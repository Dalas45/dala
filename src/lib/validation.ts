import { z } from "zod";

const name = z.string().trim().min(2, "Vul je naam in.").max(100, "Je naam is te lang.");
const email = z.email("Vul een geldig e-mailadres in.").max(200);
const phone = z
  .string()
  .trim()
  .max(30, "Het telefoonnummer is te lang.")
  .refine((v) => v === "" || /^[+0-9][0-9\s()-]{5,}$/.test(v), "Vul een geldig telefoonnummer in.")
  .optional();
const message = z.string().trim().max(2000, "Je bericht is te lang (max. 2000 tekens).").optional();
const optionalSlug = z
  .string()
  .trim()
  .max(80)
  .regex(/^[a-z0-9-]*$/, "Ongeldige jurk.")
  .optional();

/** Anti-spam velden: honeypot moet leeg zijn; het tijdstempel wordt server-side gecontroleerd. */
const antiSpam = {
  website: z.string().max(0, "Spam gedetecteerd.").optional(),
  _t: z.string().optional(),
  consent: z.literal("on", { message: "Ga akkoord met de verwerking van je gegevens." }),
};

/**
 * Geen datum- of dagdeelveld: een afspraak gaat altijd op aanvraag. Wie een
 * voorkeur heeft schrijft die in het berichtveld, en Dalas bevestigt het moment
 * persoonlijk. Dat scheelt de bezoeker twee keuzes en voorkomt de indruk dat
 * een gekozen tijdstip al vaststaat.
 */
export const appointmentSchema = z.object({
  name,
  email,
  phone,
  dress: optionalSlug,
  message,
  ...antiSpam,
});

export const priceRequestSchema = z.object({
  name,
  email,
  phone,
  dress: z.string().trim().min(1, "Er is geen jurk geselecteerd.").max(80).regex(/^[a-z0-9-]+$/, "Ongeldige jurk."),
  message,
  ...antiSpam,
});

export const contactSchema = z.object({
  name,
  email,
  phone,
  subject: z.string().trim().max(150, "Het onderwerp is te lang.").optional(),
  message: z.string().trim().min(10, "Schrijf een kort bericht (minimaal 10 tekens).").max(2000, "Je bericht is te lang (max. 2000 tekens)."),
  ...antiSpam,
});

export type AppointmentInput = z.infer<typeof appointmentSchema>;
export type PriceRequestInput = z.infer<typeof priceRequestSchema>;
export type ContactInput = z.infer<typeof contactSchema>;
