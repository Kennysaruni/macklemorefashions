"use client";

import React, { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { TribalCornerWatermark } from "./TribalVectors";

interface TopoGeometry {
  type: "Polygon" | "MultiPolygon";
  arcs: number[][] | number[][][];
  id?: string;
  properties?: {
    name?: string;
  };
}

interface WorldAtlasTopology {
  type: "Topology";
  transform: {
    scale: [number, number];
    translate: [number, number];
  };
  objects: {
    countries: {
      type: "GeometryCollection";
      geometries: TopoGeometry[];
    };
  };
  arcs: number[][][];
}

export interface ContinentalRegionGroup {
  id: string;
  label: string;
  badge: string;
  hubCity: string;
  isOperationalHub: boolean;
  countries: string[];
  codes: Set<string>;
  names?: Set<string>;
  color: string;
  baseFill: string;
  baseStroke: string;
  role: string;
  deliverySummary: string;
  showroomAddress: string;
  hubCoordinates: [number, number]; // [lon, lat]
}

const CONTINENTAL_REGIONS: ContinentalRegionGroup[] = [
  {
    id: "west-africa",
    label: "West Africa",
    badge: "Nigeria · Operations Hub",
    hubCity: "Nigeria Hub",
    isOperationalHub: true,
    countries: ["Nigeria", "Ghana", "Senegal", "Côte d'Ivoire"],
    codes: new Set([
      "686", "270", "624", "324", "694", "430", "384", "288", "768", "204",
      "566", "854", "132", "466", "478", "562",
    ]),
    color: "#E31E24",
    baseFill: "#E9D6BE",
    baseStroke: "#C4A482",
    role: "Operations hub in Nigeria serving West Africa.",
    deliverySummary: "1–3 Business Days",
    showroomAddress: "Nigeria",
    hubCoordinates: [8.6753, 9.082],
  },
  {
    id: "north-america",
    label: "North America",
    badge: "Toronto, Canada · Corporate HQ",
    hubCity: "Toronto HQ",
    isOperationalHub: true,
    countries: ["Canada", "United States"],
    codes: new Set([
      "124", "840", "484", "304", "044", "192", "214", "332", "388", "630",
      "780", "084", "188", "222", "320", "340", "558", "591", "028", "052",
      "060", "092", "136", "212", "308", "500", "531", "533", "534", "652",
      "659", "660", "662", "663", "666", "670", "796", "850",
    ]),
    color: "#7A491D",
    baseFill: "#F1E7D8",
    baseStroke: "#D2BFA6",
    role: "Corporate headquarters in Toronto, Canada.",
    deliverySummary: "2–4 Business Days",
    showroomAddress: "Toronto, Canada",
    hubCoordinates: [-79.3832, 43.6532],
  },
  {
    id: "east-africa",
    label: "East Africa",
    badge: "East Africa · Delivery",
    hubCity: "Delivery",
    isOperationalHub: false,
    countries: ["Kenya", "Uganda", "Rwanda", "Tanzania"],
    codes: new Set([
      "231", "232", "262", "706", "404", "800", "646", "108", "834", "729",
      "728", "690", "480", "174", "450",
    ]),
    names: new Set(["Somaliland"]),
    color: "#D4860B",
    baseFill: "#ECDCBE",
    baseStroke: "#C4A482",
    role: "Express delivery across East Africa.",
    deliverySummary: "2–4 Business Days",
    showroomAddress: "From Nigeria & Canada",
    hubCoordinates: [36.8219, -1.2921],
  },
  {
    id: "north-southern-africa",
    label: "Southern & North Africa",
    badge: "Pan-African Delivery",
    hubCity: "Delivery",
    isOperationalHub: false,
    countries: ["South Africa", "Egypt", "Morocco", "Cameroon"],
    codes: new Set([
      // North Africa
      "504", "732", "012", "788", "434", "818", "736",
      // Central Africa
      "180", "120", "024", "140", "148", "178", "266", "678", "226",
      // Southern Africa
      "894", "716", "508", "454", "516", "426", "748", "710", "072",
    ]),
    color: "#E05C1A",
    baseFill: "#EFE2CE",
    baseStroke: "#C8AC8C",
    role: "Continental delivery from Nigeria and Toronto, Canada.",
    deliverySummary: "3–5 Business Days",
    showroomAddress: "From Nigeria & Canada",
    hubCoordinates: [28.0473, -26.2041],
  },
  {
    id: "europe-uk",
    label: "UK & Europe",
    badge: "UK & Europe · Delivery",
    hubCity: "Delivery",
    isOperationalHub: false,
    countries: ["United Kingdom", "Italy", "France", "Germany"],
    codes: new Set([
      "826", "372", "250", "276", "380", "724", "620", "528", "056", "442",
      "756", "040", "208", "578", "752", "246", "352", "616", "203", "703",
      "348", "642", "100", "300", "705", "191", "070", "688", "499", "807",
      "008", "233", "428", "440", "804", "112", "498", "470", "196", "020",
      "438", "492", "674", "336", "234", "248", "831", "832", "833",
    ]),
    names: new Set(["Kosovo", "N. Cyprus"]),
    color: "#1A7A6E",
    baseFill: "#F1E7D8",
    baseStroke: "#D2BFA6",
    role: "International delivery & partner brand network.",
    deliverySummary: "2–4 Business Days",
    showroomAddress: "From Canada & Nigeria",
    hubCoordinates: [-0.1276, 51.5072],
  },
  {
    id: "global-continents",
    label: "Global Markets",
    badge: "Worldwide Delivery",
    hubCity: "Delivery",
    isOperationalHub: false,
    countries: ["UAE", "Brazil", "Japan", "Australia"],
    codes: new Set<string>(), // Matches remaining global countries
    color: "#9A6B3B",
    baseFill: "#F5EDE1",
    baseStroke: "#DCCBB5",
    role: "Worldwide express delivery.",
    deliverySummary: "3–6 Business Days",
    showroomAddress: "From Canada & Nigeria",
    hubCoordinates: [55.2708, 25.2048],
  },
];

// Pan-African sub-regions (matches AfrikLink's exact 5-region breakdown when in Africa Focus mode)
const PAN_AFRICAN_SUBREGIONS = [
  {
    id: "west-africa",
    parentRegionId: "west-africa",
    label: "West Africa",
    countries: ["Nigeria", "Ghana", "Senegal", "Côte d'Ivoire"],
    codes: new Set([
      "686", "270", "624", "324", "694", "430", "384", "288", "768", "204",
      "566", "854", "132", "466", "478", "562",
    ]),
    color: "#E31E24",
    baseFill: "#E7D2B8",
  },
  {
    id: "east-africa",
    parentRegionId: "east-africa",
    label: "East Africa",
    countries: ["Kenya", "Uganda", "Rwanda", "Tanzania", "Ethiopia"],
    codes: new Set([
      "231", "232", "262", "706", "404", "800", "646", "108", "834", "729",
      "728", "690", "480", "174", "450",
    ]),
    names: new Set(["Somaliland"]),
    color: "#D4860B",
    baseFill: "#EAD7BE",
  },
  {
    id: "north-africa",
    parentRegionId: "north-southern-africa",
    label: "North Africa",
    countries: ["Morocco", "Algeria", "Tunisia", "Libya", "Egypt"],
    codes: new Set(["504", "732", "012", "788", "434", "818", "736"]),
    color: "#E05C1A",
    baseFill: "#EFE0CB",
  },
  {
    id: "central-africa",
    parentRegionId: "north-southern-africa",
    label: "Central Africa",
    countries: ["DR Congo", "Cameroon", "Angola", "Chad", "Gabon"],
    codes: new Set(["180", "120", "024", "140", "148", "178", "266", "678", "226"]),
    color: "#E31E24",
    baseFill: "#ECDBC5",
  },
  {
    id: "southern-africa",
    parentRegionId: "north-southern-africa",
    label: "Southern Africa",
    countries: ["South Africa", "Botswana", "Namibia", "Zambia", "Zimbabwe"],
    codes: new Set(["894", "716", "508", "454", "516", "426", "748", "710", "072"]),
    color: "#D4860B",
    baseFill: "#EFE0CB",
  },
];

function projectMercator(
  [lon, lat]: [number, number],
  mapScale: number,
  centerLon: number,
  centerLat: number,
  width: number,
  height: number
): [number, number] {
  const rad = Math.PI / 180;
  const clampedLat = Math.max(-64, Math.min(75, lat));
  const x0 = centerLon * rad;
  const y0 = Math.log(Math.tan(Math.PI / 4 + (centerLat * rad) / 2));
  const x = (lon * rad - x0) * mapScale + width / 2;
  const y =
    (y0 - Math.log(Math.tan(Math.PI / 4 + (clampedLat * rad) / 2))) * mapScale +
    height / 2;
  return [x, y];
}

function decodeArc(
  topology: WorldAtlasTopology,
  arcIndex: number
): [number, number][] {
  const arc = topology.arcs[arcIndex < 0 ? ~arcIndex : arcIndex];
  const [sx, sy] = topology.transform.scale;
  const [tx, ty] = topology.transform.translate;
  let x = 0;
  let y = 0;
  const pts: [number, number][] = arc.map(([dx, dy]) => {
    x += dx;
    y += dy;
    return [x * sx + tx, y * sy + ty];
  });
  return arcIndex < 0 ? pts.reverse() : pts;
}

function decodeRing(
  topology: WorldAtlasTopology,
  ring: number[]
): [number, number][] {
  const coords: [number, number][] = [];
  for (const arcIdx of ring) {
    const pts = decodeArc(topology, arcIdx);
    if (coords.length > 0) pts.shift();
    coords.push(...pts);
  }
  // Unwrap antimeridian quantization (-180 vs +180) so eastern Russia/Fiji never wrap across the canvas
  for (let i = 1; i < coords.length; i++) {
    const diff = coords[i][0] - coords[i - 1][0];
    if (diff > 180) coords[i][0] -= 360;
    else if (diff < -180) coords[i][0] += 360;
  }
  return coords;
}

function geometryToSvgPath(
  topology: WorldAtlasTopology,
  geom: TopoGeometry,
  proj: (pt: [number, number]) => [number, number]
): string {
  const polygons: number[][][] =
    geom.type === "Polygon"
      ? [geom.arcs as number[][]]
      : geom.type === "MultiPolygon"
        ? (geom.arcs as number[][][])
        : [];

  let pathStr = "";
  for (const poly of polygons) {
    for (const ring of poly) {
      const pts = decodeRing(topology, ring);
      if (pts.length < 3) continue;
      for (let i = 0; i < pts.length; i++) {
        const [x, y] = proj(pts[i]);
        pathStr += `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
      }
      pathStr += "Z";
    }
  }
  return pathStr;
}

function classifyContinentRegion(geom: TopoGeometry): string {
  const code = geom.id ? String(geom.id) : "";
  const name = geom.properties?.name || "";
  for (let i = 0; i < CONTINENTAL_REGIONS.length - 1; i++) {
    const reg = CONTINENTAL_REGIONS[i];
    if ((code && reg.codes.has(code)) || (name && reg.names?.has(name))) {
      return reg.id;
    }
  }
  return "global-continents";
}

export function ContinentalMapBanner({}: {
  compact?: boolean;
}) {
  const [topology, setTopology] = useState<WorldAtlasTopology | null>(null);
  const [mapMode, setMapMode] = useState<"world" | "africa">("world");
  const [hoveredRegionId, setHoveredRegionId] = useState<string | null>(null);
  const [selectedRegionId, setSelectedRegionId] = useState<string>("west-africa");
  const [hoveredCountryName, setHoveredCountryName] = useState<string | null>(null);
  const [cursorPos, setCursorPos] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });

  useEffect(() => {
    let isMounted = true;
    fetch("/countries-50m.json")
      .then((res) => {
        if (!res.ok) throw new Error(res.statusText);
        return res.json();
      })
      .then((data: WorldAtlasTopology) => {
        if (isMounted) setTopology(data);
      })
      .catch(() => {
        // Fallback to jsDelivr CDN if local public asset is unavailable
        fetch("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json")
          .then((r) => r.json())
          .then((data: WorldAtlasTopology) => {
            if (isMounted) setTopology(data);
          })
          .catch(() => {});
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const activeRegionId = hoveredRegionId || selectedRegionId;
  const activeRegion =
    CONTINENTAL_REGIONS.find((r) => r.id === activeRegionId) ||
    CONTINENTAL_REGIONS[0];

  const hoveredRegion = useMemo(
    () => CONTINENTAL_REGIONS.find((r) => r.id === hoveredRegionId) || null,
    [hoveredRegionId]
  );

  // Project countries for the selected view mode ("world" shows Africa + all Continents; "africa" zooms into Pan-African 5 regions)
  const projectedData = useMemo(() => {
    if (!topology) return null;

    const isAfricaZoom = mapMode === "africa";
    const width = isAfricaZoom ? 800 : 960;
    const height = isAfricaZoom ? 880 : 520;
    const proj = (pt: [number, number]) =>
      isAfricaZoom
        ? projectMercator(pt, 540, 20, 2, width, height)
        : projectMercator(pt, 142, 12, 16, width, height);

    const excludedAntarcticIds = new Set(["010", "260", "334"]);
    const validGeoms = topology.objects.countries.geometries.filter(
      (g) => !excludedAntarcticIds.has(String(g.id))
    );

    if (isAfricaZoom) {
      const groups = PAN_AFRICAN_SUBREGIONS.map((sub) => {
        const items = validGeoms
          .filter(
            (g) =>
              (g.id && sub.codes.has(String(g.id))) ||
              (g.properties?.name && sub.names?.has(g.properties.name))
          )
          .map((g, idx) => ({
            key: `${sub.id}-${g.id || idx}`,
            name: g.properties?.name || sub.label,
            d: geometryToSvgPath(topology, g, proj),
          }))
          .filter((item) => item.d.length > 0);

        return {
          id: sub.parentRegionId,
          subId: sub.id,
          label: sub.label,
          color: sub.color,
          baseFill: sub.baseFill,
          baseStroke: "#C4A482",
          items,
        };
      });

      const hubs = CONTINENTAL_REGIONS.filter((r) =>
        ["west-africa", "east-africa", "north-southern-africa"].includes(r.id)
      ).map((r) => {
        const [x, y] = proj(r.hubCoordinates);
        return { ...r, svgX: x, svgY: y };
      });

      return { width, height, groups, hubs };
    }

    // World & All Continents mode
    const groups = CONTINENTAL_REGIONS.map((reg) => {
      const items = validGeoms
        .filter((g) => classifyContinentRegion(g) === reg.id)
        .map((g, idx) => ({
          key: `${reg.id}-${g.id || idx}`,
          name: g.properties?.name || reg.label,
          d: geometryToSvgPath(topology, g, proj),
        }))
        .filter((item) => item.d.length > 0);

      return {
        id: reg.id,
        subId: reg.id,
        label: reg.label,
        color: reg.color,
        baseFill: reg.baseFill,
        baseStroke: reg.baseStroke,
        items,
      };
    });

    const hubs = CONTINENTAL_REGIONS.map((r) => {
      const [x, y] = proj(r.hubCoordinates);
      return { ...r, svgX: x, svgY: y };
    });

    return { width, height, groups, hubs };
  }, [topology, mapMode]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const regionVariants = {
    hidden: { opacity: 0, scale: 0.97 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.55, ease: "easeOut" as const },
    },
  };

  return (
    <section className="relative bg-[#FAF5EE] text-[#1F1A17] border-y border-[#EADFD0] overflow-hidden py-14 sm:py-20">
      <TribalCornerWatermark position="top-right" opacity={0.05} />
      <TribalCornerWatermark position="bottom-left" opacity={0.05} />

      <div className="max-w-[1380px] mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-10 lg:gap-14 items-center">
          {/* ===============================================================
              LEFT COLUMN: AFRIKLINK-STYLE INTERACTIVE CONTINENTAL & REGIONAL LIST
             =============================================================== */}
          <div>
            <span className="inline-block text-xs font-bold tracking-[0.2em] uppercase text-[#E31E24] mb-2">
              Global Network
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[#1F1A17] leading-[1.12] mb-2.5">
              Hubs &amp;{" "}
              <span className="text-[#7A491D]">Delivery Reach</span>
            </h2>
            <p className="text-xs sm:text-sm text-[#5C5147] mb-5 max-w-[440px]">
              Toronto, Canada and Nigeria hubs delivering across Africa and worldwide.
            </p>

            {/* Interactive Region / Continent Cards (AfrikLink Pattern) */}
            <div className="flex flex-col gap-2">
              {CONTINENTAL_REGIONS.map((region) => {
                const isActive = activeRegionId === region.id;
                return (
                  <div
                    key={region.id}
                    onMouseEnter={() => setHoveredRegionId(region.id)}
                    onMouseLeave={() => setHoveredRegionId(null)}
                    onClick={() => setSelectedRegionId(region.id)}
                    className={`flex items-center gap-3 p-3 sm:p-3.5 rounded-xl border transition-all duration-300 cursor-pointer group relative overflow-hidden ${
                      isActive
                        ? "bg-white border-[#7A491D]/40 shadow-sm translate-x-1"
                        : "bg-[#FFFDF9]/80 border-[#EADFD0] hover:bg-white hover:border-[#D4B895]"
                    }`}
                  >
                    <div
                      className="w-2.5 h-2.5 rounded-full shrink-0 transition-transform duration-300 group-hover:scale-125"
                      style={{ background: region.color }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="text-sm font-semibold text-[#1F1A17] truncate">
                          {region.label}
                        </h4>
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-[#7A491D] shrink-0">
                          {region.hubCity}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#6E6359] truncate">
                        {region.countries.join(" · ")}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ===============================================================
              RIGHT COLUMN: REAL TOPOJSON CONTINENTAL & AFRICAN MAP CARD
             =============================================================== */}
          <div
            className="relative w-full h-full flex items-center justify-center"
            onMouseMove={(e) => {
              setCursorPos({ x: e.clientX + 18, y: e.clientY - 44 });
            }}
          >
            <div className="relative w-full rounded-[28px] sm:rounded-[36px] bg-[#FFFDF9] border border-[#EADFD0] p-4 sm:p-7 lg:p-8 shadow-[0_20px_60px_rgba(31,26,23,0.07)] flex flex-col justify-between overflow-visible">
              {/* Map Header & View Mode Toggle */}
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-[#EFE7DC]">
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: activeRegion.color }}
                  />
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#7A491D]">
                    {activeRegion.badge}
                  </span>
                </div>

                <div className="inline-flex items-center rounded-lg border border-[#EADFD0] bg-[#FAF5EE] p-0.5">
                  <button
                    type="button"
                    onClick={() => setMapMode("world")}
                    className={`px-3 py-1 rounded-md text-[11px] font-semibold transition-all cursor-pointer ${
                      mapMode === "world"
                        ? "bg-[#1F1A17] text-[#FFFDF9] shadow-2xs"
                        : "text-[#5C5147] hover:text-[#1F1A17]"
                    }`}
                  >
                    All Continents
                  </button>
                  <button
                    type="button"
                    onClick={() => setMapMode("africa")}
                    className={`px-3 py-1 rounded-md text-[11px] font-semibold transition-all cursor-pointer ${
                      mapMode === "africa"
                        ? "bg-[#1F1A17] text-[#FFFDF9] shadow-2xs"
                        : "text-[#5C5147] hover:text-[#1F1A17]"
                    }`}
                  >
                    Pan-African Zoom
                  </button>
                </div>
              </div>

              {/* Real Geographic SVG Map (world-atlas@2/countries-50m.json) */}
              <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] rounded-2xl bg-[#FAF5EE]/70 border border-[#EFE7DC] flex items-center justify-center overflow-hidden p-2 sm:p-3">
                {!projectedData ? (
                  <div className="w-full h-full flex items-center justify-center text-xs font-medium text-[#7A491D] animate-pulse">
                    Loading continental geography...
                  </div>
                ) : (
                  <svg
                    viewBox={`0 0 ${projectedData.width} ${projectedData.height}`}
                    className="rsm-svg w-full h-full block transform-gpu preserve-3d"
                  >
                    {/* Subtle Warm Latitude & Longitude Grid */}
                    {mapMode === "world" && (
                      <g opacity="0.45">
                        {[100, 200, 300, 400].map((y) => (
                          <line
                            key={`lat-${y}`}
                            x1="0"
                            y1={y}
                            x2={projectedData.width}
                            y2={y}
                            stroke="#EADFD0"
                            strokeWidth="0.8"
                            strokeDasharray="3 3"
                          />
                        ))}
                        {[160, 320, 480, 640, 800].map((x) => (
                          <line
                            key={`lon-${x}`}
                            x1={x}
                            y1="0"
                            x2={x}
                            y2={projectedData.height}
                            stroke="#EADFD0"
                            strokeWidth="0.8"
                            strokeDasharray="3 3"
                          />
                        ))}
                      </g>
                    )}

                    {/* Real Country Geographies Grouped by Region/Continent */}
                    <motion.g
                      key={mapMode}
                      className="rsm-geographies"
                      variants={containerVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      {projectedData.groups.map((grp) => {
                        const isRegionActive = activeRegionId === grp.id;
                        const isDimmed =
                          hoveredRegionId !== null && hoveredRegionId !== grp.id;

                        return (
                          <motion.g
                            key={grp.subId}
                            variants={regionVariants}
                            className="cursor-pointer transition-opacity duration-500 will-change-transform"
                            style={{ opacity: isDimmed ? 0.42 : 1 }}
                            onMouseEnter={() => setHoveredRegionId(grp.id)}
                            onMouseLeave={() => {
                              setHoveredRegionId(null);
                              setHoveredCountryName(null);
                            }}
                            onClick={() => setSelectedRegionId(grp.id)}
                          >
                            {grp.items.map((country) => (
                              <path
                                key={country.key}
                                d={country.d}
                                className="rsm-geography"
                                onMouseEnter={() =>
                                  setHoveredCountryName(country.name)
                                }
                                style={{
                                  fill: isRegionActive
                                    ? grp.color
                                    : grp.baseFill,
                                  stroke: isRegionActive
                                    ? "rgba(255, 253, 249, 0.85)"
                                    : grp.baseStroke,
                                  strokeWidth: isRegionActive ? 0.65 : 0.45,
                                  outline: "none",
                                  transition:
                                    "fill 380ms cubic-bezier(0.23, 1, 0.32, 1), stroke 380ms cubic-bezier(0.23, 1, 0.32, 1)",
                                }}
                              />
                            ))}
                          </motion.g>
                        );
                      })}
                    </motion.g>

                    {/* Delivery Corridors from Nigeria & Toronto, Canada Hubs */}
                    {mapMode === "world" && projectedData.hubs.length >= 5 && (() => {
                      const nigeriaHub = projectedData.hubs.find((h) => h.id === "west-africa");
                      const torontoHub = projectedData.hubs.find((h) => h.id === "north-america");
                      const eastAfricaDest = projectedData.hubs.find((h) => h.id === "east-africa");
                      const southAfricaDest = projectedData.hubs.find((h) => h.id === "north-southern-africa");
                      const europeDest = projectedData.hubs.find((h) => h.id === "europe-uk");

                      if (!nigeriaHub || !torontoHub) return null;

                      return (
                        <g className="pointer-events-none">
                          {/* Toronto, Canada HQ <-> Nigeria Hub */}
                          <path
                            d={`M ${torontoHub.svgX} ${torontoHub.svgY} Q 360 205 ${nigeriaHub.svgX} ${nigeriaHub.svgY}`}
                            stroke="#E31E24"
                            strokeWidth="1.8"
                            strokeDasharray="5 4"
                            fill="none"
                            opacity="0.82"
                          />
                          {/* Nigeria Hub -> UK & Europe Delivery */}
                          {europeDest && (
                            <path
                              d={`M ${nigeriaHub.svgX} ${nigeriaHub.svgY} Q 478 215 ${europeDest.svgX} ${europeDest.svgY}`}
                              stroke="#1A7A6E"
                              strokeWidth="1.5"
                              strokeDasharray="4 4"
                              fill="none"
                              opacity="0.72"
                            />
                          )}
                          {/* Nigeria Hub -> East Africa Delivery Destination */}
                          {eastAfricaDest && (
                            <path
                              d={`M ${nigeriaHub.svgX} ${nigeriaHub.svgY} Q 520 272 ${eastAfricaDest.svgX} ${eastAfricaDest.svgY}`}
                              stroke="#D4860B"
                              strokeWidth="1.6"
                              strokeDasharray="4 3"
                              fill="none"
                              opacity="0.82"
                            />
                          )}
                          {/* Nigeria Hub -> Southern Africa Delivery Destination */}
                          {southAfricaDest && (
                            <path
                              d={`M ${nigeriaHub.svgX} ${nigeriaHub.svgY} Q 495 335 ${southAfricaDest.svgX} ${southAfricaDest.svgY}`}
                              stroke="#E05C1A"
                              strokeWidth="1.5"
                              strokeDasharray="4 3"
                              fill="none"
                              opacity="0.72"
                            />
                          )}
                        </g>
                      );
                    })()}

                    {/* Operational Hub Markers (Nigeria & Toronto, Canada) + Delivery Destination Dots */}
                    {projectedData.hubs.map((hub) => {
                      const isHubActive = activeRegionId === hub.id;
                      return (
                        <g
                          key={`pin-${hub.id}`}
                          className="cursor-pointer"
                          onMouseEnter={() => setHoveredRegionId(hub.id)}
                          onMouseLeave={() => setHoveredRegionId(null)}
                          onClick={() => setSelectedRegionId(hub.id)}
                        >
                          {hub.isOperationalHub ? (
                            <>
                              <circle
                                cx={hub.svgX}
                                cy={hub.svgY}
                                r={isHubActive ? 14 : 9.5}
                                fill={hub.color}
                                fillOpacity={isHubActive ? 0.28 : 0.18}
                                stroke={hub.color}
                                strokeOpacity={isHubActive ? 0.95 : 0.65}
                                strokeWidth="1.4"
                              />
                              <circle
                                cx={hub.svgX}
                                cy={hub.svgY}
                                r={isHubActive ? 5.2 : 4}
                                fill="#FFFDF9"
                                stroke={hub.color}
                                strokeWidth="2.2"
                              />
                            </>
                          ) : (
                            <circle
                              cx={hub.svgX}
                              cy={hub.svgY}
                              r={isHubActive ? 5 : 3.2}
                              fill={hub.color}
                              fillOpacity={isHubActive ? 0.95 : 0.65}
                              stroke="#FFFDF9"
                              strokeWidth="1.2"
                            />
                          )}
                        </g>
                      );
                    })}
                  </svg>
                )}
              </div>

              {/* Selected Region / Hub Summary Footer Inside Map Card */}
              <div className="mt-4 pt-3.5 border-t border-[#EFE7DC] grid grid-cols-3 gap-2.5">
                <div className="p-2.5 rounded-xl bg-[#FAF5EE] border border-[#EADFD0]">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-[#7A491D] block">
                    {activeRegion.isOperationalHub ? "Hub" : "Origin"}
                  </span>
                  <span className="text-xs font-semibold text-[#1F1A17] mt-0.5 block truncate">
                    {activeRegion.showroomAddress}
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-[#FAF5EE] border border-[#EADFD0]">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-[#7A491D] block">
                    Delivery
                  </span>
                  <span className="text-xs font-semibold text-[#1F1A17] mt-0.5 block truncate">
                    {activeRegion.deliverySummary}
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-[#FAF5EE] border border-[#EADFD0]">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-[#7A491D] block">
                    Markets
                  </span>
                  <span className="text-xs font-semibold text-[#1F1A17] mt-0.5 block truncate">
                    {activeRegion.countries.slice(0, 3).join(" · ")}
                  </span>
                </div>
              </div>

              {/* Floating Cursor Tooltip (AfrikLink Pattern) */}
              <AnimatePresence>
                {hoveredRegion && (
                  <motion.div
                    className="fixed pointer-events-none z-[1000] bg-[#1F1A17]/95 border border-[#D4860B]/40 rounded-2xl p-3.5 flex items-start gap-3 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.35)] min-w-[215px] max-w-[280px] hidden sm:flex"
                    style={{ left: cursorPos.x, top: cursorPos.y }}
                    initial={{ opacity: 0, y: 12, scale: 0.92 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.92 }}
                    transition={{ duration: 0.18, ease: "easeOut" }}
                  >
                    <div
                      className="w-3 h-3 rounded-full mt-1 shrink-0 shadow-[0_0_10px_rgba(227,30,36,0.4)]"
                      style={{ background: hoveredRegion.color }}
                    />
                    <div>
                      <p className="text-[13px] font-bold text-[#FFFDF9] mb-0.5 tracking-tight">
                        {hoveredCountryName
                          ? `${hoveredCountryName} · ${hoveredRegion.label}`
                          : hoveredRegion.label}
                      </p>
                      <p className="text-[11px] text-[#EADFD0]/75 leading-relaxed font-medium">
                        {hoveredRegion.countries.slice(0, 5).join(" · ")}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
