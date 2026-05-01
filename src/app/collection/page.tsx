"use client";

import { useMemo } from "react";
import { useWallet } from "@solana/wallet-adapter-react";

import { Header } from "@/components/Header";
import { Footer } from "@/components/landing/Footer";
import { PixelPanel } from "@/components/ui/PixelPanel";
import { PixelButton } from "@/components/ui/PixelButton";
import { PixelIcon } from "@/components/PixelIcon";
import { PixmonCard, type Rarity } from "@/components/PixmonCard";
import { usePixelWalletModal } from "@/components/providers/PixelWalletModalProvider";

type Mon = {
  species: number;
  name: string;
  number: number;
  rarity: Rarity;
  hp: number;
  atk: number;
  def: number;
  spd: number;
  energy: number;
  lockedIn: boolean;
};

const NAMES = [
  "Glommer",
  "Sprigly",
  "Volti",
  "Mogworm",
  "Pixet",
  "Crysto",
  "Hexbun",
  "Lumix",
];

function seededRng(seed: string) {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return () => {
    h ^= h << 13;
    h ^= h >>> 17;
    h ^= h << 5;
    return ((h >>> 0) % 100000) / 100000;
  };
}

function mockCollection(seed: string): Mon[] {
  const rng = seededRng(seed);
  const count = 4 + Math.floor(rng() * 5);
  const mons: Mon[] = [];
  for (let i = 0; i < count; i++) {
    const r = rng();
    const rarity: Rarity =
      r < 0.55 ? "common" : r < 0.85 ? "rare" : r < 0.97 ? "epic" : "legendary";
    const factor =
      rarity === "common" ? 1 : rarity === "rare" ? 1.2 : rarity === "epic" ? 1.5 : 2;
    const roll = (lo: number, hi: number, max: number) =>
      Math.min(max, Math.round((lo + rng() * (hi - lo)) * factor));
    mons.push({
      species: Math.floor(rng() * 4),
      name: NAMES[Math.floor(rng() * NAMES.length)],
      number: Math.floor(rng() * 9999) + 1,
      rarity,
      hp: roll(40, 80, 160),
      atk: roll(8, 18, 40),
      def: roll(5, 14, 30),
      spd: roll(6, 16, 32),
      energy: Math.floor(rng() * 5),
      lockedIn: i === 0,
    });
  }
  return mons;
}

export default function CollectionPage() {
  const { connected, publicKey } = useWallet();
  const { open: openWallet } = usePixelWalletModal();
  const seed = publicKey?.toBase58() ?? "";

  const collection = useMemo(() => (seed ? mockCollection(seed) : []), [seed]);

  const energyTotal = collection.reduce((acc, m) => acc + m.energy, 0);
  const lockedIn = collection.find((m) => m.lockedIn);

  return (
    <>
      <Header />
      <main className="flex-1">
        <section className="mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-16">
          <div className="mb-10">
            <div className="inline-block font-display text-[10px] text-sol-purple uppercase tracking-widest px-3 py-2 bg-bg-elevated border-[3px] border-stroke pixel-shadow-sm">
              Collection
            </div>
            <h1 className="font-display text-2xl sm:text-3xl text-ink mt-6 leading-tight">
              Your <span className="text-sol-purple">Pixmons</span>.
            </h1>
            <p className="text-ink-muted text-xl mt-3 max-w-xl">
              Every hatch, every roll. Lock one in before the daily reset to enter the arena.
            </p>
          </div>

          {!connected ? (
            <PixelPanel tone="default" title="Wallet required" titleTone="pink">
              <div className="p-10 sm:p-14 text-center space-y-6">
                <div className="mx-auto bg-bg-sunk pixel-border-tight w-24 h-24 flex items-center justify-center">
                  <PixelIcon name="lock" className="w-16 h-16" />
                </div>
                <h2 className="font-display text-xl text-ink">
                  Connect to view your collection.
                </h2>
                <p className="text-ink-muted text-xl max-w-md mx-auto leading-snug">
                  Your Pixmons live on-chain. Sign in to see what you own.
                </p>
                <PixelButton tone="green" size="lg" onClick={openWallet}>
                  Connect wallet
                </PixelButton>
              </div>
            </PixelPanel>
          ) : collection.length === 0 ? (
            <PixelPanel tone="default" title="No Pixmons yet" titleTone="cyan">
              <div className="p-10 sm:p-14 text-center space-y-6">
                <div className="mx-auto bg-bg-sunk pixel-border-tight w-24 h-24 flex items-center justify-center">
                  <PixelIcon name="egg" className="w-16 h-16" />
                </div>
                <h2 className="font-display text-xl text-ink">
                  Hatch your first one.
                </h2>
                <a href="/mint">
                  <PixelButton tone="green" size="lg">
                    Mint a Pixmon
                  </PixelButton>
                </a>
              </div>
            </PixelPanel>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
                <SummaryStat
                  icon="box"
                  label="Owned"
                  value={collection.length.toString()}
                  tone="purple"
                />
                <SummaryStat
                  icon="bolt"
                  label="Energy"
                  value={energyTotal.toString()}
                  tone="green"
                />
                <SummaryStat
                  icon="lock"
                  label="Locked in"
                  value={lockedIn ? `${lockedIn.name} #${lockedIn.number}` : "None"}
                  tone="gold"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6 justify-items-center">
                {collection.map((m, i) => (
                  <PixmonCard
                    key={`${m.name}-${m.number}-${i}`}
                    species={m.species}
                    name={`${m.name} #${m.number}`}
                    number={m.number}
                    rarity={m.rarity}
                    stats={{ hp: m.hp, atk: m.atk, def: m.def, spd: m.spd }}
                    size="md"
                    footer={
                      <div className="flex items-center justify-between gap-2">
                        <div className="inline-flex items-center gap-1 font-display text-[8px] uppercase tracking-widest text-ink-muted">
                          <PixelIcon name="bolt" className="w-3 h-3" />
                          <span className="text-ink">{m.energy}</span>
                          <span>/4</span>
                        </div>
                        {m.lockedIn ? (
                          <span className="inline-flex items-center gap-1 font-display text-[8px] uppercase tracking-widest bg-pix-gold text-on-light px-1.5 py-1 border-[2px] border-stroke">
                            <PixelIcon name="lock" className="w-3 h-3" />
                            Locked
                          </span>
                        ) : (
                          <span className="font-display text-[8px] uppercase tracking-widest text-ink-dim">
                            Idle
                          </span>
                        )}
                      </div>
                    }
                  />
                ))}
              </div>

              <p className="text-ink-dim text-base mt-8 text-center">
                Devnet preview. Real wallet read lands when the program ships.
              </p>
            </>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}

function SummaryStat({
  icon,
  label,
  value,
  tone,
}: {
  icon: "box" | "bolt" | "lock";
  label: string;
  value: string;
  tone: "purple" | "green" | "gold";
}) {
  const titleTone = { purple: "purple", green: "green", gold: "gold" } as const;
  return (
    <PixelPanel tone="default" title={label} titleTone={titleTone[tone]}>
      <div className="p-5 flex items-center gap-4">
        <div className="bg-bg-sunk pixel-border-tight w-14 h-14 flex items-center justify-center">
          <PixelIcon name={icon} className="w-9 h-9" />
        </div>
        <div className="font-display text-ink text-base truncate">{value}</div>
      </div>
    </PixelPanel>
  );
}
