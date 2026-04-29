"use client";

import { useEffect, useState } from "react";
import { PixelPanel } from "@/components/ui/PixelPanel";

function nextResetMs() {
  const now = new Date();
  const next = new Date(now);
  next.setUTCHours(24, 0, 0, 0);
  return next.getTime() - now.getTime();
}

function fmt(ms: number) {
  const total = Math.max(0, Math.floor(ms / 1000));
  const h = String(Math.floor(total / 3600)).padStart(2, "0");
  const m = String(Math.floor((total % 3600) / 60)).padStart(2, "0");
  const s = String(total % 60).padStart(2, "0");
  return `${h}:${m}:${s}`;
}

export function PrizePool() {
  const [ms, setMs] = useState(0);

  useEffect(() => {
    setMs(nextResetMs());
    const id = setInterval(() => setMs(nextResetMs()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 py-12">
      <div className="grid sm:grid-cols-3 gap-6">
        <PixelPanel tone="default" title="Today's prize pool" titleTone="gold">
          <div className="p-6">
            <div className="font-display text-3xl sm:text-4xl text-pix-gold">
              412.<span className="text-ink-muted">37</span>
            </div>
            <div className="text-ink-muted text-lg mt-2">SOL on the line</div>
          </div>
        </PixelPanel>

        <PixelPanel tone="default" title="Next elimination" titleTone="pink">
          <div className="p-6">
            <div className="font-display text-3xl sm:text-4xl text-pix-cyan tabular-nums">
              {fmt(ms)}
            </div>
            <div className="text-ink-muted text-lg mt-2">until lock-in</div>
          </div>
        </PixelPanel>

        <PixelPanel tone="default" title="Mons alive" titleTone="green">
          <div className="p-6">
            <div className="font-display text-3xl sm:text-4xl text-sol-green">
              1,847
            </div>
            <div className="text-ink-muted text-lg mt-2">in the bracket</div>
          </div>
        </PixelPanel>
      </div>
    </section>
  );
}
