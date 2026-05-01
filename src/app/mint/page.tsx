"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useWallet } from "@solana/wallet-adapter-react";

import { Header } from "@/components/Header";
import { Footer } from "@/components/landing/Footer";
import { PixelPanel } from "@/components/ui/PixelPanel";
import { PixelButton } from "@/components/ui/PixelButton";
import { PixelEgg } from "@/components/PixelEgg";
import { PixelIcon } from "@/components/PixelIcon";
import { PixmonCard } from "@/components/PixmonCard";
import { usePixelWalletModal } from "@/components/providers/PixelWalletModalProvider";
import { useGame } from "@/lib/game/store";
import type { Mon } from "@/lib/game/types";

const PRICE_SOL = 0.05;

type Phase = "idle" | "hatching" | "revealed";

const RARITY_TONE: Record<Mon["rarity"], "cyan" | "green" | "purple" | "gold"> = {
  common: "cyan",
  rare: "green",
  epic: "purple",
  legendary: "gold",
};

export default function MintPage() {
  const { connected } = useWallet();
  const { open: openWallet } = usePixelWalletModal();
  const { mintMon } = useGame();
  const [phase, setPhase] = useState<Phase>("idle");
  const [revealed, setRevealed] = useState<Mon | null>(null);

  function handleMint() {
    if (!connected) {
      openWallet();
      return;
    }
    setPhase("hatching");
    setTimeout(() => {
      const mon = mintMon();
      setRevealed(mon);
      setPhase("revealed");
    }, 2400);
  }

  function reset() {
    setRevealed(null);
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
              Each mint includes{" "}
              <span className="inline-flex items-center gap-1 text-sol-green-dark">
                <PixelIcon name="bolt" className="w-4 h-4" />4 Energy
              </span>{" "}
              and{" "}
              <span className="inline-flex items-center gap-1 text-pix-pink">
                <PixelIcon name="key" className="w-4 h-4" />1 Gacha Key
              </span>
              . Stats roll on hatch. Rarity is fate.
            </p>
          </div>

          <div className="grid lg:grid-cols-[1fr_auto] gap-8 items-start">
            <PixelPanel
              tone="default"
              title={
                phase === "revealed" && revealed
                  ? `Hatched · ${revealed.rarity.toUpperCase()}`
                  : "Pixmon · Egg"
              }
              titleTone={
                phase === "revealed" && revealed ? RARITY_TONE[revealed.rarity] : "purple"
              }
            >
              <div className="p-8 sm:p-12 flex items-center justify-center min-h-[420px] relative">
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
                  {phase === "revealed" && revealed && (
                    <motion.div
                      key="mon"
                      initial={{ opacity: 0, rotateY: 90, scale: 0.6 }}
                      animate={{ opacity: 1, rotateY: 0, scale: 1 }}
                      transition={{ type: "spring", stiffness: 180, damping: 18 }}
                      style={{ transformStyle: "preserve-3d" }}
                    >
                      <PixmonCard
                        species={revealed.species}
                        name={`${revealed.name} #${revealed.number}`}
                        number={revealed.number}
                        rarity={revealed.rarity}
                        stats={{ atk: revealed.baseAtk, def: revealed.baseDef }}
                        size="lg"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </PixelPanel>

            <div className="w-full lg:w-80 space-y-4">
              {phase !== "revealed" ? (
                <>
                  <PixelPanel tone="default" title="Cost" titleTone="gold">
                    <div className="p-5 space-y-2 text-lg">
                      <div className="flex justify-between text-ink-muted">
                        <span>Mint price</span>
                        <span className="text-ink">{PRICE_SOL} SOL</span>
                      </div>
                      <div className="flex justify-between text-ink-muted">
                        <span>Network fee</span>
                        <span>≈ 0.000005 SOL</span>
                      </div>
                      <div className="border-t-[3px] border-stroke my-3" />
                      <div className="flex justify-between font-display text-ink text-sm">
                        <span>Total</span>
                        <span>{PRICE_SOL} SOL</span>
                      </div>
                    </div>
                  </PixelPanel>

                  <PixelPanel tone="default" title="You receive" titleTone="green">
                    <div className="p-5 grid grid-cols-2 gap-4 text-center">
                      <div className="bg-bg-sunk pixel-border-tight p-3 flex flex-col items-center gap-1">
                        <PixelIcon name="bolt" className="w-10 h-10" />
                        <div className="font-display text-ink text-xs">+4</div>
                        <div className="text-ink-muted text-base">Energy</div>
                      </div>
                      <div className="bg-bg-sunk pixel-border-tight p-3 flex flex-col items-center gap-1">
                        <PixelIcon name="key" className="w-10 h-10" />
                        <div className="font-display text-ink text-xs">+1</div>
                        <div className="text-ink-muted text-base">Key</div>
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
                    Devnet build. Real on-chain mint lands when the program ships.
                  </p>
                </>
              ) : (
                revealed && (
                  <>
                    <PixelPanel
                      tone="default"
                      title="Saved to collection"
                      titleTone={RARITY_TONE[revealed.rarity]}
                    >
                      <div className="p-5 space-y-3 text-lg">
                        <div className="flex justify-between text-ink-muted">
                          <span>Pixmon</span>
                          <span className="text-ink font-display text-xs">
                            {revealed.name} #{revealed.number}
                          </span>
                        </div>
                        <div className="flex justify-between text-ink-muted">
                          <span>ATK</span>
                          <span className="text-ink tabular-nums">{revealed.baseAtk}</span>
                        </div>
                        <div className="flex justify-between text-ink-muted">
                          <span>DEF</span>
                          <span className="text-ink tabular-nums">{revealed.baseDef}</span>
                        </div>
                      </div>
                    </PixelPanel>

                    <Link href="/collection" className="block">
                      <PixelButton tone="cyan" size="lg" className="w-full">
                        Open collection
                      </PixelButton>
                    </Link>

                    <PixelButton
                      tone="green"
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
