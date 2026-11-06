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
    <div className="min-h-screen bg-[#0B0B0C] text-[#F6F5F1]">
      {/* Header Banner */}
      <section className="relative border-b border-stone-800 px-4 py-16 md:px-8 md:py-24 overflow-hidden">
        <TribalCornerWatermark
          position="top-right"
          className="text-[#D4860B]"
          opacity={0.07}
        />
        <div className="mx-auto max-w-[1600px]">
          <div className="font-mono text-[10px] tracking-[0.28em] text-[#D4860B] uppercase mb-3">
            [ THE MACKLEMORE JOURNAL // EDITORIAL & CULTURAL ARCHIVE ]
          </div>
          <StaggeredText
            text="TRANS-ATLANTIC DISPATCHES."
            as="h1"
            className="font-display text-4xl sm:text-6xl font-bold tracking-[-0.03em] uppercase leading-[0.95] max-w-4xl"
          />
          <p className="mt-6 max-w-2xl text-sm text-stone-400 leading-relaxed">
            In-depth essays on Afro-Atlantic textile architecture, continental supply chain sovereignty, and conversations with the creative directors shaping Lagos, Toronto, Milan, Accra, and Nairobi.
          </p>
        </div>
      </section>

      {/* Main Editorial Reader + Issue Index */}
      <section className="mx-auto max-w-[1600px] px-4 py-14 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 border border-stone-800">
          {/* Left Column: Issue Selector Rail */}
          <div className="lg:col-span-4 border-b lg:border-b-0 lg:border-r border-stone-800 divide-y divide-stone-800 bg-[#0E0E10]">
            <div className="p-5 bg-black/50">
              <span className="font-mono text-[10px] tracking-[0.24em] text-stone-400 uppercase">
                [ ARCHIVE INDEX // {JOURNAL_ARTICLES.length} ISSUES PUBLISHED ]
              </span>
            </div>
            {JOURNAL_ARTICLES.map((article) => {
              const isSelected = article.id === selectedArticle.id;
              return (
                <button
                  key={article.id}
                  onClick={() => setSelectedArticle(article)}
                  className={`w-full text-left p-6 transition-colors ${
                    isSelected
                      ? "bg-[#151518] border-l-2 border-l-[#E31E24]"
                      : "hover:bg-stone-950"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 font-mono text-[10px] tracking-[0.2em] text-[#D4860B] uppercase mb-2">
                    <span>{article.issueNumber}</span>
                    <span className="text-stone-500">{article.readTime}</span>
                  </div>
                  <h3 className="font-display text-lg font-bold tracking-tight text-[#F6F5F1] uppercase leading-snug mb-2">
                    {article.title}
                  </h3>
                  <p className="font-mono text-[10px] tracking-[0.16em] text-stone-400 uppercase">
                    {article.corridor}
                  </p>
                </button>
              );
            })}

            {/* Corridor Dispatch Note */}
            <div className="p-6 space-y-3 bg-[#0B0B0C]">
              <div className="font-mono text-[10px] tracking-[0.22em] text-[#D4860B] uppercase">
                [ PRESS & SYNDICATION DESK ]
              </div>
              <p className="text-xs text-stone-400 leading-relaxed">
                For editorial pulls, showroom appointments in Victoria Island or King West, and high-resolution campaign lookbooks, contact the Macklemore Press Directorate.
              </p>
              <Link
                href="/contact"
                className="inline-block border border-stone-700 px-4 py-2.5 font-mono text-[10px] tracking-[0.2em] text-[#F6F5F1] uppercase hover:border-[#D4860B] hover:text-[#D4860B]"
              >
                REQUEST PRESS CREDENTIALS →
              </Link>
            </div>
          </div>

          {/* Right Column: Full Feature Reader */}
          <div className="lg:col-span-8 p-6 md:p-12 bg-[#0B0B0C]">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-800 pb-6 mb-8">
              <div>
                <span className="font-mono text-[10px] tracking-[0.22em] text-[#E31E24] uppercase block">
                  {selectedArticle.issueNumber}
                </span>
                <span className="font-mono text-[11px] tracking-[0.18em] text-stone-400 uppercase mt-1 block">
                  {selectedArticle.corridor}
                </span>
              </div>
              <div className="text-right font-mono text-[10px] tracking-[0.18em] text-stone-400 uppercase">
                <div>AUTHOR: {selectedArticle.author}</div>
                <div>PUBLISHED: {selectedArticle.publishedAt} // {selectedArticle.readTime}</div>
              </div>
            </div>

            <h2 className="font-display text-2xl sm:text-4xl font-bold tracking-[-0.02em] text-[#F6F5F1] uppercase leading-[1.08] mb-4">
              {selectedArticle.title}
            </h2>
            <p className="text-base text-stone-300 leading-relaxed mb-8">
              {selectedArticle.subtitle}
            </p>

            <CurtainReveal
              key={selectedArticle.id}
              className="aspect-[16/9] border border-stone-800 mb-10 bg-stone-950"
            >
              <img
                src={selectedArticle.heroImageUrl}
                alt={selectedArticle.title}
                className="h-full w-full object-cover"
              />
            </CurtainReveal>

            <div className="space-y-6 max-w-3xl">
              <p className="font-mono text-xs tracking-[0.12em] text-[#D4860B] uppercase leading-relaxed border-l-2 border-[#E31E24] pl-4 py-1">
                {selectedArticle.excerpt}
              </p>
              {selectedArticle.bodyParagraphs.map((paragraph, index) => (
                <p
                  key={index}
                  className="text-sm sm:text-base text-stone-300 leading-relaxed"
                >
                  {paragraph}
                </p>
              ))}
            </div>

            <TribalSectionSeparator className="my-10" />

            <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
              <div className="font-mono text-[10px] tracking-[0.2em] text-stone-500 uppercase">
                [ ARCHIVE CLASSIFICATION: AFRO-ATLANTIC LUXURY // INFRASTRUCTURE ]
              </div>
              <div className="flex gap-3">
                <Link
                  href="/collections"
                  className="border border-stone-700 px-5 py-2.5 font-mono text-[10px] tracking-[0.2em] text-[#F6F5F1] uppercase hover:border-[#D4860B]"
                >
                  VIEW REFERENCED DROP →
                </Link>
                <Link
                  href="/brands/luca"
                  className="bg-[#E31E24] px-5 py-2.5 font-mono text-[10px] font-semibold tracking-[0.2em] text-white uppercase hover:bg-[#D4860B] hover:text-black transition-colors"
                >
                  EXPLORE LUCA MICROSITE →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

