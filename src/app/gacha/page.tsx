"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useWallet } from "@solana/wallet-adapter-react";

import { Header } from "@/components/Header";
import { Footer } from "@/components/landing/Footer";
import { PixelPanel } from "@/components/ui/PixelPanel";
import { PixelButton } from "@/components/ui/PixelButton";
import { PixelIcon } from "@/components/PixelIcon";
import { GearCard } from "@/components/GearCard";
import { usePixelWalletModal } from "@/components/providers/PixelWalletModalProvider";
import { useGame } from "@/lib/game/store";
import type { Item } from "@/lib/game/types";

type Phase = "idle" | "rolling" | "revealed";

export default function GachaPage() {
  const { connected } = useWallet();
  const { open: openWallet } = usePixelWalletModal();
  const { state, rollGacha } = useGame();
  const [phase, setPhase] = useState<Phase>("idle");
  const [reveal, setReveal] = useState<Item | null>(null);

  function handleRoll() {
    if (!connected) {
      openWallet();
      return;
    }
    if (state.keys <= 0) return;
    setPhase("rolling");
    setReveal(null);
    setTimeout(() => {
      const item = rollGacha();
      if (!item) {
        setPhase("idle");
        return;
      }
      setReveal(item);
      setPhase("revealed");
    }, 2200);
  }

  function rollAgain() {
    setReveal(null);
    setPhase("idle");
  }

  return (
    <>
      <Header />
      <main className="flex-1">
        <section className="mx-auto max-w-5xl px-4 sm:px-6 py-12 sm:py-16">
          <div className="mb-10">
            <div className="inline-block font-display text-[10px] text-pix-pink uppercase tracking-widest px-3 py-2 bg-bg-elevated border-[3px] border-stroke pixel-shadow-sm">
              Gacha
            </div>
            <h1 className="font-display text-2xl sm:text-3xl text-ink mt-6 leading-tight">
              Spend a key. Win <span className="text-pix-pink">gear</span>.
            </h1>
            <p className="text-ink-muted text-xl mt-3 max-w-xl">
              Common to legendary equipment. Higher rarity, bigger boost.
            </p>
          </div>

          {!connected ? (
            <ConnectGate onConnect={openWallet} />
          ) : !state.hydrated ? (
            <div className="font-display text-sm text-ink-muted py-20 text-center">
              Loading…
            </div>
          ) : (
            <>
              <div className="grid lg:grid-cols-[1fr_auto] gap-8 items-start">
                <PixelPanel tone="default" title="Roll" titleTone="pink">
                  <div className="p-8 sm:p-12 flex items-center justify-center min-h-[420px] relative">
                    <AnimatePresence mode="wait">
                      {phase === "idle" && (
                        <motion.div
                          key="idle"
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          className="flex flex-col items-center gap-6"
                        >
                          <div className="bob bg-bg-sunk pixel-border w-40 h-40 flex items-center justify-center">
                            <PixelIcon name="dice" className="w-28 h-28" />
                          </div>
                          <div className="font-display text-ink text-base text-center">
                            Tap roll to spend 1 key.
                          </div>
                        </motion.div>
                      )}
                      {phase === "rolling" && (
                        <motion.div
                          key="rolling"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="flex flex-col items-center gap-6"
                        >
                          <motion.div
                            animate={{ rotateY: [0, 180, 360, 540, 720] }}
                            transition={{ duration: 2, ease: "easeInOut" }}
                            style={{ transformStyle: "preserve-3d" }}
                            className="w-40 h-56 glass-card glass-card-glow-epic flex items-center justify-center"
                          >
                            <PixelIcon name="dice" className="w-24 h-24" />
                          </motion.div>
                          <div className="font-display text-pix-pink text-sm uppercase tracking-widest blink">
                            ✦ Rolling ✦
                          </div>
                        </motion.div>
                      )}
                      {phase === "revealed" && reveal && (
                        <motion.div
                          key="reveal"
                          initial={{ opacity: 0, rotateY: 90, scale: 0.6 }}
                          animate={{ opacity: 1, rotateY: 0, scale: 1 }}
                          transition={{ type: "spring", stiffness: 180, damping: 18 }}
                          style={{ transformStyle: "preserve-3d" }}
                        >
                          <GearCard item={reveal} size="lg" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </PixelPanel>

                <div className="w-full lg:w-80 space-y-4">
                  <PixelPanel tone="default" title="Inventory" titleTone="cyan">
                    <div className="p-5 grid grid-cols-2 gap-4 text-center">
                      <div className="bg-bg-sunk pixel-border-tight p-3 flex flex-col items-center gap-1">
                        <PixelIcon name="key" className="w-10 h-10" />
                        <div className="font-display text-ink text-xs">{state.keys}</div>
                        <div className="text-ink-muted text-base">Keys</div>
                      </div>
                      <div className="bg-bg-sunk pixel-border-tight p-3 flex flex-col items-center gap-1">
                        <PixelIcon name="box" className="w-10 h-10" />
                        <div className="font-display text-ink text-xs">{state.items.length}</div>
                        <div className="text-ink-muted text-base">Items</div>
                      </div>
                    </div>
                  </PixelPanel>

                  {phase === "revealed" ? (
                    <>
                      <PixelButton
                        tone="green"
                        size="lg"
                        className="w-full"
                        onClick={rollAgain}
                        disabled={state.keys <= 0}
                      >
                        Roll again
                      </PixelButton>
                      <Link href="/collection" className="block">
                        <PixelButton tone="cyan" size="lg" className="w-full">
                          Equip on a Pixmon
                        </PixelButton>
                      </Link>
                    </>
                  ) : (
                    <PixelButton
                      tone="pink"
                      size="lg"
                      className="w-full"
                      onClick={handleRoll}
                      disabled={phase === "rolling" || state.keys <= 0}
                    >
                      {phase === "rolling"
                        ? "Rolling…"
                        : state.keys <= 0
                        ? "No keys"
                        : "Spend 1 key"}
                    </PixelButton>
                  )}

                  <p className="text-ink-dim text-base leading-snug">
                    On chain: 2-step <em>request</em> → <em>claim</em> with verifiable
                    randomness. Rare items have supply caps.
                  </p>
                </div>
              </div>

              <h2 className="font-display text-sm text-ink uppercase tracking-widest mt-12 mb-4">
                Owned items ({state.items.length})
              </h2>
              {state.items.length === 0 ? (
                <PixelPanel tone="default" title="Empty" titleTone="purple">
                  <div className="p-8 text-center text-ink-muted text-xl">
                    Roll the gacha to win equipment.
                  </div>
                </PixelPanel>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center">
                  {state.items.map((it) => {
                    const equippedTo = state.mons.find((m) => m.equippedItemId === it.id);
                    return (
                      <GearCard
                        key={it.id}
                        item={it}
                        equippedToName={
                          equippedTo ? `${equippedTo.name} #${equippedTo.number}` : null
                        }
                      />
                    );
                  })}
                </div>
              )}
            </>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}

function ConnectGate({ onConnect }: { onConnect: () => void }) {
  return (
    <PixelPanel tone="default" title="Wallet required" titleTone="pink">
      <div className="p-10 sm:p-14 text-center space-y-6">
        <div className="mx-auto bg-bg-sunk pixel-border-tight w-24 h-24 flex items-center justify-center">
          <PixelIcon name="lock" className="w-16 h-16" />
        </div>
        <h2 className="font-display text-xl text-ink">Connect to roll the gacha.</h2>
        <PixelButton tone="green" size="lg" onClick={onConnect}>
          Connect wallet
        </PixelButton>
      </div>
    </PixelPanel>
  );
}
