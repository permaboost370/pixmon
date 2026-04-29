"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { PixelButton } from "@/components/ui/PixelButton";
import { PixelEgg } from "@/components/PixelEgg";

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b-[3px] border-stroke">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-16 sm:py-24 grid lg:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-8"
        >
          <div className="inline-block bg-pix-pink text-ink font-display text-[9px] uppercase tracking-widest px-3 py-2 border-[3px] border-stroke pixel-shadow-sm">
            Now hatching · Devnet
          </div>

          <h1 className="font-display text-2xl sm:text-3xl lg:text-5xl leading-tight">
            <span className="text-pix-gold">Catch.</span>
            <br />
            <span className="text-pix-cyan">Evolve.</span>
            <br />
            <span className="text-sol-green">Battle.</span>
            <br />
            <span className="text-ink-muted text-lg sm:text-xl lg:text-2xl">
              On Sol<span className="blink">_</span>
            </span>
          </h1>

          <p className="text-xl sm:text-2xl text-ink-muted max-w-md leading-snug">
            Mint a Pixmon, feed it Energy, gear it from the Gacha, and survive
            the daily elimination arena to split the prize pool.
          </p>

          <div className="flex flex-wrap gap-4">
            <Link href="/mint">
              <PixelButton tone="green" size="lg">
                Mint your Pixmon
              </PixelButton>
            </Link>
            <Link href="/arena">
              <PixelButton tone="ink" size="lg">
                Watch the arena →
              </PixelButton>
            </Link>
          </div>

          <div className="flex items-center gap-6 text-sm text-ink-muted pt-2">
            <div>
              <div className="font-display text-[10px] text-pix-gold">0.05 SOL</div>
              <div>per mint</div>
            </div>
            <div className="w-px h-8 bg-ink-dim" />
            <div>
              <div className="font-display text-[10px] text-pix-gold">+4 ⚡ +1 🔑</div>
              <div>starter pack</div>
            </div>
            <div className="w-px h-8 bg-ink-dim" />
            <div>
              <div className="font-display text-[10px] text-pix-gold">DAILY</div>
              <div>tournament</div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="relative flex items-center justify-center"
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-[80%] aspect-square bg-sol-purple/30 rounded-full blur-3xl" />
          </div>
          <div className="relative bob">
            <PixelEgg className="w-64 sm:w-80 lg:w-96 drop-shadow-[6px_6px_0_#000]" />
          </div>
          <div className="absolute top-6 right-6 wiggle font-display text-pix-gold text-xs">
            ✦
          </div>
          <div className="absolute bottom-12 left-4 wiggle font-display text-pix-cyan text-sm">
            ✦
          </div>
          <div className="absolute top-1/2 right-2 wiggle font-display text-sol-green text-base">
            ✦
          </div>
        </motion.div>
      </div>
    </section>
  );
}
