import "server-only";

/**
 * E-mailnotificaties via de Resend REST API (geen extra dependency).
 *
 * Environment variables:
 *  RESEND_API_KEY   – API-key van resend.com
 *  FORM_TO_EMAIL    – adres waar aanvragen binnenkomen (bv. info@dalas.nl)
 *  FORM_FROM_EMAIL  – afzender; moet een geverifieerd domein in Resend zijn
 *                     (standaard "Dalas Website <onboarding@resend.dev>" om te testen)
 *
 * Zonder RESEND_API_KEY/FORM_TO_EMAIL:
 *  - development: aanvraag wordt in de terminal gelogd en als verzonden beschouwd
 *  - production : aanvraag wordt geweigerd met een nette foutmelding (zodat er geen leads stil verloren gaan)
 */

interface NotificationInput {
  subject: string;
  text: string;
  replyTo?: string;
}

export const emailConfigured = Boolean(process.env.RESEND_API_KEY && process.env.FORM_TO_EMAIL);

export async function sendNotification({ subject, text, replyTo }: NotificationInput): Promise<boolean> {
  if (!emailConfigured) {
    if (process.env.NODE_ENV !== "production") {
      console.info(`\n[dalas] E-mail niet geconfigureerd – aanvraag gelogd:\n${subject}\n${text}\n`);
      return true;
    }
    console.error("[dalas] RESEND_API_KEY / FORM_TO_EMAIL ontbreken; aanvraag kon niet worden verzonden.");
    return false;
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.FORM_FROM_EMAIL ?? "Dalas Website <onboarding@resend.dev>",
        to: [process.env.FORM_TO_EMAIL],
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
