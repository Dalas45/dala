"use server";

import { headers } from "next/headers";
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

async function guard(raw: Record<string, string>): Promise<FormState | null> {
  if (raw.website) {
    // Honeypot ingevuld: bot. Doe alsof het gelukt is.
    return { status: "success", message: "Bedankt, je aanvraag is ontvangen." };
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
  const blocked = await guard(raw);
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
  return {
    status: "success",
    message: "Bedankt, je afspraakaanvraag is ontvangen. We nemen zo snel mogelijk contact met je op om de afspraak te bevestigen.",
  };
}

export async function submitPriceRequest(_prev: FormState, formData: FormData): Promise<FormState> {
  const raw = toObject(formData);
  const blocked = await guard(raw);
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
  return {
    status: "success",
    message: `Bedankt, je prijsaanvraag voor ${dress.name} is ontvangen. Je ontvangt zo snel mogelijk een persoonlijk antwoord.`,
  };
}

export async function submitContact(_prev: FormState, formData: FormData): Promise<FormState> {
  const raw = toObject(formData);
  const blocked = await guard(raw);
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
  return { status: "success", message: "Bedankt voor je bericht. We reageren zo snel mogelijk." };
}
