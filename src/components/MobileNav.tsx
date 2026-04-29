"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";

const TABS = [
  { href: "/", label: "Home", emoji: "🏠" },
  { href: "/mint", label: "Mint", emoji: "🥚" },
  { href: "/collection", label: "Mons", emoji: "📦" },
  { href: "/arena", label: "Arena", emoji: "⚔️" },
];

export function MobileNav() {
  const pathname = usePathname();
  return (
    <nav
      className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-bg-elevated border-t-[3px] border-stroke"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      aria-label="Primary"
    >
      <ul className="grid grid-cols-4">
        {TABS.map((t) => {
          const active =
            t.href === "/" ? pathname === "/" : pathname.startsWith(t.href);
          return (
            <li key={t.href}>
              <Link
                href={t.href}
                className={cn(
                  "flex flex-col items-center justify-center py-2 gap-0.5 transition-colors min-h-[64px]",
                  active
                    ? "bg-pix-gold text-on-light"
                    : "text-ink-muted hover:text-ink",
                )}
                aria-current={active ? "page" : undefined}
              >
                <span className="text-2xl leading-none" aria-hidden>
                  {t.emoji}
                </span>
                <span className="font-display text-[8px] uppercase tracking-wider">
                  {t.label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
