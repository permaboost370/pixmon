import { PixmonCard } from "@/components/PixmonCard";
import type { Rarity } from "@/lib/game/types";

type Spec = {
  name: string;
  rarity: Rarity;
  species: number;
  number: number;
};

const SPECS: Spec[] = [
  { name: "Glommer",  rarity: "common",    species: 0, number: 142 },
  { name: "Sprigly",  rarity: "rare",      species: 1, number: 318 },
  { name: "Volti",    rarity: "common",    species: 2, number: 27 },
  { name: "Mogworm",  rarity: "rare",      species: 3, number: 590 },
  { name: "Pixet",    rarity: "epic",      species: 0, number: 7 },
  { name: "Crysto",   rarity: "common",    species: 1, number: 244 },
  { name: "Hexbun",   rarity: "rare",      species: 2, number: 81 },
  { name: "Drifo",    rarity: "common",    species: 3, number: 412 },
  { name: "Lumix",    rarity: "legendary", species: 0, number: 1 },
  { name: "Boxlet",   rarity: "epic",      species: 1, number: 19 },
  { name: "Vyrr",     rarity: "rare",      species: 2, number: 207 },
  { name: "Embo",     rarity: "common",    species: 3, number: 333 },
];

export function SamplePixmons() {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 py-16">
      <div className="mb-10">
        <div className="inline-block font-display text-[10px] text-sol-purple uppercase tracking-widest px-3 py-2 bg-bg-elevated border-[3px] border-stroke pixel-shadow-sm">
          Specimens
        </div>
        <h2 className="font-display text-2xl sm:text-3xl text-ink mt-6 leading-tight max-w-2xl">
          Every <span className="text-sol-purple">hatch</span> rolls a fresh
          species, palette and rarity.
        </h2>
        <p className="text-ink-muted text-xl mt-3 max-w-xl">
          Common to legendary. Each lives on-chain as a holographic card.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6 justify-items-center">
        {SPECS.map((s) => (
          <PixmonCard
            key={s.name}
            name={s.name}
            species={s.species}
            rarity={s.rarity}
            number={s.number}
            size="sm"
            className="hover:-translate-y-1 transition-transform"
          />
        ))}
      </div>
    </section>
  );
}
