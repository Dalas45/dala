"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { AntiSpamFields, ConsentField, SubmitButton, TextAreaField, TextField } from "@/components/forms/FormField";
import { FormStatusMessage } from "@/components/forms/FormStatusMessage";
import { submitContact, type FormState } from "@/lib/actions";
import { track, trackConversion } from "@/lib/analytics";
import { siteConfig } from "@/lib/site";

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
  const formRef = useRef<HTMLFormElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (state.status !== "success") return;
    track("contact_submit");
    trackConversion(siteConfig.analytics.adsId, siteConfig.analytics.adsConversionContact);
    formRef.current?.reset();
    statusRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [state.status]);

  const errors = state.errors ?? {};

  return (
    <form ref={formRef} action={formAction} noValidate className="relative space-y-9">
      <AntiSpamFields startedAt={startedAt} />
      <div ref={statusRef}>
        <FormStatusMessage state={state} />
      </div>

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
