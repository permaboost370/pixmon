"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useWallet } from "@solana/wallet-adapter-react";

import { Header } from "@/components/Header";
import { Footer } from "@/components/landing/Footer";
import { PixelPanel } from "@/components/ui/PixelPanel";
import { PixelButton } from "@/components/ui/PixelButton";
import { PixelIcon } from "@/components/PixelIcon";
import { PixelMon } from "@/components/PixelMon";
import { useGame } from "@/lib/game/store";
import { pick, rollInt, seededRng } from "@/lib/game/rng";
import type { Rarity } from "@/lib/game/types";
import { dayIndex } from "@/lib/game/time";
import { cn } from "@/lib/cn";

const NAMES = [
  "Glommer", "Sprigly", "Volti", "Mogworm", "Pixet", "Crysto", "Hexbun", "Drifo",
  "Lumix", "Boxlet", "Vyrr", "Embo", "Klink", "Snip", "Borb", "Fizzle",
  "Mossic", "Tikko", "Zibb", "Flux", "Quark", "Munchy", "Pebble", "Glow",
];

type Row = {
  rank: number;
  walletShort: string;
  monName: string;
  monNumber: number;
  monSpecies: number;
  monRarity: Rarity;
  wins: number;
  prize: number;
  isYou?: boolean;
};

function shortAddr(addr: string) {
  return `${addr.slice(0, 4)}…${addr.slice(-4)}`;
}

function fakeRow(seed: string, rank: number): Row {
  const rng = seededRng(seed);
  const r = rng();
  const rarity: Rarity =
    r < 0.45 ? "rare" : r < 0.8 ? "epic" : r < 0.96 ? "legendary" : "common";
  return {
    rank,
    walletShort: `${seed.slice(0, 4)}…${seed.slice(-4)}`,
    monName: pick(rng, NAMES),
    monNumber: rollInt(rng, 1, 9999),
    monSpecies: rollInt(rng, 0, 3),
    monRarity: rarity,
    wins: Math.max(1, Math.round(60 - rank * 1.2 + rng() * 10)),
    prize: Math.max(0.01, +(2.4 - rank * 0.04 + rng() * 0.2).toFixed(3)),
  };
}

const SEASON_SEED = "season-alpha-1";

function generateLeaderboard(myKey: string | null, myBest: Row | null) {
  const rng = seededRng(SEASON_SEED);
  const fakes: Row[] = [];
  for (let i = 1; i <= 50; i++) {
    const seedTail = Math.floor(rng() * 1e9).toString(36);
    const fakeKey = `${SEASON_SEED}-${i}-${seedTail}`;
    fakes.push(fakeRow(fakeKey, i));
  }
  if (myBest && myKey) {
    // dunk you in based on your wins
    const insertAt = Math.max(
      0,
      fakes.findIndex((r) => r.wins < myBest.wins),
    );
    const me: Row = {
      ...myBest,
      walletShort: shortAddr(myKey),
      isYou: true,
    };
    const merged = [
      ...fakes.slice(0, insertAt),
      me,
      ...fakes.slice(insertAt),
    ].slice(0, 50);
    return merged.map((r, i) => ({ ...r, rank: i + 1 }));
  }
  return fakes;
}

function recentWinners() {
  const rng = seededRng(`recent-${dayIndex()}`);
  const winners: Array<{ name: string; number: number; species: number; rarity: Rarity; prize: number; ago: string }> = [];
  for (let i = 0; i < 6; i++) {
    const r = rng();
    const rarity: Rarity =
      r < 0.45 ? "rare" : r < 0.8 ? "epic" : r < 0.96 ? "legendary" : "common";
    winners.push({
      name: pick(rng, NAMES),
      number: rollInt(rng, 1, 9999),
      species: rollInt(rng, 0, 3),
      rarity,
      prize: +((rng() * 0.4 + 0.05) * (rarity === "legendary" ? 2 : 1)).toFixed(3),
      ago: `${rollInt(rng, 1, 23)}h ago`,
    });
  }
  return winners;
}

export default function LeaderboardPage() {
  const { publicKey, connected } = useWallet();
  const { state, monById } = useGame();

  const myKey = publicKey?.toBase58() ?? null;

  const myBest: Row | null = useMemo(() => {
    if (!connected || state.arenaRuns.length === 0) return null;
    const wins = state.arenaRuns.filter((r) => r.result.won).length;
    const totalPrize = state.arenaRuns.reduce((s, r) => s + r.result.prizeSol, 0);
    const bestRun = [...state.arenaRuns].sort(
      (a, b) => b.result.finalRound - a.result.finalRound,
    )[0];
    const m = bestRun ? monById(bestRun.monId) : undefined;
    if (!m) return null;
    return {
      rank: 0,
      walletShort: shortAddr(myKey ?? ""),
      monName: m.name,
      monNumber: m.number,
      monSpecies: m.species,
      monRarity: m.rarity,
      wins: Math.max(wins, bestRun.result.finalRound),
      prize: +totalPrize.toFixed(3),
    };
  }, [connected, state.arenaRuns, monById, myKey]);

  const rows = useMemo(() => generateLeaderboard(myKey, myBest), [myKey, myBest]);
  const winners = useMemo(() => recentWinners(), []);

  const prizePool = useMemo(() => {
    const rng = seededRng(`pool-${dayIndex()}`);
    return +(40 + rng() * 60).toFixed(2);
  }, []);

  return (
    <>
      <Header />
      <main className="flex-1">
        <section className="mx-auto max-w-6xl px-4 sm:px-6 py-12 sm:py-16">
          <div className="mb-10 flex items-start justify-between gap-6 flex-wrap">
            <div>
              <div className="inline-block font-display text-[10px] text-pix-gold uppercase tracking-widest px-3 py-2 bg-bg-elevated border-[3px] border-stroke pixel-shadow-sm">
                Leaderboard
              </div>
              <h1 className="font-display text-2xl sm:text-3xl text-ink mt-6 leading-tight">
                Season <span className="text-pix-gold">α</span>.
              </h1>
              <p className="text-ink-muted text-xl mt-3 max-w-xl">
                Ranked by survivor count. Top 5 take the lion&apos;s share. New season begins
                when the program ships.
              </p>
            </div>

            <PixelPanel tone="default" title="Today's pool" titleTone="gold">
              <div className="p-4 flex items-center gap-3">
                <PixelIcon name="coin" className="w-8 h-8" />
                <div className="font-display text-lg text-ink tabular-nums">
                  {prizePool} SOL
                </div>
              </div>
            </PixelPanel>
          </div>

          <div className="grid lg:grid-cols-[1fr_320px] gap-8 items-start">
            <PixelPanel tone="default" title="Top 50" titleTone="purple">
              <div className="divide-y-[3px] divide-stroke">
                {rows.map((r) => (
                  <RowItem key={`${r.rank}-${r.walletShort}-${r.monNumber}`} row={r} />
                ))}
              </div>
            </PixelPanel>

            <div className="space-y-4">
              <PixelPanel tone="default" title="Recent winners" titleTone="cyan">
                <div className="divide-y-[3px] divide-stroke">
                  {winners.map((w, i) => (
                    <div key={i} className="px-4 py-3 flex items-center gap-3">
                      <PixelMon species={w.species} className="w-10 h-10" />
                      <div className="flex-1 min-w-0">
                        <div className="font-display text-[10px] text-ink uppercase truncate">
                          {w.name} #{w.number}
                        </div>
                        <div className="text-ink-muted text-base">
                          {w.rarity} · {w.ago}
                        </div>
                      </div>
                      <div className="font-display text-xs text-pix-gold tabular-nums">
                        +{w.prize}
                      </div>
                    </div>
                  ))}
                </div>
              </PixelPanel>

              {!connected ? (
                <PixelPanel tone="default" title="Want a spot?" titleTone="green">
                  <div className="p-5 space-y-3 text-center">
                    <p className="text-ink-muted text-xl leading-snug">
                      Mint a Pixmon, lock in for the arena, climb the board.
                    </p>
                    <Link href="/mint" className="block">
                      <PixelButton tone="green" size="md" className="w-full">
                        Mint a Pixmon
                      </PixelButton>
                    </Link>
                  </div>
                </PixelPanel>
              ) : (
                <PixelPanel tone="default" title="Your standing" titleTone="green">
                  <div className="p-5 space-y-2 text-lg">
                    <div className="flex justify-between text-ink-muted">
                      <span>Pixmons owned</span>
                      <span className="text-ink tabular-nums">{state.mons.length}</span>
                    </div>
                    <div className="flex justify-between text-ink-muted">
                      <span>Arena runs</span>
                      <span className="text-ink tabular-nums">{state.arenaRuns.length}</span>
                    </div>
                    <div className="flex justify-between text-ink-muted">
                      <span>Total prize</span>
                      <span className="text-pix-gold font-display text-xs tabular-nums">
                        {state.prizeBalance.toFixed(3)} SOL
                      </span>
                    </div>
                  </div>
                </PixelPanel>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

function RowItem({ row }: { row: Row }) {
  const tonePill: Record<Rarity, string> = {
    common: "bg-bg-sunk text-ink-muted",
    rare: "bg-pix-cyan text-on-light",
    epic: "bg-sol-purple text-on-dark",
    legendary: "bg-pix-gold text-on-light",
  };
  return (
    <div
      className={cn(
        "px-4 py-3 flex items-center gap-4",
        row.isYou && "bg-sol-green/10",
      )}
    >
      <div
        className={cn(
          "font-display text-base w-10 text-center tabular-nums",
          row.rank === 1
            ? "text-pix-gold"
            : row.rank === 2
            ? "text-pix-cyan"
            : row.rank === 3
            ? "text-pix-pink"
            : "text-ink-muted",
        )}
      >
        {row.rank}
      </div>
      <PixelMon species={row.monSpecies} className="w-10 h-10 shrink-0" />
      <div className="flex-1 min-w-0">
        <div className="font-display text-[10px] text-ink uppercase truncate">
          {row.monName} #{row.monNumber}
          {row.isYou && (
            <span className="ml-2 inline-block bg-sol-green text-on-light text-[8px] px-1.5 py-0.5 border-[2px] border-stroke">
              YOU
            </span>
          )}
        </div>
        <div className="text-ink-muted text-base">{row.walletShort}</div>
      </div>
      <span
        className={cn(
          "hidden sm:inline-block font-display text-[8px] uppercase tracking-widest px-1.5 py-1 border-[2px] border-stroke",
          tonePill[row.monRarity],
        )}
      >
        {row.monRarity}
      </span>
      <div className="text-right shrink-0">
        <div className="font-display text-xs text-ink tabular-nums">{row.wins} W</div>
        <div className="font-display text-[10px] text-pix-gold tabular-nums">
          {row.prize}
        </div>
      </div>
    </div>
  );
}
