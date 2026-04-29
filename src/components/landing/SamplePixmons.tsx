import { PixelMon } from "@/components/PixelMon";

const NAMES = [
  "Glommer",
  "Sprigly",
  "Volti",
  "Mogworm",
  "Pixet",
  "Crysto",
  "Hexbun",
  "Drifo",
  "Lumix",
  "Boxlet",
  "Vyrr",
  "Embo",
];

const RARITY: Array<"common" | "rare" | "epic" | "legendary"> = [
  "common", "rare", "common", "rare",
  "epic", "common", "rare", "common",
  "legendary", "epic", "rare", "common",
];

const RARITY_BORDER: Record<(typeof RARITY)[number], string> = {
  common: "bg-bg-elevated",
  rare: "bg-pix-cyan/20",
  epic: "bg-sol-purple/20",
  legendary: "bg-pix-gold/30",
};

const RARITY_PILL: Record<(typeof RARITY)[number], string> = {
  common: "text-ink-muted bg-bg-sunk",
  rare: "text-on-light bg-pix-cyan",
  epic: "text-on-dark bg-sol-purple",
  legendary: "text-on-light bg-pix-gold",
};

export function SamplePixmons() {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 py-16">
      <div className="mb-8">
        <div className="inline-block font-display text-[10px] text-sol-purple uppercase tracking-widest px-3 py-2 bg-bg-elevated border-[3px] border-stroke pixel-shadow-sm">
          Specimens
        </div>
        <h2 className="font-display text-2xl sm:text-3xl text-ink mt-6 leading-tight max-w-2xl">
          Every <span className="text-sol-purple">hatch</span> rolls a fresh
          species, palette and stat line.
        </h2>
        <p className="text-ink-muted text-xl mt-3 max-w-xl">
          Common to legendary. Rarity nudges your stat ceiling up.
        </p>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
        {NAMES.map((name, i) => (
          <div
            key={name}
            className={`group ${RARITY_BORDER[RARITY[i]]} pixel-border-tight p-3 transition-transform hover:-translate-y-1 hover:rotate-[-1deg]`}
          >
            <div className="aspect-square flex items-center justify-center">
              <PixelMon
                species={i % 4}
                className="w-16 sm:w-20 lg:w-24 group-hover:scale-105 transition-transform"
              />
            </div>
            <div className="mt-2 font-display text-[9px] text-ink uppercase truncate">
              {name}
            </div>
            <div
              className={`mt-1 inline-block font-display text-[7px] uppercase tracking-widest px-2 py-0.5 border-[2px] border-stroke ${RARITY_PILL[RARITY[i]]}`}
            >
              {RARITY[i]}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
