export type CurrencyCode = "CAD" | "USD" | "GBP" | "EUR" | "NGN" | "GHS" | "KES";

export type GenderTarget = "MEN" | "WOMEN" | "KIDS" | "UNISEX";

export type HubCode = "HUB_A_LAGOS" | "HUB_B_TORONTO";

export type PaymentProvider = "STRIPE" | "PAYSTACK";

export type PaymentStatus =
  | "INITIATED"
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
    regionLabel: "Canada · Toronto HQ",
    rateFromCad: 1.0,
    defaultGateway: "STRIPE",
    sampleCountryIso: "CA",
  },
  USD: {
    code: "USD",
    symbol: "USD $",
    label: "US Dollar",
    regionLabel: "United States & International",
    rateFromCad: 0.74,
    defaultGateway: "STRIPE",
    sampleCountryIso: "US",
  },
  GBP: {
    code: "GBP",
    symbol: "GBP £",
    label: "British Pound",
    regionLabel: "United Kingdom · London",
    rateFromCad: 0.58,
    defaultGateway: "STRIPE",
    sampleCountryIso: "GB",
  },
  EUR: {
    code: "EUR",
    symbol: "EUR €",
    label: "Euro",
    regionLabel: "Europe · Milan & Paris",
    rateFromCad: 0.68,
    defaultGateway: "STRIPE",
    sampleCountryIso: "FR",
  },
  NGN: {
    code: "NGN",
    symbol: "NGN ₦",
    label: "Nigerian Naira",
    regionLabel: "Nigeria · Operations Hub",
    rateFromCad: 1125.0,
    defaultGateway: "PAYSTACK",
    sampleCountryIso: "NG",
  },
  GHS: {
    code: "GHS",
    symbol: "GHS GH₵",
    label: "Ghanaian Cedi",
    regionLabel: "West Africa · Ghana",
    rateFromCad: 11.4,
    defaultGateway: "PAYSTACK",
    sampleCountryIso: "GH",
  },
  KES: {
    code: "KES",
    symbol: "KES KSh",
    label: "Kenyan Shilling",
    regionLabel: "East Africa · Delivery",
    rateFromCad: 104.1667,
    defaultGateway: "STRIPE",
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

export type ShopCategory =
  | "Men Wears"
  | "Male Accessories"
  | "Women Wears"
  | "Female Accessories"
  | "Kids Wears"
  | "Fabrics"
  | "OUTERWEAR"
  | "SHIRTING"
  | "TROUSERS"
  | "KAFTAN_ARCHIVE"
  | "KNITWEAR"
  | "ACCESSORIES";

export interface ProductRecord {
  id: string;
  slug: string;
  skuPrefix: string;
  title: string;
  subtitle: string;
  description: string;
  gender: GenderTarget;
  category: ShopCategory;
  fabricWeightGsm: number;
  fabricComposition: string;
  originLabel: string;
  basePriceCad: number;
  priceRangeLabel?: string;
  priceOverrides?: Partial<Record<CurrencyCode, number>>;
  editorialImageUrl: string;
  flatlayImageUrl: string;
  s3EditorialKey?: string;
  s3FlatlayKey?: string;
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
    name: "Macklemore Fashion",
    tagline: "Authentic African Luxury, Bespoke Tailoring & Ready-to-Wear",
    bio: "Headquartered in Toronto, Canada with operational roots in Lagos, Nigeria. Founded by creative entrepreneur Micah Elechi, Macklemore Fashion fuses traditional African craftsmanship with modern sophistication.",
    story:
      "Featured on the runway at Toronto Fashion Week 2024, RAW Toronto 2024, and the Africa International Film Festival (AFRIFF), Macklemore Fashion creates custom and ready-to-wear Agbada sets, Aso-Oke Dashikis, Boubou gowns, children's ceremonial attire, and curated African textiles.",
    originCity: "Toronto & Lagos",
    originCountry: "Canada & Nigeria",
    creativeDirector: "Micah Elechi",
    foundedYear: 2021,
    isProprietary: true,
    lookbookBannerUrl:
      "https://macklemorefashions.com/wp-content/uploads/2025/05/Torontofw1.jpg",
    secondaryBannerUrl:
      "https://macklemorefashions.com/wp-content/uploads/2025/05/Micah-sewing-.jpg",
    commissionRatePct: 0,
    allocatedRegions: [
      "Canada & North America",
      "West Africa (Lagos & Accra)",
      "East Africa (Nairobi)",
      "UK & Europe",
    ],
    isActive: true,
  },
  {
    id: "brand-deji-and-kola",
    slug: "deji-and-kola",
    name: "Deji & Kola",
    tagline: "Contemporary Nigerian Senator Kaftans & Bespoke Menswear",
    bio: "Lagos-born luxury menswear label renowned for precision-tailored Zipline Senator Kaftans, ceremonial Agbadas, and modern African suiting.",
    story:
      "Showcased in Macklemore Fashion's Men Wears collection, Deji & Kola brings contemporary Nigerian tailoring and structured 3/4-sleeve Senator silhouettes to clients across West Africa, East Africa, and the global diaspora.",
    originCity: "Lagos",
    originCountry: "Nigeria",
    creativeDirector: "Deji & Kola Atelier",
    foundedYear: 2018,
    isProprietary: false,
    lookbookBannerUrl:
      "https://macklemorefashions.com/wp-content/uploads/2025/04/dejiandkola_africa_1712608765_3341927002288432016_30014923707.jpg",
    secondaryBannerUrl:
      "https://macklemorefashions.com/wp-content/uploads/2025/04/dejiandkola_africa_1712608765_3341927002557004894_30014923707.jpg",
    commissionRatePct: 20.0,
    allocatedRegions: ["West Africa", "East Africa", "North America", "UK"],
    isActive: true,
  },
  {
    id: "brand-luca",
    slug: "luca",
    name: "LUCA",
    tagline: "Contemporary International Tailoring & West African Drape",
    bio: "Represented partner brand combining modern Italian tailoring with relaxed, breathable silhouettes curated for African and international markets.",
    story:
      "Represented across West and East Africa by Macklemore Fashion, LUCA exemplifies our vision of connecting international fashion houses with discerning customers in Lagos, Accra, Nairobi, and Toronto.",
    originCity: "Milan & Lagos",
    originCountry: "Italy & Nigeria",
    creativeDirector: "Luca Vance",
    foundedYear: 2022,
    isProprietary: false,
    lookbookBannerUrl:
      "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1800&q=85",
    secondaryBannerUrl:
      "https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?auto=format&fit=crop&w=1400&q=85",
    commissionRatePct: 24.5,
    allocatedRegions: ["West Africa", "East Africa", "North America"],
    isActive: true,
  },
  {
    id: "brand-aso-oke-heritage",
    slug: "aso-oke-heritage",
    name: "Macklemore Textiles & Prints",
    tagline: "Curated Aso-Oke, Ankara, Kente, Adire & Ceremonial Lace",
    bio: "Direct textile curation supplying authentic hand-woven Aso-Oke, African wax print Ankara, Kente, Adire tie-dye, and ceremonial lace in 3-yard and 6-yard cuts.",
    story:
      "At Macklemore Fashions, the fabric is the soul of every creation. We source and curate high-quality African fabrics for bespoke tailoring, designers, students, and cultural celebrations across Canada, Nigeria, and worldwide.",
    originCity: "Lagos & Toronto",
    originCountry: "Nigeria & Canada",
    creativeDirector: "Micah Elechi",
    foundedYear: 2021,
    isProprietary: true,
    lookbookBannerUrl:
      "https://macklemorefashions.com/wp-content/uploads/2025/04/25.jpg",
    secondaryBannerUrl:
      "https://macklemorefashions.com/wp-content/uploads/2025/04/26.jpg",
    commissionRatePct: 0,
    allocatedRegions: ["Canada", "Nigeria", "Ghana", "Kenya", "UK"],
    isActive: true,
  },
];

export const INITIAL_COLLECTIONS: CollectionRecord[] = [
  {
    id: "col-men-wears",
    slug: "men-wears-collection",
    title: "Men Wears & Royal Agbada Collection",
    seasonCode: "Men Wears · Custom & Ready-to-Wear",
    manifesto:
      "Champagne gold Aso-Oke Dashikis with hand-woven Yoruba hats and coral beads, sided pagoda-embroidered white Agbadas, and tortilla brown Zipline Senator Kaftans.",
    heroImageUrl:
      "https://macklemorefashions.com/wp-content/uploads/2025/04/168465240_271856821065695_3354743809372838221_n.jpg",
    releaseDate: "2026-04-01T00:00:00Z",
    isDropLive: true,
    isVipLocked: false,
    brandId: "brand-macklemore",
    brandName: "Macklemore Fashion",
  },
  {
    id: "col-women-wears",
    slug: "women-wears-collection",
    title: "Women Wears, Aso-Ebi & Boubou Gowns",
    seasonCode: "Women Wears · Bespoke & Ready-to-Wear",
    manifesto:
      "Regal Green Aso-Ebi gowns, flowing African Aso-Oke Boubou silhouettes, Ankara lace styles, and pre-styled royal gold Gele headties and bridal bead sets.",
    heroImageUrl:
      "https://macklemorefashions.com/wp-content/uploads/2025/04/7.jpg",
    releaseDate: "2026-04-05T00:00:00Z",
    isDropLive: true,
    isVipLocked: false,
    brandId: "brand-macklemore",
    brandName: "Macklemore Fashion",
  },
  {
    id: "col-kids-wears",
    slug: "kids-wears-collection",
    title: "Kids Wears · Traditional Aso-Oke Sets",
    seasonCode: "Children Wears · Cultural Heritage",
    manifesto:
      "Handcrafted Yoruba, Hausa, and ceremonial Aso-Oke complete outfits for baby boys and baby girls, celebrating cultural pride across generations.",
    heroImageUrl:
      "https://macklemorefashions.com/wp-content/uploads/2025/04/16.jpg",
    releaseDate: "2026-04-10T00:00:00Z",
    isDropLive: true,
    isVipLocked: false,
    brandId: "brand-macklemore",
    brandName: "Macklemore Fashion",
  },
  {
    id: "col-prints-and-patterns",
    slug: "prints-and-patterns-collection",
    title: "Prints, Patterns & Luxury African Fabrics",
    seasonCode: "Fabrics · 3 Yards & 6 Yards",
    manifesto:
      "Authentic Aso-Oke Oxblood & Pink weaves, Elegant African Lace, and vibrant Ankara wax prints available in 3-yard and 6-yard cuts for custom tailoring or bulk orders.",
    heroImageUrl:
      "https://macklemorefashions.com/wp-content/uploads/2025/04/25.jpg",
    releaseDate: "2026-04-15T00:00:00Z",
    isDropLive: true,
    isVipLocked: false,
    brandId: "brand-aso-oke-heritage",
    brandName: "Macklemore Textiles & Prints",
  },
];

/**
 * All 21 Official Products from https://macklemorefashions.com/
 * plus 2 Represented Partner Brand (LUCA) pieces.
 */
export const INITIAL_PRODUCTS: ProductRecord[] = [
  // =========================================================================
  // 1. MEN WEARS (https://macklemorefashions.com/african-man-wears/)
  // =========================================================================
  {
    id: "mkm-200",
    slug: "aso-oke-dashiki-with-a-floral-and-ancient-style-shaped-embroidery-design",
    skuPrefix: "MKM-MEN-200",
    title:
      "Aso-Oke Dashiki with Floral Embroidery, Yoruba Hat & Coral Bead",
    subtitle:
      "Champagne gold Aso-Oke dashiki set with hand-woven Yoruba hat and extra-length red & gold coral beads",
    description:
      "A champagne gold Aso-Oke dashiki featuring a floral and ancient style shaped embroidery design, paired with a hand-woven Yoruba hat and an extra-length red and gold coral bead. Available in any colour.",
    gender: "MEN",
    category: "Men Wears",
    fabricWeightGsm: 480,
    fabricComposition: "100% Hand-Woven Nigerian Aso-Oke & Coral Beads",
    originLabel: "Lagos & Toronto",
    basePriceCad: 300,
    editorialImageUrl:
      "https://macklemorefashions.com/wp-content/uploads/2025/04/168465240_271856821065695_3354743809372838221_n.jpg",
    flatlayImageUrl:
      "https://macklemorefashions.com/wp-content/uploads/2025/04/167562703_128763839258414_8121017181478532563_n.jpg",
    colorName: "Champagne Gold & Red",
    colorHex: "#D4860B",
    isFeatured: true,
    brandId: "brand-macklemore",
    brandSlug: "macklemore",
    brandName: "Macklemore Fashion",
    collectionSlug: "men-wears-collection",
    variants: [
      { size: "S", sku: "MKM-200-S", hubALagos: 4, hubBToronto: 3 },
      { size: "M", sku: "MKM-200-M", hubALagos: 5, hubBToronto: 4 },
      { size: "L", sku: "MKM-200-L", hubALagos: 6, hubBToronto: 4 },
      { size: "XL", sku: "MKM-200-XL", hubALagos: 4, hubBToronto: 3 },
      { size: "XXL", sku: "MKM-200-XXL", hubALagos: 3, hubBToronto: 2 },
    ],
  },
  {
    id: "mkm-172",
    slug: "a-white-embroidery-details-agbada",
    skuPrefix: "MKM-MEN-172",
    title: "White Embroidery Details Agbada Set",
    subtitle:
      "3-piece white sided pagoda embroidery Agbada, 3/4-sleeve Kaftan, and Sokoto trousers",
    description:
      "A regal white 3-piece Agbada ensemble featuring intricate sided pagoda embroidery details, a 3/4-sleeve Kaftan tunic, and matching tailored Sokoto trousers. Available in any colour.",
    gender: "MEN",
    category: "Men Wears",
    fabricWeightGsm: 440,
    fabricComposition: "Premium Polished Cotton & Pagoda Embroidery",
    originLabel: "Lagos & Toronto",
    basePriceCad: 200,
    editorialImageUrl:
      "https://macklemorefashions.com/wp-content/uploads/2025/04/413888847_18015074198003708_3616451493638629856_n.jpg",
    flatlayImageUrl:
      "https://macklemorefashions.com/wp-content/uploads/2025/04/413815567_18015074219003708_8203886899399243130_n.jpg",
    colorName: "Crisp White & Gold",
    colorHex: "#FAF5EE",
    isFeatured: true,
    brandId: "brand-macklemore",
    brandSlug: "macklemore",
    brandName: "Macklemore Fashion",
    collectionSlug: "men-wears-collection",
    variants: [
      { size: "S", sku: "MKM-172-S", hubALagos: 4, hubBToronto: 3 },
      { size: "M", sku: "MKM-172-M", hubALagos: 6, hubBToronto: 4 },
      { size: "L", sku: "MKM-172-L", hubALagos: 5, hubBToronto: 4 },
      { size: "XL", sku: "MKM-172-XL", hubALagos: 4, hubBToronto: 2 },
      { size: "XXL", sku: "MKM-172-XXL", hubALagos: 3, hubBToronto: 2 },
    ],
  },
  {
    id: "mkm-191",
    slug: "tortilla-brown-short-sleeve-kaftan",
    skuPrefix: "MKM-MEN-191",
    title: "Tortilla Brown Short Sleeve Kaftan",
    subtitle:
      "Tailored tortilla brown Zipline 3/4-sleeve African Senator Kaftan native set",
    description:
      "A tortilla brown Zipline 3/4-sleeve African Senator Kaftan native suit crafted with clean architectural lines and matching tailored trousers. Available in any colour.",
    gender: "MEN",
    category: "Men Wears",
    fabricWeightGsm: 380,
    fabricComposition: "Structured Senator Suiting Wool-Cotton Blend",
    originLabel: "Lagos & Toronto",
    basePriceCad: 150,
    editorialImageUrl:
      "https://macklemorefashions.com/wp-content/uploads/2025/04/dejiandkola_africa_1712608765_3341927002288432016_30014923707.jpg",
    flatlayImageUrl:
      "https://macklemorefashions.com/wp-content/uploads/2025/04/dejiandkola_africa_1712608765_3341927002557004894_30014923707.jpg",
    colorName: "Tortilla Brown",
    colorHex: "#7A491D",
    isFeatured: true,
    brandId: "brand-deji-and-kola",
    brandSlug: "deji-and-kola",
    brandName: "Deji & Kola",
    collectionSlug: "men-wears-collection",
    variants: [
      { size: "S", sku: "MKM-191-S", hubALagos: 5, hubBToronto: 3 },
      { size: "M", sku: "MKM-191-M", hubALagos: 6, hubBToronto: 4 },
      { size: "L", sku: "MKM-191-L", hubALagos: 6, hubBToronto: 4 },
      { size: "XL", sku: "MKM-191-XL", hubALagos: 4, hubBToronto: 3 },
      { size: "XXL", sku: "MKM-191-XXL", hubALagos: 3, hubBToronto: 2 },
    ],
  },

  // =========================================================================
  // 2. WOMEN WEARS (https://macklemorefashions.com/african-woman-wears/)
  // =========================================================================
  {
    id: "mkm-233",
    slug: "green-aso-ebi-gown",
    skuPrefix: "MKM-WOM-233",
    title: "Green Aso-Ebi Gown",
    subtitle:
      "Bespoke emerald green lace and beaded Aso-Ebi evening gown with matching headtie",
    description:
      "An exquisite emerald green Aso-Ebi couture gown tailored with hand-placed lace appliqués, sculpted corset bodice, and regal floor-sweeping train. Available in any colour.",
    gender: "WOMEN",
    category: "Women Wears",
    fabricWeightGsm: 360,
    fabricComposition: "Hand-Beaded Guipure Lace & Silk Satin Lining",
    originLabel: "Lagos & Toronto",
    basePriceCad: 250,
    editorialImageUrl:
      "https://macklemorefashions.com/wp-content/uploads/2025/04/7.jpg",
    flatlayImageUrl:
      "https://macklemorefashions.com/wp-content/uploads/2025/04/8.jpg",
    colorName: "Emerald Green",
    colorHex: "#1A7A6E",
    isFeatured: true,
    brandId: "brand-macklemore",
    brandSlug: "macklemore",
    brandName: "Macklemore Fashion",
    collectionSlug: "women-wears-collection",
    variants: [
      { size: "S", sku: "MKM-233-S", hubALagos: 4, hubBToronto: 3 },
      { size: "M", sku: "MKM-233-M", hubALagos: 5, hubBToronto: 4 },
      { size: "L", sku: "MKM-233-L", hubALagos: 4, hubBToronto: 3 },
      { size: "XL", sku: "MKM-233-XL", hubALagos: 3, hubBToronto: 2 },
      { size: "XXL", sku: "MKM-233-XXL", hubALagos: 2, hubBToronto: 2 },
    ],
  },
  {
    id: "mkm-220",
    slug: "african-aso-oke-boubou-gown",
    skuPrefix: "MKM-WOM-220",
    title: "African Aso Oke Boubou Gown",
    subtitle:
      "Flowing luxury Boubou gown with hand-loomed Aso-Oke panels and wide kimono sleeves",
    description:
      "Effortlessly regal African Aso-Oke Boubou gown designed for maximum comfort and statement elegance. Features rich woven Aso-Oke trim and a relaxed floor-length drape. Available in any colour.",
    gender: "WOMEN",
    category: "Women Wears",
    fabricWeightGsm: 400,
    fabricComposition: "Hand-Woven Nigerian Aso-Oke & Silk Crepe",
    originLabel: "Lagos & Toronto",
    basePriceCad: 150,
    editorialImageUrl:
      "https://macklemorefashions.com/wp-content/uploads/2025/04/6.jpg",
    flatlayImageUrl:
      "https://macklemorefashions.com/wp-content/uploads/2025/04/5.jpg",
    colorName: "Royal Gold & Wine",
    colorHex: "#E31E24",
    isFeatured: true,
    brandId: "brand-macklemore",
    brandSlug: "macklemore",
    brandName: "Macklemore Fashion",
    collectionSlug: "women-wears-collection",
    variants: [
      { size: "S", sku: "MKM-220-S", hubALagos: 5, hubBToronto: 4 },
      { size: "M", sku: "MKM-220-M", hubALagos: 6, hubBToronto: 4 },
      { size: "L", sku: "MKM-220-L", hubALagos: 5, hubBToronto: 3 },
      { size: "XL", sku: "MKM-220-XL", hubALagos: 4, hubBToronto: 3 },
      { size: "XXL", sku: "MKM-220-XXL", hubALagos: 3, hubBToronto: 2 },
    ],
  },
  {
    id: "mkm-236",
    slug: "ankara-lace-style-short-and-long-length",
    skuPrefix: "MKM-WOM-236",
    title: "Ankara Lace Style (Short & Long Length)",
    subtitle:
      "Vibrant Ankara wax print and lace dress available in short or full-length silhouette",
    description:
      "Contemporary Ankara and lace fusion dress crafted for celebrations and elevated everyday wear. Available in both short and long lengths and customizable in any colour and pattern.",
    gender: "WOMEN",
    category: "Women Wears",
    fabricWeightGsm: 320,
    fabricComposition: "100% African Wax Print Ankara & Embroidered Lace",
    originLabel: "Lagos & Toronto",
    basePriceCad: 120,
    editorialImageUrl:
      "https://macklemorefashions.com/wp-content/uploads/2025/04/9.jpg",
    flatlayImageUrl:
      "https://macklemorefashions.com/wp-content/uploads/2025/04/10.jpg",
    colorName: "Multi-Color Ankara",
    colorHex: "#E05C1A",
    isFeatured: true,
    brandId: "brand-macklemore",
    brandSlug: "macklemore",
    brandName: "Macklemore Fashion",
    collectionSlug: "women-wears-collection",
    variants: [
      { size: "S", sku: "MKM-236-S", hubALagos: 5, hubBToronto: 4 },
      { size: "M", sku: "MKM-236-M", hubALagos: 6, hubBToronto: 5 },
      { size: "L", sku: "MKM-236-L", hubALagos: 5, hubBToronto: 4 },
      { size: "XL", sku: "MKM-236-XL", hubALagos: 4, hubBToronto: 3 },
      { size: "XXL", sku: "MKM-236-XXL", hubALagos: 3, hubBToronto: 2 },
    ],
  },

  // =========================================================================
  // 3. MALE ACCESSORIES (https://macklemorefashions.com/male-accessories/)
  // =========================================================================
  {
    id: "mkm-218",
    slug: "2-layer-african-coral-beads-jewelry-set-for-men",
    skuPrefix: "MKM-MACC-218",
    title: "2-Layer African Coral Beads Jewelry Set for Men",
    subtitle:
      "Traditional royal red coral bead double-layered necklace and wrist set for men",
    description:
      "Authentic 2-layer African royal coral beads jewelry set crafted for grooms, titled chiefs, and ceremonial occasions. Pairs seamlessly with Agbada, Dashiki, and Kaftan attire.",
    gender: "MEN",
    category: "Male Accessories",
    fabricWeightGsm: 300,
    fabricComposition: "Polished Ceremonial Coral Beads",
    originLabel: "Lagos & Benin",
    basePriceCad: 65,
    editorialImageUrl:
      "https://macklemorefashions.com/wp-content/uploads/2025/04/ac03712a-e69a-4d71-b6d4-d10f50c9cb89.webp",
    flatlayImageUrl:
      "https://macklemorefashions.com/wp-content/uploads/2025/04/ac03712a-e69a-4d71-b6d4-d10f50c9cb89.webp",
    colorName: "Coral Red",
    colorHex: "#E31E24",
    isFeatured: false,
    brandId: "brand-macklemore",
    brandSlug: "macklemore",
    brandName: "Macklemore Fashion",
    collectionSlug: "men-wears-collection",
    variants: [
      { size: "S", sku: "MKM-218-S", hubALagos: 8, hubBToronto: 6 },
      { size: "M", sku: "MKM-218-M", hubALagos: 10, hubBToronto: 8 },
      { size: "L", sku: "MKM-218-L", hubALagos: 8, hubBToronto: 6 },
      { size: "XL", sku: "MKM-218-XL", hubALagos: 6, hubBToronto: 4 },
    ],
  },
  {
    id: "mkm-209",
    slug: "african-igbo-red-royal-traditional-hat-with-gold-and-horn-adornment",
    skuPrefix: "MKM-MACC-209",
    title:
      "African Igbo Red Royal Traditional Hat With Gold & Horn Adornment",
    subtitle:
      "Ceremonial red Chieftaincy cap adorned with royal gold and traditional horn crest",
    description:
      "Handcrafted African Igbo Red Royal Traditional Hat featuring regal gold embroidery and horn adornment. Available across sizes S to XXL.",
    gender: "MEN",
    category: "Male Accessories",
    fabricWeightGsm: 350,
    fabricComposition: "Wool Felt, Gold Bullion Thread & Ceremonial Adornment",
    originLabel: "Eastern Nigeria & Lagos",
    basePriceCad: 60,
    editorialImageUrl:
      "https://macklemorefashions.com/wp-content/uploads/2025/04/119150399_162644002133362_4996665628877405313_n.jpg",
    flatlayImageUrl:
      "https://macklemorefashions.com/wp-content/uploads/2025/04/119150399_162644002133362_4996665628877405313_n.jpg",
    colorName: "Royal Crimson & Gold",
    colorHex: "#E31E24",
    isFeatured: false,
    brandId: "brand-macklemore",
    brandSlug: "macklemore",
    brandName: "Macklemore Fashion",
    collectionSlug: "men-wears-collection",
    variants: [
      { size: "S", sku: "MKM-209-S", hubALagos: 6, hubBToronto: 5 },
      { size: "M", sku: "MKM-209-M", hubALagos: 8, hubBToronto: 6 },
      { size: "L", sku: "MKM-209-L", hubALagos: 8, hubBToronto: 6 },
      { size: "XL", sku: "MKM-209-XL", hubALagos: 5, hubBToronto: 4 },
      { size: "XXL", sku: "MKM-209-XXL", hubALagos: 4, hubBToronto: 3 },
    ],
  },
  {
    id: "mkm-217",
    slug: "igbo-traditional-hand-fan",
    skuPrefix: "MKM-MACC-217",
    title: "Igbo Traditional Hand Fan",
    subtitle:
      "Handcrafted leather and embroidered ceremonial Igbo royal hand fan (Akupe)",
    description:
      "Authentic Igbo traditional royal hand fan crafted from durable leather with cultural motifs, ideal for traditional weddings, chieftaincy ceremonies, and grand occasions.",
    gender: "MEN",
    category: "Male Accessories",
    fabricWeightGsm: 320,
    fabricComposition: "Hand-Tooled Leather & Traditional Emblem",
    originLabel: "Lagos & Toronto",
    basePriceCad: 50,
    editorialImageUrl:
      "https://macklemorefashions.com/wp-content/uploads/2025/04/hand-traditional-fan.jpg",
    flatlayImageUrl:
      "https://macklemorefashions.com/wp-content/uploads/2025/04/hand-traditional-fan.jpg",
    colorName: "Savannah Bronze & Red",
    colorHex: "#7A491D",
    isFeatured: false,
    brandId: "brand-macklemore",
    brandSlug: "macklemore",
    brandName: "Macklemore Fashion",
    collectionSlug: "men-wears-collection",
    variants: [
      { size: "M", sku: "MKM-217-M", hubALagos: 10, hubBToronto: 8 },
      { size: "L", sku: "MKM-217-L", hubALagos: 8, hubBToronto: 6 },
    ],
  },

  // =========================================================================
  // 4. FEMALE ACCESSORIES (https://macklemorefashions.com/female-accessories/)
  // =========================================================================
  {
    id: "mkm-247",
    slug: "green-gold-bead-necklace-bracelet-earrings",
    skuPrefix: "MKM-FACC-247",
    title: "Green & Gold Bead Necklace, Bracelet & Earrings",
    subtitle:
      "Complete handcrafted emerald green and gold bridal & ceremonial jewelry set",
    description:
      "Luxury multi-strand green and gold bead necklace with matching bracelet and drop earrings. Available in any colour and pattern to complement your Aso-Ebi or bridal attire.",
    gender: "WOMEN",
    category: "Female Accessories",
    fabricWeightGsm: 280,
    fabricComposition: "Hand-Strung Glass, Coral & Gold-Plated Beads",
    originLabel: "Lagos & Toronto",
    basePriceCad: 120,
    editorialImageUrl:
      "https://macklemorefashions.com/wp-content/uploads/2025/04/15.jpg",
    flatlayImageUrl:
      "https://macklemorefashions.com/wp-content/uploads/2025/04/15.jpg",
    colorName: "Emerald & Gold",
    colorHex: "#1A7A6E",
    isFeatured: false,
    brandId: "brand-macklemore",
    brandSlug: "macklemore",
    brandName: "Macklemore Fashion",
    collectionSlug: "women-wears-collection",
    variants: [
      { size: "S", sku: "MKM-247-S", hubALagos: 6, hubBToronto: 5 },
      { size: "M", sku: "MKM-247-M", hubALagos: 8, hubBToronto: 6 },
      { size: "L", sku: "MKM-247-L", hubALagos: 6, hubBToronto: 5 },
    ],
  },
  {
    id: "mkm-246",
    slug: "royal-bridal-bead-set",
    skuPrefix: "MKM-FACC-246",
    title: "Royal Bridal Bead Set",
    subtitle:
      "Traditional Nigerian bridal coral and gold statement necklace, bracelet & earring suite",
    description:
      "Regal bridal bead jewelry set crafted for traditional weddings and milestone celebrations. Customizable in any colour and pattern.",
    gender: "WOMEN",
    category: "Female Accessories",
    fabricWeightGsm: 300,
    fabricComposition: "Ceremonial Bridal Coral & Gold Beads",
    originLabel: "Lagos & Toronto",
    basePriceCad: 120,
    editorialImageUrl:
      "https://macklemorefashions.com/wp-content/uploads/2025/04/14.jpg",
    flatlayImageUrl:
      "https://macklemorefashions.com/wp-content/uploads/2025/04/14.jpg",
    colorName: "Royal Gold & Coral",
    colorHex: "#D4860B",
    isFeatured: false,
    brandId: "brand-macklemore",
    brandSlug: "macklemore",
    brandName: "Macklemore Fashion",
    collectionSlug: "women-wears-collection",
    variants: [
      { size: "S", sku: "MKM-246-S", hubALagos: 6, hubBToronto: 5 },
      { size: "M", sku: "MKM-246-M", hubALagos: 8, hubBToronto: 6 },
      { size: "L", sku: "MKM-246-L", hubALagos: 6, hubBToronto: 4 },
    ],
  },
  {
    id: "mkm-245",
    slug: "green-royal-gold-gele",
    skuPrefix: "MKM-FACC-245",
    title: "Green & Royal Gold Gele",
    subtitle:
      "Pre-pleated luxury green and royal gold auto-Gele headtie with embellished crown",
    description:
      "Our high-quality Gele hats are crafted from premium fabrics for a soft, luxurious feel and effortless wear. Available in any colour and pattern.",
    gender: "WOMEN",
    category: "Female Accessories",
    fabricWeightGsm: 320,
    fabricComposition: "Hand-Pleated Aso-Oke & Segi Gele Fabric",
    originLabel: "Lagos & Toronto",
    basePriceCad: 100,
    editorialImageUrl:
      "https://macklemorefashions.com/wp-content/uploads/2025/04/13.jpg",
    flatlayImageUrl:
      "https://macklemorefashions.com/wp-content/uploads/2025/04/13.jpg",
    colorName: "Green & Royal Gold",
    colorHex: "#1A7A6E",
    isFeatured: false,
    brandId: "brand-macklemore",
    brandSlug: "macklemore",
    brandName: "Macklemore Fashion",
    collectionSlug: "women-wears-collection",
    variants: [
      { size: "S", sku: "MKM-245-S", hubALagos: 6, hubBToronto: 5 },
      { size: "M", sku: "MKM-245-M", hubALagos: 8, hubBToronto: 6 },
      { size: "L", sku: "MKM-245-L", hubALagos: 6, hubBToronto: 5 },
    ],
  },
  {
    id: "mkm-240",
    slug: "already-made-african-gold-gele-headtie-hat",
    skuPrefix: "MKM-FACC-240",
    title: "Already Made African Gold Gele Headtie Hat",
    subtitle:
      "Ready-to-wear pleated champagne gold auto-Gele headtie hat for weddings & events",
    description:
      "Pre-styled, ready-to-wear African gold Gele headtie hat designed for instant elegance without complex tying. Available in any colour and pattern.",
    gender: "WOMEN",
    category: "Female Accessories",
    fabricWeightGsm: 320,
    fabricComposition: "Metallic Gold Aso-Oke & Structured Pleats",
    originLabel: "Lagos & Toronto",
    basePriceCad: 100,
    editorialImageUrl:
      "https://macklemorefashions.com/wp-content/uploads/2025/04/12.jpg",
    flatlayImageUrl:
      "https://macklemorefashions.com/wp-content/uploads/2025/04/12.jpg",
    colorName: "Champagne Gold",
    colorHex: "#D4860B",
    isFeatured: false,
    brandId: "brand-macklemore",
    brandSlug: "macklemore",
    brandName: "Macklemore Fashion",
    collectionSlug: "women-wears-collection",
    variants: [
      { size: "S", sku: "MKM-240-S", hubALagos: 7, hubBToronto: 6 },
      { size: "M", sku: "MKM-240-M", hubALagos: 9, hubBToronto: 7 },
      { size: "L", sku: "MKM-240-L", hubALagos: 7, hubBToronto: 5 },
    ],
  },

  // =========================================================================
  // 5. KIDS WEARS (https://macklemorefashions.com/african-kids-wears/)
  // =========================================================================
  {
    id: "mkm-248",
    slug: "baby-in-aso-oke",
    skuPrefix: "MKM-KIDS-248",
    title: "Baby In Aso-Oke",
    subtitle:
      "Hand-woven ceremonial Aso-Oke outfit with matching cap and royal coral beads",
    description:
      "Bespoke traditional Aso-Oke ensemble for babies and toddlers, complete with matching cap and ceremonial accessories. Available in any colour and pattern.",
    gender: "KIDS",
    category: "Kids Wears",
    fabricWeightGsm: 360,
    fabricComposition: "Soft-Lined Hand-Woven Aso-Oke",
    originLabel: "Lagos & Toronto",
    basePriceCad: 120,
    editorialImageUrl:
      "https://macklemorefashions.com/wp-content/uploads/2025/04/16.jpg",
    flatlayImageUrl:
      "https://macklemorefashions.com/wp-content/uploads/2025/04/18.jpg",
    colorName: "Royal Gold & Crimson",
    colorHex: "#E31E24",
    isFeatured: false,
    brandId: "brand-macklemore",
    brandSlug: "macklemore",
    brandName: "Macklemore Fashion",
    collectionSlug: "kids-wears-collection",
    variants: [
      { size: "XS", sku: "MKM-248-XS", hubALagos: 6, hubBToronto: 5 },
      { size: "S", sku: "MKM-248-S", hubALagos: 8, hubBToronto: 6 },
      { size: "M", sku: "MKM-248-M", hubALagos: 6, hubBToronto: 5 },
    ],
  },
  {
    id: "mkm-259",
    slug: "complete-set-baby-girl-aso-oke",
    skuPrefix: "MKM-KIDS-259",
    title: "Complete Set Baby Girl Aso Oke",
    subtitle:
      "Traditional baby girl Aso-Oke iro, buba, headtie & coral bead celebration set",
    description:
      "Complete ceremonial Aso-Oke outfit for baby girls, crafted with soft cotton lining for comfort during naming ceremonies, first birthdays, and family celebrations.",
    gender: "KIDS",
    category: "Kids Wears",
    fabricWeightGsm: 340,
    fabricComposition: "Soft-Lined Nigerian Aso-Oke & Beads",
    originLabel: "Lagos & Toronto",
    basePriceCad: 100,
    editorialImageUrl:
      "https://macklemorefashions.com/wp-content/uploads/2025/04/22.jpg",
    flatlayImageUrl:
      "https://macklemorefashions.com/wp-content/uploads/2025/04/22.jpg",
    colorName: "Rose Gold & Coral",
    colorHex: "#E05C1A",
    isFeatured: false,
    brandId: "brand-macklemore",
    brandSlug: "macklemore",
    brandName: "Macklemore Fashion",
    collectionSlug: "kids-wears-collection",
    variants: [
      { size: "XS", sku: "MKM-259-XS", hubALagos: 6, hubBToronto: 5 },
      { size: "S", sku: "MKM-259-S", hubALagos: 7, hubBToronto: 6 },
      { size: "M", sku: "MKM-259-M", hubALagos: 5, hubBToronto: 4 },
    ],
  },
  {
    id: "mkm-258",
    slug: "complete-set-aso-oke-for-baby-boy",
    skuPrefix: "MKM-KIDS-258",
    title: "Complete Set Aso Oke For Baby Boy",
    subtitle:
      "3-piece baby boy Aso-Oke agbada, tunic, sokoto & matching fila cap",
    description:
      "Complete traditional Aso-Oke set for baby boys with embroidered tunic, trousers, and matching Yoruba fila hat. Available in any colour and pattern.",
    gender: "KIDS",
    category: "Kids Wears",
    fabricWeightGsm: 350,
    fabricComposition: "Soft-Lined Hand-Woven Aso-Oke",
    originLabel: "Lagos & Toronto",
    basePriceCad: 100,
    editorialImageUrl:
      "https://macklemorefashions.com/wp-content/uploads/2025/04/19.jpg",
    flatlayImageUrl:
      "https://macklemorefashions.com/wp-content/uploads/2025/04/19.jpg",
    colorName: "Ivory & Gold",
    colorHex: "#D4860B",
    isFeatured: false,
    brandId: "brand-macklemore",
    brandSlug: "macklemore",
    brandName: "Macklemore Fashion",
    collectionSlug: "kids-wears-collection",
    variants: [
      { size: "XS", sku: "MKM-258-XS", hubALagos: 6, hubBToronto: 5 },
      { size: "S", sku: "MKM-258-S", hubALagos: 8, hubBToronto: 6 },
      { size: "M", sku: "MKM-258-M", hubALagos: 6, hubBToronto: 4 },
    ],
  },
  {
    id: "mkm-257",
    slug: "yoruba-baby-boy",
    skuPrefix: "MKM-KIDS-257",
    title: "Yoruba Baby Boy Traditional Set",
    subtitle:
      "Embroidered Yoruba baby boy celebration agbada set with matching fila cap",
    description:
      "Regal Yoruba baby boy traditional attire featuring classic embroidery, comfortable breathable lining, and matching cap. Available in any colour and pattern.",
    gender: "KIDS",
    category: "Kids Wears",
    fabricWeightGsm: 340,
    fabricComposition: "Hand-Woven Aso-Oke & Cotton Lining",
    originLabel: "Lagos & Toronto",
    basePriceCad: 100,
    editorialImageUrl:
      "https://macklemorefashions.com/wp-content/uploads/2025/04/20.jpg",
    flatlayImageUrl:
      "https://macklemorefashions.com/wp-content/uploads/2025/04/20.jpg",
    colorName: "Royal Wine & Gold",
    colorHex: "#7A491D",
    isFeatured: false,
    brandId: "brand-macklemore",
    brandSlug: "macklemore",
    brandName: "Macklemore Fashion",
    collectionSlug: "kids-wears-collection",
    variants: [
      { size: "XS", sku: "MKM-257-XS", hubALagos: 5, hubBToronto: 5 },
      { size: "S", sku: "MKM-257-S", hubALagos: 7, hubBToronto: 6 },
      { size: "M", sku: "MKM-257-M", hubALagos: 5, hubBToronto: 4 },
    ],
  },
  {
    id: "mkm-256",
    slug: "hausa-baby-boy",
    skuPrefix: "MKM-KIDS-256",
    title: "Hausa Baby Boy Traditional Set",
    subtitle:
      "Northern Nigerian Babban Riga embroidered baby boy tunic and hula cap set",
    description:
      "Traditional Hausa baby boy ceremonial outfit featuring classic Northern Nigerian embroidery and matching woven cap. Available in any colour and pattern.",
    gender: "KIDS",
    category: "Kids Wears",
    fabricWeightGsm: 340,
    fabricComposition: "Embroidered Cotton Brocade",
    originLabel: "Kano, Lagos & Toronto",
    basePriceCad: 100,
    editorialImageUrl:
      "https://macklemorefashions.com/wp-content/uploads/2025/04/21.jpg",
    flatlayImageUrl:
      "https://macklemorefashions.com/wp-content/uploads/2025/04/21.jpg",
    colorName: "Sky Blue & White",
    colorHex: "#1A7A6E",
    isFeatured: false,
    brandId: "brand-macklemore",
    brandSlug: "macklemore",
    brandName: "Macklemore Fashion",
    collectionSlug: "kids-wears-collection",
    variants: [
      { size: "XS", sku: "MKM-256-XS", hubALagos: 6, hubBToronto: 4 },
      { size: "S", sku: "MKM-256-S", hubALagos: 7, hubBToronto: 5 },
      { size: "M", sku: "MKM-256-M", hubALagos: 5, hubBToronto: 4 },
    ],
  },

  // =========================================================================
  // 6. FABRICS / PRINTS AND PATTERNS (https://macklemorefashions.com/african-fabric/)
  // =========================================================================
  {
    id: "mkm-267",
    slug: "aso-oke-oxblood-and-pink-fabric",
    skuPrefix: "MKM-FAB-267",
    title: "Aso-Oke Oxblood and Pink Fabric (3 Yards / 6 Yards)",
    subtitle:
      "Hand-loomed Nigerian Aso-Oke textile in rich oxblood and pink ($120 – $240)",
    description:
      "Authentic hand-woven Aso-Oke fabric in oxblood and pink, ideal for bespoke Agbada, Iro & Buba, Gele, and ceremonial tailoring. Available in 3 Yards ($120) and 6 Yards ($240) bundles.",
    gender: "UNISEX",
    category: "Fabrics",
    fabricWeightGsm: 460,
    fabricComposition: "100% Hand-Loomed Nigerian Aso-Oke (3 Yards / 6 Yards)",
    originLabel: "Iseyin, Lagos & Toronto",
    basePriceCad: 120,
    priceRangeLabel: "$120.00 – $240.00",
    editorialImageUrl:
      "https://macklemorefashions.com/wp-content/uploads/2025/04/25.jpg",
    flatlayImageUrl:
      "https://macklemorefashions.com/wp-content/uploads/2025/04/25.jpg",
    colorName: "Oxblood & Pink",
    colorHex: "#E31E24",
    isFeatured: true,
    brandId: "brand-aso-oke-heritage",
    brandSlug: "aso-oke-heritage",
    brandName: "Macklemore Textiles & Prints",
    collectionSlug: "prints-and-patterns-collection",
    variants: [
      { size: "M", sku: "MKM-267-3YDS", hubALagos: 12, hubBToronto: 10 },
      { size: "L", sku: "MKM-267-6YDS", hubALagos: 10, hubBToronto: 8 },
    ],
  },
  {
    id: "mkm-270",
    slug: "elegant-african-lace",
    skuPrefix: "MKM-FAB-270",
    title: "Elegant African Lace (3 Yards / 6 Yards)",
    subtitle:
      "Luxury embroidered ceremonial African lace fabric ($100 – $200)",
    description:
      "Intricately embroidered African ceremonial lace curated for Aso-Ebi gowns, Kaftans, and wedding attire. Available in 3 Yards ($100) and 6 Yards ($200) cuts in any colour and pattern.",
    gender: "UNISEX",
    category: "Fabrics",
    fabricWeightGsm: 320,
    fabricComposition: "Embroidered Guipure & Tulle African Lace",
    originLabel: "Lagos & Toronto",
    basePriceCad: 100,
    priceRangeLabel: "$100.00 – $200.00",
    editorialImageUrl:
      "https://macklemorefashions.com/wp-content/uploads/2025/04/23.jpg",
    flatlayImageUrl:
      "https://macklemorefashions.com/wp-content/uploads/2025/04/23.jpg",
    colorName: "Royal Gold Lace",
    colorHex: "#D4860B",
    isFeatured: false,
    brandId: "brand-aso-oke-heritage",
    brandSlug: "aso-oke-heritage",
    brandName: "Macklemore Textiles & Prints",
    collectionSlug: "prints-and-patterns-collection",
    variants: [
      { size: "M", sku: "MKM-270-3YDS", hubALagos: 14, hubBToronto: 10 },
      { size: "L", sku: "MKM-270-6YDS", hubALagos: 12, hubBToronto: 8 },
    ],
  },
  {
    id: "mkm-260",
    slug: "ankara-fabric",
    skuPrefix: "MKM-FAB-260",
    title: "Ankara Fabric (3 Yards / 6 Yards)",
    subtitle:
      "100% cotton African wax print Ankara fabric in vibrant heritage patterns ($50 – $100)",
    description:
      "Vibrant, durable 100% cotton African wax print Ankara fabric supplied to fashion lovers, designers, and students across Canada, Nigeria, and worldwide. Available in 3 Yards ($50) and 6 Yards ($100).",
    gender: "UNISEX",
    category: "Fabrics",
    fabricWeightGsm: 280,
    fabricComposition: "100% Mercerized Cotton Wax Print Ankara",
    originLabel: "Lagos & Toronto",
    basePriceCad: 50,
    priceRangeLabel: "$50.00 – $100.00",
    editorialImageUrl:
      "https://macklemorefashions.com/wp-content/uploads/2025/04/26.jpg",
    flatlayImageUrl:
      "https://macklemorefashions.com/wp-content/uploads/2025/04/Ankara.jpg",
    colorName: "Vibrant Wax Print",
    colorHex: "#E05C1A",
    isFeatured: false,
    brandId: "brand-aso-oke-heritage",
    brandSlug: "aso-oke-heritage",
    brandName: "Macklemore Textiles & Prints",
    collectionSlug: "prints-and-patterns-collection",
    variants: [
      { size: "M", sku: "MKM-260-3YDS", hubALagos: 20, hubBToronto: 15 },
      { size: "L", sku: "MKM-260-6YDS", hubALagos: 18, hubBToronto: 12 },
    ],
  },

  // =========================================================================
  // 7. REPRESENTED PARTNER HOUSE: LUCA (/brands/luca)
  // =========================================================================
  {
    id: "luca-01",
    slug: "luca-architectural-gabardine-trench",
    skuPrefix: "LCA-AW26-014",
    title: "LUCA Structural Gabardine Trench",
    subtitle:
      "Represented Partner House · Water-repellent cotton gabardine trench coat",
    description:
      "Designed by partner brand LUCA and represented across West and East Africa by Macklemore Fashion. Tailored in crisp water-repellent cotton gabardine.",
    gender: "UNISEX",
    category: "Men Wears",
    fabricWeightGsm: 480,
    fabricComposition: "100% High-Twist Cotton Gabardine",
    originLabel: "Milan & Lagos",
    basePriceCad: 340,
    editorialImageUrl:
      "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1000&q=85",
    flatlayImageUrl:
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=1000&q=85",
    colorName: "Warm Sand",
    colorHex: "#D4B895",
    isFeatured: false,
    brandId: "brand-luca",
    brandSlug: "luca",
    brandName: "LUCA",
    collectionSlug: "men-wears-collection",
    variants: [
      { size: "S", sku: "LCA-014-S", hubALagos: 4, hubBToronto: 3 },
      { size: "M", sku: "LCA-014-M", hubALagos: 5, hubBToronto: 4 },
      { size: "L", sku: "LCA-014-L", hubALagos: 4, hubBToronto: 3 },
      { size: "XL", sku: "LCA-014-XL", hubALagos: 2, hubBToronto: 2 },
    ],
  },
  {
    id: "luca-02",
    slug: "luca-pleated-wide-wool-trouser",
    skuPrefix: "LCA-AW26-021",
    title: "LUCA Double-Pleat Tailored Suit Set",
    subtitle:
      "Represented Partner House · Relaxed double-breasted jacket & wide-leg trouser",
    description:
      "Signature LUCA relaxed tailoring represented by Macklemore Fashion across Nigeria, Ghana, Kenya, and Canada.",
    gender: "WOMEN",
    category: "Women Wears",
    fabricWeightGsm: 360,
    fabricComposition: "96% Virgin Wool / 4% Elastane",
    originLabel: "Milan & Lagos",
    basePriceCad: 280,
    editorialImageUrl:
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=85",
    flatlayImageUrl:
      "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=1000&q=85",
    colorName: "Warm Ivory",
    colorHex: "#FAF5EE",
    isFeatured: false,
    brandId: "brand-luca",
    brandSlug: "luca",
    brandName: "LUCA",
    collectionSlug: "women-wears-collection",
    variants: [
      { size: "S", sku: "LCA-021-S", hubALagos: 4, hubBToronto: 4 },
      { size: "M", sku: "LCA-021-M", hubALagos: 5, hubBToronto: 4 },
      { size: "L", sku: "LCA-021-L", hubALagos: 3, hubBToronto: 3 },
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
    destinationCity: "Nigeria",
    currency: "NGN",
    subtotalAmount: 337500,
    shippingAmount: 18000,
    dutiesAmount: 0,
    totalAmount: 355500,
    assignedHub: "HUB_A_LAGOS",
    courierPartner: "GIG Logistics Priority",
    waybillNumber: "GIG-NG-8841209",
    status: "DELIVERED",
    paymentProvider: "PAYSTACK",
    paymentReference: "PSK_REF_994810234",
    paymentStatus: "SUCCEEDED",
    createdAt: "2026-11-02T09:14:00Z",
    items: [
      {
        productId: "mkm-200",
        productTitle:
          "Aso-Oke Dashiki with Floral Embroidery, Yoruba Hat & Coral Bead",
        brandName: "Macklemore Fashion",
        size: "L",
        quantity: 1,
        unitPrice: 337500,
      },
    ],
  },
  {
    id: "ord-02",
    orderNumber: "MKM-2026-9042",
    customerName: "Marcus Sterling",
    customerEmail: "m.sterling@baystreetpartners.ca",
    customerPhone: "+1 416 555 0194",
    destinationCountry: "CA",
    destinationCity: "Toronto, Canada",
    currency: "CAD",
    subtotalAmount: 650,
    shippingAmount: 20,
    dutiesAmount: 0,
    totalAmount: 670,
    assignedHub: "HUB_B_TORONTO",
    courierPartner: "DHL Express Domestic",
    waybillNumber: "DHL-YYZ-4491023",
    status: "DELIVERED",
    paymentProvider: "STRIPE",
    paymentReference: "pi_3Q8Mkm_Toronto_002",
    paymentStatus: "SUCCEEDED",
    createdAt: "2026-11-04T14:30:00Z",
    items: [
      {
        productId: "mkm-172",
        productTitle: "White Embroidery Details Agbada Set",
        brandName: "Macklemore Fashion",
        size: "XL",
        quantity: 2,
        unitPrice: 200,
      },
      {
        productId: "mkm-233",
        productTitle: "Green Aso-Ebi Gown",
        brandName: "Macklemore Fashion",
        size: "M",
        quantity: 1,
        unitPrice: 250,
      },
    ],
  },
  {
    id: "ord-03",
    orderNumber: "MKM-2026-9043",
    customerName: "Chidinma Okafor",
    customerEmail: "chidinma@atelierlagos.ng",
    customerPhone: "+234 803 771 8290",
    destinationCountry: "NG",
    destinationCity: "Nigeria",
    currency: "NGN",
    subtotalAmount: 607500,
    shippingAmount: 18000,
    dutiesAmount: 0,
    totalAmount: 625500,
    assignedHub: "HUB_A_LAGOS",
    courierPartner: "GIG Logistics Priority",
    waybillNumber: "GIG-NG-8841590",
    status: "DISPATCHED",
    paymentProvider: "PAYSTACK",
    paymentReference: "PSK_REF_994810519",
    paymentStatus: "SUCCEEDED",
    createdAt: "2026-11-06T11:20:00Z",
    items: [
      {
        productId: "mkm-191",
        productTitle: "Tortilla Brown Short Sleeve Kaftan",
        brandName: "Deji & Kola",
        size: "L",
        quantity: 2,
        unitPrice: 168750,
      },
      {
        productId: "mkm-267",
        productTitle: "Aso-Oke Oxblood and Pink Fabric (3 Yards / 6 Yards)",
        brandName: "Macklemore Textiles & Prints",
        size: "L",
        quantity: 1,
        unitPrice: 270000,
      },
    ],
  },
  {
    id: "ord-04",
    orderNumber: "MKM-2026-9044",
    customerName: "Eleanor Vance-Kerr",
    customerEmail: "eleanor@mayfairstyle.co.uk",
    customerPhone: "+44 20 7946 0921",
    destinationCountry: "GB",
    destinationCity: "United Kingdom",
    currency: "GBP",
    subtotalAmount: 360,
    shippingAmount: 20,
    dutiesAmount: 22,
    totalAmount: 402,
    assignedHub: "HUB_B_TORONTO",
    courierPartner: "DHL Express International",
    waybillNumber: "DHL-LHR-7731904",
    status: "DISPATCHED",
    paymentProvider: "STRIPE",
    paymentReference: "pi_3Q8Mkm_London_004",
    paymentStatus: "SUCCEEDED",
    createdAt: "2026-11-07T16:45:00Z",
    items: [
      {
        productId: "luca-01",
        productTitle: "LUCA Structural Gabardine Trench",
        brandName: "LUCA",
        size: "M",
        quantity: 1,
        unitPrice: 197,
      },
      {
        productId: "luca-02",
        productTitle: "LUCA Double-Pleat Tailored Suit Set",
        brandName: "LUCA",
        size: "S",
        quantity: 1,
        unitPrice: 163,
      },
    ],
  },
  {
    id: "ord-05",
    orderNumber: "MKM-2026-9045",
    customerName: "Amara Nwosu",
    customerEmail: "amara.nwosu@gmail.com",
    customerPhone: "+1 647 555 0821",
    destinationCountry: "CA",
    destinationCity: "Toronto, Canada",
    currency: "CAD",
    subtotalAmount: 490,
    shippingAmount: 20,
    dutiesAmount: 0,
    totalAmount: 510,
    assignedHub: "HUB_B_TORONTO",
    courierPartner: "DHL Express Domestic",
    status: "PAID",
    paymentProvider: "STRIPE",
    paymentReference: "pi_3Q8Mkm_Toronto_005",
    paymentStatus: "SUCCEEDED",
    createdAt: "2026-11-09T10:15:00Z",
    items: [
      {
        productId: "mkm-220",
        productTitle: "African Aso Oke Boubou Gown",
        brandName: "Macklemore Fashion",
        size: "M",
        quantity: 1,
        unitPrice: 150,
      },
      {
        productId: "mkm-246",
        productTitle: "Royal Bridal Bead Set",
        brandName: "Macklemore Fashion",
        size: "M",
        quantity: 1,
        unitPrice: 120,
      },
      {
        productId: "mkm-245",
        productTitle: "Green & Royal Gold Gele",
        brandName: "Macklemore Fashion",
        size: "M",
        quantity: 1,
        unitPrice: 100,
      },
      {
        productId: "mkm-248",
        productTitle: "Baby In Aso-Oke",
        brandName: "Macklemore Fashion",
        size: "S",
        quantity: 1,
        unitPrice: 120,
      },
    ],
  },
];

export const INITIAL_B2B_INQUIRIES: B2BInquiryRecord[] = [
  {
    id: "b2b-01",
    referenceCode: "B2B-MKM-0412",
    channel: "BRAND_REPRESENTATION",
    brandOrCompanyName: "LUCA MILANO",
    contactName: "Luca Vance",
    contactRole: "Managing Director",
    email: "luca@lucamilano.it",
    phone: "+39 02 4410 8821",
    headquartersCountry: "Italy",
    websiteUrl: "https://macklemorefashions.com/brands/luca",
    targetRegions: ["West Africa", "East Africa", "North America"],
    annualVolumeTier: "Partner Brand",
    message:
      "Continental representation agreement with Macklemore Fashion across Nigeria, East Africa, and Toronto, Canada.",
    status: "PARTNERED",
    assignedExecutive: "Micah Elechi",
    createdAt: "2026-09-12T10:00:00Z",
  },
  {
    id: "b2b-02",
    referenceCode: "B2B-MKM-0519",
    channel: "WHOLESALE",
    brandOrCompanyName: "Kempinski Boutique Collective",
    contactName: "Tariq Al-Mansoor",
    contactRole: "Head of Luxury Buying",
    email: "t.almansoor@kempinski-retail.com",
    phone: "+233 24 891 0042",
    headquartersCountry: "Ghana",
    websiteUrl: "https://macklemorefashions.com",
    targetRegions: ["West Africa", "East Africa"],
    annualVolumeTier: "250+ Units / Season",
    message:
      "Seeking seasonal wholesale allocation of Men Wears Agbada sets and Women Wears Aso-Ebi gowns for our West & East African retail spaces.",
    status: "IN_REVIEW",
    assignedExecutive: "Micah Elechi",
    createdAt: "2026-11-05T13:20:00Z",
  },
];

export const JOURNAL_ARTICLES: JournalArticle[] = [
  {
    id: "jrn-01",
    slug: "macklemore-fashions-at-toronto-fashion-week-and-afriff",
    issueNumber: "Feature 01 · Runway & Red Carpet",
    title:
      "From Toronto Fashion Week to the AFRIFF Red Carpet: Celebrating Cultural Pride",
    subtitle:
      "How founder Micah Elechi and Macklemore Fashion are bringing bespoke Nigerian Aso-Oke, Agbada tailoring, and contemporary African design to global stages.",
    corridor: "Toronto · Lagos · Global",
    author: "Macklemore Editorial Team",
    readTime: "4 Min Read",
    publishedAt: "2026-10-15",
    heroImageUrl:
      "https://macklemorefashions.com/wp-content/uploads/2025/05/Torontofw1.jpg",
    excerpt:
      "At Macklemore Fashions, we believe fashion is a bridge between generations, cultures, and stories. From the runway of Toronto Fashion Week 2024 to the Africa International Film Festival (AFRIFF) in Lagos, every piece is tailored to make a lasting statement.",
    bodyParagraphs: [
      "Founded by creative entrepreneur Micah Elechi, Macklemore Fashions is rooted in a clear vision: to make luxury African-inspired clothing accessible, empowering, and unforgettable across Canada, Nigeria, and international markets.",
      "At Toronto Fashion Week 2024 and RAW Toronto 2024, Macklemore Fashions joined professional models on the runway, earning acclaim for bold prints, intricate Aso-Oke weaving, and modern tailoring. Simultaneously, on the red carpet at the Africa International Film Festival (AFRIFF) and the Excellence Awards, actors and public figures such as Kosa Akaraiwe and Emmkab wore custom Macklemore ensembles that celebrated heritage and sophistication.",
      "As we expand our operational footprint in Lagos alongside our Canadian base in Toronto, Macklemore Fashion is proud to represent partner houses like Deji & Kola and LUCA, connecting global and African fashion labels with customers across West Africa, East Africa, and beyond.",
    ],
  },
  {
    id: "jrn-02",
    slug: "the-soul-of-creation-aso-oke-ankara-and-ceremonial-lace",
    issueNumber: "Feature 02 · Textile Heritage",
    title:
      "The Soul of Every Creation: Curating Aso-Oke, Ankara, Kente & Ceremonial Lace",
    subtitle:
      "Inside our textile sourcing across Nigeria and West Africa for bespoke tailoring, designers, and cultural celebrations.",
    corridor: "Iseyin · Lagos · Toronto",
    author: "Micah Elechi",
    readTime: "5 Min Read",
    publishedAt: "2026-10-02",
    heroImageUrl:
      "https://macklemorefashions.com/wp-content/uploads/2025/04/25.jpg",
    excerpt:
      "At Macklemore Fashions, the fabric is the soul of every creation. We source and curate high-quality African fabrics (including Aso-Oke, Ankara, Kente, Adire, and Lace) that reflect rich heritage and lasting elegance.",
    bodyParagraphs: [
      "Whether crafting a three-piece white pagoda-embroidered Agbada, a champagne gold Aso-Oke Dashiki with coral beads, or an emerald green Aso-Ebi gown, the integrity of the textile defines the silhouette.",
      "In addition to designing custom and ready-to-wear clothing, Macklemore Fashions supplies authentic 3-yard and 6-yard fabric bundles to fashion enthusiasts, independent designers, and tailoring students across Canada, Nigeria, and international markets.",
    ],
  },
  {
    id: "jrn-03",
    slug: "partnering-with-international-and-african-brands",
    issueNumber: "Feature 03 · Brand Partnerships",
    title:
      "Building the Bridge: Representing International & African Fashion Brands Across the Continent",
    subtitle:
      "How Macklemore Fashion supports partner labels like LUCA and Deji & Kola in reaching customers across West and East Africa.",
    corridor: "Milan · Lagos · Accra · Nairobi",
    author: "Macklemore Partnerships Desk",
    readTime: "5 Min Read",
    publishedAt: "2026-09-20",
    heroImageUrl:
      "https://macklemorefashions.com/wp-content/uploads/2025/04/dejiandkola_africa_1712608765_3341927002288432016_30014923707.jpg",
    excerpt:
      "Our long-term vision is for Macklemore Fashion to serve as a strong platform for fashion retail, brand partnerships, representation, and distribution across West Africa, East Africa, and global markets.",
    bodyParagraphs: [
      "By combining Canadian corporate credibility with an active operational presence in Lagos, Nigeria, Macklemore Fashion offers international and African fashion houses a trusted gateway into Africa's fastest-growing consumer hubs.",
      "Each represented brand receives its own dedicated showcase on our platform alongside regional distribution and client concierge support across Nigeria, Ghana, Kenya, the UK, and North America.",
    ],
  },
];

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
      return `NGN ₦${formatted}`;
    case "GHS":
      return `GHS GH₵${formatted}`;
    case "KES":
      return `KES KSh ${formatted}`;
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
    return `${cad} · ${ngn} · ${kes}`;
  }
  if (activeCurrency === "NGN") {
    return `${ngn} · ${cad} · ${kes}`;
  }
  if (activeCurrency === "KES") {
    return `${kes} · ${cad} · ${ngn}`;
  }
  return `${primary} · ${ngn} · ${kes}`;
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

  if (["NG", "GH", "CI", "SN"].includes(destinationCountryIso)) {
    const baseShipCad = destinationCountryIso === "NG" ? 16 : 24;
    return {
      assignedHub: "HUB_A_LAGOS",
      hubName: "Nigeria Operations Hub",
      courierPartner:
        destinationCountryIso === "NG"
          ? "GIG Logistics Priority"
          : "DHL West Africa Express",
      estimatedTransitDays:
        destinationCountryIso === "NG" ? "1–2 Business Days" : "2–4 Business Days",
      shippingFee: Math.round(baseShipCad * rate),
      dutiesFee: 0,
      recommendedGateway: "PAYSTACK",
    };
  }

  if (["KE", "UG", "TZ", "RW"].includes(destinationCountryIso)) {
    const baseShipCad = 28;
    return {
      assignedHub: "HUB_A_LAGOS",
      hubName: "Nigeria Operations Hub (Express to East Africa)",
      courierPartner: "DHL Express Africa",
      estimatedTransitDays: "2–4 Business Days",
      shippingFee: Math.round(baseShipCad * rate),
      dutiesFee: Math.round(subtotalInCurrency * 0.045),
      recommendedGateway: "STRIPE",
    };
  }

  const baseShipCad = destinationCountryIso === "CA" ? 20 : 35;
  return {
    assignedHub: "HUB_B_TORONTO",
    hubName: "Toronto, Canada Corporate HQ",
    courierPartner: "DHL Express International",
    estimatedTransitDays:
      destinationCountryIso === "CA" ? "1–2 Business Days" : "2–4 Business Days",
    shippingFee: Math.round(baseShipCad * rate),
    dutiesFee:
      destinationCountryIso === "CA"
        ? 0
        : Math.round(subtotalInCurrency * 0.06),
    recommendedGateway: "STRIPE",
  };
}
