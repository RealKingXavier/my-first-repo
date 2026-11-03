// Site-wide settings. Everything a non-developer may need to change before
// launch lives here: contact details, socials, and feature switches.

export const site = {
  name: "Bahia Dreams Costa Rica",
  shortName: "Bahia Dreams",
  url: "https://bahiadreamscr.com",
  positioning: "Exceptional stays. Thoughtfully managed.",
  description:
    "Boutique vacation rentals and attentive property management on Costa Rica's Central Pacific coast. Explore our homes in Herradura or tell us about yours.",
  locale: "en",

  contact: {
    // TODO(launch): confirm these are the public numbers and inbox to publish.
    email: "bahiadreamscostarica@gmail.com",
    phoneDisplay: "+506 6048 1990",
    phoneE164: "+50660481990",
    whatsappEnabled: true,
    whatsappUrl: "https://wa.me/50660481990",
    // Leave null to show nothing. Only publish a response window once approved.
    responseExpectation: null as string | null,
  },

  socials: {
    instagram: { handle: "@bahiadreamscr", url: "https://www.instagram.com/bahiadreamscr/" },
  },

  // Owner fee terms from "Service & Pricing" (p. 9–10). Kept off the public site
  // by default and shared privately after a consultation.
  pricing: {
    showOnPublicSite: false,
    commissionNote:
      "25% of rental proceeds (excludes cleaning, platform and other non-nightly charges). Standard turnover cleaning included; deep cleaning and specialised maintenance billed separately.",
  },

  legal: {
    entityName: "Bahia Dreams Costa Rica",
    lastUpdated: "November 3, 2026",
  },
} as const;

export const nav = [
  { href: "/stays", label: "Stays" },
  { href: "/property-management", label: "Property Management" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;

export function whatsappLink(message?: string) {
  if (!site.contact.whatsappEnabled) return null;
  return message
    ? `${site.contact.whatsappUrl}?text=${encodeURIComponent(message)}`
    : site.contact.whatsappUrl;
}
