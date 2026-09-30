"use client";

import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { track, type AnalyticsEvent, type AnalyticsParams } from "@/lib/analytics";

interface TrackedLinkProps extends Omit<ComponentPropsWithoutRef<typeof Link>, "children"> {
  event: AnalyticsEvent;
  params?: AnalyticsParams;
  children: ReactNode;
}

/** Interne link die bij een klik een analytics-event verstuurt. */
export function TrackedLink({ event, params, children, onClick, ...props }: TrackedLinkProps) {
  return (
    <Link
      {...props}
      onClick={(e) => {
        track(event, params);
        onClick?.(e);
      }}
    >
      {children}
    </Link>
  );
}

interface TrackedAnchorProps extends Omit<ComponentPropsWithoutRef<"a">, "children"> {
  event: AnalyticsEvent;
  params?: AnalyticsParams;
  children: ReactNode;
}

/** Externe link (tel:, mailto:, wa.me) met analytics-event. */
export function TrackedAnchor({ event, params, children, onClick, ...props }: TrackedAnchorProps) {
  return (
    <a
      {...props}
      onClick={(e) => {
        track(event, params);
        onClick?.(e);
      }}
    >
      {children}
    </a>
  );
}
