import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

const defaults: IconProps = {
  width: 18,
  height: 18,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.4,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
  focusable: false,
};

export const ArrowRight = (props: IconProps) => (
  <svg {...defaults} {...props}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

export const ArrowLeft = (props: IconProps) => (
  <svg {...defaults} {...props}>
    <path d="M19 12H5M11 18l-6-6 6-6" />
  </svg>
);

export const Close = (props: IconProps) => (
  <svg {...defaults} {...props}>
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
);

export const Menu = (props: IconProps) => (
  <svg {...defaults} {...props}>
    <path d="M3 7h18M3 12h18M3 17h18" />
  </svg>
);

export const Phone = (props: IconProps) => (
  <svg {...defaults} {...props}>
    <path d="M6.5 3h3l1.5 4-2 1.5a12 12 0 006.5 6.5L17 13l4 1.5v3a2 2 0 01-2.2 2A17 17 0 013.5 5.2 2 2 0 015.5 3z" />
  </svg>
);

export const Mail = (props: IconProps) => (
  <svg {...defaults} {...props}>
    <rect x="3" y="5" width="18" height="14" rx="1.5" />
    <path d="M3.5 6.5l8.5 6 8.5-6" />
  </svg>
);

export const WhatsApp = (props: IconProps) => (
  <svg {...defaults} {...props}>
    <path d="M3.5 20.5l1.3-4.2A8.2 8.2 0 1120.5 12a8.2 8.2 0 01-12.3 7l-4.7 1.5z" />
    <path d="M9 9.2c.2-.6.5-.6.8-.6h.5c.2 0 .4 0 .6.5l.7 1.6c.1.2 0 .4-.1.5l-.4.5c-.1.2-.2.3 0 .6a6 6 0 002.6 2.2c.3.1.4 0 .6-.1l.5-.6c.2-.2.3-.1.5 0l1.5.8c.2.1.3.2.3.4 0 .5-.3 1.3-1.1 1.5-1.2.3-3-.3-4.4-1.5a8 8 0 01-2.4-3.4c-.3-.9-.2-1.7-.2-1.9z" />
  </svg>
);

export const Instagram = (props: IconProps) => (
  <svg {...defaults} {...props}>
    <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" />
    <circle cx="12" cy="12" r="3.8" />
    <circle cx="17" cy="7" r="0.9" fill="currentColor" stroke="none" />
  </svg>
);

export const Facebook = (props: IconProps) => (
  <svg {...defaults} {...props}>
    <path d="M14.5 21v-7h2.4l.4-2.9h-2.8V9.3c0-.8.2-1.4 1.4-1.4h1.5V5.3A19 19 0 0015.2 5C13 5 11.5 6.4 11.5 9v2.1H9V14h2.5v7z" />
  </svg>
);

export const MapPin = (props: IconProps) => (
  <svg {...defaults} {...props}>
    <path d="M12 21s7-5.6 7-11a7 7 0 10-14 0c0 5.4 7 11 7 11z" />
    <circle cx="12" cy="10" r="2.6" />
  </svg>
);

export const Clock = (props: IconProps) => (
  <svg {...defaults} {...props}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.5V12l3 1.8" />
  </svg>
);

export const Check = (props: IconProps) => (
  <svg {...defaults} {...props}>
    <path d="M4.5 12.5l5 5 10-10" />
  </svg>
);

/** Gebruikt in de FAQ; draait naar een kruis wanneer een vraag opengaat. */
export const Plus = (props: IconProps) => (
  <svg {...defaults} {...props}>
    <path d="M12 5v14M5 12h14" />
  </svg>
);

export const Expand = (props: IconProps) => (
  <svg {...defaults} {...props}>
    <path d="M9 4H4v5M15 4h5v5M9 20H4v-5M15 20h5v-5" />
  </svg>
);

export const ChevronDown = (props: IconProps) => (
  <svg {...defaults} {...props}>
    <path d="M6 9.5l6 6 6-6" />
  </svg>
);
