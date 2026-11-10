"use client";

import React, { useState } from "react";
import { BrandRecord, GenderTarget, ProductRecord, ShopCategory, VariantStock } from "@/lib/store-data";

interface AdminProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: ProductRecord | null;
  brands: BrandRecord[];
  onSave: (productData: Partial<ProductRecord>) => void;
}

export function AdminProductModal({
  isOpen,
  onClose,
  product,
  brands,
  onSave,
}: AdminProductModalProps) {
  if (!isOpen) return null;

  return (
    <AdminProductModalContent
      key={product?.id || "new-product"}
      onClose={onClose}
      product={product}
      brands={brands}
      onSave={onSave}
    />
  );
}

function AdminProductModalContent({
  onClose,
  product,
  brands,
  onSave,
}: {
  onClose: () => void;
  product?: ProductRecord | null;
  brands: BrandRecord[];
  onSave: (productData: Partial<ProductRecord>) => void;
}) {
  const [title, setTitle] = useState(product?.title || "");
  const [brandId, setBrandId] = useState(product?.brandId || brands[0]?.id || "");
  const [category, setCategory] = useState<ShopCategory>(product?.category || "Men Wears");
  const [priceCad, setPriceCad] = useState(product?.basePriceCad ?? 180);
  const [fabricWeightGsm, setFabricWeightGsm] = useState(product?.fabricWeightGsm ?? 380);
  const [genderTarget, setGenderTarget] = useState<GenderTarget>(product?.gender || "MEN");
  const [description, setDescription] = useState(product?.description || "");
  const [editorialImageUrl, setEditorialImageUrl] = useState(
    product?.editorialImageUrl ||
      "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=80"
  );
  const [flatlayImageUrl, setFlatlayImageUrl] = useState(
    product?.flatlayImageUrl ||
      "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=80"
  );
  const [isUploadingEditorial, setIsUploadingEditorial] = useState(false);
  const [isUploadingFlatlay, setIsUploadingFlatlay] = useState(false);

  // Variant stock
  const [variantsStock, setVariantsStock] = useState<
    { size: "XS" | "S" | "M" | "L" | "XL" | "XXL"; hubALagos: number; hubBToronto: number }[]
  >(
    product
      ? product.variants.map((v) => ({
          size: v.size,
          hubALagos: v.hubALagos || 0,
          hubBToronto: v.hubBToronto || 0,
        }))
      : [
          { size: "S", hubALagos: 5, hubBToronto: 5 },
          { size: "M", hubALagos: 10, hubBToronto: 8 },
          { size: "L", hubALagos: 10, hubBToronto: 8 },
          { size: "XL", hubALagos: 5, hubBToronto: 5 },
        ]
  );

  const handleFileUpload = async (
    file: File,
    type: "editorial" | "flatlay"
  ) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", "products");

    if (type === "editorial") setIsUploadingEditorial(true);
    else setIsUploadingFlatlay(true);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data?.url) {
        if (type === "editorial") setEditorialImageUrl(data.url);
        else setFlatlayImageUrl(data.url);
      }
    } catch {
      // fallback
    } finally {
      if (type === "editorial") setIsUploadingEditorial(false);
      else setIsUploadingFlatlay(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const brand = brands.find((b) => b.id === brandId) || brands[0];
    const prefix = product?.skuPrefix || "MF";

    const builtVariants: VariantStock[] = variantsStock.map((v) => ({
      sku: `${prefix}-${v.size}`,
      size: v.size,
      hubALagos: v.hubALagos,
      hubBToronto: v.hubBToronto,
    }));

    onSave({
      ...(product ? { id: product.id } : {}),
      title,
      brandId: brand?.id || "brand-macklemore",
      brandName: brand?.name || "Macklemore",
      brandSlug: brand?.slug || "macklemore",
      category,
      basePriceCad: priceCad,
      fabricWeightGsm,
      gender: genderTarget,
      description,
      editorialImageUrl,
      flatlayImageUrl,
      variants: builtVariants,
      slug: product?.slug || title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      skuPrefix: prefix,
      subtitle: product?.subtitle || "Afro-Luxury Signature",
      fabricComposition: product?.fabricComposition || "100% Organic African Cotton",
      originLabel: product?.originLabel || "Artisan Crafted in Lagos, Nigeria",
      colorName: product?.colorName || "Artisanal Natural",
      colorHex: product?.colorHex || "#7A491D",
      isFeatured: product?.isFeatured || false,
      collectionSlug: product?.collectionSlug || "core-collection",
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs overflow-y-auto">
      <div className="w-full max-w-2xl rounded-sm border border-[#EADFD0] bg-white p-7 sm:p-8 shadow-2xl my-8">
        <div className="flex items-center justify-between border-b border-[#EADFD0]/60 pb-4 mb-6">
          <div>
            <h3 className="font-display text-xl font-bold uppercase tracking-tight text-[#1F1A17]">
              {product ? "Edit Garment Details" : "Add New Boutique Piece"}
            </h3>
            <p className="text-xs text-[#6E6A63] mt-0.5">
              Configure pricing, partner house, fabric weight, and hub stock
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-sm bg-[#FAF9F6] border border-[#EADFD0] px-2.5 py-1 text-xs text-[#6E6A63] hover:text-[#1F1A17] hover:bg-white cursor-pointer"
          >
            Close
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Piece Title & Brand */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[#4A4742]">Piece Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Royal Indigo Agbada Two-Piece"
                className="w-full rounded-sm border border-[#EADFD0] bg-[#FAF9F6] px-3.5 py-2.5 text-xs text-[#1F1A17] focus:border-[#7A491D] focus:bg-white focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[#4A4742]">Fashion House / Brand</label>
              <select
                value={brandId}
                onChange={(e) => setBrandId(e.target.value)}
                className="w-full rounded-sm border border-[#EADFD0] bg-[#FAF9F6] px-3.5 py-2.5 text-xs text-[#1F1A17] focus:border-[#7A491D] focus:bg-white focus:outline-none cursor-pointer"
              >
                {brands.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name} ({b.commissionRatePct}% Comm.)
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Category, Gender, Price, GSM */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[#4A4742]">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ShopCategory)}
                className="w-full rounded-sm border border-[#EADFD0] bg-[#FAF9F6] px-3 py-2.5 text-xs text-[#1F1A17] focus:border-[#7A491D] focus:bg-white focus:outline-none cursor-pointer"
              >
                <option value="Men Wears">Men Wears</option>
                <option value="Male Accessories">Male Accessories</option>
                <option value="Women Wears">Women Wears</option>
                <option value="Female Accessories">Female Accessories</option>
                <option value="Kids Wears">Kids Wears</option>
                <option value="Fabrics">Fabrics</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[#4A4742]">Target</label>
              <select
                value={genderTarget}
                onChange={(e) => setGenderTarget(e.target.value as GenderTarget)}
                className="w-full rounded-sm border border-[#EADFD0] bg-[#FAF9F6] px-3 py-2.5 text-xs text-[#1F1A17] focus:border-[#7A491D] focus:bg-white focus:outline-none cursor-pointer"
              >
                <option value="MEN">Men</option>
                <option value="WOMEN">Women</option>
                <option value="UNISEX">Unisex</option>
                <option value="KIDS">Kids</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[#4A4742]">Base Price (CAD)</label>
              <input
                type="number"
                min="10"
                value={priceCad}
                onChange={(e) => setPriceCad(Number(e.target.value))}
                className="w-full rounded-sm border border-[#EADFD0] bg-[#FAF9F6] px-3 py-2.5 text-xs text-[#1F1A17] focus:border-[#7A491D] focus:bg-white focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[#4A4742]">Fabric GSM</label>
              <input
                type="number"
                min="100"
                max="900"
                value={fabricWeightGsm}
                onChange={(e) => setFabricWeightGsm(Number(e.target.value))}
                className="w-full rounded-sm border border-[#EADFD0] bg-[#FAF9F6] px-3 py-2.5 text-xs text-[#1F1A17] focus:border-[#7A491D] focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[#4A4742]">Artisanal Description</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Handcrafted organic cotton, artisanal embroidery, tailored in Lagos..."
              className="w-full rounded-sm border border-[#EADFD0] bg-[#FAF9F6] px-3.5 py-2.5 text-xs text-[#1F1A17] focus:border-[#7A491D] focus:bg-white focus:outline-none leading-relaxed"
            />
          </div>

          {/* Editorial Photos & S3 Upload */}
          <div className="space-y-3 border-t border-[#EADFD0]/60 pt-4">
            <span className="text-xs font-semibold text-[#1F1A17] block">
              Lookbook Photos (Neon S3 Cloud)
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Editorial Image */}
              <div className="rounded-sm border border-[#EADFD0] bg-[#FAF9F6] p-4 space-y-2">
                <span className="text-xs font-medium text-[#4A4742] block">
                  Model / Editorial Photo
                </span>
                <input
                  type="text"
                  value={editorialImageUrl}
                  onChange={(e) => setEditorialImageUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full rounded-sm border border-[#EADFD0] bg-white px-3 py-1.5 text-xs text-[#1F1A17]"
                />
                <div className="flex items-center gap-2">
                  <label className="rounded-sm bg-white border border-[#EADFD0] px-3 py-1.5 text-xs font-medium text-[#7A491D] hover:bg-[#FAF5EE] cursor-pointer">
                    {isUploadingEditorial ? "Uploading..." : "Upload Photo"}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileUpload(file, "editorial");
                      }}
                    />
                  </label>
                </div>
              </div>

              {/* Flatlay Image */}
              <div className="rounded-sm border border-[#EADFD0] bg-[#FAF9F6] p-4 space-y-2">
                <span className="text-xs font-medium text-[#4A4742] block">
                  Garment Flatlay Photo
                </span>
                <input
                  type="text"
                  value={flatlayImageUrl}
                  onChange={(e) => setFlatlayImageUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full rounded-sm border border-[#EADFD0] bg-white px-3 py-1.5 text-xs text-[#1F1A17]"
                />
                <div className="flex items-center gap-2">
                  <label className="rounded-sm bg-white border border-[#EADFD0] px-3 py-1.5 text-xs font-medium text-[#7A491D] hover:bg-[#FAF5EE] cursor-pointer">
                    {isUploadingFlatlay ? "Uploading..." : "Upload Photo"}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileUpload(file, "flatlay");
                      }}
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Size & Stock Matrix */}
          <div className="space-y-3 border-t border-[#EADFD0]/60 pt-4">
            <span className="text-xs font-semibold text-[#1F1A17] block">
              Dual-Hub Inventory Allocation
            </span>

            <div className="rounded-sm border border-[#EADFD0] bg-[#FAF9F6] p-4 divide-y divide-[#EADFD0]/60">
              <div className="grid grid-cols-3 pb-2 text-xs font-medium text-[#6E6A63]">
                <span>Size</span>
                <span className="text-center">Lagos Hub</span>
                <span className="text-right">Toronto HQ</span>
              </div>

              {variantsStock.map((v, idx) => (
                <div key={v.size} className="grid grid-cols-3 py-2 items-center text-xs">
                  <span className="font-bold text-[#1F1A17]">{v.size}</span>
                  <div className="flex justify-center">
                    <input
                      type="number"
                      min="0"
                      value={v.hubALagos}
                      onChange={(e) => {
                        const val = Math.max(0, parseInt(e.target.value) || 0);
                        setVariantsStock((prev) =>
                          prev.map((item, i) =>
                            i === idx ? { ...item, hubALagos: val } : item
                          )
                        );
                      }}
                      className="w-16 text-center rounded-sm border border-[#EADFD0] bg-white py-1 font-mono text-xs text-[#1F1A17]"
                    />
                  </div>
                  <div className="flex justify-end">
                    <input
                      type="number"
                      min="0"
                      value={v.hubBToronto}
                      onChange={(e) => {
                        const val = Math.max(0, parseInt(e.target.value) || 0);
                        setVariantsStock((prev) =>
                          prev.map((item, i) =>
                            i === idx ? { ...item, hubBToronto: val } : item
                          )
                        );
                      }}
                      className="w-16 text-center rounded-sm border border-[#EADFD0] bg-white py-1 font-mono text-xs text-[#1F1A17]"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#EADFD0]/60">
            <button
              type="button"
              onClick={onClose}
              className="rounded-sm border border-[#EADFD0] bg-[#FAF9F6] px-5 py-2.5 text-xs font-medium text-[#6E6A63] hover:text-[#1F1A17] hover:bg-white cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-sm bg-[#7A491D] px-6 py-2.5 text-xs font-semibold text-white uppercase shadow-xs hover:bg-[#5C3614] transition-all cursor-pointer"
            >
              Save Piece to Vault
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
