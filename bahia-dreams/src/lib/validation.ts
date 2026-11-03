import { z } from "zod";

// Shared by the browser (step validation) and the API routes (authoritative).

const trimmed = (max: number) => z.string().trim().max(max);
// Required text: the same message whether the field is missing or too short.
const required = (max: number, min: number, message: string) =>
  z.string({ message }).trim().min(min, message).max(max);
const optionalText = (max: number) => trimmed(max).optional().or(z.literal("").transform(() => undefined));
const optionalUrl = z
  .string()
  .trim()
  .max(500)
  .optional()
  .transform((v) => (v ? v : undefined))
  .refine((v) => !v || /^https:\/\/[^\s]+$/i.test(v), "Please paste the full link, starting with https://");

export const propertyTypes = ["condo", "villa", "house", "other"] as const;
export const listingStatuses = ["currently-rented", "ready-to-launch", "under-construction", "exploring"] as const;
export const serviceNeeds = ["full-service", "property-care", "both", "not-sure"] as const;
export const timelines = ["asap", "1-3-months", "3-6-months", "6-plus-months", "not-sure"] as const;
export const contactMethods = ["email", "whatsapp", "phone"] as const;
export const ownerAmenities = ["pool", "ocean-view", "air-conditioning", "parking", "gym", "garden", "workspace", "bbq"] as const;

export const labels = {
  propertyType: { condo: "Condo", villa: "Villa", house: "House", other: "Other" },
  listingStatus: {
    "currently-rented": "Currently rented",
    "ready-to-launch": "Ready to launch",
    "under-construction": "Under construction",
    exploring: "Just exploring",
  },
  serviceNeed: {
    "full-service": "Full-service vacation rental management",
    "property-care": "Property care",
    both: "Both",
    "not-sure": "Not sure yet",
  },
  timeline: {
    asap: "As soon as possible",
    "1-3-months": "In 1–3 months",
    "3-6-months": "In 3–6 months",
    "6-plus-months": "6+ months",
    "not-sure": "Not sure yet",
  },
  contactMethod: { email: "Email", whatsapp: "WhatsApp", phone: "Phone call" },
  amenity: {
    pool: "Pool",
    "ocean-view": "Ocean view",
    "air-conditioning": "Air conditioning",
    parking: "Parking",
    gym: "Gym",
    garden: "Garden",
    workspace: "Workspace",
    bbq: "BBQ",
  },
} as const;

const count = (max: number, msg: string) =>
  z.coerce.number({ message: msg }).int(msg).min(0, msg).max(max, msg);

export const stepSchemas = [
  z.object({
    propertyType: z.enum(propertyTypes, { message: "Choose a property type" }),
    propertyName: optionalText(120),
    area: required(120, 2, "Tell us the city or area"),
    address: optionalText(300),
    bedrooms: count(30, "Enter the number of bedrooms"),
    bathrooms: z.coerce.number({ message: "Enter the number of bathrooms" }).min(0).max(30, "Enter the number of bathrooms"),
    maxGuests: count(60, "Enter the maximum number of guests").refine((n) => n >= 1, "Enter the maximum number of guests"),
  }),
  z.object({
    alreadyListed: z.enum(["yes", "no"], { message: "Let us know if it's already listed" }),
    airbnbUrl: optionalUrl,
    bookingUrl: optionalUrl,
    vrboUrl: optionalUrl,
    listingStatus: z.enum(listingStatuses, { message: "Choose the current status" }),
    amenities: z.array(z.enum(ownerAmenities)).max(ownerAmenities.length).default([]),
    photoConsent: z.boolean().default(false),
  }),
  z.object({
    serviceNeed: z.enum(serviceNeeds, { message: "Choose what you're looking for" }),
    timeline: z.enum(timelines, { message: "Choose a timeline" }),
    message: optionalText(3000),
  }),
  z.object({
    name: required(120, 2, "Please enter your name"),
    email: z.string({ message: "Please enter a valid email" }).trim().max(200).email("Please enter a valid email"),
    phone: required(40, 6, "Please enter a WhatsApp or phone number").regex(/^[+()\d\s.-]+$/, "Use digits, spaces and + only"),
    contactMethod: z.enum(contactMethods, { message: "Choose how we should contact you" }),
    consent: z.literal(true, { message: "Please agree so we can contact you" }),
  }),
] as const;

export const ownerLeadSchema = stepSchemas[0]
  .extend(stepSchemas[1].shape)
  .extend(stepSchemas[2].shape)
  .extend(stepSchemas[3].shape);

export type OwnerLead = z.infer<typeof ownerLeadSchema>;

export const contactTopics = ["stay", "owner", "other"] as const;
export const contactTopicLabels = {
  stay: "I’m looking for a stay",
  owner: "I own a property",
  other: "Something else",
} as const;

export const contactSchema = z.object({
  name: required(120, 2, "Please enter your name"),
  email: z.string({ message: "Please enter a valid email" }).trim().max(200).email("Please enter a valid email"),
  topic: z.enum(contactTopics, { message: "Choose a topic" }),
  about: optionalText(80),
  message: required(3000, 10, "Please write a short message (at least 10 characters)"),
  consent: z.literal(true, { message: "Please agree so we can reply" }),
});

export type ContactMessage = z.infer<typeof contactSchema>;

// Anti-spam fields every form posts alongside its data.
export const antiSpamSchema = z.object({
  website: z.string().max(0).optional().or(z.literal("")),
  startedAt: z.coerce.number().int().positive(),
});

export const uploadRules = {
  maxFiles: 5,
  maxBytesPerFile: 1_200_000,
  maxDimension: 1600,
  accept: ["image/jpeg", "image/png", "image/webp"],
} as const;

export function fieldErrors(error: z.ZodError) {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "form");
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}
