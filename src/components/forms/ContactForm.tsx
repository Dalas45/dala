"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { AntiSpamFields, ConsentField, SubmitButton, TextAreaField, TextField } from "@/components/forms/FormField";
import { FormStatusMessage } from "@/components/forms/FormStatusMessage";
import { submitContact, type FormState } from "@/lib/actions";

const initial: FormState = { status: "idle" };

function Submit() {
  const { pending } = useFormStatus();
  return <SubmitButton pending={pending} label="Verstuur bericht" pendingLabel="Bezig met verzenden…" />;
}

/**
 * `defaultSubject` vult het onderwerp vooraf in. Dat gebeurt wanneer iemand
 * vanaf een sieraad doorklikt: het onderwerp bevat dan al de naam van het stuk,
 * zodat de aanvraag meteen herleidbaar is.
 */
export function ContactForm({ defaultSubject }: { defaultSubject?: string }) {
  const [state, formAction] = useActionState(submitContact, initial);
  const [startedAt] = useState(() => Date.now());

  // Geen afhandeling van "geslaagd": de server action stuurt dan door naar
  // /bedankt. Wat hier overblijft, is het tonen van fouten.
  const errors = state.errors ?? {};

  return (
    <form action={formAction} noValidate className="relative space-y-9">
      <AntiSpamFields startedAt={startedAt} />
      <FormStatusMessage state={state} />

      <div className="grid gap-9 sm:grid-cols-2">
        <TextField id="contact-naam" name="name" label="Naam" autoComplete="name" required error={errors.name} />
        <TextField id="contact-email" name="email" label="E-mail" type="email" autoComplete="email" required error={errors.email} />
        <TextField id="contact-telefoon" name="phone" label="Telefoon" type="tel" autoComplete="tel" error={errors.phone} />
        <TextField
          id="contact-onderwerp"
          name="subject"
          label="Onderwerp"
          defaultValue={defaultSubject}
          error={errors.subject}
        />
      </div>

      <TextAreaField id="contact-bericht" name="message" label="Bericht" rows={6} required error={errors.message} />

      <ConsentField id="contact-consent" error={errors.consent} />
      <Submit />
    </form>
  );
}
