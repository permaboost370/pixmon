"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { PixelButton } from "@/components/ui/PixelButton";
import { PixelEgg } from "@/components/PixelEgg";

function nextResetMs() {
  const now = new Date();
  const next = new Date(now);
  next.setUTCHours(24, 0, 0, 0);
  return next.getTime() - now.getTime();
}

function fmt(ms: number) {
  const total = Math.max(0, Math.floor(ms / 1000));
  const h = String(Math.floor(total / 3600)).padStart(2, "0");
  const m = String(Math.floor((total % 3600) / 60)).padStart(2, "0");
  const s = String(total % 60).padStart(2, "0");
  return `${h}:${m}:${s}`;
}

export function Hero() {
  const [ms, setMs] = useState(0);

  useEffect(() => {
    setMs(nextResetMs());
    const id = setInterval(() => setMs(nextResetMs()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="relative overflow-hidden border-b-[3px] border-stroke">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-14 sm:py-20 grid lg:grid-cols-[1.15fr_1fr] gap-10 lg:gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-7"
        >
          <div className="inline-flex items-center gap-2 bg-bg-elevated border-[3px] border-stroke pixel-shadow-sm px-3 py-2">
            <span className="w-2 h-2 bg-sol-green inline-block blink" />
            <span className="font-display text-[9px] uppercase tracking-widest text-ink">
              Devnet · Pre-launch
            </span>
          </div>

          <h1 className="font-display text-2xl sm:text-3xl lg:text-5xl leading-tight">
            <span className="text-sol-purple">Catch.</span>
            <span className="text-ink-dim"> </span>
            <span className="text-sol-green-dark">Evolve.</span>
            <br />
            <span className="text-pix-pink">Battle.</span>
            <span className="text-ink"> On Sol</span>
            <span className="blink text-ink">_</span>
          </h1>

          <p className="text-xl sm:text-2xl text-ink-muted max-w-xl leading-snug">
            Mint a Pixmon, feed it Energy, gear it from the Gacha, and survive
            the daily elimination arena to split the prize pool.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <Link href="/mint">
              <PixelButton tone="green" size="lg">
                Hatch your first Pixmon →
              </PixelButton>
            </Link>
            <Link
              href="#how"
              className="font-display text-[10px] uppercase tracking-widest text-ink-muted hover:text-sol-purple transition-colors px-2 py-3"
            >
              How it works ↓
            </Link>
          </div>

          <div className="grid grid-cols-3 gap-3 pt-4 max-w-xl">
            <Stat label="Mint" value="0.05 SOL" tone="purple" />
            <Stat label="Starter pack" value="4 ⚡  1 🔑" tone="green" />
            <Stat label="Next arena" value={fmt(ms)} tone="pink" mono />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="relative flex items-center justify-center"
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-[80%] aspect-square bg-sol-purple/15 rounded-full blur-3xl" />
          </div>
          <div className="relative bob">
            <PixelEgg className="w-56 sm:w-72 lg:w-96 drop-shadow-[6px_6px_0_#000]" />
          </div>
          <div className="absolute top-6 right-6 wiggle font-display text-pix-gold text-xs">
            ✦
          </div>
          <div className="absolute bottom-12 left-4 wiggle font-display text-sol-purple text-sm">
            ✦
          </div>
          <div className="absolute top-1/2 right-2 wiggle font-display text-sol-green-dark text-base">
            ✦
          </div>
        </motion.div>
      </div>
    </section>
  );
}

type StatProps = {
  label: string;
  value: string;
  tone: "purple" | "green" | "pink";
  mono?: boolean;
};

function Stat({ label, value, tone, mono }: StatProps) {
  const toneText = {
    purple: "text-sol-purple",
    green: "text-sol-green-dark",
    pink: "text-pix-pink",
  }[tone];
  return (
    <div className="bg-bg-elevated border-[3px] border-stroke pixel-shadow-sm px-3 py-2">
      <div className="font-display text-[8px] uppercase tracking-widest text-ink-muted">
        {label}
      </div>
      <div
        className={`font-display text-xs mt-1 ${toneText} ${mono ? "tabular-nums" : ""}`}
      >
        {value}
      </div>
    </div>
  );
}
