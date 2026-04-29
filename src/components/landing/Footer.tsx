import Link from "next/link";
import { PixmonLogo } from "@/components/PixmonLogo";

export function Footer() {
  return (
    <footer className="border-t-[3px] border-stroke bg-bg-elevated">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <PixmonLogo className="w-8 h-8" />
          <div>
            <div className="font-display text-pix-gold text-sm">PIXMON</div>
            <div className="text-ink-muted text-base">
              On-chain creature battler. Built on Solana.
            </div>
          </div>
        </div>

        <nav className="flex flex-wrap gap-1 text-base">
          {[
            { href: "/mint", label: "Mint" },
            { href: "/collection", label: "My Mons" },
            { href: "/gacha", label: "Gacha" },
            { href: "/arena", label: "Arena" },
            { href: "/leaderboard", label: "Leaderboard" },
          ].map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="font-display text-[10px] uppercase tracking-wider px-3 py-2 text-ink-muted hover:text-pix-gold transition-colors"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="font-display text-[9px] text-ink-dim uppercase">
          v0.0.1 · devnet
        </div>
      </div>
    </footer>
  );
}
