"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useWallet } from "@solana/wallet-adapter-react";

import { Header } from "@/components/Header";
import { Footer } from "@/components/landing/Footer";
import { PixelPanel } from "@/components/ui/PixelPanel";
import { PixelButton } from "@/components/ui/PixelButton";
import { PixelEgg } from "@/components/PixelEgg";
import { PixelMon } from "@/components/PixelMon";
import { usePixelWalletModal } from "@/components/providers/PixelWalletModalProvider";

const PRICE_SOL = 0.05;

const STAT_MAX = {
  hp: 160,
  atk: 40,
  def: 30,
  spd: 32,
} as const;

type Phase = "idle" | "hatching" | "revealed";

type Roll = {
  species: number;
  name: string;
  hp: number;
  atk: number;
  def: number;
  spd: number;
  rarity: "common" | "rare" | "epic" | "legendary";
};

const NAMES = [
  "Glommer",
  "Sprigly",
  "Volti",
  "Mogworm",
  "Pixet",
  "Crysto",
  "Hexbun",
  "Drifo",
  "Lumix",
  "Boxlet",
];

function rollMon(): Roll {
  const r = Math.random();
  const rarity =
    r < 0.6 ? "common" : r < 0.9 ? "rare" : r < 0.99 ? "epic" : "legendary";
  const factor =
    rarity === "common" ? 1 : rarity === "rare" ? 1.2 : rarity === "epic" ? 1.5 : 2;
  const roll = (lo: number, hi: number, max: number) =>
    Math.min(max, Math.round((lo + Math.random() * (hi - lo)) * factor));
  return {
    species: Math.floor(Math.random() * 4),
    name: `${NAMES[Math.floor(Math.random() * NAMES.length)]} #${Math.floor(
      Math.random() * 9999,
    )}`,
    hp: roll(40, 80, STAT_MAX.hp),
    atk: roll(8, 18, STAT_MAX.atk),
    def: roll(5, 14, STAT_MAX.def),
    spd: roll(6, 16, STAT_MAX.spd),
    rarity,
  };
}

const RARITY_TONE: Record<Roll["rarity"], "cyan" | "green" | "purple" | "gold"> = {
  common: "cyan",
  rare: "green",
  epic: "purple",
  legendary: "gold",
};

export default function MintPage() {
  const { connected } = useWallet();
  const { open: openWallet } = usePixelWalletModal();
  const [qty, setQty] = useState(1);
  const [phase, setPhase] = useState<Phase>("idle");
  const [roll, setRoll] = useState<Roll | null>(null);

  function handleMint() {
    if (!connected) {
      openWallet();
      return;
    }
    setPhase("hatching");
    setTimeout(() => {
      setRoll(rollMon());
      setPhase("revealed");
    }, 2400);
  }

  function reset() {
    setRoll(null);
    setPhase("idle");
  }

  return (
    <>
      <Header />
      <main className="flex-1">
        <section className="mx-auto max-w-5xl px-4 sm:px-6 py-12 sm:py-16">
          <div className="mb-10">
            <div className="inline-block font-display text-[10px] text-pix-pink uppercase tracking-widest px-3 py-2 bg-bg-elevated border-[3px] border-stroke pixel-shadow-sm">
              Mint
            </div>
            <h1 className="font-display text-2xl sm:text-3xl text-ink mt-6 leading-tight">
              Hatch a fresh{" "}
              <span className="text-sol-purple">Pixmon</span>.
            </h1>
            <p className="text-ink-muted text-xl mt-3 max-w-xl">
              Each mint includes <span className="text-sol-green-dark">4 ⚡ Energy</span>{" "}
              and <span className="text-pix-pink">1 🔑 Gacha Key</span>. Stats
              roll on hatch. Rarity is fate.
            </p>
          </div>

          <div className="grid lg:grid-cols-[1fr_auto] gap-8 items-start">
            <PixelPanel
              tone="default"
              title={
                phase === "revealed" && roll
                  ? `Hatched · ${roll.rarity.toUpperCase()}`
                  : "Pixmon · Egg"
              }
              titleTone={
                phase === "revealed" && roll ? RARITY_TONE[roll.rarity] : "purple"
              }
            >
              <div className="p-8 sm:p-12 flex items-center justify-center min-h-[360px] relative">
                <AnimatePresence mode="wait">
                  {phase === "idle" && (
                    <motion.div
                      key="egg"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="bob"
                    >
                      <PixelEgg className="w-56 sm:w-72 drop-shadow-[6px_6px_0_#000]" />
                    </motion.div>
                  )}
                  {phase === "hatching" && (
                    <motion.div
                      key="hatching"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex flex-col items-center gap-6"
                    >
                      <motion.div
                        animate={{ rotate: [-6, 6, -4, 4, 0], scale: [1, 1.05, 1] }}
                        transition={{ duration: 0.4, repeat: Infinity }}
                      >
                        <PixelEgg className="w-56 sm:w-72 drop-shadow-[6px_6px_0_#000]" />
                      </motion.div>
                      <div className="font-display text-sol-purple text-sm uppercase tracking-widest blink">
                        ✦ Hatching ✦
                      </div>
                    </motion.div>
                  )}
                  {phase === "revealed" && roll && (
                    <motion.div
                      key="mon"
                      initial={{ opacity: 0, y: 20, scale: 0.7 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ type: "spring", stiffness: 240, damping: 18 }}
                      className="flex flex-col items-center gap-4"
                    >
                      <div className="bob">
                        <PixelMon
                          species={roll.species}
                          className="w-56 sm:w-72 drop-shadow-[6px_6px_0_#000]"
                        />
                      </div>
                      <div className="font-display text-ink text-base">
                        {roll.name}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </PixelPanel>

            <div className="w-full lg:w-80 space-y-4">
              {phase !== "revealed" ? (
                <>
                  <PixelPanel tone="default" title="Quantity" titleTone="cyan">
                    <div className="p-5 flex items-center justify-between gap-3">
                      <button
                        onClick={() => setQty(Math.max(1, qty - 1))}
                        className="font-display text-xl bg-bg-sunk text-ink w-10 h-10 border-[3px] border-stroke pixel-shadow-sm pixel-press"
                        aria-label="Decrease"
                      >
                        −
                      </button>
                      <div className="font-display text-3xl text-sol-purple tabular-nums">
                        {qty}
                      </div>
                      <button
                        onClick={() => setQty(Math.min(5, qty + 1))}
                        className="font-display text-xl bg-bg-sunk text-ink w-10 h-10 border-[3px] border-stroke pixel-shadow-sm pixel-press"
                        aria-label="Increase"
                      >
                        +
                      </button>
                    </div>
                  </PixelPanel>

                  <PixelPanel tone="default" title="Cost" titleTone="gold">
                    <div className="p-5 space-y-2 text-lg">
                      <div className="flex justify-between text-ink-muted">
                        <span>{qty} × {PRICE_SOL} SOL</span>
                        <span className="text-ink">
                          {(qty * PRICE_SOL).toFixed(3)} SOL
                        </span>
                      </div>
                      <div className="flex justify-between text-ink-muted">
                        <span>Network fee</span>
                        <span>≈ 0.000005 SOL</span>
                      </div>
                      <div className="border-t-[3px] border-stroke my-3" />
                      <div className="flex justify-between font-display text-ink text-sm">
                        <span>Total</span>
                        <span>{(qty * PRICE_SOL).toFixed(3)} SOL</span>
                      </div>
                    </div>
                  </PixelPanel>

                  <PixelButton
                    tone="green"
                    size="lg"
                    className="w-full"
                    onClick={handleMint}
                    disabled={phase === "hatching"}
                  >
                    {phase === "hatching"
                      ? "Hatching…"
                      : connected
                      ? "Hatch now"
                      : "Connect to mint"}
                  </PixelButton>

                  <p className="text-ink-dim text-base leading-snug">
                    Devnet build. Stats and rarity shown are simulated. Real
                    on-chain mint lands when the program ships.
                  </p>
                </>
              ) : (
                roll && (
                  <>
                    <PixelPanel
                      tone="default"
                      title="Stats rolled"
                      titleTone={RARITY_TONE[roll.rarity]}
                    >
                      <ul className="p-5 space-y-3 text-lg">
                        <Stat label="HP" value={roll.hp} max={STAT_MAX.hp} />
                        <Stat label="ATK" value={roll.atk} max={STAT_MAX.atk} />
                        <Stat label="DEF" value={roll.def} max={STAT_MAX.def} />
                        <Stat label="SPD" value={roll.spd} max={STAT_MAX.spd} />
                      </ul>
                    </PixelPanel>

                    <PixelPanel tone="default" title="Starter pack" titleTone="green">
                      <div className="p-5 flex justify-around text-center">
                        <div>
                          <div className="text-3xl">⚡</div>
                          <div className="font-display text-ink text-xs mt-1">
                            +4
                          </div>
                          <div className="text-ink-muted text-base">Energy</div>
                        </div>
                        <div>
                          <div className="text-3xl">🔑</div>
                          <div className="font-display text-ink text-xs mt-1">
                            +1
                          </div>
                          <div className="text-ink-muted text-base">Key</div>
                        </div>
                      </div>
                    </PixelPanel>

                    <PixelButton
                      tone="cyan"
                      size="lg"
                      className="w-full"
                      onClick={reset}
                    >
                      Hatch another
                    </PixelButton>
                  </>
                )
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

function Stat({ label, value, max }: { label: string; value: number; max: number }) {
  const pct = Math.min(100, (value / max) * 100);
  return (
    <li className="flex items-center justify-between gap-3">
      <span className="font-display text-[10px] uppercase text-ink-muted tracking-widest w-12">
        {label}
      </span>
      <div className="flex-1 h-3 bg-bg-sunk border-[3px] border-stroke">
        <div
          className="h-full bg-sol-green"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="font-display text-ink text-xs tabular-nums w-14 text-right">
        {value}
        <span className="text-ink-dim">/{max}</span>
      </span>
    </li>
  );
}
