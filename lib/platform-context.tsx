"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
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

  // Dynamic Enterprise State (Shared across Storefront & /admin)
  brands: BrandRecord[];
  addBrand: (brand: Omit<BrandRecord, "id">) => BrandRecord;
  products: ProductRecord[];
  addProduct: (product: Omit<ProductRecord, "id">) => ProductRecord;
  updateVariantStock: (
    productId: string,
    size: string,
    hub: "hubALagos" | "hubBToronto",
    newQty: number
  ) => void;
  collections: CollectionRecord[];
  toggleCollectionLive: (collectionId: string) => void;
  orders: OrderRecord[];
  createOrder: (order: Omit<OrderRecord, "id" | "orderNumber" | "createdAt">) => OrderRecord;
  updateOrderStatus: (
    orderId: string,
    status: OrderStatus,
    paymentStatus?: PaymentStatus,
    waybill?: string,
    mpesaReceipt?: string
  ) => void;
  b2bInquiries: B2BInquiryRecord[];
  submitB2BInquiry: (
    inquiry: Omit<
      B2BInquiryRecord,
      "id" | "referenceCode" | "status" | "assignedExecutive" | "createdAt"
    >
  ) => B2BInquiryRecord;
  updateB2BStatus: (id: string, status: B2BLeadStatus, executive?: string) => void;

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
    "TORONTO // LAGOS BRIDGE"
  );
  const [cart, setCart] = useState<CartItem[]>([
    {
      product: INITIAL_PRODUCTS[0],
      size: "L",
      quantity: 1,
    },
  ]);
  const [isCartOpen, setIsCartOpen] = useState(false);

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

  // Automatic Geolocation / Timezone Currency Detection on Initial Mount
  useEffect(() => {
    const id = window.requestAnimationFrame(() => {
      try {
        const savedCurr = localStorage.getItem("mkm_currency") as CurrencyCode | null;
        if (savedCurr) {
          setCurrency(savedCurr);
          return;
        }
        const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
        if (tz.includes("Lagos") || tz.includes("Africa/Lagos")) {
          setCurrency("NGN");
          setDetectedRegion("WEST AFRICA // LAGOS DETECTED");
        } else if (tz.includes("Accra")) {
          setCurrency("GHS");
          setDetectedRegion("WEST AFRICA // ACCRA DETECTED");
        } else if (tz.includes("Nairobi")) {
          setCurrency("KES");
          setDetectedRegion("EAST AFRICA // NAIROBI DETECTED");
        } else if (tz.includes("London")) {
          setCurrency("GBP");
          setDetectedRegion("UNITED KINGDOM // LONDON DETECTED");
        } else if (tz.includes("Europe")) {
          setCurrency("EUR");
          setDetectedRegion("EUROPE // CONTINENTAL DETECTED");
        } else if (tz.includes("America/New_York") || tz.includes("Chicago")) {
          setCurrency("USD");
          setDetectedRegion("NORTH AMERICA // US DETECTED");
        } else {
          setCurrency("CAD");
          setDetectedRegion("NORTH AMERICA // TORONTO HQ");
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
    return newBrand;
  };

  const addProduct = (productInput: Omit<ProductRecord, "id">): ProductRecord => {
    const newProd: ProductRecord = {
      ...productInput,
      id: `prod-${Date.now()}`,
    };
    setProducts((prev) => [newProd, ...prev]);
    return newProd;
  };

  const updateVariantStock = (
    productId: string,
    size: string,
    hub: "hubALagos" | "hubBToronto",
    newQty: number
  ) => {
    setProducts((prev) =>
      prev.map((prod) => {
        if (prod.id !== productId) return prod;
        return {
          ...prod,
          variants: prod.variants.map((v) =>
            v.size === size ? { ...v, [hub]: Math.max(0, newQty) } : v
          ),
        };
      })
    );
  };

  const toggleCollectionLive = (collectionId: string) => {
    setCollections((prev) =>
      prev.map((col) =>
        col.id === collectionId
          ? { ...col, isDropLive: !col.isDropLive, isVipLocked: col.isDropLive }
          : col
      )
    );
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
    return newOrder;
  };

  const updateOrderStatus = (
    orderId: string,
    status: OrderStatus,
    paymentStatus?: PaymentStatus,
    waybill?: string,
    mpesaReceipt?: string
  ) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id !== orderId) return ord;
        return {
          ...ord,
          status,
          paymentStatus: paymentStatus ?? ord.paymentStatus,
          waybillNumber: waybill ?? ord.waybillNumber,
          mpesaReceiptNumber: mpesaReceipt ?? ord.mpesaReceiptNumber,
        };
      })
    );
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
          ? "Chidi Okonkwo (Lagos B2B Desk)"
          : "Elena Rostova (Toronto / Global Desk)",
      createdAt: new Date().toISOString(),
    };
    setB2bInquiries((prev) => [record, ...prev]);
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
        brands,
        addBrand,
        products,
        addProduct,
        updateVariantStock,
        collections,
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

