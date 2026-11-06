export type CurrencyCode = "CAD" | "USD" | "GBP" | "EUR" | "NGN" | "GHS" | "KES";

export type GenderTarget = "MEN" | "WOMEN" | "UNISEX";

export type HubCode = "HUB_A_LAGOS" | "HUB_B_TORONTO";

export type PaymentProvider = "STRIPE" | "PAYSTACK" | "MPESA_DARAJA";

export type PaymentStatus =
  | "INITIATED"
  | "STK_PUSH_SENT"
  | "PROCESSING"
  | "SUCCEEDED"
  | "FAILED"
  | "RECONCILED_MANUALLY";

export type OrderStatus =
  | "PENDING_PAYMENT"
  | "PAID"
  | "ALLOCATED_TO_HUB"
  | "DISPATCHED"
  | "IN_CUSTOMS"
  | "DELIVERED"
  | "CANCELLED"
  | "REFUNDED";

export type B2BLeadStatus =
  | "NEW"
  | "IN_REVIEW"
  | "MEETING_SCHEDULED"
  | "PARTNERED"
  | "ARCHIVED";

export type InquiryChannel =
  | "CONCIERGE"
  | "WHOLESALE"
  | "BRAND_REPRESENTATION"
  | "PRESS";

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  label: string;
  regionLabel: string;
  rateFromCad: number; // Base 1.00 CAD
  defaultGateway: PaymentProvider;
  sampleCountryIso: string;
}

export const CURRENCIES: Record<CurrencyCode, CurrencyConfig> = {
  CAD: {
    code: "CAD",
    symbol: "CAD $",
    label: "Canadian Dollar",
    regionLabel: "NORTH AMERICA // TORONTO HQ",
    rateFromCad: 1.0,
    defaultGateway: "STRIPE",
    sampleCountryIso: "CA",
  },
  USD: {
    code: "USD",
    symbol: "USD $",
    label: "US Dollar",
    regionLabel: "NORTH AMERICA // GLOBAL",
    rateFromCad: 0.74,
    defaultGateway: "STRIPE",
    sampleCountryIso: "US",
  },
  GBP: {
    code: "GBP",
    symbol: "GBP £",
    label: "British Pound",
    regionLabel: "UNITED KINGDOM // LONDON",
    rateFromCad: 0.58,
    defaultGateway: "STRIPE",
    sampleCountryIso: "GB",
  },
  EUR: {
    code: "EUR",
    symbol: "EUR €",
    label: "Euro",
    regionLabel: "EUROPE // MILAN · PARIS",
    rateFromCad: 0.68,
    defaultGateway: "STRIPE",
    sampleCountryIso: "FR",
  },
  NGN: {
    code: "NGN",
    symbol: "NGN ₦",
    label: "Nigerian Naira",
    regionLabel: "WEST AFRICA // LAGOS HQ",
    rateFromCad: 1125.0,
    defaultGateway: "PAYSTACK",
    sampleCountryIso: "NG",
  },
  GHS: {
    code: "GHS",
    symbol: "GHS GH₵",
    label: "Ghanaian Cedi",
    regionLabel: "WEST AFRICA // ACCRA CORRIDOR",
    rateFromCad: 11.4,
    defaultGateway: "PAYSTACK",
    sampleCountryIso: "GH",
  },
  KES: {
    code: "KES",
    symbol: "KES KSh",
    label: "Kenyan Shilling",
    regionLabel: "EAST AFRICA // NAIROBI HUB",
    rateFromCad: 104.1667,
    defaultGateway: "MPESA_DARAJA",
    sampleCountryIso: "KE",
  },
};

export interface BrandRecord {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  bio: string;
  story: string;
  originCity: string;
  originCountry: string;
  creativeDirector: string;
  foundedYear: number;
  isProprietary: boolean;
  lookbookBannerUrl: string;
  secondaryBannerUrl: string;
  commissionRatePct: number;
  allocatedRegions: string[];
  isActive: boolean;
}

export interface CollectionRecord {
  id: string;
  slug: string;
  title: string;
  seasonCode: string;
  manifesto: string;
  heroImageUrl: string;
  releaseDate: string;
  isDropLive: boolean;
  isVipLocked: boolean;
  brandId: string;
  brandName: string;
}

export interface VariantStock {
  size: "XS" | "S" | "M" | "L" | "XL" | "XXL";
  sku: string;
  hubALagos: number;
  hubBToronto: number;
}

export interface ProductRecord {
  id: string;
  slug: string;
  skuPrefix: string;
  title: string;
  subtitle: string;
  description: string;
  gender: GenderTarget;
  category:
    | "OUTERWEAR"
    | "SHIRTING"
    | "TROUSERS"
    | "KAFTAN_ARCHIVE"
    | "KNITWEAR"
    | "ACCESSORIES";
  fabricWeightGsm: number;
  fabricComposition: string;
  originLabel: string;
  basePriceCad: number;
  priceOverrides?: Partial<Record<CurrencyCode, number>>;
  editorialImageUrl: string;
  flatlayImageUrl: string;
  colorName: string;
  colorHex: string;
  isFeatured: boolean;
  brandId: string;
  brandSlug: string;
  brandName: string;
  collectionSlug: string;
  variants: VariantStock[];
}

export interface OrderRecord {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  destinationCountry: string;
  destinationCity: string;
  currency: CurrencyCode;
  subtotalAmount: number;
  shippingAmount: number;
  dutiesAmount: number;
  totalAmount: number;
  assignedHub: HubCode;
  courierPartner: string;
  waybillNumber?: string;
  status: OrderStatus;
  paymentProvider: PaymentProvider;
  paymentReference: string;
  mpesaReceiptNumber?: string;
  paymentStatus: PaymentStatus;
  createdAt: string;
  items: {
    productId: string;
    productTitle: string;
    brandName: string;
    size: string;
    quantity: number;
    unitPrice: number;
  }[];
}

export interface B2BInquiryRecord {
  id: string;
  referenceCode: string;
  channel: InquiryChannel;
  brandOrCompanyName: string;
  contactName: string;
  contactRole: string;
  email: string;
  phone: string;
  headquartersCountry: string;
  websiteUrl: string;
  targetRegions: string[];
  annualVolumeTier: string;
  message: string;
  status: B2BLeadStatus;
  assignedExecutive: string;
  createdAt: string;
}

export interface JournalArticle {
  id: string;
  slug: string;
  issueNumber: string;
  title: string;
  subtitle: string;
  corridor: string;
  author: string;
  readTime: string;
  publishedAt: string;
  heroImageUrl: string;
  excerpt: string;
  bodyParagraphs: string[];
}

export const INITIAL_BRANDS: BrandRecord[] = [
  {
    id: "brand-macklemore",
    slug: "macklemore",
    name: "MACKLEMORE FASHION",
    tagline: "ARCHITECTURAL AFRO-ATLANTIC LUXURY & HEAVYWEIGHT STREETWEAR",
    bio: "Flagship proprietary label anchored between Toronto and Victoria Island, Lagos. Merging 480–620 GSM heavyweight technical jersey with hand-loomed Nigerian Aso Oke and architectural tailoring.",
    story:
      "Conceived in Canada and forged in the industrial ateliers of Lagos, Nigeria, Macklemore Fashion operates as both a sovereign luxury house and the premier continental distribution bridge linking North America, Europe, West Africa, and East Africa. Every garment is numbered, specification-stamped, and cut from custom-milled fabrics.",
    originCity: "LAGOS / TORONTO",
    originCountry: "Nigeria & Canada",
    creativeDirector: "Macklemore Design Directorate",
    foundedYear: 2021,
    isProprietary: true,
    lookbookBannerUrl:
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1800&q=85",
    secondaryBannerUrl:
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1400&q=85",
    commissionRatePct: 0,
    allocatedRegions: [
      "WEST_AFRICA",
      "EAST_AFRICA",
      "NORTH_AMERICA",
      "EUROPE",
      "UK",
    ],
    isActive: true,
  },
  {
    id: "brand-luca",
    slug: "luca",
    name: "LUCA",
    tagline: "MONOLITHIC MILANESE TAILORING & WEST AFRICAN STRUCTURAL DRAPE",
    bio: "Represented flagship partner house. LUCA synthesizes razor-sharp Italian outerwear engineering with raw unbleached West African cottons and sculptural silhouettes.",
    story:
      "Represented exclusively across West and East Africa by Macklemore Fashion, LUCA bridges Milanese pattern-making with Lagosian cultural electricity. Distributed directly through Hub A (Victoria Island, Lagos) and Hub B (Toronto) with full customs clearance and mono-brand pop-up activation.",
    originCity: "MILAN / LAGOS",
    originCountry: "Italy & Nigeria",
    creativeDirector: "Luca Vance & Tunde Balogun",
    foundedYear: 2022,
    isProprietary: false,
    lookbookBannerUrl:
      "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1800&q=85",
    secondaryBannerUrl:
      "https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?auto=format&fit=crop&w=1400&q=85",
    commissionRatePct: 24.5,
    allocatedRegions: ["WEST_AFRICA", "EAST_AFRICA", "NORTH_AMERICA"],
    isActive: true,
  },
  {
    id: "brand-adire-atelier",
    slug: "adire-atelier",
    name: "ADIRE ATELIER",
    tagline: "HERITAGE INDIGO RESIST-DYE & ARCHITECTURAL WORKWEAR",
    bio: "Artisanal Yoruba indigo fermentation vats applied to 500 GSM Japanese selvedge denim and structured utility outerwear.",
    story:
      "Working with fourth-generation indigo dyers in Abeokuta and pattern cutters in Yaba, Lagos, Adire Atelier transforms ancient cassava-paste resist geometry into museum-grade contemporary outerwear.",
    originCity: "ABEOKUTA / LAGOS",
    originCountry: "Nigeria",
    creativeDirector: "Adebisi Ogunlesi",
    foundedYear: 2020,
    isProprietary: false,
    lookbookBannerUrl:
      "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&w=1800&q=85",
    secondaryBannerUrl:
      "https://images.unsplash.com/photo-1507680434567-5739c80be1ac?auto=format&fit=crop&w=1400&q=85",
    commissionRatePct: 22.0,
    allocatedRegions: ["NORTH_AMERICA", "EUROPE", "UK", "EAST_AFRICA"],
    isActive: true,
  },
  {
    id: "brand-kojo-accra",
    slug: "kojo-accra",
    name: "KOJO ACCRA",
    tagline: "GOLD COAST BRUTALISM & HAND-WOVEN KENTE TECHNICAL SHELLS",
    bio: "Utilitarian menswear and unisex tailoring engineered in Osu, Accra with technical weatherproof membranes and Bonwire Kente selvedge trims.",
    story:
      "Kojo Accra reinterprets mid-century West African Tropical Modernist architecture through technical gabardine trench coats, wide-leg pleated trousers, and modular cargo vests.",
    originCity: "ACCRA / LONDON",
    originCountry: "Ghana & UK",
    creativeDirector: "Kojo Mensah-Bonsu",
    foundedYear: 2023,
    isProprietary: false,
    lookbookBannerUrl:
      "https://images.unsplash.com/photo-1506634572416-48cdfe530110?auto=format&fit=crop&w=1800&q=85",
    secondaryBannerUrl:
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=1400&q=85",
    commissionRatePct: 25.0,
    allocatedRegions: ["WEST_AFRICA", "NORTH_AMERICA", "EUROPE"],
    isActive: true,
  },
  {
    id: "brand-savannah-254",
    slug: "savannah-254",
    name: "SAVANNAH STUDIO 254",
    tagline: "NAIROBI DROP-MODEL STREETWEAR & HIGH-ALTITUDE KNITWEAR",
    bio: "Born in Westlands, Nairobi. High-density 540 GSM fleece, distressed mohair knits, and industrial graphic capsules built on the East African drop model.",
    story:
      "Channeling the raw drop energy of Nairobi's underground creative vanguard, Savannah Studio 254 produces strictly limited runs distributed across East Africa via Wells Fargo Courier and globally through Macklemore's Toronto hub.",
    originCity: "NAIROBI / TORONTO",
    originCountry: "Kenya & Canada",
    creativeDirector: "Kamau Njoroge",
    foundedYear: 2022,
    isProprietary: false,
    lookbookBannerUrl:
      "https://images.unsplash.com/photo-1523398002811-999ca8dec234?auto=format&fit=crop&w=1800&q=85",
    secondaryBannerUrl:
      "https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=1400&q=85",
    commissionRatePct: 20.0,
    allocatedRegions: ["EAST_AFRICA", "WEST_AFRICA", "NORTH_AMERICA"],
    isActive: true,
  },
];

export const INITIAL_COLLECTIONS: CollectionRecord[] = [
  {
    id: "col-drop-04",
    slug: "drop-04-harmattan-frost",
    title: "DROP 04 // HARMATTAN & FROST",
    seasonCode: "[ SEASON: AW26 // TORONTO — LAGOS ]",
    manifesto:
      "Engineered for the atmospheric collision between the Saharan Harmattan winds over Lagos Island and sub-zero Canadian winters in Toronto. 600 GSM double-faced wool-cotton monoliths, hand-woven Aso Oke storm plackets, and oxidized bronze hardware.",
    heroImageUrl:
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1800&q=85",
    releaseDate: "2026-11-01T00:00:00Z",
    isDropLive: true,
    isVipLocked: false,
    brandId: "brand-macklemore",
    brandName: "MACKLEMORE FASHION",
  },
  {
    id: "col-luca-bridge",
    slug: "luca-continental-bridge",
    title: "LUCA // MONOLITH CAPSULE 01",
    seasonCode: "[ EXCLUSIVE PARTNER DROP // MILAN — LAGOS ]",
    manifesto:
      "The inaugural continental capsule by LUCA, represented and distributed exclusively by Macklemore Fashion. Architectural double-breasted overcoats and raw unbleached bone shirting.",
    heroImageUrl:
      "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1800&q=85",
    releaseDate: "2026-10-15T00:00:00Z",
    isDropLive: true,
    isVipLocked: false,
    brandId: "brand-luca",
    brandName: "LUCA",
  },
  {
    id: "col-archive-03",
    slug: "victoria-island-nocturne",
    title: "ARCHIVE 03 // VICTORIA ISLAND NOCTURNE",
    seasonCode: "[ CAPSULE: EVENING & KAFTAN TAILORING ]",
    manifesto:
      "Nocturnal obsidian tailoring, crimson silk-embroidered agbada over-shirts, and precision-cut wide trousers built for gallery openings from Victoria Island to Mayfair.",
    heroImageUrl:
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1800&q=85",
    releaseDate: "2026-09-20T00:00:00Z",
    isDropLive: true,
    isVipLocked: false,
    brandId: "brand-macklemore",
    brandName: "MACKLEMORE FASHION",
  },
  {
    id: "col-drop-05",
    slug: "drop-05-equatorial-monolith",
    title: "DROP 05 // EQUATORIAL MONOLITH",
    seasonCode: "[ UPCOMING // VIP LOCKER SCHEDULED ]",
    manifesto:
      "Cross-continental collaborative capsule uniting Macklemore Fashion, Savannah Studio 254 (Nairobi), and Kojo Accra. Heavyweight distressed knitwear and wax-treated ballistic nylon outerwear.",
    heroImageUrl:
      "https://images.unsplash.com/photo-1523398002811-999ca8dec234?auto=format&fit=crop&w=1800&q=85",
    releaseDate: "2026-12-01T18:00:00Z",
    isDropLive: false,
    isVipLocked: true,
    brandId: "brand-savannah-254",
    brandName: "SAVANNAH STUDIO 254",
  },
];

export const INITIAL_PRODUCTS: ProductRecord[] = [
  {
    id: "prod-01",
    slug: "macklemore-aso-oke-monolith-overcoat",
    skuPrefix: "MKM-AW26-001",
    title: "ASO OKE MONOLITH GREATCOAT",
    subtitle: "Double-Faced Wool & Hand-Loomed Nigerian Aso Oke Storm Placket",
    description:
      "Cut in an elongated architectural silhouette with dropped shoulders and concealed horn closure. Features a hand-woven crimson and bronze Aso Oke internal storm placket milled in Iseyin, Nigeria, paired with 620 GSM weather-resistant Canadian virgin wool.",
    gender: "UNISEX",
    category: "OUTERWEAR",
    fabricWeightGsm: 620,
    fabricComposition: "80% VIRGIN WOOL / 20% HAND-LOOMED ISEYIN ASO OKE COTTON",
    originLabel: "LAGOS / TORONTO",
    basePriceCad: 680,
    priceOverrides: {
      CAD: 680,
      NGN: 765000,
      KES: 70800,
    },
    editorialImageUrl:
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1000&q=85",
    flatlayImageUrl:
      "https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=1000&q=85",
    colorName: "RICH OBSIDIAN / BRONZE",
    colorHex: "#0B0B0C",
    isFeatured: true,
    brandId: "brand-macklemore",
    brandSlug: "macklemore",
    brandName: "MACKLEMORE FASHION",
    collectionSlug: "drop-04-harmattan-frost",
    variants: [
      { size: "XS", sku: "MKM-001-XS", hubALagos: 2, hubBToronto: 2 },
      { size: "S", sku: "MKM-001-S", hubALagos: 4, hubBToronto: 3 },
      { size: "M", sku: "MKM-001-M", hubALagos: 5, hubBToronto: 4 },
      { size: "L", sku: "MKM-001-L", hubALagos: 3, hubBToronto: 4 },
      { size: "XL", sku: "MKM-001-XL", hubALagos: 2, hubBToronto: 1 },
    ],
  },
  {
    id: "prod-02",
    slug: "luca-architectural-gabardine-trench",
    skuPrefix: "LCA-AW26-014",
    title: "LUCA STRUCTURAL GABARDINE TRENCH",
    subtitle: "Water-Repellent High-Twist Milanese Cotton Trench with Raw Bone Lapel",
    description:
      "Engineered by partner house LUCA. Asymmetrical storm flap, gunmetal D-ring belt hardware, and raw unbleached bone under-collar contrast with hand-stitched geometric bar-tacks.",
    gender: "UNISEX",
    category: "OUTERWEAR",
    fabricWeightGsm: 510,
    fabricComposition: "100% HIGH-TWIST WATER-REPELLENT COTTON GABARDINE",
    originLabel: "MILAN / LAGOS",
    basePriceCad: 540,
    priceOverrides: {
      CAD: 540,
      NGN: 607500,
      KES: 56250,
    },
    editorialImageUrl:
      "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1000&q=85",
    flatlayImageUrl:
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=1000&q=85",
    colorName: "RAW BONE / OBSIDIAN",
    colorHex: "#F6F5F1",
    isFeatured: true,
    brandId: "brand-luca",
    brandSlug: "luca",
    brandName: "LUCA",
    collectionSlug: "luca-continental-bridge",
    variants: [
      { size: "S", sku: "LCA-014-S", hubALagos: 3, hubBToronto: 2 },
      { size: "M", sku: "LCA-014-M", hubALagos: 4, hubBToronto: 3 },
      { size: "L", sku: "LCA-014-L", hubALagos: 2, hubBToronto: 3 },
      { size: "XL", sku: "LCA-014-XL", hubALagos: 1, hubBToronto: 1 },
    ],
  },
  {
    id: "prod-03",
    slug: "macklemore-480gsm-tribal-seam-hoodie",
    skuPrefix: "MKM-AW26-008",
    title: "480 GSM TRIBAL CHEVRON HEAVY HOODIE",
    subtitle: "Boxy Drop-Shoulder Terry with Exposed 1px Crimson Geometric Topstitching",
    description:
      "The signature Macklemore streetwear staple. Milled from 480 GSM loopwheel organic cotton in custom Rich Obsidian, featuring articulated double-M chevron seam geometry across the back yoke and zero-rib raw hem.",
    gender: "UNISEX",
    category: "KNITWEAR",
    fabricWeightGsm: 480,
    fabricComposition: "100% COMBED RING-SPUN ORGANIC FRENCH TERRY // 480 GSM",
    originLabel: "LAGOS / TORONTO",
    basePriceCad: 120,
    priceOverrides: {
      CAD: 120,
      NGN: 135000,
      KES: 12500,
    },
    editorialImageUrl:
      "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1000&q=85",
    flatlayImageUrl:
      "https://images.unsplash.com/photo-1578681994506-b8f463449011?auto=format&fit=crop&w=1000&q=85",
    colorName: "RICH OBSIDIAN",
    colorHex: "#0B0B0C",
    isFeatured: true,
    brandId: "brand-macklemore",
    brandSlug: "macklemore",
    brandName: "MACKLEMORE FASHION",
    collectionSlug: "drop-04-harmattan-frost",
    variants: [
      { size: "XS", sku: "MKM-008-XS", hubALagos: 2, hubBToronto: 1 },
      { size: "S", sku: "MKM-008-S", hubALagos: 3, hubBToronto: 2 },
      { size: "M", sku: "MKM-008-M", hubALagos: 2, hubBToronto: 1 },
      { size: "L", sku: "MKM-008-L", hubALagos: 1, hubBToronto: 1 },
      { size: "XL", sku: "MKM-008-XL", hubALagos: 1, hubBToronto: 0 },
    ],
  },
  {
    id: "prod-04",
    slug: "macklemore-victoria-island-kaftan-set",
    skuPrefix: "MKM-ARC-019",
    title: "VICTORIA ISLAND ARCHITECTURAL KAFTAN",
    subtitle: "Structured Tunic & Wide-Leg Trouser Set with Savannah Bronze Geometric Embroidery",
    description:
      "Modernist reinterpretation of the West African ceremonial kaftan. Tailored in crisp 340 GSM mercerized cotton-silk twill with concealed placket and geometric bronze linework along the chest pocket and cuff.",
    gender: "MEN",
    category: "KAFTAN_ARCHIVE",
    fabricWeightGsm: 340,
    fabricComposition: "78% MERCERIZED EGYPTIAN COTTON / 22% MULBERRY SILK",
    originLabel: "LAGOS",
    basePriceCad: 380,
    priceOverrides: {
      CAD: 380,
      NGN: 427500,
      KES: 39500,
    },
    editorialImageUrl:
      "https://images.unsplash.com/photo-1507680434567-5739c80be1ac?auto=format&fit=crop&w=1000&q=85",
    flatlayImageUrl:
      "https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=1000&q=85",
    colorName: "OBSIDIAN / SAVANNAH GOLD",
    colorHex: "#1A0A00",
    isFeatured: true,
    brandId: "brand-macklemore",
    brandSlug: "macklemore",
    brandName: "MACKLEMORE FASHION",
    collectionSlug: "victoria-island-nocturne",
    variants: [
      { size: "S", sku: "MKM-019-S", hubALagos: 5, hubBToronto: 2 },
      { size: "M", sku: "MKM-019-M", hubALagos: 6, hubBToronto: 3 },
      { size: "L", sku: "MKM-019-L", hubALagos: 4, hubBToronto: 2 },
      { size: "XL", sku: "MKM-019-XL", hubALagos: 3, hubBToronto: 1 },
    ],
  },
  {
    id: "prod-05",
    slug: "adire-atelier-selvedge-work-jacket",
    skuPrefix: "ADR-AW26-004",
    title: "ABEOKUTA INDIGO SELVEDGE WORK JACKET",
    subtitle: "500 GSM Botanical Indigo Resist-Dyed Boxy Chore Jacket",
    description:
      "Hand-dipped in natural Lonchocarpus cyanescens (Elu) indigo vats in Abeokuta. Each jacket carries unique geometric resist-dyed striations and solid brass tack buttons.",
    gender: "UNISEX",
    category: "OUTERWEAR",
    fabricWeightGsm: 500,
    fabricComposition: "100% UNSANFORIZED SELVEDGE COTTON DENIM // NATURAL INDIGO",
    originLabel: "ABEOKUTA / LAGOS",
    basePriceCad: 410,
    priceOverrides: {
      CAD: 410,
      NGN: 461250,
      KES: 42700,
    },
    editorialImageUrl:
      "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&w=1000&q=85",
    flatlayImageUrl:
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=1000&q=85",
    colorName: "BOTANICAL INDIGO",
    colorHex: "#1A2639",
    isFeatured: true,
    brandId: "brand-adire-atelier",
    brandSlug: "adire-atelier",
    brandName: "ADIRE ATELIER",
    collectionSlug: "drop-04-harmattan-frost",
    variants: [
      { size: "S", sku: "ADR-004-S", hubALagos: 4, hubBToronto: 1 },
      { size: "M", sku: "ADR-004-M", hubALagos: 5, hubBToronto: 2 },
      { size: "L", sku: "ADR-004-L", hubALagos: 3, hubBToronto: 2 },
    ],
  },
  {
    id: "prod-06",
    slug: "luca-pleated-wide-wool-trouser",
    skuPrefix: "LCA-AW26-021",
    title: "LUCA DOUBLE-PLEAT WIDE TROUSER",
    subtitle: "Architectural Full-Length Drape Trouser in Unbleached Raw Bone",
    description:
      "Signature LUCA bottom silhouette. High-waisted construction with deep double front pleats, extended waistband tab, and puddle-length hem.",
    gender: "WOMEN",
    category: "TROUSERS",
    fabricWeightGsm: 360,
    fabricComposition: "96% COLD-SPUN VIRGIN WOOL / 4% ELASTANE",
    originLabel: "MILAN / LAGOS",
    basePriceCad: 320,
    priceOverrides: {
      CAD: 320,
      NGN: 360000,
      KES: 33300,
    },
    editorialImageUrl:
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=85",
    flatlayImageUrl:
      "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=1000&q=85",
    colorName: "UNBLEACHED BONE",
    colorHex: "#F6F5F1",
    isFeatured: true,
    brandId: "brand-luca",
    brandSlug: "luca",
    brandName: "LUCA",
    collectionSlug: "luca-continental-bridge",
    variants: [
      { size: "XS", sku: "LCA-021-XS", hubALagos: 3, hubBToronto: 3 },
      { size: "S", sku: "LCA-021-S", hubALagos: 4, hubBToronto: 4 },
      { size: "M", sku: "LCA-021-M", hubALagos: 4, hubBToronto: 3 },
      { size: "L", sku: "LCA-021-L", hubALagos: 2, hubBToronto: 2 },
    ],
  },
  {
    id: "prod-07",
    slug: "kojo-accra-kente-selvedge-cargo-pant",
    skuPrefix: "KJO-AW26-009",
    title: "BONWIRE SELVEDGE TECHNICAL CARGO",
    subtitle: "3-Layer Ripstop Utility Trouser with Hand-Loomed Kente Pocket Gussets",
    description:
      "Designed in Osu, Accra. Articulated knee darts, adjustable ankle storm straps, and concealed Bonwire silk-cotton Kente trim revealed when cargo bellows expand.",
    gender: "MEN",
    category: "TROUSERS",
    fabricWeightGsm: 420,
    fabricComposition: "85% BALLISTIC COTTON RIPSTOP / 15% BONWIRE HAND-WOVEN KENTE",
    originLabel: "ACCRA / LONDON",
    basePriceCad: 290,
    priceOverrides: {
      CAD: 290,
      NGN: 326250,
      GHS: 3306,
      KES: 30200,
    },
    editorialImageUrl:
      "https://images.unsplash.com/photo-1506634572416-48cdfe530110?auto=format&fit=crop&w=1000&q=85",
    flatlayImageUrl:
      "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=1000&q=85",
    colorName: "CHARCOAL / GOLD TRIM",
    colorHex: "#222222",
    isFeatured: false,
    brandId: "brand-kojo-accra",
    brandSlug: "kojo-accra",
    brandName: "KOJO ACCRA",
    collectionSlug: "drop-04-harmattan-frost",
    variants: [
      { size: "S", sku: "KJO-009-S", hubALagos: 6, hubBToronto: 2 },
      { size: "M", sku: "KJO-009-M", hubALagos: 7, hubBToronto: 3 },
      { size: "L", sku: "KJO-009-L", hubALagos: 5, hubBToronto: 2 },
      { size: "XL", sku: "KJO-009-XL", hubALagos: 3, hubBToronto: 1 },
    ],
  },
  {
    id: "prod-08",
    slug: "savannah-254-rift-mohair-knit",
    skuPrefix: "SAV-254-011",
    title: "RIFT VALLEY BRUSHED MOHAIR CREWNECK",
    subtitle: "540 GSM Intarsia Tribal Linework Sweater in Terracotta & Obsidian",
    description:
      "Knitted in small batches by Savannah Studio 254 in Nairobi. Heavyweight brushed kid-mohair blend featuring architectural topographic linework inspired by the Great Rift Valley.",
    gender: "UNISEX",
    category: "KNITWEAR",
    fabricWeightGsm: 540,
    fabricComposition: "55% KID MOHAIR / 30% MERINO WOOL / 15% NYLON",
    originLabel: "NAIROBI / TORONTO",
    basePriceCad: 260,
    priceOverrides: {
      CAD: 260,
      NGN: 292500,
      KES: 27000,
    },
    editorialImageUrl:
      "https://images.unsplash.com/photo-1523398002811-999ca8dec234?auto=format&fit=crop&w=1000&q=85",
    flatlayImageUrl:
      "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=1000&q=85",
    colorName: "TERRACOTTA / OBSIDIAN",
    colorHex: "#E05C1A",
    isFeatured: true,
    brandId: "brand-savannah-254",
    brandSlug: "savannah-254",
    brandName: "SAVANNAH STUDIO 254",
    collectionSlug: "drop-05-equatorial-monolith",
    variants: [
      { size: "S", sku: "SAV-011-S", hubALagos: 3, hubBToronto: 2 },
      { size: "M", sku: "SAV-011-M", hubALagos: 4, hubBToronto: 3 },
      { size: "L", sku: "SAV-011-L", hubALagos: 3, hubBToronto: 2 },
    ],
  },
  {
    id: "prod-09",
    slug: "macklemore-ankara-geometric-silk-shirt",
    skuPrefix: "MKM-ARC-027",
    title: "ANKARA MONOLITH SILK CAMP SHIRT",
    subtitle: "310 GSM Heavy Twill Silk Shirt with Extracted Macklemore Geometric Weave",
    description:
      "Printed in Como and finished in Lagos using the signature Macklemore crimson, gold, and teal tribal geometry. Relaxed boxy fit with mother-of-pearl buttons.",
    gender: "UNISEX",
    category: "SHIRTING",
    fabricWeightGsm: 310,
    fabricComposition: "100% HEAVYWEIGHT MULBERRY SILK TWILL",
    originLabel: "LAGOS / TORONTO",
    basePriceCad: 240,
    priceOverrides: {
      CAD: 240,
      NGN: 270000,
      KES: 25000,
    },
    editorialImageUrl:
      "https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?auto=format&fit=crop&w=1000&q=85",
    flatlayImageUrl:
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=1000&q=85",
    colorName: "CRIMSON / IMPERIAL GOLD",
    colorHex: "#E31E24",
    isFeatured: false,
    brandId: "brand-macklemore",
    brandSlug: "macklemore",
    brandName: "MACKLEMORE FASHION",
    collectionSlug: "victoria-island-nocturne",
    variants: [
      { size: "XS", sku: "MKM-027-XS", hubALagos: 3, hubBToronto: 2 },
      { size: "S", sku: "MKM-027-S", hubALagos: 5, hubBToronto: 3 },
      { size: "M", sku: "MKM-027-M", hubALagos: 6, hubBToronto: 4 },
      { size: "L", sku: "MKM-027-L", hubALagos: 4, hubBToronto: 2 },
    ],
  },
  {
    id: "prod-10",
    slug: "luca-sculpted-shoulder-blazer",
    skuPrefix: "LCA-AW26-033",
    title: "LUCA ARCHITECTURAL PEAK-LAPEL BLAZER",
    subtitle: "Full-Canvas Structured Evening Jacket with Bronze Hairline Piping",
    description:
      "Hand-canvassed blazer featuring extended architectural shoulders, a single concealed closure, and internal Macklemore x LUCA co-branded woven specification label.",
    gender: "WOMEN",
    category: "OUTERWEAR",
    fabricWeightGsm: 440,
    fabricComposition: "100% BARATHEA VIRGIN WOOL",
    originLabel: "MILAN / LAGOS",
    basePriceCad: 590,
    priceOverrides: {
      CAD: 590,
      NGN: 663750,
      KES: 61450,
    },
    editorialImageUrl:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1000&q=85",
    flatlayImageUrl:
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=1000&q=85",
    colorName: "RICH OBSIDIAN",
    colorHex: "#0B0B0C",
    isFeatured: false,
    brandId: "brand-luca",
    brandSlug: "luca",
    brandName: "LUCA",
    collectionSlug: "luca-continental-bridge",
    variants: [
      { size: "XS", sku: "LCA-033-XS", hubALagos: 2, hubBToronto: 2 },
      { size: "S", sku: "LCA-033-S", hubALagos: 3, hubBToronto: 3 },
      { size: "M", sku: "LCA-033-M", hubALagos: 3, hubBToronto: 2 },
      { size: "L", sku: "LCA-033-L", hubALagos: 1, hubBToronto: 2 },
    ],
  },
];

export const INITIAL_ORDERS: OrderRecord[] = [
  {
    id: "ord-01",
    orderNumber: "MKM-2026-9041",
    customerName: "Oluwaseun Adeyemi",
    customerEmail: "s.adeyemi@vi-capital.ng",
    customerPhone: "+234 809 442 1900",
    destinationCountry: "NG",
    destinationCity: "Victoria Island, Lagos",
    currency: "NGN",
    subtotalAmount: 765000,
    shippingAmount: 18500,
    dutiesAmount: 0,
    totalAmount: 783500,
    assignedHub: "HUB_A_LAGOS",
    courierPartner: "GIG Logistics Priority",
    waybillNumber: "GIG-LOS-8841209",
    status: "DISPATCHED",
    paymentProvider: "PAYSTACK",
    paymentReference: "PSK_REF_994810234",
    paymentStatus: "SUCCEEDED",
    createdAt: "2026-11-06T09:14:00Z",
    items: [
      {
        productId: "prod-01",
        productTitle: "ASO OKE MONOLITH GREATCOAT",
        brandName: "MACKLEMORE FASHION",
        size: "L",
        quantity: 1,
        unitPrice: 765000,
      },
    ],
  },
  {
    id: "ord-02",
    orderNumber: "MKM-2026-9042",
    customerName: "Wanjiku Mwangi",
    customerEmail: "wanjiku@nairobi-atelier.ke",
    customerPhone: "254712883901",
    destinationCountry: "KE",
    destinationCity: "Westlands, Nairobi",
    currency: "KES",
    subtotalAmount: 39500,
    shippingAmount: 3200,
    dutiesAmount: 1800,
    totalAmount: 44500,
    assignedHub: "HUB_A_LAGOS",
    courierPartner: "Wells Fargo / Fargo Courier Kenya",
    status: "PENDING_PAYMENT",
    paymentProvider: "MPESA_DARAJA",
    paymentReference: "ws_CO_06112026142209182",
    mpesaReceiptNumber: undefined,
    paymentStatus: "STK_PUSH_SENT",
    createdAt: "2026-11-06T12:22:00Z",
    items: [
      {
        productId: "prod-04",
        productTitle: "VICTORIA ISLAND ARCHITECTURAL KAFTAN",
        brandName: "MACKLEMORE FASHION",
        size: "M",
        quantity: 1,
        unitPrice: 39500,
      },
    ],
  },
  {
    id: "ord-03",
    orderNumber: "MKM-2026-9043",
    customerName: "Marcus Vance-Sterling",
    customerEmail: "m.sterling@yorkville-arch.ca",
    customerPhone: "+1 416 892 4410",
    destinationCountry: "CA",
    destinationCity: "Toronto, ON",
    currency: "CAD",
    subtotalAmount: 660,
    shippingAmount: 25,
    dutiesAmount: 0,
    totalAmount: 685,
    assignedHub: "HUB_B_TORONTO",
    courierPartner: "DHL Express Domestic Air",
    waybillNumber: "DHL-YYZ-44109822",
    status: "PAID",
    paymentProvider: "STRIPE",
    paymentReference: "pi_3QKm89LkdIwHu7ix0881",
    paymentStatus: "SUCCEEDED",
    createdAt: "2026-11-06T13:05:00Z",
    items: [
      {
        productId: "prod-02",
        productTitle: "LUCA STRUCTURAL GABARDINE TRENCH",
        brandName: "LUCA",
        size: "M",
        quantity: 1,
        unitPrice: 540,
      },
      {
        productId: "prod-03",
        productTitle: "480 GSM TRIBAL CHEVRON HEAVY HOODIE",
        brandName: "MACKLEMORE FASHION",
        size: "L",
        quantity: 1,
        unitPrice: 120,
      },
    ],
  },
  {
    id: "ord-04",
    orderNumber: "MKM-2026-9044",
    customerName: "Kwame Boateng",
    customerEmail: "k.boateng@osu-holdings.gh",
    customerPhone: "+233 24 891 0023",
    destinationCountry: "GH",
    destinationCity: "Airport Residential, Accra",
    currency: "GHS",
    subtotalAmount: 3306,
    shippingAmount: 240,
    dutiesAmount: 0,
    totalAmount: 3546,
    assignedHub: "HUB_A_LAGOS",
    courierPartner: "GIG Logistics ECOWAS Corridor",
    waybillNumber: "GIG-ACC-771029",
    status: "ALLOCATED_TO_HUB",
    paymentProvider: "PAYSTACK",
    paymentReference: "PSK_GH_77291044",
    paymentStatus: "SUCCEEDED",
    createdAt: "2026-11-06T14:10:00Z",
    items: [
      {
        productId: "prod-07",
        productTitle: "BONWIRE SELVEDGE TECHNICAL CARGO",
        brandName: "KOJO ACCRA",
        size: "M",
        quantity: 1,
        unitPrice: 3306,
      },
    ],
  },
];

export const INITIAL_B2B_INQUIRIES: B2BInquiryRecord[] = [
  {
    id: "b2b-01",
    referenceCode: "B2B-MKM-0412",
    channel: "BRAND_REPRESENTATION",
    brandOrCompanyName: "VALENTINO ROSSO STUDIO MILANO",
    contactName: "Matteo Conti",
    contactRole: "VP International Commercial Expansion",
    email: "m.conti@rossostudio.it",
    phone: "+39 02 9182 7731",
    headquartersCountry: "Italy",
    websiteUrl: "https://rossostudio.it",
    targetRegions: ["WEST_AFRICA", "EAST_AFRICA"],
    annualVolumeTier: "$1M - $5M",
    message:
      "Seeking turn-key West African (Lagos/Accra) and East African (Nairobi) distribution, bonded customs warehousing in Victoria Island, and VIP trunk show representation for AW27.",
    status: "MEETING_SCHEDULED",
    assignedExecutive: "Chidi Okonkwo (Lagos B2B Desk)",
    createdAt: "2026-11-03T11:30:00Z",
  },
  {
    id: "b2b-02",
    referenceCode: "B2B-MKM-0415",
    channel: "WHOLESALE",
    brandOrCompanyName: "ALARA & TEMPLE CONCEPT CONSORTIUM",
    contactName: "Zainab Danjuma",
    contactRole: "Head Buyer — Menswear & Avant-Garde",
    email: "z.danjuma@concept-consortium.ng",
    phone: "+234 803 900 1122",
    headquartersCountry: "Nigeria",
    websiteUrl: "https://concept-consortium.ng",
    targetRegions: ["WEST_AFRICA"],
    annualVolumeTier: "$250K - $1M",
    message:
      "Wholesale allocation request for LUCA Monolith Capsule 01 and Macklemore Drop 04 outerwear (45 units across sizes S–XL) for Q4 retail floor installation.",
    status: "IN_REVIEW",
    assignedExecutive: "Elena Rostova (Toronto / Global Desk)",
    createdAt: "2026-11-04T15:45:00Z",
  },
  {
    id: "b2b-03",
    referenceCode: "B2B-MKM-0419",
    channel: "BRAND_REPRESENTATION",
    brandOrCompanyName: "KILIMANJARO TECHNICAL APPAREL",
    contactName: "David Ochieng",
    contactRole: "Founder & Creative Director",
    email: "david@kilimanjaro-tech.ke",
    phone: "+254 722 991 044",
    headquartersCountry: "Kenya",
    websiteUrl: "https://kilimanjaro-tech.ke",
    targetRegions: ["NORTH_AMERICA", "EUROPE", "WEST_AFRICA"],
    annualVolumeTier: "$250K - $1M",
    message:
      "Applying for Macklemore Fashion representation to export our GORE-TEX East African outerwear line into Toronto, London, and Lagos via Hub B fulfillment.",
    status: "NEW",
    assignedExecutive: "Unassigned",
    createdAt: "2026-11-06T08:20:00Z",
  },
  {
    id: "b2b-04",
    referenceCode: "B2B-MKM-0388",
    channel: "BRAND_REPRESENTATION",
    brandOrCompanyName: "LUCA MILANO SRL",
    contactName: "Luca Vance",
    contactRole: "Managing Director",
    email: "luca@lucamilano.it",
    phone: "+39 02 4410 8821",
    headquartersCountry: "Italy",
    websiteUrl: "https://macklemorefashions.com/brands/luca",
    targetRegions: ["WEST_AFRICA", "EAST_AFRICA", "NORTH_AMERICA"],
    annualVolumeTier: "$1M - $5M",
    message:
      "Full continental representation agreement executed. Live microsite at /brands/luca with Hub A (Lagos) & Hub B (Toronto) inventory split.",
    status: "PARTNERED",
    assignedExecutive: "Executive Directorate",
    createdAt: "2026-09-12T10:00:00Z",
  },
];

export const JOURNAL_ARTICLES: JournalArticle[] = [
  {
    id: "jrn-01",
    slug: "the-lagos-toronto-axis-redefining-luxury-distribution",
    issueNumber: "ISSUE 01 // CONTINENTAL ARCHITECTURE",
    title: "THE TORONTO–LAGOS AXIS: WHY THE FUTURE OF LUXURY DISTRIBUTION RUNS THROUGH VICTORIA ISLAND",
    subtitle:
      "How Macklemore Fashion built a bi-continental supply chain and representation bridge connecting Canadian capital markets with West and East Africa's fastest-growing luxury hubs.",
    corridor: "[ CORRIDOR: TORONTO // LAGOS // NAIROBI ]",
    author: "Amara Nwosu & Julian Sterling",
    readTime: "06 MIN READ",
    publishedAt: "2026-11-02",
    heroImageUrl:
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1600&q=85",
    excerpt:
      "For decades, global fashion houses treated Africa as an afterthought in their international distribution matrix. Macklemore Fashion's dual-hub infrastructure in Victoria Island and Toronto rewrites the rules of customs clearance, local payment settlement, and editorial authority.",
    bodyParagraphs: [
      "From the industrial ateliers of Lagos to the architectural showrooms of King West in Toronto, a new sovereign infrastructure has emerged. Global luxury consumers in Lagos, Accra, and Nairobi no longer accept six-week overseas transit times, opaque customs duties, or declined international credit cards.",
      "By establishing Hub A in Victoria Island, Lagos—integrated directly with GIG Logistics for ECOWAS road/air freight and Wells Fargo Courier for East African fulfillment—alongside Hub B in Toronto for North American and European dispatch, Macklemore Fashion reduces continental delivery to 24–72 hours.",
      "Simultaneously, our payment orchestration layer reconciles Stripe for North America and Europe, Paystack for Nigerian Naira (NGN) and Ghanaian Cedi (GHS), and native M-Pesa Daraja 2.0 Express STK Push for Kenyan Shilling (KES) in a single unified ledger.",
    ],
  },
  {
    id: "jrn-02",
    slug: "aso-oke-and-620-gsm-wool-material-alchemy",
    issueNumber: "ISSUE 02 // TEXTILE ARCHIVE",
    title: "MATERIAL ALCHEMY: MILLING 620 GSM CANADIAN WOOL WITH ISEYIN HAND-LOOMED ASO OKE",
    subtitle:
      "Inside the textile development of Drop 04: Harmattan & Frost.",
    corridor: "[ CORRIDOR: ISEYIN // LAGOS // MONTREAL ]",
    author: "Tunde Balogun",
    readTime: "05 MIN READ",
    publishedAt: "2026-10-24",
    heroImageUrl:
      "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&w=1600&q=85",
    excerpt:
      "Traditional Yoruba strip-weaving requires mathematical tension and generational rhythm. When bonded to high-density 620 GSM virgin wool, it produces an overcoat silhouette of unprecedented structural permanence.",
    bodyParagraphs: [
      "Every strip of Aso Oke used in the Macklemore Monolith Greatcoat is woven on narrow horizontal pedal looms in Iseyin, Oyo State. Rather than treating indigenous textiles as surface decoration, our pattern cutters integrate the dense cotton-silk weave directly into the structural load-bearing storm placket and collar stand.",
      "The result is a garment engineered for both the dry dust of the December Harmattan in West Africa and the freezing winds of Lake Ontario.",
    ],
  },
  {
    id: "jrn-03",
    slug: "inside-luca-milan-to-lagos-vanguard",
    issueNumber: "ISSUE 03 // PARTNER HOUSE DOSSIER",
    title: "PARTNER DOSSIER: HOW ITALIAN LABEL 'LUCA' ENTERED WEST & EAST AFRICA THROUGH MACKLEMORE",
    subtitle:
      "A conversation with Luca Vance on why Lagos and Nairobi are outpacing traditional European capitals in avant-garde tailoring adoption.",
    corridor: "[ CORRIDOR: MILAN // LAGOS // ACCRA ]",
    author: "Elena Rostova",
    readTime: "07 MIN READ",
    publishedAt: "2026-10-11",
    heroImageUrl:
      "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1600&q=85",
    excerpt:
      "When Milanese tailoring label LUCA sought continental representation in Africa, they bypassed traditional European distributors in favor of Macklemore Fashion's Lagos headquarters.",
    bodyParagraphs: [
      "\"The patronage we see in Victoria Island, Ikoyi, Osu, and Westlands is extraordinary,\" notes founder Luca Vance. \"Through Macklemore Fashion's B2B representation platform, our seasonal collections are pre-positioned in Lagos before the drop goes live, allowing immediate settlement in NGN, GHS, and KES.\"",
    ],
  },
];

/**
 * Helper to format a CAD base price into any target CurrencyCode
 * or generate the signature bracketed multi-currency string:
 * e.g. [ CAD $120 // NGN 135,000 // KES 12,500 ]
 */
export function convertPrice(
  product: Pick<ProductRecord, "basePriceCad" | "priceOverrides">,
  currency: CurrencyCode
): number {
  if (product.priceOverrides && product.priceOverrides[currency] !== undefined) {
    return product.priceOverrides[currency]!;
  }
  const rate = CURRENCIES[currency].rateFromCad;
  const raw = product.basePriceCad * rate;
  if (currency === "NGN" || currency === "KES") {
    return Math.round(raw / 100) * 100;
  }
  return Math.round(raw);
}

export function formatCurrencyValue(
  amount: number,
  currency: CurrencyCode
): string {
  const formatted = amount.toLocaleString("en-US", {
    maximumFractionDigits: 0,
  });
  switch (currency) {
    case "CAD":
      return `CAD $${formatted}`;
    case "USD":
      return `USD $${formatted}`;
    case "GBP":
      return `GBP £${formatted}`;
    case "EUR":
      return `EUR €${formatted}`;
    case "NGN":
      return `NGN ${formatted}`;
    case "GHS":
      return `GHS ${formatted}`;
    case "KES":
      return `KES ${formatted}`;
  }
}

export function formatMultiCurrencyBracket(
  product: Pick<ProductRecord, "basePriceCad" | "priceOverrides">,
  activeCurrency: CurrencyCode
): string {
  const primary = formatCurrencyValue(
    convertPrice(product, activeCurrency),
    activeCurrency
  );
  const ngn = formatCurrencyValue(convertPrice(product, "NGN"), "NGN");
  const kes = formatCurrencyValue(convertPrice(product, "KES"), "KES");
  const cad = formatCurrencyValue(convertPrice(product, "CAD"), "CAD");

  if (activeCurrency === "CAD") {
    return `[ ${cad} // ${ngn} // ${kes} ]`;
  }
  if (activeCurrency === "NGN") {
    return `[ ${ngn} // ${cad} // ${kes} ]`;
  }
  if (activeCurrency === "KES") {
    return `[ ${kes} // ${cad} // ${ngn} ]`;
  }
  return `[ ${primary} // ${ngn} // ${kes} ]`;
}

export function getTotalProductStock(product: ProductRecord): {
  total: number;
  hubALagos: number;
  hubBToronto: number;
} {
  let hubALagos = 0;
  let hubBToronto = 0;
  for (const v of product.variants) {
    hubALagos += v.hubALagos;
    hubBToronto += v.hubBToronto;
  }
  return {
    total: hubALagos + hubBToronto,
    hubALagos,
    hubBToronto,
  };
}

/**
 * Multi-Hub Logistics & Shipping Rate Calculator
 * Evaluates destination country and currency to route order to Hub A (Lagos) or Hub B (Toronto).
 */
export function calculateLogisticsForDestination(
  destinationCountryIso: string,
  currency: CurrencyCode,
  subtotalInCurrency: number
): {
  assignedHub: HubCode;
  hubName: string;
  courierPartner: string;
  estimatedTransitDays: string;
  shippingFee: number;
  dutiesFee: number;
  recommendedGateway: PaymentProvider;
} {
  const rate = CURRENCIES[currency].rateFromCad;

  // West Africa (Nigeria, Ghana, Ivory Coast, Senegal) -> Hub A Lagos via GIG Logistics
  if (["NG", "GH", "CI", "SN"].includes(destinationCountryIso)) {
    const baseShipCad = destinationCountryIso === "NG" ? 16 : 24;
    return {
      assignedHub: "HUB_A_LAGOS",
      hubName: "Hub A: Lagos Victoria Island Fulfillment Center",
      courierPartner:
        destinationCountryIso === "NG"
          ? "GIG Logistics Priority (Same/Next-Day Lagos & Abuja)"
          : "GIG Logistics ECOWAS Air/Road Corridor",
      estimatedTransitDays:
        destinationCountryIso === "NG" ? "1–2 BUSINESS DAYS" : "2–4 BUSINESS DAYS",
      shippingFee: Math.round(baseShipCad * rate),
      dutiesFee: 0, // ECOWAS duty-cleared from Lagos HQ
      recommendedGateway: "PAYSTACK",
    };
  }

  // East Africa (Kenya, Uganda, Tanzania, Rwanda) -> Hub A Lagos / Nairobi Node via Wells Fargo / Fargo Courier
  if (["KE", "UG", "TZ", "RW"].includes(destinationCountryIso)) {
    const baseShipCad = 28;
    return {
      assignedHub: "HUB_A_LAGOS",
      hubName: "Hub A: Lagos HQ -> Nairobi Westlands Regional Node",
      courierPartner: "Wells Fargo / Fargo Courier Kenya Express",
      estimatedTransitDays: "2–3 BUSINESS DAYS",
      shippingFee: Math.round(baseShipCad * rate),
      dutiesFee: Math.round(subtotalInCurrency * 0.045),
      recommendedGateway: "MPESA_DARAJA",
    };
  }

  // North America, UK, Europe & Rest of World -> Hub B Toronto via DHL Express
  const baseShipCad = destinationCountryIso === "CA" ? 20 : 35;
  return {
    assignedHub: "HUB_B_TORONTO",
    hubName: "Hub B: Toronto International Distribution Center",
    courierPartner: "DHL Express International Air",
    estimatedTransitDays:
      destinationCountryIso === "CA" ? "1–2 BUSINESS DAYS" : "2–4 BUSINESS DAYS",
    shippingFee: Math.round(baseShipCad * rate),
    dutiesFee:
      destinationCountryIso === "CA"
        ? 0
        : Math.round(subtotalInCurrency * 0.06),
    recommendedGateway: "STRIPE",
  };
}
