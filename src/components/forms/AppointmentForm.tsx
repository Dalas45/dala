"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { AntiSpamFields, ConsentField, SelectField, SubmitButton, TextAreaField, TextField } from "@/components/forms/FormField";
import { FormStatusMessage } from "@/components/forms/FormStatusMessage";
import { submitAppointment, type FormState } from "@/lib/actions";
import { track, trackConversion } from "@/lib/analytics";
import { siteConfig } from "@/lib/site";
import type { Dress } from "@/lib/types";

const initial: FormState = { status: "idle" };

function Submit() {
  const { pending } = useFormStatus();
  return <SubmitButton pending={pending} label="Verstuur aanvraag" pendingLabel="Bezig met verzenden…" />;
}

interface AppointmentFormProps {
  /** Alle jurken, voor de keuzelijst. */
  dresses: Array<Pick<Dress, "slug" | "name">>;
  /** Vooraf geselecteerde jurk (vanaf een jurkpagina). */
  selectedSlug?: string;
}

/**
 * Afspraakformulier. Wordt gebruikt op /afspraak en, met `selectedSlug`,
 * vanaf een jurkpagina zodat de gekozen jurk automatisch meekomt.
 */
export function AppointmentForm({ dresses, selectedSlug }: AppointmentFormProps) {
  const [state, formAction] = useActionState(submitAppointment, initial);
  const [startedAt] = useState(() => Date.now());
  const formRef = useRef<HTMLFormElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (state.status !== "success") return;
    track("appointment_request_submit", { dress_slug: selectedSlug });
    trackConversion(siteConfig.analytics.adsId, siteConfig.analytics.adsConversionAppointment);
    formRef.current?.reset();
    headingRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [state.status, selectedSlug]);

  const errors = state.errors ?? {};

  return (
    <form ref={formRef} action={formAction} noValidate className="relative space-y-9">
      <AntiSpamFields startedAt={startedAt} />
      <div ref={headingRef}>
        <FormStatusMessage state={state} />
      </div>

      <div className="grid gap-9 sm:grid-cols-2">
        <TextField id="afspraak-naam" name="name" label="Naam" autoComplete="name" required error={errors.name} />
        <TextField id="afspraak-email" name="email" label="E-mail" type="email" autoComplete="email" required error={errors.email} />
        <TextField id="afspraak-telefoon" name="phone" label="Telefoon" type="tel" autoComplete="tel" error={errors.phone} />
        <SelectField
          id="afspraak-jurk"
          name="dress"
          label="Jurk die je wilt passen"
          defaultValue={selectedSlug ?? ""}
          error={errors.dress}
          options={[{ value: "", label: "Nog geen keuze / meerdere jurken" }, ...dresses.map((d) => ({ value: d.slug, label: d.name }))]}
        />
      </div>

      {/*
        Bewust geen datum- en dagdeelkeuze: de afspraak gaat op aanvraag en
        wordt persoonlijk bevestigd. Wie al weet wanneer het schikt schrijft dat
        hieronder — vandaar dat de placeholder daar nu naar vraagt.
      */}
      <TextAreaField
        id="afspraak-bericht"
        name="message"
        label="Bericht"
        rows={4}
        error={errors.message}
        placeholder="Bijvoorbeeld wanneer het jou schikt, je trouwdatum, je maat of met hoeveel personen je komt."
      />

      <ConsentField id="afspraak-consent" error={errors.consent} />
      <Submit />
    </form>
  );
}
