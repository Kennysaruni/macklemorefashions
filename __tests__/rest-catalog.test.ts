import { describe, expect, it } from "vitest";
import { NextRequest } from "next/server";
import { GET as getProducts } from "@/app/api/products/route";
import { GET as getBrands } from "@/app/api/brands/route";
import { GET as getCollections } from "@/app/api/collections/route";

describe("RESTful Catalog API Handlers", () => {
  it("GET /api/products returns product array with pagination meta", async () => {
    const req = new NextRequest("http://localhost:3000/api/products?limit=5");
    const res = await getProducts(req);
    expect(res.status).toBe(200);

    const json = await res.json();
    expect(json.ok).toBe(true);
    expect(Array.isArray(json.data)).toBe(true);
    expect(json.data.length).toBeLessThanOrEqual(5);
    expect(json.meta?.limit).toBe(5);
  });

  it("GET /api/products filters by category correctly", async () => {
    const req = new NextRequest(
      "http://localhost:3000/api/products?category=KAFTAN_ARCHIVE"
    );
    const res = await getProducts(req);
    expect(res.status).toBe(200);

    const json = await res.json();
    expect(json.ok).toBe(true);
    for (const p of json.data) {
      expect(p.category).toBe("KAFTAN_ARCHIVE");
    }
  });

  it("GET /api/brands returns partner fashion houses", async () => {
    const req = new NextRequest("http://localhost:3000/api/brands");
    const res = await getBrands(req);
    expect(res.status).toBe(200);

    const json = await res.json();
    expect(json.ok).toBe(true);
    expect(Array.isArray(json.data)).toBe(true);
    expect(json.data.length).toBeGreaterThan(0);
    const macklemore = json.data.find(
      (b: { slug: string }) => b.slug === "macklemore"
    );
    expect(macklemore).toBeDefined();
  });

  it("GET /api/collections returns seasonal capsules", async () => {
    const res = await getCollections();
    expect(res.status).toBe(200);

    const json = await res.json();
    expect(json.ok).toBe(true);
    expect(Array.isArray(json.data)).toBe(true);
    expect(json.data.length).toBeGreaterThan(0);
  });
});

