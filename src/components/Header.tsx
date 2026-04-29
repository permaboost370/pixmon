import Link from "next/link";
import { WalletButton } from "@/components/WalletButton";
import { PixmonLogo } from "@/components/PixmonLogo";

const NAV = [
  { href: "/mint", label: "Mint" },
  { href: "/collection", label: "Mons" },
  { href: "/gacha", label: "Gacha" },
  { href: "/arena", label: "Arena" },
];

export function Header() {
  return (
    <header className="relative z-30 border-b-[3px] border-stroke bg-bg-elevated">
      <div className="mx-auto max-w-7xl flex items-center justify-between px-4 sm:px-6 py-3 gap-4">
        <Link href="/" className="flex items-center gap-3 group">
          <PixmonLogo className="w-10 h-10 group-hover:rotate-3 transition-transform" />
          <span className="font-display text-sm sm:text-base text-pix-gold">
            PIXMON
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="font-display text-[10px] uppercase tracking-wider px-3 py-2 text-ink-muted hover:text-pix-gold transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <WalletButton />
      </div>
    </header>
  );
}
