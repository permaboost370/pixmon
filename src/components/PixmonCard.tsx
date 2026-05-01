"use client";

import {
  useRef,
  useState,
  type CSSProperties,
  type MouseEvent,
  type ReactNode,
} from "react";
import { PixelMon } from "@/components/PixelMon";
import { PixelIcon, type IconName } from "@/components/PixelIcon";
import { cn } from "@/lib/cn";

export type Rarity = "common" | "rare" | "epic" | "legendary";

type Size = "sm" | "md" | "lg";

type Stats = {
  hp: number;
  atk: number;
  def: number;
  spd: number;
};

type Props = {
  species: number;
  name: string;
  rarity: Rarity;
  number?: number | string;
  stats?: Stats;
  size?: Size;
  interactive?: boolean;
  footer?: ReactNode;
  className?: string;
};

const SIZE: Record<Size, { wrap: string; sprite: string; pad: string; nameSize: string }> = {
  sm: {
    wrap: "w-[180px]",
    sprite: "w-24",
    pad: "p-3",
    nameSize: "text-[10px]",
  },
  md: {
    wrap: "w-[240px]",
    sprite: "w-36",
    pad: "p-4",
    nameSize: "text-xs",
  },
  lg: {
    wrap: "w-[300px]",
    sprite: "w-48",
    pad: "p-5",
    nameSize: "text-sm",
  },
};

const RARITY_LABEL: Record<Rarity, string> = {
  common: "Common",
  rare: "Rare",
  epic: "Epic",
  legendary: "Legendary",
};

const RARITY_PILL: Record<Rarity, string> = {
  common: "bg-bg-sunk text-ink-muted",
  rare: "bg-pix-cyan text-on-light",
  epic: "bg-sol-purple text-on-dark",
  legendary: "bg-pix-gold text-on-light",
};

const RARITY_ICON: Record<Rarity, IconName> = {
  common: "spark",
  rare: "spark",
  epic: "crown",
  legendary: "crown",
};

const STAT_MAX = { hp: 160, atk: 40, def: 30, spd: 32 } as const;

export function PixmonCard({
  species,
  name,
  rarity,
  number,
  stats,
  size = "md",
  interactive = true,
  footer,
  className,
}: Props) {
  const sizing = SIZE[size];
  const ref = useRef<HTMLDivElement | null>(null);
  const [tilt, setTilt] = useState<{ rx: number; ry: number; mx: number; my: number }>({
    rx: 0,
    ry: 0,
    mx: 50,
    my: 50,
  });

  function handleMove(e: MouseEvent<HTMLDivElement>) {
    if (!interactive) return;
    const node = ref.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    const ry = (x - 0.5) * 14;
    const rx = (0.5 - y) * 14;
    setTilt({ rx, ry, mx: x * 100, my: y * 100 });
  }

  function handleLeave() {
    if (!interactive) return;
    setTilt({ rx: 0, ry: 0, mx: 50, my: 50 });
  }

  const tiltStyle: CSSProperties = interactive
    ? {
        transform: `perspective(900px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
        transition: "transform 180ms ease-out",
      }
    : {};

  const surfaceClass = SURFACE[rarity];
  const showSparks = rarity === "epic" || rarity === "legendary";
  const isLegendary = rarity === "legendary";

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={tiltStyle}
      className={cn(
        "relative pixel-border bg-bg-elevated select-none",
        sizing.wrap,
        className,
      )}
    >
      <div
        className={cn(
          "holo-surface relative border-b-[3px] border-stroke",
          surfaceClass,
        )}
      >
        {isLegendary && (
          <div
            className="absolute inset-0 holo-rainbow opacity-70 mix-blend-screen pointer-events-none"
            aria-hidden
          />
        )}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(circle at ${tilt.mx}% ${tilt.my}%, rgba(255,255,255,0.55), transparent 55%)`,
            mixBlendMode: "overlay",
          }}
          aria-hidden
        />
        <div className="holo-grain" aria-hidden />
        <div className="holo-sheen-band" aria-hidden />
        <div className="scanlines absolute inset-0 pointer-events-none" aria-hidden />

        {showSparks && (
          <>
            <span
              className="holo-spark"
              style={{ top: "12%", left: "14%", animationDelay: "0s" }}
              aria-hidden
            />
            <span
              className="holo-spark"
              style={{ top: "22%", right: "16%", animationDelay: "0.7s" }}
              aria-hidden
            />
            <span
              className="holo-spark"
              style={{ bottom: "20%", left: "20%", animationDelay: "1.4s" }}
              aria-hidden
            />
          </>
        )}

        <div
          className={cn(
            "relative flex items-center justify-center aspect-[4/3]",
          )}
        >
          <div className="bob">
            <PixelMon
              species={species}
              className={cn("drop-shadow-[4px_4px_0_#000]", sizing.sprite)}
            />
          </div>
        </div>

        {number !== undefined && (
          <div className="absolute top-2 left-2 font-display text-[8px] uppercase tracking-widest bg-ink/80 text-on-dark px-1.5 py-1 border-[2px] border-stroke">
            #{number}
          </div>
        )}
        <div className="absolute top-2 right-2">
          <div
            className={cn(
              "inline-flex items-center gap-1 font-display text-[8px] uppercase tracking-widest px-1.5 py-1 border-[2px] border-stroke pixel-shadow-sm",
              RARITY_PILL[rarity],
            )}
          >
            <PixelIcon name={RARITY_ICON[rarity]} className="w-3 h-3" />
            <span>{RARITY_LABEL[rarity]}</span>
          </div>
        </div>
      </div>

      <div className={cn("bg-bg-elevated", sizing.pad)}>
        <div
          className={cn(
            "font-display text-ink uppercase truncate",
            sizing.nameSize,
          )}
        >
          {name}
        </div>

        {stats && (
          <div className="mt-3 grid grid-cols-2 gap-x-3 gap-y-1.5">
            <StatPip label="HP" value={stats.hp} max={STAT_MAX.hp} tone="bg-pix-pink" />
            <StatPip label="ATK" value={stats.atk} max={STAT_MAX.atk} tone="bg-pix-gold" />
            <StatPip label="DEF" value={stats.def} max={STAT_MAX.def} tone="bg-sol-green" />
            <StatPip label="SPD" value={stats.spd} max={STAT_MAX.spd} tone="bg-pix-cyan" />
          </div>
        )}

        {footer && <div className="mt-3">{footer}</div>}
      </div>
    </div>
  );
}

const SURFACE: Record<Rarity, string> = {
  common:
    "bg-[linear-gradient(135deg,_#ffffff_0%,_#fff0d0_100%)]",
  rare:
    "bg-[linear-gradient(135deg,_#e0f7ff_0%,_#5ee7ff_55%,_#9bf0c8_100%)]",
  epic:
    "bg-[linear-gradient(135deg,_#f0d9ff_0%,_#9945ff_55%,_#ff2e88_100%)]",
  legendary:
    "bg-[linear-gradient(135deg,_#fff8e7_0%,_#ffe57a_45%,_#ffb700_100%)]",
};

function StatPip({
  label,
  value,
  max,
  tone,
}: {
  label: string;
  value: number;
  max: number;
  tone: string;
}) {
  const pct = Math.min(100, (value / max) * 100);
  return (
    <div>
      <div className="flex justify-between font-display text-[8px] uppercase tracking-widest text-ink-muted">
        <span>{label}</span>
        <span className="text-ink tabular-nums">{value}</span>
      </div>
      <div className="mt-1 h-1.5 bg-bg-sunk border-[2px] border-stroke">
        <div className={cn("h-full", tone)} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
