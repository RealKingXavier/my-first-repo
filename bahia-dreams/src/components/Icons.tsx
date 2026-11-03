import type { SVGProps } from "react";
import type { Amenity } from "@/content/properties";

// Small stroke icon set (paths adapted from Lucide, ISC licence).
type P = SVGProps<SVGSVGElement>;

function Base({ children, ...props }: P) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      {children}
    </svg>
  );
}

export const ArrowRight = (p: P) => <Base {...p}><path d="M5 12h14M13 6l6 6-6 6" /></Base>;
export const ArrowLeft = (p: P) => <Base {...p}><path d="M19 12H5M11 18l-6-6 6-6" /></Base>;
export const External = (p: P) => <Base {...p}><path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" /></Base>;
export const Close = (p: P) => <Base {...p}><path d="M6 6l12 12M18 6L6 18" /></Base>;
export const Menu = (p: P) => <Base {...p}><path d="M4 7h16M4 12h16M4 17h16" /></Base>;
export const Expand = (p: P) => <Base {...p}><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" /></Base>;
export const Check = (p: P) => <Base {...p}><path d="M5 12.5l4.5 4.5L19 7.5" /></Base>;
export const Mail = (p: P) => <Base {...p}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 6 9-6" /></Base>;
export const Phone = (p: P) => <Base {...p}><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a1 1 0 0 1-1 1A16 16 0 0 1 4 5a1 1 0 0 1 1-1z" /></Base>;
export const Pin = (p: P) => <Base {...p}><path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z" /><circle cx="12" cy="9.5" r="2.5" /></Base>;
export const Bed = (p: P) => <Base {...p}><path d="M3 18V6M3 14h18v4M21 14v-2a3 3 0 0 0-3-3h-7v5" /><circle cx="7" cy="11" r="1.5" /></Base>;
export const Bath = (p: P) => <Base {...p}><path d="M4 12h16v3a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4v-3zM6 12V5a2 2 0 0 1 3.5-1.3M6 19l-1 2M18 19l1 2" /></Base>;
export const Users = (p: P) => <Base {...p}><circle cx="9" cy="8" r="3.5" /><path d="M2.5 20a6.5 6.5 0 0 1 13 0M16 4.5a3.5 3.5 0 0 1 0 7M18 14.5a6 6 0 0 1 3.5 5.5" /></Base>;
export const Home = (p: P) => <Base {...p}><path d="M3 11l9-7 9 7M5 10v10h14V10" /></Base>;
export const Instagram = (p: P) => <Base {...p}><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" /></Base>;

export const WhatsApp = (p: P) => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor" aria-hidden="true" focusable="false" {...p}>
    <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.3-.4.8-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.1 5.1 0 0 0 1.1 2.7 11.7 11.7 0 0 0 4.5 4c1.7.7 2.3.8 3.2.7a2.7 2.7 0 0 0 1.8-1.3 2.2 2.2 0 0 0 .1-1.3c0-.1-.2-.2-.4-.3z" />
  </svg>
);

const amenityIcon: Record<Amenity, (p: P) => React.ReactElement> = {
  wifi: (p) => <Base {...p}><path d="M2 9a15 15 0 0 1 20 0M5 12.5a10 10 0 0 1 14 0M8.5 16a5 5 0 0 1 7 0" /><circle cx="12" cy="19.5" r="0.8" fill="currentColor" /></Base>,
  "air-conditioning": (p) => <Base {...p}><path d="M12 2v20M4.9 6.5l14.2 11M19.1 6.5L4.9 17.5M9 4l3 2 3-2M9 20l3-2 3 2" /></Base>,
  kitchen: (p) => <Base {...p}><path d="M6 3v8a2 2 0 0 0 2 2v8M10 3v8a2 2 0 0 1-2 2M8 3v6M17 21V3c-2 1-3 4-3 7h3" /></Base>,
  pool: (p) => <Base {...p}><path d="M2 18c2 0 2-1.5 4-1.5S8 18 10 18s2-1.5 4-1.5 2 1.5 4 1.5 2-1.5 4-1.5M8 15V5a2 2 0 0 1 4 0M16 15V5a2 2 0 0 0-4 0M8 9h8" /></Base>,
  gym: (p) => <Base {...p}><path d="M6 7v10M18 7v10M3 10v4M21 10v4M6 12h12" /></Base>,
  tennis: (p) => <Base {...p}><circle cx="12" cy="12" r="9" /><path d="M5.5 5.5a12 12 0 0 1 0 13M18.5 5.5a12 12 0 0 0 0 13" /></Base>,
  workspace: (p) => <Base {...p}><rect x="3" y="4" width="18" height="12" rx="1.5" /><path d="M8 20h8M12 16v4" /></Base>,
  parking: (p) => <Base {...p}><rect x="3" y="3" width="18" height="18" rx="3" /><path d="M9 17V7h4a3 3 0 0 1 0 6H9" /></Base>,
  washer: (p) => <Base {...p}><rect x="4" y="2.5" width="16" height="19" rx="2" /><circle cx="12" cy="13" r="5" /><path d="M8 6h.01M11 6h.01" /></Base>,
  dryer: (p) => <Base {...p}><rect x="4" y="2.5" width="16" height="19" rx="2" /><circle cx="12" cy="13" r="5" /><path d="M10 12c1-1 3 1 4 0" /></Base>,
  dishwasher: (p) => <Base {...p}><rect x="4" y="2.5" width="16" height="19" rx="2" /><path d="M4 7h16M8 12h8M8 16h8" /></Base>,
  tv: (p) => <Base {...p}><rect x="2.5" y="5" width="19" height="13" rx="1.5" /><path d="M8 21h8" /></Base>,
  coffee: (p) => <Base {...p}><path d="M4 9h13v5a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5V9zM17 10h1.5a2.5 2.5 0 0 1 0 5H17M8 3v3M12 3v3" /></Base>,
  bbq: (p) => <Base {...p}><path d="M4 9h16a8 8 0 0 1-16 0zM8 17l-2 4M16 17l2 4M12 17v4M9 3c0 1.5 1 1.5 1 3M13 3c0 1.5 1 1.5 1 3" /></Base>,
  "outdoor-dining": (p) => <Base {...p}><path d="M3 10h18M12 10v11M7 21h10M5 10l1-5h12l1 5" /></Base>,
  balcony: (p) => <Base {...p}><path d="M3 21h18M4 13h16M6 13v8M10 13v8M14 13v8M18 13v8M7 13V4h10v9" /></Base>,
  "self-check-in": (p) => <Base {...p}><rect x="5" y="10" width="14" height="11" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3M12 14v3" /></Base>,
  "hair-dryer": (p) => <Base {...p}><path d="M14 4a5 5 0 0 1 0 10H8L3 9l5-5h6zM11 14l1 7h3l-1-7" /></Base>,
  "ev-charging": (p) => <Base {...p}><path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z" /></Base>,
};

export const amenityLabels: Record<Amenity, string> = {
  wifi: "Wi-Fi",
  "air-conditioning": "Air conditioning",
  kitchen: "Full kitchen",
  pool: "Pool access",
  gym: "Fitness room",
  tennis: "Tennis court",
  workspace: "Dedicated workspace",
  parking: "Free parking on premises",
  washer: "Washer",
  dryer: "Dryer",
  dishwasher: "Dishwasher",
  tv: "TV",
  coffee: "Coffee maker",
  bbq: "BBQ grill",
  "outdoor-dining": "Outdoor dining area",
  balcony: "Private balcony",
  "self-check-in": "Self check-in (smart lock)",
  "hair-dryer": "Hair dryer",
  "ev-charging": "EV / golf-cart charging",
};

export function AmenityIcon({ name, ...p }: P & { name: Amenity }) {
  const I = amenityIcon[name];
  return <I {...p} />;
}
