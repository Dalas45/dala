"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { AntiSpamFields, ConsentField, SubmitButton, TextAreaField, TextField } from "@/components/forms/FormField";
import { FormStatusMessage } from "@/components/forms/FormStatusMessage";
import { submitPriceRequest, type FormState } from "@/lib/actions";
import { track, trackConversion } from "@/lib/analytics";
import { siteConfig } from "@/lib/site";
import { cn } from "@/lib/utils";

const initial: FormState = { status: "idle" };

function Submit({ tone }: { tone: "light" | "noir" }) {
  const { pending } = useFormStatus();
  return <SubmitButton pending={pending} label="Vraag de prijs op" pendingLabel="Bezig met verzenden…" tone={tone} full />;
}

/**
 * Prijsaanvraag voor één specifieke jurk.
 * De jurk staat vast via een hidden field, zodat de aanvraag altijd herleidbaar is.
 */
export function PriceRequestForm({
  dressSlug,
  dressName,
  onSuccess,
  tone = "light",
}: {
  dressSlug: string;
  dressName: string;
  onSuccess?: () => void;
  tone?: "light" | "noir";
}) {
  const [state, formAction] = useActionState(submitPriceRequest, initial);
  const [startedAt] = useState(() => Date.now());
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.status !== "success") return;
    track("price_request_submit", { dress_slug: dressSlug });
    trackConversion(siteConfig.analytics.adsId, siteConfig.analytics.adsConversionPriceRequest);
    formRef.current?.reset();
    onSuccess?.();
  }, [state.status, dressSlug, onSuccess]);

  const errors = state.errors ?? {};

  return (
    <form ref={formRef} action={formAction} noValidate className="relative space-y-7">
      <AntiSpamFields startedAt={startedAt} />
      <input type="hidden" name="dress" value={dressSlug} />

      <p
        className={cn(
          "border-l-2 px-5 py-3.5 text-sm",
          tone === "noir" ? "border-champagne bg-on-noir/5 text-on-noir" : "border-gold bg-cream/60 text-ink",
        )}
      >
        Jurk: <strong className="font-medium">{dressName}</strong>
      </p>

      <FormStatusMessage state={state} tone={tone} />

      <div className="grid gap-7 sm:grid-cols-2">
        <TextField id={`prijs-naam-${dressSlug}`} name="name" label="Naam" autoComplete="name" required error={errors.name} tone={tone} />
        <TextField
          id={`prijs-email-${dressSlug}`}
          name="email"
          label="E-mail"
          type="email"
          autoComplete="email"
          required
          error={errors.email}
          tone={tone}
        />
      </div>
      <TextField
        id={`prijs-telefoon-${dressSlug}`}
        name="phone"
        label="Telefoon"
        type="tel"
        autoComplete="tel"
        error={errors.phone}
        tone={tone}
      />
      <TextAreaField
        id={`prijs-bericht-${dressSlug}`}
        name="message"
        label="Bericht"
        rows={3}
        error={errors.message}
        placeholder="Bijvoorbeeld je trouwdatum of je maat."
        tone={tone}
      />

      <ConsentField id={`prijs-consent-${dressSlug}`} error={errors.consent} tone={tone} />
      <Submit tone={tone} />
    </form>
  );
}
