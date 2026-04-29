const ITEMS = [
  "★ HATCH",
  "✦ EVOLVE",
  "⚡ ENERGY",
  "🗡 EQUIP",
  "🎲 GACHA",
  "👑 SURVIVE",
  "💰 SPLIT THE POT",
  "★ DAILY ARENA",
];

export function Marquee() {
  const doubled = [...ITEMS, ...ITEMS];
  return (
    <div className="relative overflow-hidden bg-pix-gold text-bg border-y-[3px] border-stroke py-2">
      <div className="flex marquee-track whitespace-nowrap font-display text-[10px] uppercase tracking-widest gap-10 pr-10">
        {doubled.map((item, i) => (
          <span key={i} className="shrink-0">
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
