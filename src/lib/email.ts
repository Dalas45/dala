import "server-only";
import nodemailer, { type Transporter } from "nodemailer";

/**
 * E-mailnotificaties voor de formulieren.
 *
 * Twee transportwegen, in deze volgorde geprobeerd:
 *
 *  1. SMTP (voorkeur)
 *     SMTP_HOST      – bv. smtp.jouwprovider.nl
 *     SMTP_PORT      – 587 (STARTTLS, standaard) of 465 (directe TLS)
 *     SMTP_USER      – gebruikersnaam, meestal het volledige mailadres
 *     SMTP_PASSWORD  – wachtwoord of app-wachtwoord
 *     SMTP_SECURE    – optioneel "true"/"false"; standaard afgeleid uit de poort
 *
 *  2. Resend REST API
 *     RESEND_API_KEY – alleen nodig als je geen SMTP gebruikt
 *
 * Gemeenschappelijk:
 *     FORM_TO_EMAIL   – adres waar aanvragen binnenkomen (verplicht)
 *     FORM_FROM_EMAIL – afzender; standaard SMTP_USER bij SMTP
 *
 * Zonder werkende configuratie:
 *  - development: aanvraag wordt in de terminal gelogd en als verzonden beschouwd
 *  - production : aanvraag wordt geweigerd met een nette foutmelding (zodat er geen leads stil verloren gaan)
 */

interface NotificationInput {
  subject: string;
  text: string;
  replyTo?: string;
}

const env = (key: string): string | undefined => {
  const value = process.env[key];
  return value && value.trim().length > 0 ? value.trim() : undefined;
};

const smtpConfigured = Boolean(env("SMTP_HOST") && env("SMTP_USER") && env("SMTP_PASSWORD"));

export const emailConfigured = Boolean(env("FORM_TO_EMAIL") && (smtpConfigured || env("RESEND_API_KEY")));

/**
 * Eén transporter per serverinstantie. Bewust zonder `pool`: een serverless
 * functie wordt na een aanvraag bevroren, en een openstaande verbinding levert
 * dan alleen maar een timeout op bij de volgende aanvraag.
 */
let transporter: Transporter | undefined;

function getTransporter(): Transporter | undefined {
  if (!smtpConfigured) return undefined;
  if (!transporter) {
    const port = Number(env("SMTP_PORT") ?? 587);
    const secure = env("SMTP_SECURE");
    transporter = nodemailer.createTransport({
      host: env("SMTP_HOST"),
      port,
      // Poort 465 praat meteen TLS; 587 begint onversleuteld en schakelt met
      // STARTTLS over. SMTP_SECURE overschrijft die afleiding als het moet.
      secure: secure ? secure === "true" : port === 465,
      auth: { user: env("SMTP_USER"), pass: env("SMTP_PASSWORD") },
    });
  }
  return transporter;
}

export async function sendNotification({ subject, text, replyTo }: NotificationInput): Promise<boolean> {
  const to = env("FORM_TO_EMAIL");
  if (!emailConfigured || !to) {
    if (process.env.NODE_ENV !== "production") {
      console.info(`\n[dalas] E-mail niet geconfigureerd – aanvraag gelogd:\n${subject}\n${text}\n`);
      return true;
    }
    console.error("[dalas] FORM_TO_EMAIL en SMTP_* (of RESEND_API_KEY) ontbreken; aanvraag kon niet worden verzonden.");
    return false;
  }

  const smtp = getTransporter();
  if (smtp) {
    try {
      await smtp.sendMail({
        from: env("FORM_FROM_EMAIL") ?? env("SMTP_USER"),
        to,
        subject,
        text,
        replyTo,
      });
      return true;
    } catch (error) {
      console.error("[dalas] SMTP-fout:", error);
      return false;
    }
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env("RESEND_API_KEY")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: env("FORM_FROM_EMAIL") ?? "Dalas Website <onboarding@resend.dev>",
        to: [to],
        subject,
        text,
        reply_to: replyTo,
      }),
    });
    if (!response.ok) {
      console.error("[dalas] Resend-fout:", response.status, await response.text());
      return false;
    }
    return true;
  } catch (error) {
    console.error("[dalas] E-mail verzenden mislukt:", error);
    return false;
  }
}
