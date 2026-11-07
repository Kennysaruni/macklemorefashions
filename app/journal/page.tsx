"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { JOURNAL_ARTICLES, JournalArticle } from "@/lib/store-data";
import {
  CurtainImage,
  TextReveal,
} from "@/components/motion/MotionPrimitives";
import {
  TribalCornerWatermark,
  TribalSectionSeparator,
} from "@/components/vectors/TribalVectors";

export default function JournalPage() {
  const [selectedArticle, setSelectedArticle] = useState<JournalArticle>(
    JOURNAL_ARTICLES[0]
  );

  return (
    <div className="min-h-screen bg-[#FFFDF9] text-[#1F1A17]">
      {/* Header Banner */}
      <section className="relative border-b border-[#EADFD0] bg-[#FAF5EE] px-4 py-12 md:px-8 md:py-16 overflow-hidden">
        <TribalCornerWatermark position="top-right" opacity={0.05} />
        <div className="mx-auto max-w-[1440px] space-y-3">
          <span className="text-xs font-semibold tracking-wider uppercase text-[#7A491D] block">
            Journal &amp; Editorial
          </span>
          <TextReveal
            text="Stories on Style, Culture & Craft"
            as="h1"
            className="font-display text-3xl sm:text-5xl font-semibold tracking-tight max-w-3xl text-[#1F1A17]"
          />
          <p className="max-w-2xl text-sm sm:text-base text-[#5C5147] leading-relaxed">
            Explore campaign stories, designer features, and cultural perspectives connecting Lagos, Toronto, Nairobi, Accra, and Milan.
          </p>
        </div>
      </section>

      {/* Main Editorial Reader + Story List */}
      <section className="mx-auto max-w-[1440px] px-4 py-12 md:px-8 md:py-16">
        <div className="rounded-lg border border-[#EADFD0] bg-white overflow-hidden shadow-xs grid grid-cols-1 lg:grid-cols-12">
          {/* Left Column: Story Selector with layoutId Gliding Indicator */}
          <div className="lg:col-span-4 border-b lg:border-b-0 lg:border-r border-[#EADFD0] divide-y divide-[#F2EAE0] bg-[#FAF5EE]/60">
            <div className="p-5 bg-white">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#7A491D]">
                Featured Stories ({JOURNAL_ARTICLES.length})
              </span>
            </div>
            {JOURNAL_ARTICLES.map((article) => {
              const isSelected = article.id === selectedArticle.id;
              return (
                <button
                  key={article.id}
                  onClick={() => setSelectedArticle(article)}
                  className={`relative w-full text-left p-6 transition-colors duration-200 cursor-pointer overflow-hidden ${
                    isSelected ? "bg-white" : "hover:bg-white/80"
                  }`}
                >
                  {isSelected && (
                    <motion.span
                      layoutId="journal-story-indicator"
                      transition={{
                        type: "spring",
                        stiffness: 380,
                        damping: 32,
                      }}
                      className="absolute left-0 top-0 bottom-0 w-1 bg-[#E31E24]"
                    />
                  )}
                  <div className="flex items-center justify-between gap-2 text-xs text-[#7A491D] font-medium mb-1.5">
                    <span>{article.corridor}</span>
                    <span className="text-[#8C7E71]">{article.readTime}</span>
                  </div>
                  <h3 className="font-display text-lg font-semibold text-[#1F1A17] leading-snug">
                    {article.title}
                  </h3>
                </button>
              );
            })}

            {/* Press Note */}
            <div className="p-6 space-y-3 bg-white">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#7A491D] block">
                Press &amp; Styling Enquiries
              </span>
              <p className="text-xs text-[#5C5147] leading-relaxed">
                For lookbook requests, showroom appointments, or editorial collaborations, reach out to our communications team.
              </p>
              <Link
                href="/contact"
                className="inline-block rounded-md border border-[#D4B895] bg-[#FAF5EE] px-4 py-2 text-xs font-medium text-[#1F1A17] hover:bg-[#1F1A17] hover:text-white transition-colors"
              >
                Contact Press Team →
              </Link>
            </div>
          </div>

          {/* Right Column: Full Story Reader */}
          <div className="lg:col-span-8 p-6 md:p-12 bg-white">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#F2EAE0] pb-5 mb-6 text-xs text-[#7D7065]">
              <span className="text-[#E31E24] font-semibold">
                {selectedArticle.corridor}
              </span>
              <span>
                By {selectedArticle.author} · {selectedArticle.readTime}
              </span>
            </div>

            <TextReveal
              key={selectedArticle.title}
              text={selectedArticle.title}
              as="h2"
              className="font-display text-2xl sm:text-4xl font-semibold tracking-tight text-[#1F1A17] leading-snug mb-3"
            />
            <p className="text-base text-[#5C5147] leading-relaxed mb-6">
              {selectedArticle.subtitle}
            </p>

            <CurtainImage
              key={selectedArticle.id}
              src={selectedArticle.heroImageUrl}
              alt={selectedArticle.title}
              aspectClass="aspect-[16/9]"
              sizes="(max-width: 1024px) 100vw, 66vw"
              className="rounded-lg border border-[#EADFD0] mb-8"
            />

            <div className="space-y-5 max-w-3xl">
              <p className="text-sm font-medium text-[#7A491D] leading-relaxed border-l-3 border-[#D4860B] pl-4 py-1.5 bg-[#FAF5EE]/60 rounded-r-md">
                {selectedArticle.excerpt}
              </p>
              {selectedArticle.bodyParagraphs.map((paragraph, index) => (
                <p
                  key={index}
                  className="text-sm sm:text-base text-[#5C5147] leading-relaxed"
                >
                  {paragraph}
                </p>
              ))}
            </div>

            <TribalSectionSeparator className="my-8" />

            <div className="flex flex-wrap items-center justify-between gap-4">
              <span className="text-xs text-[#7D7065]">
                Macklemore Fashion Editorial
              </span>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/collections"
                  className="rounded-md border border-[#D4B895] bg-white px-4 py-2.5 text-xs font-medium text-[#1F1A17] hover:bg-[#1F1A17] hover:text-white transition-colors"
                >
                  View Collections →
                </Link>
                <Link
                  href="/brands/luca"
                  className="rounded-md bg-[#1F1A17] px-4 py-2.5 text-xs font-medium text-white hover:bg-[#E31E24] transition-colors"
                >
                  Explore LUCA →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
