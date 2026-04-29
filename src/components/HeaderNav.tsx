"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";

const NAV = [
  { href: "/mint", label: "Mint" },
  { href: "/collection", label: "Mons" },
  { href: "/gacha", label: "Gacha" },
  { href: "/arena", label: "Arena" },
  { href: "/leaderboard", label: "Top" },
];

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
              active
                ? "bg-pix-gold text-on-light"
                : "bg-bg-elevated text-ink hover:bg-bg-sunk",
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
