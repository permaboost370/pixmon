import { PixelIcon, type IconName } from "@/components/PixelIcon";

type Kind = "ko" | "evo" | "mint" | "drop" | "win";

const EVENTS: Array<{ kind: Kind; text: string }> = [
  { kind: "ko", text: "Crysto #420 KO'd Mogworm #69 in round 3" },
  { kind: "evo", text: "Sprigly #1024 evolved → Sprigly Prime" },
  { kind: "mint", text: "0xSun…44Q hatched Drifo #2188 (epic)" },
  { kind: "drop", text: "Glommer #07 pulled Hexcharm of Lightning" },
  { kind: "ko", text: "Pixet #303 KO'd Volti #88 in finals" },
  { kind: "win", text: "Hexbun #421 banked 0.32 SOL" },
  { kind: "evo", text: "Lumix #51 evolved → Lumix Prime" },
  { kind: "drop", text: "Vyrr #19 pulled Boots of Bounce" },
  { kind: "ko", text: "Embo #777 swept the bracket" },
];

const TONE: Record<Kind, string> = {
  ko: "text-pix-pink",
  evo: "text-sol-green-dark",
  mint: "text-sol-purple",
  drop: "text-pix-gold",
  win: "text-pix-cyan",
};

const ICON: Record<Kind, IconName> = {
  ko: "skull",
  evo: "spark",
  mint: "egg",
  drop: "dice",
  win: "coin",
};

const LABEL: Record<Kind, string> = {
  ko: "ko",
  evo: "evo",
  mint: "mint",
  drop: "drop",
  win: "win",
};

export function ActivityTicker() {
  const doubled = [...EVENTS, ...EVENTS];
  return (
    <div className="relative overflow-hidden bg-bg-elevated border-y-[3px] border-stroke py-3">
      <div className="absolute left-0 top-0 bottom-0 z-10 w-20 bg-gradient-to-r from-bg-elevated to-transparent pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 z-10 w-20 bg-gradient-to-l from-bg-elevated to-transparent pointer-events-none" />

      <div className="flex ticker-track whitespace-nowrap gap-8 pr-8">
        {doubled.map((e, i) => (
          <span
            key={i}
            className="shrink-0 flex items-center gap-2 text-lg"
          >
            <PixelIcon name={ICON[e.kind]} className="w-4 h-4" />
            <span className={`font-display text-[9px] uppercase ${TONE[e.kind]}`}>
              {LABEL[e.kind]}
            </span>
            <span className="text-ink">{e.text}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
