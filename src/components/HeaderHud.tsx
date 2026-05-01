"use client";

import { useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useGame } from "@/lib/game/store";
import { formatCountdown, nextResetMs } from "@/lib/game/time";
import { PixelIcon } from "@/components/PixelIcon";

export function HeaderHud() {
  const { connected } = useWallet();
  const { state } = useGame();
  const [ms, setMs] = useState(0);
  const [mounted, setMounted] = useState(false);

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    setMounted(true);
    setMs(nextResetMs());
    const id = setInterval(() => setMs(nextResetMs()), 1000);
    return () => clearInterval(id);
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  if (!mounted || !connected || !state.hydrated) return null;

  return (
    <div className="hidden lg:flex items-center gap-2">
      <Chip icon="bolt" label="Energy" value={state.energy.toString()} />
      <Chip icon="key" label="Keys" value={state.keys.toString()} />
      <Chip icon="lock" label="Reset" value={formatCountdown(ms)} mono />
    </div>
  );
}

function Chip({
  icon,
  label,
  value,
  mono,
}: {
  icon: "bolt" | "key" | "lock";
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div
      className="flex items-center gap-2 bg-bg-elevated border-[3px] border-stroke pixel-shadow-sm px-2 py-1.5"
      title={label}
    >
      <PixelIcon name={icon} className="w-4 h-4" />
      <span
        className={`font-display text-[9px] uppercase tracking-wider text-ink ${
          mono ? "tabular-nums" : ""
        }`}
      >
        {value}
      </span>
    </div>
  );
}
