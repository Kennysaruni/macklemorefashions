"use client";

import React, { useState } from "react";
import Link from "next/link";
import { JOURNAL_ARTICLES, JournalArticle } from "@/lib/store-data";
import { CurtainReveal, StaggeredText } from "@/components/motion/MotionPrimitives";
import {
  TribalCornerWatermark,
  TribalSectionSeparator,
} from "@/components/vectors/TribalVectors";

export default function JournalPage() {
  const [selectedArticle, setSelectedArticle] = useState<JournalArticle>(
    JOURNAL_ARTICLES[0]
  );

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#111111]">
      {/* Header Banner */}
      <section className="relative border-b border-[#E5E0D8] bg-white px-4 py-14 md:px-8 md:py-20 overflow-hidden">
        <TribalCornerWatermark
          position="top-right"
          className="text-[#7A491D]"
          opacity={0.05}
        />
        <div className="mx-auto max-w-[1440px]">
          <div className="font-mono text-[10px] tracking-[0.26em] text-[#7A491D] font-semibold uppercase mb-3">
            THE MACKLEMORE JOURNAL // CULTURE, COMFORT &amp; DESIGNER STORIES
          </div>
          <StaggeredText
            text="TRANS-ATLANTIC STORIES & STYLE."
            as="h1"
            className="font-display text-4xl sm:text-6xl font-bold tracking-tight uppercase leading-[0.95] max-w-4xl text-[#111111]"
          />
          <p className="mt-5 max-w-2xl text-sm sm:text-base text-[#4A4742] leading-relaxed">
            In-depth essays on Afro-Atlantic textile architecture, Nairobi 254 streetwear culture, continental supply chain sovereignty, and conversations with the creative directors shaping Lagos, Toronto, Milan, and Accra.
          </p>
        </div>
      </section>

      {/* Main Editorial Reader + Issue Index */}
      <section className="mx-auto max-w-[1440px] px-4 py-14 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 border border-[#E5E0D8] bg-white">
          {/* Left Column: Issue Selector Rail */}
          <div className="lg:col-span-4 border-b lg:border-b-0 lg:border-r border-[#E5E0D8] divide-y divide-[#E5E0D8] bg-[#FAF9F6]">
            <div className="p-5 bg-white">
              <span className="font-mono text-[10px] tracking-[0.22em] text-[#7A491D] font-semibold uppercase">
                ARCHIVE INDEX // {JOURNAL_ARTICLES.length} ISSUES PUBLISHED
              </span>
            </div>
            {JOURNAL_ARTICLES.map((article) => {
              const isSelected = article.id === selectedArticle.id;
              return (
                <button
                  key={article.id}
                  onClick={() => setSelectedArticle(article)}
                  className={`w-full text-left p-6 transition-colors cursor-pointer ${
                    isSelected
                      ? "bg-white border-l-4 border-l-[#E31E24]"
                      : "hover:bg-white/70"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 font-mono text-[10px] tracking-[0.18em] text-[#7A491D] font-semibold uppercase mb-2">
                    <span>{article.issueNumber}</span>
                    <span className="text-[#6E6A63]">{article.readTime}</span>
                  </div>
                  <h3 className="font-display text-lg font-bold tracking-tight text-[#111111] uppercase leading-snug mb-2">
                    {article.title}
                  </h3>
                  <p className="font-mono text-[10px] tracking-[0.16em] text-[#6E6A63] uppercase">
                    {article.corridor}
                  </p>
                </button>
              );
            })}

            {/* Corridor Dispatch Note */}
            <div className="p-6 space-y-3 bg-white">
              <div className="font-mono text-[10px] tracking-[0.22em] text-[#7A491D] font-semibold uppercase">
                PRESS &amp; STYLING DESK
              </div>
              <p className="text-xs text-[#4A4742] leading-relaxed">
                For editorial pulls, showroom appointments in Victoria Island, Westlands (254), or King West, and high-resolution campaign lookbooks, contact the Macklemore Press Directorate.
              </p>
              <Link
                href="/contact"
                className="inline-block border border-[#111111] bg-white px-4 py-2.5 font-mono text-[10px] tracking-[0.2em] text-[#111111] uppercase hover:bg-[#111111] hover:text-white transition-colors"
              >
                REQUEST PRESS CREDENTIALS →
              </Link>
            </div>
          </div>

          {/* Right Column: Full Feature Reader */}
          <div className="lg:col-span-8 p-6 md:p-12 bg-white">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E5E0D8] pb-6 mb-8">
              <div>
                <span className="font-mono text-[10px] tracking-[0.22em] text-[#E31E24] font-semibold uppercase block">
                  {selectedArticle.issueNumber}
                </span>
                <span className="font-mono text-[11px] tracking-[0.18em] text-[#7A491D] uppercase mt-1 block">
                  {selectedArticle.corridor}
                </span>
              </div>
              <div className="text-right font-mono text-[10px] tracking-[0.18em] text-[#6E6A63] uppercase">
                <div>AUTHOR: {selectedArticle.author}</div>
                <div>
                  PUBLISHED: {selectedArticle.publishedAt} ·{" "}
                  {selectedArticle.readTime}
                </div>
              </div>
            </div>

            <h2 className="font-display text-2xl sm:text-4xl font-bold tracking-tight text-[#111111] uppercase leading-[1.08] mb-4">
              {selectedArticle.title}
            </h2>
            <p className="text-base text-[#4A4742] leading-relaxed mb-8">
              {selectedArticle.subtitle}
            </p>

            <CurtainReveal
              key={selectedArticle.id}
              className="aspect-[16/9] border border-[#E5E0D8] mb-10 bg-[#F3EFEA]"
            >
              <img
                src={selectedArticle.heroImageUrl}
                alt={selectedArticle.title}
                className="h-full w-full object-cover"
              />
            </CurtainReveal>

            <div className="space-y-6 max-w-3xl">
              <p className="font-mono text-xs tracking-[0.12em] text-[#7A491D] font-semibold uppercase leading-relaxed border-l-2 border-[#E31E24] pl-4 py-1 bg-[#FAF9F6]">
                {selectedArticle.excerpt}
              </p>
              {selectedArticle.bodyParagraphs.map((paragraph, index) => (
                <p
                  key={index}
                  className="text-sm sm:text-base text-[#4A4742] leading-relaxed"
                >
                  {paragraph}
                </p>
              ))}
            </div>

            <TribalSectionSeparator theme="light" className="my-10" />

            <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
              <div className="font-mono text-[10px] tracking-[0.2em] text-[#6E6A63] uppercase">
                ARCHIVE CLASSIFICATION: AFRO-ATLANTIC LUXURY &amp; STREETWEAR
              </div>
              <div className="flex gap-3">
                <Link
                  href="/collections"
                  className="border border-[#111111] bg-white px-5 py-2.5 font-mono text-[10px] tracking-[0.2em] text-[#111111] uppercase hover:bg-[#111111] hover:text-white transition-colors"
                >
                  VIEW REFERENCED DROP →
                </Link>
                <Link
                  href="/brands/luca"
                  className="bg-[#111111] px-5 py-2.5 font-mono text-[10px] font-semibold tracking-[0.2em] text-white uppercase hover:bg-[#E31E24] transition-colors"
                >
                  EXPLORE LUCA BOUTIQUE →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
