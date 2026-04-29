"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";

type Tone = "purple" | "green" | "pink" | "cyan" | "gold";

const NAV: Array<{ href: string; label: string; tone: Tone }> = [
  { href: "/mint", label: "Mint", tone: "purple" },
  { href: "/collection", label: "Mons", tone: "green" },
  { href: "/gacha", label: "Gacha", tone: "pink" },
  { href: "/arena", label: "Arena", tone: "cyan" },
  { href: "/leaderboard", label: "Top", tone: "gold" },
];

const ACTIVE: Record<Tone, string> = {
  purple: "bg-sol-purple text-on-dark",
  green: "bg-sol-green text-on-light",
  pink: "bg-pix-pink text-on-dark",
  cyan: "bg-pix-cyan text-on-light",
  gold: "bg-pix-gold text-on-light",
};

const HOVER: Record<Tone, string> = {
  purple: "bg-bg-elevated text-ink hover:bg-sol-purple hover:text-on-dark",
  green: "bg-bg-elevated text-ink hover:bg-sol-green hover:text-on-light",
  pink: "bg-bg-elevated text-ink hover:bg-pix-pink hover:text-on-dark",
  cyan: "bg-bg-elevated text-ink hover:bg-pix-cyan hover:text-on-light",
  gold: "bg-bg-elevated text-ink hover:bg-pix-gold hover:text-on-light",
};

export function HeaderNav() {
  const pathname = usePathname();
  return (
    <nav className="hidden md:flex items-center gap-2">
      {NAV.map((item) => {
        const active = pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "font-display text-[9px] uppercase tracking-wider px-3 py-2 border-[3px] border-stroke pixel-shadow-sm pixel-press transition-colors",
              active ? ACTIVE[item.tone] : HOVER[item.tone],
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
