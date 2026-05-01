"use client";

import {
  useRef,
  useState,
  type CSSProperties,
  type MouseEvent,
  type ReactNode,
} from "react";
import { PixelIcon, type IconName } from "@/components/PixelIcon";
import { cn } from "@/lib/cn";
import type { GearSlot, Item, Rarity } from "@/lib/game/types";

type Size = "sm" | "md" | "lg";

type Props = {
  item: Item;
  size?: Size;
  interactive?: boolean;
  selected?: boolean;
  equippedToName?: string | null;
  footer?: ReactNode;
  className?: string;
  onClick?: () => void;
};

const SIZE: Record<Size, { wrap: string; icon: string; pad: string; nameSize: string }> = {
  sm: { wrap: "w-[160px]", icon: "w-16",  pad: "p-3", nameSize: "text-[9px]" },
  md: { wrap: "w-[220px]", icon: "w-24",  pad: "p-4", nameSize: "text-[10px]" },
  lg: { wrap: "w-[280px]", icon: "w-32",  pad: "p-5", nameSize: "text-xs" },
};

const GLOW: Record<Rarity, string> = {
  common: "glass-card-glow-common",
  rare: "glass-card-glow-rare",
  epic: "glass-card-glow-epic",
  legendary: "glass-card-glow-legendary",
};

const CHAMBER: Record<Rarity, string> = {
  common: "glass-chamber",
  rare: "glass-chamber glass-chamber-rare",
  epic: "glass-chamber glass-chamber-epic",
  legendary: "glass-chamber glass-chamber-legendary",
};

const RARITY_LABEL: Record<Rarity, string> = {
  common: "Common",
  rare: "Rare",
  epic: "Epic",
  legendary: "Legendary",
};

const RARITY_PILL: Record<Rarity, string> = {
  common: "bg-white/70 text-ink",
  rare: "bg-pix-cyan text-on-light",
  epic: "bg-sol-purple text-on-dark",
  legendary: "bg-pix-gold text-on-light",
};

const RARITY_RING: Record<Rarity, string> = {
  common: "ring-white/50",
  rare: "ring-pix-cyan/70",
  epic: "ring-sol-purple/70",
  legendary: "ring-pix-gold/80",
};

const SLOT_ICON: Record<GearSlot, IconName> = {
  sword: "sword",
  shield: "shield",
  boot: "boot",
  spark: "spark",
};

const SLOT_LABEL: Record<GearSlot, string> = {
  sword: "Sword",
  shield: "Shield",
  boot: "Boots",
  spark: "Charm",
};

export function GearCard({
  item,
  size = "md",
  interactive = true,
  selected = false,
  equippedToName,
  footer,
  className,
  onClick,
}: Props) {
  const sizing = SIZE[size];
  const ref = useRef<HTMLDivElement | null>(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, mx: 50, my: 50 });

  function handleMove(e: MouseEvent<HTMLDivElement>) {
    if (!interactive) return;
    const node = ref.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setTilt({
      rx: (0.5 - y) * 12,
      ry: (x - 0.5) * 12,
      mx: x * 100,
      my: y * 100,
    });
  }

  function handleLeave() {
    if (!interactive) return;
    setTilt({ rx: 0, ry: 0, mx: 50, my: 50 });
  }

  const tiltStyle: CSSProperties = interactive
    ? {
        transform: `perspective(900px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
        transition: "transform 200ms ease-out",
      }
    : {};

  const isLegendary = item.rarity === "legendary";
  const showSheen = item.rarity === "epic" || isLegendary;

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      onClick={onClick}
      style={tiltStyle}
      className={cn(
        "glass-card glass-lift",
        GLOW[item.rarity],
        sizing.wrap,
        selected && cn("ring-4 ring-offset-2 ring-offset-bg", RARITY_RING[item.rarity]),
        onClick && "cursor-pointer",
        className,
      )}
    >
      <span className="glass-edge" aria-hidden />

      <div className={cn(sizing.pad, "relative")}>
        <div className={cn(CHAMBER[item.rarity], "aspect-[4/3] flex items-center justify-center")}>
          {isLegendary && <span className="glass-prism" aria-hidden />}
          {showSheen && <span className="holo-sheen-band" aria-hidden />}
          <span
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `radial-gradient(circle at ${tilt.mx}% ${tilt.my}%, rgba(255,255,255,0.45), transparent 55%)`,
              mixBlendMode: "overlay",
            }}
            aria-hidden
          />
          <div className="bob relative z-10">
            <PixelIcon
              name={SLOT_ICON[item.slot]}
              className={cn("drop-shadow-[3px_3px_0_rgba(0,0,0,0.4)]", sizing.icon)}
            />
          </div>

          <div className="absolute top-2 left-2 z-20 glass-chip font-display text-[8px] uppercase tracking-widest text-ink px-1.5 py-1 rounded">
            {SLOT_LABEL[item.slot]}
          </div>

          <div className="absolute top-2 right-2 z-20">
            <span
              className={cn(
                "inline-flex items-center gap-1 font-display text-[8px] uppercase tracking-widest px-1.5 py-1 rounded border border-white/60",
                RARITY_PILL[item.rarity],
              )}
            >
              <PixelIcon name={isLegendary ? "crown" : "spark"} className="w-3 h-3" />
              <span>{RARITY_LABEL[item.rarity]}</span>
            </span>
          </div>

          {equippedToName && (
            <div className="absolute bottom-2 left-2 right-2 z-20 glass-chip flex items-center justify-center gap-1 font-display text-[8px] uppercase tracking-widest text-sol-purple px-1.5 py-1 rounded">
              <PixelIcon name="lock" className="w-3 h-3" />
              <span className="truncate">on {equippedToName}</span>
            </div>
          )}
        </div>

        <div className="mt-3">
          <div className={cn("font-display text-ink uppercase truncate", sizing.nameSize)}>
            {item.name}
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2 font-display text-[8px] uppercase tracking-widest">
            <BoostPip label="ATK" flat={item.atkFlat} pct={item.atkPct} tone="text-pix-pink" />
            <BoostPip label="DEF" flat={item.defFlat} pct={item.defPct} tone="text-sol-green-dark" />
          </div>

          {footer && <div className="mt-3">{footer}</div>}
        </div>
      </div>
    </div>
  );
}

function BoostPip({
  label,
  flat,
  pct,
  tone,
}: {
  label: string;
  flat: number;
  pct: number;
  tone: string;
}) {
  const empty = flat === 0 && pct === 0;
  return (
    <div className="glass-chip rounded px-2 py-1.5">
      <div className="text-ink-muted">{label}</div>
      {empty ? (
        <div className="text-ink-dim mt-0.5">—</div>
      ) : (
        <div className={cn("mt-0.5 tabular-nums", tone)}>
          {flat > 0 && <span>+{flat}</span>}
          {flat > 0 && pct > 0 && <span className="text-ink-muted"> · </span>}
          {pct > 0 && <span>+{pct}%</span>}
        </div>
      )}
    </div>
  );
}
