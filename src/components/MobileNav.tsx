"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";
import { PixelIcon, type IconName } from "@/components/PixelIcon";

type Tab = {
  href: string;
  label: string;
  icon: IconName;
  tone: "green" | "purple" | "gold" | "cyan";
};

const TABS: Tab[] = [
  { href: "/", label: "Home", icon: "home", tone: "green" },
  { href: "/mint", label: "Mint", icon: "egg", tone: "purple" },
  { href: "/collection", label: "Mons", icon: "box", tone: "gold" },
  { href: "/arena", label: "Arena", icon: "sword", tone: "cyan" },
];

const ACTIVE: Record<Tab["tone"], string> = {
  green: "bg-sol-green text-on-light",
  purple: "bg-sol-purple text-on-dark",
  gold: "bg-pix-gold text-on-light",
  cyan: "bg-pix-cyan text-on-light",
};

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
                  "flex flex-col items-center justify-center py-2 gap-1 transition-colors min-h-[64px]",
                  active ? ACTIVE[t.tone] : "text-ink-muted hover:text-ink",
                )}
                aria-current={active ? "page" : undefined}
              >
                <PixelIcon name={t.icon} className="w-6 h-6" />
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
