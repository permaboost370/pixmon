import Link from "next/link";
import { PixmonLogo } from "@/components/PixmonLogo";

const COLS: Array<{
  title: string;
  links: Array<{ href: string; label: string; external?: boolean }>;
}> = [
  {
    title: "Game",
    links: [
      { href: "/mint", label: "Mint" },
      { href: "/collection", label: "My Mons" },
      { href: "/gacha", label: "Gacha" },
      { href: "/arena", label: "Arena" },
      { href: "/leaderboard", label: "Leaderboard" },
    ],
  },
  {
    title: "Build",
    links: [
      { href: "https://github.com/permaboost370/pixmon", label: "GitHub", external: true },
      { href: "/#how", label: "How it works" },
      { href: "/#faq", label: "FAQ" },
    ],
  },
  {
    title: "Social",
    links: [
      { href: "#", label: "X / Twitter" },
      { href: "#", label: "Discord" },
      { href: "#", label: "Telegram" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t-[3px] border-stroke bg-bg-elevated">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12">
        <div className="grid sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr] gap-8">
          <div className="flex items-start gap-3">
            <PixmonLogo className="w-10 h-10 shrink-0" />
            <div>
              <div className="font-display text-ink text-sm">PIXMON</div>
              <div className="text-ink-muted text-base mt-1 max-w-xs leading-snug">
                On-chain creature battler. Catch, evolve, gear up, survive.
                Built on Solana.
              </div>
              <div className="font-display text-[8px] text-ink-dim uppercase mt-3">
                v0.0.2 · devnet
              </div>
            </div>
          </div>

          {COLS.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <div className="font-display text-[9px] text-ink uppercase tracking-widest mb-3">
                {col.title}
              </div>
              <ul className="space-y-2">
                {col.links.map((l) => (
                  <li key={l.label}>
                    {l.external ? (
                      <a
                        href={l.href}
                        target="_blank"
                        rel="noopener"
                        className="text-ink-muted hover:text-sol-purple text-lg transition-colors"
                      >
                        {l.label} ↗
                      </a>
                    ) : (
                      <Link
                        href={l.href}
                        className="text-ink-muted hover:text-sol-purple text-lg transition-colors"
                      >
                        {l.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-10 pt-6 border-t-[3px] border-stroke flex flex-wrap items-center justify-between gap-3 text-base">
          <span className="text-ink-dim">
            © Pixmon. All on-chain assets owned by their respective wallets.
          </span>
          <span className="font-display text-[8px] text-ink-dim uppercase">
            Made with ✦ pixels and SOL
          </span>
        </div>
      </div>
    </footer>
  );
}
