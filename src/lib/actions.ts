"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import type { z } from "zod";
import { getDressBySlug } from "@/lib/dresses";
import { sendNotification } from "@/lib/email";
import { appointmentSchema, contactSchema, priceRequestSchema } from "@/lib/validation";

export type FormStatus = "idle" | "success" | "error";

export interface FormState {
  status: FormStatus;
  message?: string;
  /** Veldnaam -> foutmelding */
  errors?: Record<string, string>;
}

const MIN_FILL_TIME_MS = 3000;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX = 5;

/** Best-effort rate limiting per IP (in-memory, per serverless instance). */
const attempts = new Map<string, number[]>();

async function clientKey(): Promise<string> {
  const h = await headers();
  return h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? h.get("x-real-ip") ?? "unknown";
}

async function isRateLimited(): Promise<boolean> {
  const key = await clientKey();
  const now = Date.now();
  const recent = (attempts.get(key) ?? []).filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
  recent.push(now);
  attempts.set(key, recent);
  return recent.length > RATE_LIMIT_MAX;
}

function tooFast(timestamp?: string): boolean {
  const started = Number(timestamp);
  if (!Number.isFinite(started) || started <= 0) return false;
  return Date.now() - started < MIN_FILL_TIME_MS;
}

function formErrors(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "form");
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}

const GENERIC_ERROR = "Er ging iets mis bij het verzenden. Probeer het later opnieuw of neem rechtstreeks contact met ons op.";

/**
 * Doel van de doorverwijzing na een geslaagde verzending.
 *
 * `redirect` gooit een NEXT_REDIRECT-fout en moet daarom buiten een try/catch
 * staan. Next stuurt een 303 bij een formulier zonder JavaScript en navigeert
 * client-side wanneer JavaScript wel beschikbaar is.
 */
function thanksPath(type: "afspraak" | "prijs" | "contact", dressSlug?: string): string {
  const params = new URLSearchParams({ type });
  if (dressSlug) params.set("jurk", dressSlug);
  return `/bedankt?${params.toString()}`;
}

function toObject(formData: FormData): Record<string, string> {
  const obj: Record<string, string> = {};
  formData.forEach((value, key) => {
    if (typeof value === "string") obj[key] = value;
  });
  return obj;
}

function line(label: string, value?: string): string {
  return value && value.trim() ? `${label}: ${value.trim()}\n` : "";
}

async function guard(raw: Record<string, string>, thanks: string): Promise<FormState | null> {
  if (raw.website) {
    // Honeypot ingevuld: bot. Dezelfde afloop als een echte verzending, zodat
    // niet te zien is dat het veld de aanvraag heeft tegengehouden.
    redirect(thanks);
  }
  if (tooFast(raw._t)) {
    return { status: "error", message: "Het formulier is te snel verzonden. Controleer je gegevens en probeer opnieuw." };
  }
  if (await isRateLimited()) {
    return { status: "error", message: "Je hebt te veel aanvragen verstuurd. Probeer het over enkele minuten opnieuw." };
  }
  return null;
}

export async function submitAppointment(_prev: FormState, formData: FormData): Promise<FormState> {
  const raw = toObject(formData);
  const blocked = await guard(raw, thanksPath("afspraak", raw.dress));
  if (blocked) return blocked;

  const parsed = appointmentSchema.safeParse(raw);
  if (!parsed.success) {
    return { status: "error", message: "Controleer de gemarkeerde velden.", errors: formErrors(parsed.error) };
  }
  const data = parsed.data;
  const dress = data.dress ? getDressBySlug(data.dress) : undefined;

  const text =
    `Nieuwe afspraakaanvraag via de website\n\n` +
    line("Naam", data.name) +
    line("E-mail", data.email) +
    line("Telefoon", data.phone) +
    line("Jurk", dress ? `${dress.name} (${dress.slug})` : undefined) +
    line("Bericht", data.message);

  const sent = await sendNotification({
    subject: `Afspraakaanvraag${dress ? ` – ${dress.name}` : ""} – ${data.name}`,
    text,
    replyTo: data.email,
  });
  if (!sent) return { status: "error", message: GENERIC_ERROR };
  redirect(thanksPath("afspraak", dress?.slug));
}

export async function submitPriceRequest(_prev: FormState, formData: FormData): Promise<FormState> {
  const raw = toObject(formData);
  const blocked = await guard(raw, thanksPath("prijs", raw.dress));
  if (blocked) return blocked;

  const parsed = priceRequestSchema.safeParse(raw);
  if (!parsed.success) {
    return { status: "error", message: "Controleer de gemarkeerde velden.", errors: formErrors(parsed.error) };
  }
  const data = parsed.data;
  const dress = getDressBySlug(data.dress);
  if (!dress) return { status: "error", message: "Deze jurk is niet gevonden.", errors: { dress: "Onbekende jurk." } };

  const text =
    `Nieuwe prijsaanvraag via de website\n\n` +
    line("Jurk", `${dress.name} (${dress.slug})`) +
    line("Naam", data.name) +
    line("E-mail", data.email) +
    line("Telefoon", data.phone) +
    line("Bericht", data.message);

  const sent = await sendNotification({ subject: `Prijsaanvraag – ${dress.name} – ${data.name}`, text, replyTo: data.email });
  if (!sent) return { status: "error", message: GENERIC_ERROR };
  redirect(thanksPath("prijs", dress.slug));
}

export async function submitContact(_prev: FormState, formData: FormData): Promise<FormState> {
  const raw = toObject(formData);
  const blocked = await guard(raw, thanksPath("contact"));
  if (blocked) return blocked;

  const parsed = contactSchema.safeParse(raw);
  if (!parsed.success) {
    return { status: "error", message: "Controleer de gemarkeerde velden.", errors: formErrors(parsed.error) };
  }
  const data = parsed.data;
  const text =
    `Nieuw contactbericht via de website\n\n` +
    line("Naam", data.name) +
    line("E-mail", data.email) +
    line("Telefoon", data.phone) +
    line("Onderwerp", data.subject) +
    line("Bericht", data.message);

  const sent = await sendNotification({
    subject: `Contact – ${data.subject?.trim() || "Bericht via website"} – ${data.name}`,
    text,
    replyTo: data.email,
  });
  if (!sent) return { status: "error", message: GENERIC_ERROR };
  redirect(thanksPath("contact"));
}
