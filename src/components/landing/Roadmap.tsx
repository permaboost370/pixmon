type Phase = {
  label: string;
  title: string;
  body: string;
  status: "now" | "next" | "later" | "soon";
};

const PHASES: Phase[] = [
  {
    label: "Phase 0",
    title: "Devnet",
    body: "Frontend live. Stub mints. Wallet connect. Sprite pipeline via PixelLab.",
    status: "now",
  },
  {
    label: "Phase 1",
    title: "Testnet",
    body: "Solana program: mint, energy, evolve, gacha, equip. Public testers + bug bounties.",
    status: "next",
  },
  {
    label: "Phase 2",
    title: "Mainnet · Soft launch",
    body: "Real mints, real prize pool, daily eliminations. Capped supply for pioneer wave.",
    status: "soon",
  },
  {
    label: "Phase 3",
    title: "Full game",
    body: "Breeding, alliances, seasonal arenas, leaderboard rewards, mobile-first UX.",
    status: "later",
  },
];

const STATUS_PILL: Record<Phase["status"], string> = {
  now: "bg-sol-green text-on-light",
  next: "bg-pix-cyan text-on-light",
  soon: "bg-pix-gold text-on-light",
  later: "bg-bg-sunk text-ink-muted",
};

const STATUS_LABEL: Record<Phase["status"], string> = {
  now: "Now",
  next: "Next",
  soon: "Soon",
  later: "Later",
};

export function Roadmap() {
  return (
    <section className="bg-bg-sunk border-y-[3px] border-stroke">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-16">
        <div className="mb-10">
          <div className="inline-block font-display text-[10px] text-pix-gold uppercase tracking-widest px-3 py-2 bg-bg-elevated border-[3px] border-stroke pixel-shadow-sm">
            Roadmap
          </div>
          <h2 className="font-display text-2xl sm:text-3xl text-ink mt-6 leading-tight">
            The path from <span className="text-sol-green-dark">cream</span> egg
            to <span className="text-pix-pink">prize pot</span>.
          </h2>
        </div>

        <ol className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {PHASES.map((p) => (
            <li
              key={p.label}
              className="bg-bg-elevated pixel-border p-5 relative"
            >
              <div
                className={`inline-block font-display text-[8px] uppercase tracking-widest px-2 py-1 border-[2px] border-stroke ${STATUS_PILL[p.status]}`}
              >
                {STATUS_LABEL[p.status]}
              </div>
              <div className="font-display text-ink-muted text-[9px] mt-3 uppercase">
                {p.label}
              </div>
              <div className="font-display text-ink text-sm mt-1">
                {p.title}
              </div>
              <p className="text-ink-muted text-lg leading-snug mt-3">
                {p.body}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
