"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useWallet } from "@solana/wallet-adapter-react";

import { Header } from "@/components/Header";
import { Footer } from "@/components/landing/Footer";
import { PixelPanel } from "@/components/ui/PixelPanel";
import { PixelButton } from "@/components/ui/PixelButton";
import { PixelIcon } from "@/components/PixelIcon";
import { PixelMon } from "@/components/PixelMon";
import { PixmonCard } from "@/components/PixmonCard";
import { usePixelWalletModal } from "@/components/providers/PixelWalletModalProvider";
import { useGame } from "@/lib/game/store";
import { formatCountdown, nextResetMs } from "@/lib/game/time";
import type { ArenaRun, BattleRound, Item, Mon } from "@/lib/game/types";

export default function ArenaPage() {
  const { connected } = useWallet();
  const { open: openWallet } = usePixelWalletModal();
  const { state, lockIn, resolveLockedArena, monById, itemById } = useGame();

  const [phase, setPhase] = useState<"idle" | "fighting" | "done">("idle");
  const [activeRun, setActiveRun] = useState<ArenaRun | null>(null);
  const [roundIndex, setRoundIndex] = useState(0);

  const lockedMon = state.dailyLockedMonId ? monById(state.dailyLockedMonId) ?? null : null;
  const lockedItem = lockedMon?.equippedItemId ? itemById(lockedMon.equippedItemId) ?? null : null;
  const todayRun = useMemo(
    () => state.arenaRuns.find((r) => r.day === state.dailyLockedDay),
    [state.arenaRuns, state.dailyLockedDay],
  );

  function startFight() {
    if (!lockedMon) return;
    if (todayRun) {
      setActiveRun(todayRun);
      setRoundIndex(todayRun.result.rounds.length - 1);
      setPhase("done");
      return;
    }
    const run = resolveLockedArena();
    if (!run) return;
    setActiveRun(run);
    setRoundIndex(0);
    setPhase("fighting");
  }

  // walk rounds
  useEffect(() => {
    if (phase !== "fighting" || !activeRun) return;
    const total = activeRun.result.rounds.length;
    if (roundIndex >= total - 1) {
      const t = setTimeout(() => setPhase("done"), 1400);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setRoundIndex((i) => i + 1), 1700);
    return () => clearTimeout(t);
  }, [phase, roundIndex, activeRun]);

  return (
    <>
      <Header />
      <main className="flex-1">
        <section className="mx-auto max-w-6xl px-4 sm:px-6 py-12 sm:py-16">
          <div className="mb-10 flex items-start justify-between gap-6 flex-wrap">
            <div>
              <div className="inline-block font-display text-[10px] text-pix-cyan uppercase tracking-widest px-3 py-2 bg-bg-elevated border-[3px] border-stroke pixel-shadow-sm">
                Arena
              </div>
              <h1 className="font-display text-2xl sm:text-3xl text-ink mt-6 leading-tight">
                Daily <span className="text-pix-cyan">elimination</span>.
              </h1>
              <p className="text-ink-muted text-xl mt-3 max-w-xl">
                Lock in one Pixmon before the reset. Survive 5 rounds. Top tier splits the prize pool.
              </p>
            </div>
            <ResetCountdown />
          </div>

          {!connected ? (
            <ConnectGate onConnect={openWallet} />
          ) : !state.hydrated ? (
            <Loading />
          ) : !lockedMon ? (
            <PickMon />
          ) : phase === "idle" ? (
            <ReadyToFight
              mon={lockedMon}
              item={lockedItem}
              alreadyResolved={!!todayRun}
              onFight={startFight}
            />
          ) : phase === "fighting" && activeRun ? (
            <BattleStage mon={lockedMon} run={activeRun} roundIndex={roundIndex} />
          ) : phase === "done" && activeRun ? (
            <ResultStage
              mon={lockedMon}
              run={activeRun}
              onClose={() => {
                setPhase("idle");
                setActiveRun(null);
              }}
            />
          ) : null}

          <RecentRuns runs={state.arenaRuns} monById={monById} />
        </section>
      </main>
      <Footer />

      <LockInBypass
        canLock={connected && state.hydrated && !state.dailyLockedMonId && state.mons.length > 0}
        mons={state.mons}
        onPick={lockIn}
      />
    </>
  );
}

function Loading() {
  return (
    <div className="font-display text-sm text-ink-muted py-20 text-center">
      Loading…
    </div>
  );
}

function ConnectGate({ onConnect }: { onConnect: () => void }) {
  return (
    <PixelPanel tone="default" title="Wallet required" titleTone="pink">
      <div className="p-10 sm:p-14 text-center space-y-6">
        <div className="mx-auto bg-bg-sunk pixel-border-tight w-24 h-24 flex items-center justify-center">
          <PixelIcon name="lock" className="w-16 h-16" />
        </div>
        <h2 className="font-display text-xl text-ink">Connect to enter the arena.</h2>
        <PixelButton tone="green" size="lg" onClick={onConnect}>
          Connect wallet
        </PixelButton>
      </div>
    </PixelPanel>
  );
}

function PickMon() {
  return (
    <PixelPanel tone="default" title="Lock in a Pixmon" titleTone="cyan">
      <div className="p-10 sm:p-14 text-center space-y-6">
        <div className="mx-auto bg-bg-sunk pixel-border-tight w-24 h-24 flex items-center justify-center">
          <PixelIcon name="sword" className="w-16 h-16" />
        </div>
        <h2 className="font-display text-xl text-ink">Pick your fighter from the collection.</h2>
        <p className="text-ink-muted text-xl max-w-md mx-auto leading-snug">
          Equip your best item, evolve if you can, then lock one in. Locked Pixmons can&apos;t be
          changed until the next UTC reset.
        </p>
        <Link href="/collection">
          <PixelButton tone="green" size="lg">Open collection</PixelButton>
        </Link>
      </div>
    </PixelPanel>
  );
}

function ReadyToFight({
  mon,
  item,
  alreadyResolved,
  onFight,
}: {
  mon: Mon;
  item: Item | null;
  alreadyResolved: boolean;
  onFight: () => void;
}) {
  return (
    <div className="grid lg:grid-cols-[auto_1fr] gap-8 items-start">
      <PixmonCard
        species={mon.species}
        name={`${mon.name} #${mon.number}`}
        number={mon.number}
        rarity={mon.rarity}
        stats={{
          atk: mon.baseAtk + mon.evoBonusAtk + (item?.atkFlat ?? 0),
          def: mon.baseDef + mon.evoBonusDef + (item?.defFlat ?? 0),
        }}
        evolved={mon.evolved}
        equipped={
          item ? { name: item.name, slot: item.slot, rarity: item.rarity } : null
        }
        size="lg"
      />

      <div className="space-y-4">
        <PixelPanel tone="default" title="Today's bracket" titleTone="cyan">
          <div className="p-5 space-y-3">
            <p className="text-ink-muted text-xl leading-snug">
              {alreadyResolved
                ? "You already fought today. Replay the rounds."
                : "5 elimination rounds. Win each to advance. Survivors split the prize."}
            </p>
            <div className="grid grid-cols-5 gap-2">
              {[1, 2, 3, 4, 5].map((r) => (
                <div
                  key={r}
                  className="bg-bg-sunk pixel-border-tight aspect-square flex flex-col items-center justify-center font-display text-[10px] text-ink-muted uppercase"
                >
                  R{r}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-5 gap-2 text-center font-display text-[8px] text-ink-muted uppercase tracking-widest">
              <span>—</span>
              <span>0.01</span>
              <span>0.04</span>
              <span>0.12</span>
              <span className="text-pix-gold">0.45</span>
            </div>
          </div>
        </PixelPanel>

        <PixelButton
          tone="cyan"
          size="lg"
          className="w-full"
          onClick={onFight}
        >
          {alreadyResolved ? "Replay battle" : "Fight now"}
        </PixelButton>

        <p className="text-ink-dim text-base leading-snug">
          Demo: battles run on click. On chain, the daily bracket resolves at the reset.
        </p>
      </div>
    </div>
  );
}

function BattleStage({
  mon,
  run,
  roundIndex,
}: {
  mon: Mon;
  run: ArenaRun;
  roundIndex: number;
}) {
  const round: BattleRound = run.result.rounds[roundIndex];
  if (!round) return null;
  return (
    <PixelPanel
      tone="default"
      title={`Round ${round.round} · ${round.outcome === "win" ? "WIN" : "DOWN"}`}
      titleTone={round.outcome === "win" ? "green" : "pink"}
    >
      <div className="p-6 sm:p-10">
        <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] gap-6 items-center">
          <Combatant
            species={mon.species}
            name={`${mon.name} #${mon.number}`}
            rarity={mon.rarity}
            hp={round.yourHp}
            maxHp={Math.max(round.yourHp, 1)}
            damage={round.opponentDamage}
            side="left"
          />

          <motion.div
            key={`vs-${round.round}`}
            initial={{ scale: 0.4, opacity: 0 }}
            animate={{ scale: 1.1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 240, damping: 14 }}
            className="font-display text-2xl text-pix-pink uppercase tracking-widest text-center"
          >
            VS
          </motion.div>

          <Combatant
            species={round.opponentSpecies}
            name={round.opponentName}
            rarity={round.opponentRarity}
            hp={round.opponentHp}
            maxHp={Math.max(round.opponentHp, 1)}
            damage={round.yourDamage}
            side="right"
          />
        </div>

        <div className="mt-8 flex justify-center gap-2">
          {run.result.rounds.map((r, i) => (
            <div
              key={r.round}
              className={`w-3 h-3 border-[2px] border-stroke ${
                i === roundIndex
                  ? "bg-pix-cyan"
                  : i < roundIndex
                  ? r.outcome === "win"
                    ? "bg-sol-green"
                    : "bg-pix-red"
                  : "bg-bg-sunk"
              }`}
            />
          ))}
        </div>
      </div>
    </PixelPanel>
  );
}

function Combatant({
  species,
  name,
  rarity,
  hp,
  maxHp,
  damage,
  side,
}: {
  species: number;
  name: string;
  rarity: import("@/lib/game/types").Rarity;
  hp: number;
  maxHp: number;
  damage: number;
  side: "left" | "right";
}) {
  const pct = Math.max(0, (hp / maxHp) * 100);
  const tonePill: Record<typeof rarity, string> = {
    common: "bg-white/70 text-ink",
    rare: "bg-pix-cyan text-on-light",
    epic: "bg-sol-purple text-on-dark",
    legendary: "bg-pix-gold text-on-light",
  };
  return (
    <div className={`flex flex-col items-center gap-3 ${side === "right" ? "sm:-scale-x-100" : ""}`}>
      <motion.div
        animate={{ x: side === "left" ? [0, 12, 0] : [0, -12, 0] }}
        transition={{ duration: 0.4 }}
        className="relative"
      >
        <PixelMon species={species} className="w-32 sm:w-40 drop-shadow-[4px_4px_0_#000]" />
        <AnimatePresence>
          {damage > 0 && (
            <motion.div
              key={`dmg-${damage}-${hp}`}
              initial={{ opacity: 0, y: 0, scale: 0.6 }}
              animate={{ opacity: 1, y: -28, scale: 1 }}
              exit={{ opacity: 0, y: -40 }}
              transition={{ duration: 0.6 }}
              className={`absolute top-0 left-1/2 -translate-x-1/2 font-display text-lg ${
                side === "left" ? "text-pix-red" : "text-sol-green-dark"
              } ${side === "right" ? "sm:-scale-x-100" : ""}`}
            >
              -{damage}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <div className={`w-full max-w-[200px] ${side === "right" ? "sm:-scale-x-100" : ""}`}>
        <div className="font-display text-[9px] uppercase tracking-widest text-ink truncate text-center">
          {name}
        </div>
        <div
          className={`mt-1 inline-block w-full text-center font-display text-[8px] uppercase tracking-widest px-1.5 py-0.5 border-[2px] border-stroke ${tonePill[rarity]}`}
        >
          {rarity}
        </div>
        <div className="mt-2 h-3 bg-bg-sunk border-[2px] border-stroke">
          <motion.div
            className="h-full bg-pix-red"
            initial={{ width: "100%" }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>
        <div className="mt-1 font-display text-[8px] uppercase tracking-widest text-ink-muted text-center tabular-nums">
          {hp} HP
        </div>
      </div>
    </div>
  );
}

function ResultStage({
  mon,
  run,
  onClose,
}: {
  mon: Mon;
  run: ArenaRun;
  onClose: () => void;
}) {
  const r = run.result;
  const tier = r.finalRound;
  const won = r.won;
  const tone = won ? "gold" : tier >= 3 ? "purple" : "cyan";

  return (
    <PixelPanel
      tone="default"
      title={won ? `Champion · R${tier}` : `Eliminated · R${tier}`}
      titleTone={tone}
    >
      <div className="p-6 sm:p-10 text-center space-y-6">
        <motion.div
          initial={{ scale: 0.5, opacity: 0, rotate: -10 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 220, damping: 16 }}
          className="mx-auto"
        >
          <PixelIcon
            name={won ? "crown" : tier >= 3 ? "shield" : "skull"}
            className="w-20 h-20"
          />
        </motion.div>

        <div className="space-y-2">
          <h2 className="font-display text-2xl text-ink">
            {won ? "You won the bracket!" : `Out at round ${tier}.`}
          </h2>
          <p className="text-ink-muted text-xl">
            {mon.name} #{mon.number} earned{" "}
            <span className="text-pix-gold font-display text-base">
              {r.prizeSol.toFixed(3)} SOL
            </span>
            .
          </p>
        </div>

        <div className="grid grid-cols-5 gap-2 max-w-md mx-auto">
          {r.rounds.map((rd, i) => (
            <div
              key={i}
              className={`aspect-square pixel-border-tight flex items-center justify-center font-display text-[10px] uppercase ${
                rd.outcome === "win" ? "bg-sol-green text-on-light" : "bg-pix-red text-on-dark"
              }`}
            >
              R{rd.round}
            </div>
          ))}
        </div>

        <div className="flex gap-3 justify-center pt-2">
          <PixelButton tone="ghost" size="md" onClick={onClose}>
            Close
          </PixelButton>
          <Link href="/leaderboard">
            <PixelButton tone="cyan" size="md">View leaderboard</PixelButton>
          </Link>
        </div>
      </div>
    </PixelPanel>
  );
}

function ResetCountdown() {
  const [ms, setMs] = useState(0);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMs(nextResetMs());
    const id = setInterval(() => setMs(nextResetMs()), 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <PixelPanel tone="default" title="Next reset" titleTone="purple">
      <div className="p-4 flex items-center gap-3">
        <PixelIcon name="lock" className="w-8 h-8" />
        <div className="font-display text-lg text-ink tabular-nums">
          {formatCountdown(ms)}
        </div>
      </div>
    </PixelPanel>
  );
}

function RecentRuns({
  runs,
  monById,
}: {
  runs: ArenaRun[];
  monById: (id: string) => Mon | undefined;
}) {
  if (runs.length === 0) return null;
  return (
    <div className="mt-12">
      <h2 className="font-display text-sm text-ink uppercase tracking-widest mb-4">
        Recent runs
      </h2>
      <div className="grid gap-3">
        {runs.slice(0, 8).map((run) => {
          const m = monById(run.monId);
          const won = run.result.won;
          return (
            <div
              key={`${run.day}-${run.monId}`}
              className="bg-bg-elevated pixel-border-tight px-4 py-3 flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3">
                <PixelIcon
                  name={won ? "crown" : run.result.finalRound >= 3 ? "shield" : "skull"}
                  className="w-6 h-6"
                />
                <div>
                  <div className="font-display text-[10px] text-ink uppercase">
                    {m ? `${m.name} #${m.number}` : "Unknown"}
                  </div>
                  <div className="text-ink-muted text-base">
                    Round {run.result.finalRound}
                    {won ? " · champion" : ""}
                  </div>
                </div>
              </div>
              <div className="font-display text-xs text-pix-gold tabular-nums">
                {run.result.prizeSol.toFixed(3)} SOL
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function LockInBypass({
  canLock,
  mons,
  onPick,
}: {
  canLock: boolean;
  mons: Mon[];
  onPick: (id: string) => void;
}) {
  // small floating helper if user is on /arena with no lock-in but has mons
  if (!canLock || mons.length === 0) return null;
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30 hidden md:block">
      <div className="bg-bg-elevated pixel-border-tight px-4 py-3 flex items-center gap-3">
        <span className="font-display text-[9px] uppercase tracking-widest text-ink-muted">
          Quick lock-in:
        </span>
        <select
          className="font-display text-[9px] uppercase tracking-widest bg-bg-sunk border-[2px] border-stroke px-2 py-1"
          defaultValue=""
          onChange={(e) => {
            if (e.target.value) onPick(e.target.value);
          }}
        >
          <option value="" disabled>
            Pick a Pixmon
          </option>
          {mons.map((m) => (
            <option key={m.id} value={m.id}>
              {m.name} #{m.number} · {m.rarity}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
