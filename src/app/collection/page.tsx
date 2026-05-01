"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useWallet } from "@solana/wallet-adapter-react";

import { Header } from "@/components/Header";
import { Footer } from "@/components/landing/Footer";
import { PixelPanel } from "@/components/ui/PixelPanel";
import { PixelButton } from "@/components/ui/PixelButton";
import { PixelIcon } from "@/components/PixelIcon";
import { PixmonCard } from "@/components/PixmonCard";
import { GearCard } from "@/components/GearCard";
import { usePixelWalletModal } from "@/components/providers/PixelWalletModalProvider";
import { useGame } from "@/lib/game/store";
import type { Item, Mon } from "@/lib/game/types";

export default function CollectionPage() {
  const { connected } = useWallet();
  const { open: openWallet } = usePixelWalletModal();
  const {
    state,
    evolveMon,
    equip,
    unequip,
    lockIn,
    itemById,
    monById,
  } = useGame();

  const [evolveTarget, setEvolveTarget] = useState<Mon | null>(null);
  const [equipTarget, setEquipTarget] = useState<Mon | null>(null);

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
              Evolve, gear up, and lock one in for today&apos;s arena.
            </p>
          </div>

          {!connected ? (
            <ConnectGate onConnect={openWallet} />
          ) : !state.hydrated ? (
            <Loading />
          ) : state.mons.length === 0 ? (
            <EmptyState />
          ) : (
            <>
              <SummaryRow
                energy={state.energy}
                keys={state.keys}
                lockedMon={state.dailyLockedMonId ? monById(state.dailyLockedMonId) ?? null : null}
                prize={state.prizeBalance}
              />

              <h2 className="font-display text-sm text-ink uppercase tracking-widest mt-12 mb-4">
                Pixmons
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center">
                {state.mons.map((m) => {
                  const item = m.equippedItemId ? itemById(m.equippedItemId) ?? null : null;
                  const isLocked = state.dailyLockedMonId === m.id;
                  const canLock = state.dailyLockedMonId === null;
                  return (
                    <PixmonCard
                      key={m.id}
                      species={m.species}
                      name={`${m.name} #${m.number}`}
                      number={m.number}
                      rarity={m.rarity}
                      stats={{
                        atk: m.baseAtk + m.evoBonusAtk + (item?.atkFlat ?? 0),
                        def: m.baseDef + m.evoBonusDef + (item?.defFlat ?? 0),
                      }}
                      evolved={m.evolved}
                      equipped={item ? { name: item.name, slot: item.slot, rarity: item.rarity } : null}
                      footer={
                        <div className="flex flex-wrap gap-2">
                          {!m.evolved && (
                            <SmallBtn
                              tone="purple"
                              onClick={() => setEvolveTarget(m)}
                              disabled={state.energy <= 0}
                            >
                              Evolve
                            </SmallBtn>
                          )}
                          {item ? (
                            <SmallBtn tone="ghost" onClick={() => unequip(m.id)}>
                              Unequip
                            </SmallBtn>
                          ) : (
                            <SmallBtn
                              tone="cyan"
                              onClick={() => setEquipTarget(m)}
                              disabled={state.items.length === 0}
                            >
                              Equip
                            </SmallBtn>
                          )}
                          {isLocked ? (
                            <SmallBtn tone="gold" disabled>
                              Locked in
                            </SmallBtn>
                          ) : canLock ? (
                            <SmallBtn tone="green" onClick={() => lockIn(m.id)}>
                              Lock in
                            </SmallBtn>
                          ) : null}
                        </div>
                      }
                    />
                  );
                })}
              </div>

              <div className="mt-12 flex items-center justify-between gap-4">
                <h2 className="font-display text-sm text-ink uppercase tracking-widest">
                  Items ({state.items.length})
                </h2>
                <Link href="/gacha">
                  <PixelButton tone="pink" size="sm">
                    Roll gacha
                  </PixelButton>
                </Link>
              </div>

              {state.items.length === 0 ? (
                <PixelPanel tone="default" title="Empty inventory" titleTone="pink">
                  <div className="p-8 text-center text-ink-muted text-xl">
                    Roll the gacha to win equipment.
                  </div>
                </PixelPanel>
              ) : (
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center">
                  {state.items.map((it) => {
                    const equippedTo = state.mons.find((m) => m.equippedItemId === it.id);
                    return (
                      <GearCard
                        key={it.id}
                        item={it}
                        equippedToName={equippedTo ? `${equippedTo.name} #${equippedTo.number}` : null}
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

      <EvolveModal
        target={evolveTarget}
        availableEnergy={state.energy}
        onClose={() => setEvolveTarget(null)}
        onConfirm={(energy) => {
          if (!evolveTarget) return;
          evolveMon(evolveTarget.id, energy);
          setEvolveTarget(null);
        }}
      />

      <EquipModal
        target={equipTarget}
        items={state.items}
        onClose={() => setEquipTarget(null)}
        onPick={(itemId) => {
          if (!equipTarget) return;
          equip(equipTarget.id, itemId);
          setEquipTarget(null);
        }}
      />
    </>
  );
}

function Loading() {
  return (
    <div className="font-display text-sm text-ink-muted py-20 text-center">
      Loading collection…
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
        <h2 className="font-display text-xl text-ink">
          Connect to view your collection.
        </h2>
        <p className="text-ink-muted text-xl max-w-md mx-auto leading-snug">
          Your Pixmons live on-chain. Sign in to see what you own.
        </p>
        <PixelButton tone="green" size="lg" onClick={onConnect}>
          Connect wallet
        </PixelButton>
      </div>
    </PixelPanel>
  );
}

function EmptyState() {
  return (
    <PixelPanel tone="default" title="No Pixmons yet" titleTone="cyan">
      <div className="p-10 sm:p-14 text-center space-y-6">
        <div className="mx-auto bg-bg-sunk pixel-border-tight w-24 h-24 flex items-center justify-center">
          <PixelIcon name="egg" className="w-16 h-16" />
        </div>
        <h2 className="font-display text-xl text-ink">Hatch your first one.</h2>
        <Link href="/mint">
          <PixelButton tone="green" size="lg">Mint a Pixmon</PixelButton>
        </Link>
      </div>
    </PixelPanel>
  );
}

function SummaryRow({
  energy,
  keys,
  lockedMon,
  prize,
}: {
  energy: number;
  keys: number;
  lockedMon: Mon | null;
  prize: number;
}) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      <Stat icon="bolt" tone="green" label="Energy" value={energy.toString()} />
      <Stat icon="key" tone="pink" label="Keys" value={keys.toString()} />
      <Stat icon="coin" tone="gold" label="Prize" value={`${prize.toFixed(3)} SOL`} />
      <Stat
        icon="lock"
        tone="purple"
        label="Locked in"
        value={lockedMon ? `${lockedMon.name} #${lockedMon.number}` : "None"}
      />
    </div>
  );
}

function Stat({
  icon,
  tone,
  label,
  value,
}: {
  icon: "bolt" | "key" | "coin" | "lock";
  tone: "green" | "pink" | "gold" | "purple";
  label: string;
  value: string;
}) {
  return (
    <PixelPanel tone="default" title={label} titleTone={tone}>
      <div className="p-4 flex items-center gap-3">
        <div className="bg-bg-sunk pixel-border-tight w-12 h-12 flex items-center justify-center shrink-0">
          <PixelIcon name={icon} className="w-8 h-8" />
        </div>
        <div className="font-display text-ink text-xs truncate">{value}</div>
      </div>
    </PixelPanel>
  );
}

function SmallBtn({
  tone,
  onClick,
  disabled,
  children,
}: {
  tone: "purple" | "green" | "cyan" | "gold" | "ghost";
  onClick?: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  const map = {
    purple: "bg-sol-purple text-on-dark",
    green: "bg-sol-green text-on-light",
    cyan: "bg-pix-cyan text-on-light",
    gold: "bg-pix-gold text-on-light",
    ghost: "bg-bg-sunk text-ink",
  } as const;
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`font-display text-[8px] uppercase tracking-widest px-2 py-1.5 border-[2px] border-stroke pixel-shadow-sm pixel-press disabled:opacity-50 disabled:cursor-not-allowed ${map[tone]}`}
    >
      {children}
    </button>
  );
}

function EvolveModal({
  target,
  availableEnergy,
  onClose,
  onConfirm,
}: {
  target: Mon | null;
  availableEnergy: number;
  onClose: () => void;
  onConfirm: (energy: number) => void;
}) {
  const [energy, setEnergy] = useState(1);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (target) setEnergy(Math.min(4, Math.max(1, availableEnergy)));
  }, [target, availableEnergy]);

  useEffect(() => {
    if (!target) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [target, onClose]);

  const max = Math.min(10, availableEnergy);

  return (
    <AnimatePresence>
      {target && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="absolute inset-0 bg-ink/40 backdrop-blur-sm cursor-default"
          />
          <motion.div
            initial={{ y: 16, opacity: 0, scale: 0.96 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 8, opacity: 0, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 320, damping: 24 }}
            className="relative w-full max-w-md"
          >
            <PixelPanel tone="default" title="Evolve" titleTone="purple">
              <div className="p-5 space-y-5">
                <p className="text-ink-muted text-xl leading-snug">
                  Spend energy on{" "}
                  <span className="text-ink font-display text-xs">
                    {target.name} #{target.number}
                  </span>
                  . Higher spend, bigger random stat bonus. <br />
                  <span className="text-ink-dim">Each Pixmon evolves only once.</span>
                </p>

                <div className="space-y-2">
                  <div className="flex justify-between font-display text-[10px] uppercase tracking-widest text-ink-muted">
                    <span>Energy spent</span>
                    <span className="text-sol-purple text-xs tabular-nums">{energy}</span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={Math.max(1, max)}
                    value={energy}
                    onChange={(e) => setEnergy(Number(e.target.value))}
                    className="w-full accent-sol-purple"
                  />
                  <div className="flex justify-between text-ink-dim text-base">
                    <span>1</span>
                    <span>{max}</span>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <PixelButton tone="ghost" size="md" className="flex-1" onClick={onClose}>
                    Cancel
                  </PixelButton>
                  <PixelButton
                    tone="purple"
                    size="md"
                    className="flex-1"
                    onClick={() => onConfirm(energy)}
                    disabled={availableEnergy < 1}
                  >
                    Evolve
                  </PixelButton>
                </div>
              </div>
            </PixelPanel>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function EquipModal({
  target,
  items,
  onClose,
  onPick,
}: {
  target: Mon | null;
  items: Item[];
  onClose: () => void;
  onPick: (itemId: string) => void;
}) {
  useEffect(() => {
    if (!target) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [target, onClose]);

  return (
    <AnimatePresence>
      {target && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="absolute inset-0 bg-ink/40 backdrop-blur-sm cursor-default"
          />
          <motion.div
            initial={{ y: 16, opacity: 0, scale: 0.96 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 8, opacity: 0, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 320, damping: 24 }}
            className="relative w-full max-w-3xl max-h-[85vh] overflow-y-auto"
          >
            <PixelPanel tone="default" title={`Equip ${target.name} #${target.number}`} titleTone="cyan">
              <div className="p-5">
                {items.length === 0 ? (
                  <div className="text-ink-muted text-xl text-center py-10">
                    No items yet — roll the gacha first.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 justify-items-center">
                    {items.map((it) => (
                      <GearCard
                        key={it.id}
                        item={it}
                        size="sm"
                        onClick={() => onPick(it.id)}
                      />
                    ))}
                  </div>
                )}
                <div className="mt-5 flex justify-end">
                  <PixelButton tone="ghost" size="md" onClick={onClose}>
                    Close
                  </PixelButton>
                </div>
              </div>
            </PixelPanel>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

