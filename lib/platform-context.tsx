"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  B2BInquiryRecord,
  B2BLeadStatus,
  BrandRecord,
  CollectionRecord,
  CurrencyCode,
  INITIAL_B2B_INQUIRIES,
  INITIAL_BRANDS,
  INITIAL_COLLECTIONS,
  INITIAL_ORDERS,
  INITIAL_PRODUCTS,
  OrderRecord,
  OrderStatus,
  PaymentStatus,
  ProductRecord,
} from "./store-data";

export interface CartItem {
  product: ProductRecord;
  size: "XS" | "S" | "M" | "L" | "XL" | "XXL";
  quantity: number;
}

interface PlatformContextValue {
  currency: CurrencyCode;
  setCurrency: (c: CurrencyCode) => void;
  detectedRegion: string;
  cart: CartItem[];
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  addToCart: (
    product: ProductRecord,
    size: "XS" | "S" | "M" | "L" | "XL" | "XXL",
    quantity?: number
  ) => void;
  removeFromCart: (productId: string, size: string) => void;
  updateCartQuantity: (productId: string, size: string, delta: number) => void;
  clearCart: () => void;
  cartCount: number;

  // Dynamic Enterprise State (Synced with Neon PostgreSQL + Neon S3)
  storageSource: string;
  refreshCatalog: () => Promise<void>;
  brands: BrandRecord[];
  addBrand: (brand: Omit<BrandRecord, "id">) => BrandRecord;
  deleteBrand: (id: string) => Promise<boolean>;
  products: ProductRecord[];
  addProduct: (
    product: Omit<ProductRecord, "id"> & {
      s3EditorialKey?: string;
      s3FlatlayKey?: string;
    }
  ) => ProductRecord;
  updateProduct: (
    id: string,
    updates: Partial<ProductRecord> & {
      s3EditorialKey?: string;
      s3FlatlayKey?: string;
    }
  ) => void;
  deleteProduct: (id: string) => void;
  updateVariantStock: (
    productId: string,
    size: string,
    hub: "hubALagos" | "hubBToronto",
    newQty: number
  ) => void;
  collections: CollectionRecord[];
  addCollection: (data: Omit<CollectionRecord, "id">) => Promise<CollectionRecord>;
  deleteCollection: (id: string) => Promise<boolean>;
  toggleCollectionLive: (collectionId: string) => void;
  orders: OrderRecord[];
  createOrder: (
    order: Omit<OrderRecord, "id" | "orderNumber" | "createdAt">
  ) => OrderRecord;
  updateOrderStatus: (
    orderId: string,
    status: OrderStatus,
    paymentStatus?: PaymentStatus,
    waybill?: string
  ) => void;
  b2bInquiries: B2BInquiryRecord[];
  submitB2BInquiry: (
    inquiry: Omit<
      B2BInquiryRecord,
      "id" | "referenceCode" | "status" | "assignedExecutive" | "createdAt"
    >
  ) => B2BInquiryRecord;
  updateB2BStatus: (
    id: string,
    status: B2BLeadStatus,
    executive?: string
  ) => void;

  // VIP Tribal Teaser Mode ("Preparing Something Good" Evolution)
  vipTribalTeaserMode: boolean;
  setVipTribalTeaserMode: (enabled: boolean) => void;
  vipUnlockedByGuest: boolean;
  setVipUnlockedByGuest: (unlocked: boolean) => void;
}

const PlatformContext = createContext<PlatformContextValue | null>(null);

export function PlatformProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrency] = useState<CurrencyCode>("CAD");
  const [detectedRegion, setDetectedRegion] = useState<string>(
    "TORONTO, CANADA // NIGERIA HUB"
  );
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const [storageSource, setStorageSource] = useState<string>(
    "NEON_POSTGRES_PLUS_S3"
  );
  const [brands, setBrands] = useState<BrandRecord[]>(INITIAL_BRANDS);
  const [products, setProducts] = useState<ProductRecord[]>(INITIAL_PRODUCTS);
  const [collections, setCollections] =
    useState<CollectionRecord[]>(INITIAL_COLLECTIONS);
  const [orders, setOrders] = useState<OrderRecord[]>(INITIAL_ORDERS);
  const [b2bInquiries, setB2bInquiries] = useState<B2BInquiryRecord[]>(
    INITIAL_B2B_INQUIRIES
  );
  const [vipTribalTeaserMode, setVipTribalTeaserMode] = useState(false);
  const [vipUnlockedByGuest, setVipUnlockedByGuest] = useState(false);

  // Sync live catalog from Neon PostgreSQL + S3 API
  const refreshCatalog = useCallback(async () => {
    try {
      const res = await fetch("/api/catalog", { cache: "no-store" });
      if (!res.ok) return;
      const data = await res.json();
      if (data?.ok) {
        if (Array.isArray(data.brands) && data.brands.length > 0) {
          setBrands(data.brands);
        }
        if (Array.isArray(data.products) && data.products.length > 0) {
          setProducts(data.products);
        }
        if (Array.isArray(data.collections) && data.collections.length > 0) {
          setCollections(data.collections);
        }
        if (Array.isArray(data.orders) && data.orders.length > 0) {
          setOrders(data.orders);
        }
        if (Array.isArray(data.b2bInquiries) && data.b2bInquiries.length > 0) {
          setB2bInquiries(data.b2bInquiries);
        }
        if (data.storageSource) {
          setStorageSource(data.storageSource);
        }
      }
    } catch {
      // Keep initial fallback catalog if offline
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void refreshCatalog();
    }, 0);
    return () => window.clearTimeout(timer);
  }, [refreshCatalog]);

  // Automatic Geolocation / Timezone Currency Detection on Initial Mount
  useEffect(() => {
    const id = window.requestAnimationFrame(() => {
      try {
        const savedCurr = localStorage.getItem(
          "mkm_currency"
        ) as CurrencyCode | null;
        if (savedCurr) {
          setCurrency(savedCurr);
          return;
        }
        const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
        if (tz.includes("Lagos") || tz.includes("Africa/Lagos")) {
          setCurrency("NGN");
          setDetectedRegion("WEST AFRICA // NIGERIA HUB");
        } else if (tz.includes("Accra")) {
          setCurrency("GHS");
          setDetectedRegion("WEST AFRICA // GHANA CORRIDOR");
        } else if (tz.includes("Nairobi")) {
          setCurrency("KES");
          setDetectedRegion("EAST AFRICA // REGIONAL DELIVERY");
        } else if (tz.includes("London")) {
          setCurrency("GBP");
          setDetectedRegion("UNITED KINGDOM // EXPRESS DELIVERY");
        } else if (tz.includes("Europe")) {
          setCurrency("EUR");
          setDetectedRegion("EUROPE // CONTINENTAL DELIVERY");
        } else if (tz.includes("America/New_York") || tz.includes("Chicago")) {
          setCurrency("USD");
          setDetectedRegion("NORTH AMERICA // US DELIVERY");
        } else {
          setCurrency("CAD");
          setDetectedRegion("NORTH AMERICA // TORONTO, CANADA HQ");
        }
      } catch {
        // Fallback to CAD
      }
    });
    return () => window.cancelAnimationFrame(id);
  }, []);

  const handleSetCurrency = (c: CurrencyCode) => {
    setCurrency(c);
    try {
      localStorage.setItem("mkm_currency", c);
    } catch {
      // ignore storage errors
    }
  };

  const addToCart = (
    product: ProductRecord,
    size: "XS" | "S" | "M" | "L" | "XL" | "XXL",
    quantity = 1
  ) => {
    setCart((prev) => {
      const idx = prev.findIndex(
        (item) => item.product.id === product.id && item.size === size
      );
      if (idx > -1) {
        const updated = [...prev];
        updated[idx] = {
          ...updated[idx],
          quantity: updated[idx].quantity + quantity,
        };
        return updated;
      }
      return [...prev, { product, size, quantity }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId: string, size: string) => {
    setCart((prev) =>
      prev.filter(
        (item) => !(item.product.id === productId && item.size === size)
      )
    );
  };

  const updateCartQuantity = (
    productId: string,
    size: string,
    delta: number
  ) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId && item.size === size) {
            const nextQty = item.quantity + delta;
            return nextQty > 0 ? { ...item, quantity: nextQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const clearCart = () => setCart([]);

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const addBrand = (brandInput: Omit<BrandRecord, "id">): BrandRecord => {
    const newBrand: BrandRecord = {
      ...brandInput,
      id: `brand-${Date.now()}`,
    };
    setBrands((prev) => [newBrand, ...prev]);
    void fetch("/api/brands", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newBrand),
    }).catch(() => {});
    return newBrand;
  };

  const deleteBrand = async (brandId: string): Promise<boolean> => {
    setBrands((prev) => prev.filter((b) => b.id !== brandId));
    try {
      const res = await fetch(`/api/brands/${brandId}`, { method: "DELETE" });
      return res.ok;
    } catch {
      return false;
    }
  };

  const addProduct = (
    productInput: Omit<ProductRecord, "id"> & {
      s3EditorialKey?: string;
      s3FlatlayKey?: string;
    }
  ): ProductRecord => {
    const newProd: ProductRecord = {
      ...productInput,
      id: `prod-${Date.now()}`,
    };
    setProducts((prev) => [newProd, ...prev]);
    void fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...newProd,
        s3EditorialKey: productInput.s3EditorialKey,
        s3FlatlayKey: productInput.s3FlatlayKey,
      }),
    }).catch(() => {});
    return newProd;
  };

  const updateProduct = (
    id: string,
    updates: Partial<ProductRecord> & {
      s3EditorialKey?: string;
      s3FlatlayKey?: string;
    }
  ) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
    void fetch(`/api/products/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    }).catch(() => {});
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    void fetch(`/api/products/${id}`, {
      method: "DELETE",
    }).catch(() => {});
  };

  const updateVariantStock = (
    productId: string,
    size: string,
    hub: "hubALagos" | "hubBToronto",
    newQty: number
  ) => {
    const safeQty = Math.max(0, newQty);
    setProducts((prev) =>
      prev.map((prod) => {
        if (prod.id !== productId) return prod;
        return {
          ...prod,
          variants: prod.variants.map((v) =>
            v.size === size ? { ...v, [hub]: safeQty } : v
          ),
        };
      })
    );
    void fetch(`/api/products/${productId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ size, hub, newQty: safeQty }),
    }).catch(() => {});
  };

  const toggleCollectionLive = (collectionId: string) => {
    let nextDropLive = false;
    let nextVipLocked = true;
    setCollections((prev) =>
      prev.map((col) => {
        if (col.id === collectionId) {
          nextDropLive = !col.isDropLive;
          nextVipLocked = col.isDropLive;
          return { ...col, isDropLive: nextDropLive, isVipLocked: nextVipLocked };
        }
        return col;
      })
    );
    void fetch(`/api/collections/${collectionId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isDropLive: nextDropLive, isVipLocked: nextVipLocked }),
    }).catch(() => {});
  };

  const addCollection = async (
    data: Omit<CollectionRecord, "id">
  ): Promise<CollectionRecord> => {
    const cleanSlug =
      data.slug?.trim() ||
      data.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
    const id = `col-${Date.now()}`;
    const newCol: CollectionRecord = {
      ...data,
      id,
      slug: cleanSlug,
    };
    setCollections((prev) => [newCol, ...prev]);
    try {
      const res = await fetch("/api/collections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCol),
      });
      const json = await res.json();
      if (json?.data) {
        return json.data as CollectionRecord;
      }
    } catch {
      // Local optimistic record
    }
    return newCol;
  };

  const deleteCollection = async (collectionId: string): Promise<boolean> => {
    setCollections((prev) => prev.filter((c) => c.id !== collectionId));
    try {
      const res = await fetch(`/api/collections/${collectionId}`, {
        method: "DELETE",
      });
      return res.ok;
    } catch {
      return false;
    }
  };

  const createOrder = (
    orderInput: Omit<OrderRecord, "id" | "orderNumber" | "createdAt">
  ): OrderRecord => {
    const num = 9045 + orders.length;
    const newOrder: OrderRecord = {
      ...orderInput,
      id: `ord-${Date.now()}`,
      orderNumber: `MKM-2026-${num}`,
      createdAt: new Date().toISOString(),
    };
    setOrders((prev) => [newOrder, ...prev]);
    void fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newOrder),
    }).catch(() => {});
    return newOrder;
  };

  const updateOrderStatus = (
    orderId: string,
    status: OrderStatus,
    paymentStatus?: PaymentStatus,
    waybill?: string
  ) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id !== orderId) return ord;
        return {
          ...ord,
          status,
          paymentStatus: paymentStatus ?? ord.paymentStatus,
          waybillNumber: waybill ?? ord.waybillNumber,
        };
      })
    );
    void fetch(`/api/orders/${orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status,
        paymentStatus,
        waybillNumber: waybill,
      }),
    }).catch(() => {});
  };

  const submitB2BInquiry = (
    input: Omit<
      B2BInquiryRecord,
      "id" | "referenceCode" | "status" | "assignedExecutive" | "createdAt"
    >
  ): B2BInquiryRecord => {
    const codeNum = 420 + b2bInquiries.length;
    const record: B2BInquiryRecord = {
      ...input,
      id: `b2b-${Date.now()}`,
      referenceCode: `B2B-MKM-0${codeNum}`,
      status: "NEW",
      assignedExecutive:
        input.targetRegions.includes("WEST_AFRICA") ||
        input.targetRegions.includes("EAST_AFRICA")
          ? "Chidi Okonkwo (Nigeria B2B Desk)"
          : "Elena Rostova (Toronto / Global Desk)",
      createdAt: new Date().toISOString(),
    };
    setB2bInquiries((prev) => [record, ...prev]);
    void fetch("/api/b2b-inquiries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(record),
    }).catch(() => {});
    return record;
  };

  const updateB2BStatus = (
    id: string,
    status: B2BLeadStatus,
    executive?: string
  ) => {
    setB2bInquiries((prev) =>
      prev.map((inq) =>
        inq.id === id
          ? {
              ...inq,
              status,
              assignedExecutive: executive ?? inq.assignedExecutive,
            }
          : inq
      )
    );
    void fetch(`/api/b2b-inquiries/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status,
        assignedExecutive: executive,
      }),
    }).catch(() => {});
  };

  return (
    <PlatformContext.Provider
      value={{
        currency,
        setCurrency: handleSetCurrency,
        detectedRegion,
        cart,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartCount,
        storageSource,
        refreshCatalog,
        brands,
        addBrand,
        deleteBrand,
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        updateVariantStock,
        collections,
        addCollection,
        deleteCollection,
        toggleCollectionLive,
        orders,
        createOrder,
        updateOrderStatus,
        b2bInquiries,
        submitB2BInquiry,
        updateB2BStatus,
        vipTribalTeaserMode,
        setVipTribalTeaserMode,
        vipUnlockedByGuest,
        setVipUnlockedByGuest,
      }}
    >
      {children}
    </PlatformContext.Provider>
  );
}

export function usePlatform() {
  const ctx = useContext(PlatformContext);
  if (!ctx) {
    throw new Error("usePlatform must be used within a PlatformProvider");
  }
  return ctx;
}
