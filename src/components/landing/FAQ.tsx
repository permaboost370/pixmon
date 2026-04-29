"use client";

import { useState } from "react";

const QUESTIONS = [
  {
    q: "What is a Pixmon?",
    a: "A pixel-art creature you mint as an NFT on Solana. Each one rolls a random species, palette, and stat line on hatch. Rarer hatches roll higher caps.",
  },
  {
    q: "How do I battle?",
    a: "Equip items on your Pixmon, lock it in before the daily UTC reset, and the on-chain elimination bracket runs automatically. Survivors at the threshold tier split the prize pool.",
  },
  {
    q: "How does evolution work?",
    a: "Each Pixmon can evolve once. Burn Energy tokens — the more you spend, the bigger the random stat-bonus roll. After that, your stats are locked.",
  },
  {
    q: "What's in the gacha?",
    a: "Weapons, charms, and relics. Each item has a flat stat bonus + a percent multiplier. Pull with Keys (you get one free with every mint).",
  },
  {
    q: "Is this on mainnet yet?",
    a: "No. We're on devnet. The frontend you're looking at is a working preview. Mainnet launches when the Solana program ships and audits clear.",
  },
  {
    q: "Do I need ETH?",
    a: "No. Pixmon lives on Solana. You'll need a Solana wallet (Phantom, Solflare, Backpack) and a small amount of SOL.",
  },
  {
    q: "Why pixel art?",
    a: "It's the genre's lingua franca. We're using the PixelLab pipeline to generate every species and animation, so the world stays cohesive as we add creatures.",
  },
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="mx-auto max-w-3xl px-4 sm:px-6 py-16">
      <div className="mb-8">
        <div className="inline-block font-display text-[10px] text-sol-purple uppercase tracking-widest px-3 py-2 bg-bg-elevated border-[3px] border-stroke pixel-shadow-sm">
          FAQ
        </div>
        <h2 className="font-display text-2xl sm:text-3xl text-ink mt-6 leading-tight">
          Quick answers.
        </h2>
      </div>

      <ul className="space-y-3">
        {QUESTIONS.map((item, i) => {
          const isOpen = open === i;
          return (
            <li
              key={item.q}
              className="bg-bg-elevated pixel-border-tight overflow-hidden"
            >
              <button
                onClick={() => setOpen(isOpen ? null : i)}
                aria-expanded={isOpen}
                className="w-full flex items-center justify-between gap-4 p-4 text-left pixel-press"
              >
                <span className="font-display text-[11px] text-ink uppercase tracking-wider leading-snug">
                  {item.q}
                </span>
                <span
                  className={`font-display text-pix-pink text-base shrink-0 transition-transform ${
                    isOpen ? "rotate-45" : ""
                  }`}
                  aria-hidden
                >
                  +
                </span>
              </button>
              <div
                className={`grid transition-[grid-template-rows] duration-200 ease-out ${
                  isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                }`}
              >
                <div className="overflow-hidden">
                  <p className="px-4 pb-4 pt-0 text-ink-muted text-lg leading-snug border-t-[3px] border-stroke">
                    <span className="block pt-3">{item.a}</span>
                  </p>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
