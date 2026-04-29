import Link from "next/link";
import { WalletButton } from "@/components/WalletButton";
import { PixmonLogo } from "@/components/PixmonLogo";
import { HeaderNav } from "@/components/HeaderNav";

export function Header() {
  return (
    <header className="sticky top-0 z-30 border-b-[3px] border-stroke bg-bg-elevated/95 backdrop-blur supports-[backdrop-filter]:bg-bg-elevated/85">
      <div className="mx-auto max-w-7xl flex items-center justify-between px-4 sm:px-6 py-3 gap-4">
        <Link href="/" className="flex items-center gap-3 group">
          <PixmonLogo className="w-10 h-10 group-hover:rotate-3 transition-transform" />
          <span className="font-display text-sm sm:text-base text-ink">
            PIXMON
          </span>
        </Link>

        <HeaderNav />

        <WalletButton />
      </div>
    </header>
  );
}
