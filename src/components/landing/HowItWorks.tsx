const STEPS = [
  {
    n: "01",
    title: "Hatch",
    body: "Connect a Solana wallet. Mint your first Pixmon — random species, random base stats.",
    accent: "text-sol-purple",
  },
  {
    n: "02",
    title: "Power up",
    body: "Spend Energy to evolve once. Pull Gacha Keys for weapons. Mix flat + % gear for max output.",
    accent: "text-sol-green-dark",
  },
  {
    n: "03",
    title: "Lock in",
    body: "Equip and lock your Pixmon before the daily reset. Forfeit the day if you miss the window.",
    accent: "text-pix-pink",
  },
  {
    n: "04",
    title: "Survive",
    body: "On-chain elimination runs the bracket. Survivors at the threshold tier split the prize pool.",
    accent: "text-pix-cyan",
  },
];

export function HowItWorks() {
  return (
    <section id="how" className="bg-bg-sunk border-y-[3px] border-stroke">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-16">
        <div className="mb-10">
          <div className="inline-block font-display text-[10px] text-pix-pink uppercase tracking-widest px-3 py-2 bg-bg-elevated border-[3px] border-stroke pixel-shadow-sm">
            How to play
          </div>
          <h2 className="font-display text-2xl sm:text-3xl text-ink mt-6 leading-tight">
            From <span className="text-sol-purple">egg</span> to{" "}
            <span className="text-sol-green-dark">payout</span>.
          </h2>
        </div>

        <ol className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {STEPS.map((s) => (
            <li
              key={s.n}
              className="bg-bg-elevated pixel-border p-5 relative"
            >
              <div className={`font-display ${s.accent} text-3xl mb-3`}>
                {s.n}
              </div>
              <div className="font-display text-ink text-sm mb-2 uppercase">
                {s.title}
              </div>
              <p className="text-ink-muted text-lg leading-snug">{s.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
