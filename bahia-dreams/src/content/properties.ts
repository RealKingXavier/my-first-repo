// Single source of truth for every property on the site. Pages, cards, the
// sitemap and structured data all read from here, so adding or updating a home
// never means touching a template.
//
// Rules for editing:
// - Only publish facts confirmed against the live listing or by the owner.
//   Leave a field undefined rather than guessing; the templates hide it.
// - Booking links render only when a real URL is present. Never paste a
//   search page or a placeholder.
// - Photos live in /public/images/stays/<slug>/ and must be ones we have the
//   rights to use (the current sets come from our own Airbnb listings).

export type Photo = {
  src: string;
  alt: string;
  caption?: string;
  width: number;
  height: number;
};

export type BookingLinks = {
  airbnb?: string;
  booking?: string;
  vrbo?: string;
};

export type Amenity =
  | "wifi"
  | "air-conditioning"
  | "kitchen"
  | "pool"
  | "gym"
  | "tennis"
  | "workspace"
  | "parking"
  | "washer"
  | "dryer"
  | "dishwasher"
  | "tv"
  | "coffee"
  | "bbq"
  | "outdoor-dining"
  | "balcony"
  | "self-check-in"
  | "hair-dryer"
  | "ev-charging";

export type Nearby = { label: string; detail: string };

export type Property = {
  id: string;
  slug: string;
  displayName: string;
  status: "active" | "coming-soon";
  featuredOrder: number;
  locationLabel: string;
  area?: string;
  tagline: string;
  shortDescription: string;
  longDescription: string[];
  experience?: { title: string; body: string }[];
  heroImage?: Photo;
  // Optional different image for collection cards (defaults to heroImage).
  cardImage?: Photo;
  gallery: Photo[];
  amenities: Amenity[];
  bedrooms?: number;
  beds?: number;
  bathrooms?: number;
  sleeps?: number;
  propertyType?: string;
  badges?: string[];
  guestAccess?: string[];
  nearby?: Nearby[];
  // Generalised area only, never the exact unit. The image is a static map
  // rendered from OpenStreetMap data with a soft circle over the area.
  mapArea?: { label: string; image: string; osmUrl: string };
  bookingLinks: BookingLinks;
  seo: { title: string; description: string };
  todo?: string[];
};

const W = 1920;
const H = 1440;

function photos(slug: string, list: [alt: string, caption?: string][]): Photo[] {
  return list.map(([alt, caption], i) => ({
    src: `/images/stays/${slug}/${String(i + 1).padStart(2, "0")}.jpg`,
    alt,
    caption,
    width: W,
    height: H,
  }));
}

const cararaGallery = photos("carara-sky-house", [
  ["Balcony with glass railing overlooking green jungle hills and the Pacific Ocean", "The view from the balcony"],
  ["Infinity pool with a thatched shade structure at the edge of the hillside, ocean beyond", "Infinity pool overlooking the Pacific"],
  ["Open living room with a red sectional sofa, colourful abstract art and glass coffee table", "Living room"],
  ["Wide view of forested hills rolling down to the Pacific coastline", "Ocean and jungle, as far as you can see"],
  ["Long kitchen island with white bar stools and a stainless steel kitchen", "Kitchen and dining island"],
  ["Bedroom with a queen bed, navy throw and floor-to-ceiling windows framing the ocean", "Bedroom one"],
  ["Bedroom with a navy throw, patterned cushions and abstract art", "Bedroom two"],
  ["Bedroom with a teal throw and large window onto the jungle", "Bedroom three"],
  ["Glass-walled shared workspace with a long table and ocean view", "Workspace with a view"],
  ["Covered lounge terrace with outdoor sofas looking over the pool and coast", "Poolside lounge terrace"],
  ["Two hammocks under a wooden roof facing the ocean", "Hammocks above the pool"],
  ["Gym with treadmill and elliptical machines beside tall windows", "Fitness room"],
  ["Bathroom with oval mirror, light wood vanity and glass shower", "Bathroom"],
  ["Pool deck with palms, shade structures and the residential tower behind", "Pool deck"],
  ["Entry hallway with a wooden sideboard, plants and a wavy mirror", "Entry"],
]);

const enchantingGallery = photos("enchanting", [
  ["Bright open-plan living room with a cream sectional sofa, ceiling fan and glass doors to the balcony", "Living room"],
  ["Rectangular pool lined with sun loungers in front of a three-storey condominium building", "Condominium pool"],
  ["Cream sofa with blue and macaw-print cushions", "Living room details"],
  ["Living area and kitchen seen from the sofa, with plants and natural light", "Open-plan living"],
  ["Kitchen island with white quartz top and four wooden stools", "Kitchen"],
  ["Round dining table with four upholstered chairs beside the balcony doors", "Dining area"],
  ["King bed with a blue throw and wooden headboard", "Main bedroom"],
  ["Bed with a coral throw and upholstered headboard", "Second bedroom"],
  ["Bed with a green throw and a window onto tropical greenery", "Third bedroom"],
  ["Balcony with wicker lounge chairs looking onto green hills", "Balcony lounge"],
  ["Tropical gardens and palms around the condominium buildings", "Condominium grounds"],
  ["Pool surrounded by gardens with a fountain and a house behind", "Clubhouse pool"],
  ["Blue tennis court surrounded by trees", "Tennis court"],
  ["White vessel sink on a quartz counter with mosaic tile", "Bathroom"],
  ["Pool and loungers with palms and the condominium building", "Pool"],
]);

const lovelyGallery = photos("lovely", [
  ["Open living room with a cream sofa, wooden furniture, ceiling fan and glass doors to the balcony", "Living room"],
  ["Rectangular pool with loungers in front of a white condominium building and palms", "Condominium pool"],
  ["Cream sofa with tropical-print cushions and a wooden coffee table", "Living room"],
  ["Kitchen with island, white stools, stainless refrigerator and coral vases", "Kitchen"],
  ["Round dining table with four tan chairs between the kitchen and living room", "Dining area"],
  ["King bed with a blue throw and blue cushions", "Main bedroom"],
  ["Bed with a coral throw beside a window onto tropical trees", "Second bedroom"],
  ["Bed facing glass doors that open towards the pool and gardens", "Main bedroom, garden side"],
  ["Balcony with two rattan chairs and a small round table among the trees", "Balcony"],
  ["Clubhouse pool surrounded by gardens and a fountain", "Clubhouse pool"],
  ["Blue tennis court with net, surrounded by greenery", "Tennis court"],
  ["White vessel sink on a quartz counter with mosaic tiles", "Bathroom"],
  ["Pool seen from above, lined with sun loungers and umbrellas", "Pool from above"],
]);

export const properties: Property[] = [
  {
    id: "carara-sky-house",
    slug: "carara-sky-house",
    displayName: "Carara Sky House",
    status: "active",
    featuredOrder: 1,
    locationLabel: "Mar a Mar, Herradura · Puntarenas",
    area: "Central Pacific coast",
    tagline: "High above the Pacific, between the jungle and the sea.",
    shortDescription:
      "A three-bedroom residence at Mar a Mar with sweeping ocean and jungle views, an infinity pool on the hillside and room for six.",
    longDescription: [
      "Carara Sky House sits high on the hills of Mar a Mar, looking out over layers of green forest to the Pacific. Floor-to-ceiling glass carries the view into every room, from the open living space to all three bedrooms.",
      "The home is laid out for families, friends travelling together, or anyone who wants to work remotely with a horizon in front of them: a long kitchen island for shared meals, a balcony made for slow mornings, and fast Wi-Fi.",
      "Downstairs, the residence opens onto an infinity pool that seems to spill into the ocean, two further pools, a fitness room, shaded lounge terraces with hammocks and BBQ areas.",
    ],
    experience: [
      { title: "Mornings on the balcony", body: "Coffee with the jungle below and the coastline stretching out to the south." },
      { title: "Afternoons at the infinity pool", body: "A hillside pool with shade, loungers and hammocks facing the sea." },
      { title: "Evenings in", body: "A full kitchen and a long island built for long dinners together." },
    ],
    heroImage: cararaGallery[0],
    cardImage: cararaGallery[1],
    gallery: cararaGallery,
    amenities: ["wifi", "air-conditioning", "kitchen", "pool", "gym", "workspace", "balcony", "parking", "washer", "dryer", "tv", "coffee", "self-check-in", "hair-dryer"],
    bedrooms: 3,
    beds: 3,
    bathrooms: 2.5,
    sleeps: 6,
    propertyType: "Entire residence",
    badges: ["Ocean & jungle views", "Infinity pool"],
    nearby: [
      { label: "Punta Leona", detail: "About 5 minutes away" },
      { label: "Jacó Beach", detail: "About 15 minutes away" },
      { label: "Los Sueños Marina", detail: "About 15 minutes away" },
    ],
    mapArea: {
      label: "Mar a Mar, in the hills between Herradura and Punta Leona",
      image: "/images/maps/mar-a-mar.jpg",
      osmUrl: "https://www.openstreetmap.org/#map=13/9.682/-84.650",
    },
    bookingLinks: { airbnb: "https://airbnb.com/h/cararaskyhouse" },
    seo: {
      title: "Carara Sky House — Ocean & Jungle View Residence at Mar a Mar",
      description:
        "Three-bedroom vacation rental at Mar a Mar, Herradura, with ocean and jungle views, an infinity pool and space for six. Book on Airbnb.",
    },
    todo: ["Confirm amenity list against the live listing before each season.", "Add Booking.com / Vrbo links if listed."],
  },
  {
    id: "enchanting",
    slug: "enchanting",
    displayName: "Enchanting",
    status: "active",
    featuredOrder: 2,
    locationLabel: "Herradura · near Los Sueños Marina",
    area: "Central Pacific coast",
    tagline: "Coastal calm, a short drive from the marina.",
    shortDescription:
      "A newly built three-bedroom condo by Los Sueños with a balcony onto the hills, shared pools, a clubhouse and a tennis court.",
    longDescription: [
      "Enchanting is a light-filled three-bedroom condominium close to Los Sueños Marina, finished in soft coastal tones with touches of Costa Rican colour.",
      "The open living space flows from a quartz kitchen island to the dining table and out to a balcony with lounge seating, looking onto the green hills that frame Herradura.",
      "The whole apartment is yours, along with the shared facilities of the condominium: the pool and clubhouse, a tennis court, and a balcony dining area. Beach chairs are available on request.",
    ],
    experience: [
      { title: "Pool days", body: "The condominium pool and clubhouse, set among tropical gardens." },
      { title: "A game of tennis", body: "The court is usually free; if not, we can request a slot for you." },
      { title: "Marina evenings", body: "Los Sueños restaurants are a short drive away." },
    ],
    heroImage: enchantingGallery[0],
    gallery: enchantingGallery,
    amenities: ["wifi", "air-conditioning", "kitchen", "pool", "tennis", "workspace", "balcony", "outdoor-dining", "parking", "washer", "dishwasher", "tv", "coffee", "self-check-in", "hair-dryer", "ev-charging"],
    bedrooms: 3,
    beds: 4,
    bathrooms: 2,
    sleeps: 6,
    propertyType: "Entire condominium",
    badges: ["Pool & tennis", "Near Los Sueños"],
    guestAccess: [
      "The entire apartment, plus the condominium pool and clubhouse.",
      "Tennis court — usually free, or we can request a slot for you.",
      "One marked parking space; visitor spaces for extra cars.",
      "Charging outlets for golf carts and EVs in the parking area.",
    ],
    mapArea: {
      label: "Herradura, near Los Sueños Marina",
      image: "/images/maps/herradura.jpg",
      osmUrl: "https://www.openstreetmap.org/#map=14/9.653/-84.658",
    },
    bookingLinks: { airbnb: "https://airbnb.com/h/enchantingcondo" },
    seo: {
      title: "Enchanting — Three-Bedroom Condo near Los Sueños, Herradura",
      description:
        "Newly built three-bedroom vacation condo in Herradura near Los Sueños Marina, with pools, a clubhouse and tennis court. Sleeps six. Book on Airbnb.",
    },
    todo: ["Owner to confirm the exact public location wording.", "Add Booking.com / Vrbo links if listed."],
  },
  {
    id: "lovely",
    slug: "lovely",
    displayName: "Lovely",
    status: "active",
    featuredOrder: 3,
    locationLabel: "Herradura · near Los Sueños Marina",
    area: "Central Pacific coast",
    tagline: "An easy, light-filled base for the coast.",
    shortDescription:
      "A bright two-bedroom condo in Herradura with a garden balcony, clubhouse and pools, a tennis court and BBQ area — five minutes from the beach.",
    longDescription: [
      "Lovely is a two-bedroom condominium in Herradura, close to Los Sueños Marina — an easy, comfortable base for couples, small families and friends.",
      "Inside, a bright open plan connects a fully equipped kitchen, a round dining table and a relaxed living room. A balcony with rattan chairs looks into the trees.",
      "Shared facilities include the clubhouse pool beside the tennis court, the main pool with a children's wading pool, and a BBQ area. The public beach is a five-minute drive, and the marina restaurants are open to everyone.",
    ],
    experience: [
      { title: "A quiet pool", body: "The clubhouse pool is usually calm — most homes here have their own." },
      { title: "Tennis, no booking", body: "First come, first served on the condominium court." },
      { title: "The beach, five minutes away", body: "A short drive to the public beach at Herradura." },
    ],
    heroImage: lovelyGallery[0],
    gallery: lovelyGallery,
    amenities: ["wifi", "air-conditioning", "kitchen", "pool", "tennis", "bbq", "workspace", "balcony", "outdoor-dining", "parking", "washer", "dishwasher", "tv", "coffee", "self-check-in", "hair-dryer", "ev-charging"],
    bedrooms: 2,
    beds: 3,
    bathrooms: 2,
    sleeps: 4,
    propertyType: "Entire condominium",
    badges: ["Pool & tennis", "5 min to the beach"],
    guestAccess: [
      "The entire apartment, plus the clubhouse pool, main pool and children's wading pool.",
      "Tennis court — free, first come first served.",
      "BBQ area and balcony dining space.",
      "One marked parking space; visitor spaces for extra cars. EV and golf-cart outlets in the parking area.",
      "The Los Sueños Marriott beach club is not included.",
    ],
    nearby: [
      { label: "Herradura public beach", detail: "About a 5-minute drive" },
      { label: "Los Sueños Marina restaurants", detail: "Open to everyone" },
    ],
    mapArea: {
      label: "Herradura, near Los Sueños Marina",
      image: "/images/maps/herradura.jpg",
      osmUrl: "https://www.openstreetmap.org/#map=14/9.653/-84.658",
    },
    bookingLinks: { airbnb: "https://airbnb.com/h/lovelyherradura" },
    seo: {
      title: "Lovely — Two-Bedroom Condo in Herradura with Pool & Tennis",
      description:
        "Bright two-bedroom vacation condo in Herradura near Los Sueños, with pools, tennis, a BBQ area and the beach five minutes away. Book on Airbnb.",
    },
    todo: ["Owner to confirm the exact public location wording.", "Add Booking.com / Vrbo links if listed."],
  },
  {
    id: "casa-kathia",
    slug: "casa-kathia",
    displayName: "Casa Kathia",
    status: "coming-soon",
    featuredOrder: 4,
    locationLabel: "Costa Rica",
    tagline: "A new home, taking shape.",
    shortDescription:
      "Casa Kathia is under construction and joining the collection soon. Leave your details and we'll share news as it opens.",
    longDescription: [
      "Casa Kathia is being built now and will join the Bahia Dreams collection when it is ready to welcome guests.",
      "We'll share photographs, details and booking information once the home is complete. Until then, we're happy to keep you posted.",
    ],
    gallery: [],
    amenities: [],
    bookingLinks: {},
    seo: {
      title: "Casa Kathia — Coming Soon",
      description: "Casa Kathia is under construction and will join the Bahia Dreams collection soon. Ask to be notified when it opens.",
    },
    todo: ["Location, specifications and photography once construction is complete."],
  },
];

export const sortedProperties = [...properties].sort((a, b) => a.featuredOrder - b.featuredOrder);
export const activeProperties = sortedProperties.filter((p) => p.status === "active");

export function getProperty(slug: string) {
  return properties.find((p) => p.slug === slug);
}

export const platformLabels: Record<keyof BookingLinks, string> = {
  airbnb: "Airbnb",
  booking: "Booking.com",
  vrbo: "Vrbo",
};

export function availableBookingLinks(p: Property) {
  return (Object.keys(platformLabels) as (keyof BookingLinks)[])
    .filter((k) => typeof p.bookingLinks[k] === "string" && p.bookingLinks[k]!.startsWith("https://"))
    .map((k) => ({ platform: k, label: platformLabels[k], url: p.bookingLinks[k]! }));
}
