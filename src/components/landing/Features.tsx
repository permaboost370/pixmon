import { PixelPanel } from "@/components/ui/PixelPanel";
import { PixelIcon, type IconName } from "@/components/PixelIcon";

type Feat = {
  tone: "purple" | "green" | "pink" | "cyan";
  icon: IconName;
  title: string;
  body: string;
};

const FEATURES: Feat[] = [
  {
    tone: "purple",
    icon: "egg",
    title: "Mint",
    body: "Buy a fresh Pixmon NFT for 0.05 SOL. Each comes with 4 Energy and 1 Gacha Key. New ones drop at random rarities.",
  },
  {
    tone: "green",
    icon: "bolt",
    title: "Evolve",
    body: "Burn Energy to evolve your Pixmon — once. Stat boosts roll randomly: more energy spent, bigger swing.",
  },
  {
    tone: "pink",
    icon: "dice",
    title: "Gacha",
    body: "Spend Keys to pull weapons, charms and relics. Rare drops grant flat + percent bonuses. Stack them, lose them never.",
  },
  {
    tone: "cyan",
    icon: "sword",
    title: "Arena",
    body: "Daily on-chain elimination. Equip your Pixmon, lock it in before reset, survive the bracket. Top survivors split the pool.",
  },
];

export function Features() {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 py-16">
      <div className="mb-10">
        <div className="inline-block font-display text-[10px] text-sol-green-dark uppercase tracking-widest px-3 py-2 bg-bg-elevated border-[3px] border-stroke pixel-shadow-sm">
          The loop
        </div>
        <h2 className="font-display text-2xl sm:text-3xl text-ink mt-6 max-w-2xl leading-tight">
          Four buttons. <span className="text-pix-pink">One winner</span> per day.
        </h2>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {FEATURES.map((f) => (
          <PixelPanel
            key={f.title}
            tone="default"
            title={f.title}
            titleTone={f.tone}
          >
            <div className="p-5 space-y-4 min-h-[180px]">
              <div className="bg-bg-sunk pixel-border-tight w-16 h-16 flex items-center justify-center">
                <PixelIcon name={f.icon} className="w-10 h-10" />
              </div>
              <p className="text-ink-muted text-lg leading-snug">{f.body}</p>
            </div>
          </PixelPanel>
        ))}
      </div>
    </section>
  );
}
