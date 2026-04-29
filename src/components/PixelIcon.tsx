import { cn } from "@/lib/cn";

export type IconName =
  | "bolt"
  | "key"
  | "egg"
  | "dice"
  | "sword"
  | "shield"
  | "crown"
  | "box"
  | "home"
  | "lock"
  | "spark"
  | "heart"
  | "coin"
  | "skull"
  | "boot"
  | "construction"
  | "arrow-up";

const K = "#000";

type IconDef = {
  fill: string;
  altFill?: string;
  grid: string[];
};

const ICONS: Record<IconName, IconDef> = {
  bolt: {
    fill: "#FFB700",
    grid: [
      "............",
      "......aa....",
      ".....aaa....",
      "....aaa.....",
      "...aaaa.....",
      "..aaaaaa....",
      "aaaaaaaaa...",
      ".....aaaa...",
      "....aaaa....",
      "...aaa......",
      "..aaa.......",
      "............",
    ],
  },
  key: {
    fill: "#FFB700",
    altFill: "#FF2E88",
    grid: [
      "............",
      "...aaaaa....",
      "..aa...aa...",
      ".aa.....aa..",
      ".aa..oo.aa..",
      ".aa..oo.aa..",
      ".aa.....aa..",
      "..aa...aa...",
      "...aaaaa....",
      "....aa......",
      "....aa......",
      "....aaaa....",
    ],
  },
  egg: {
    fill: "#9945FF",
    altFill: "#FFFAEC",
    grid: [
      ".....aaa....",
      "....aaaaa...",
      "...aaaaaaa..",
      "..aaaaaaaaa.",
      "..aaooaaaaa.",
      ".aaaooaaaaaa",
      ".aaaaaaaaaaa",
      ".aaaaaooaaaa",
      ".aaaaaooaaaa",
      "..aaaaaaaaa.",
      "..aaaaaaaaa.",
      "...aaaaaaa..",
    ],
  },
  dice: {
    fill: "#FF2E88",
    altFill: "#FFFAEC",
    grid: [
      "............",
      ".aaaaaaaaaa.",
      "aaaaaaaaaaaa",
      "aaooaaaaooaa",
      "aaooaaaaooaa",
      "aaaaaooaaaaa",
      "aaaaaooaaaaa",
      "aaooaaaaooaa",
      "aaooaaaaooaa",
      "aaaaaaaaaaaa",
      ".aaaaaaaaaa.",
      "............",
    ],
  },
  sword: {
    fill: "#06B6D4",
    altFill: "#FFB700",
    grid: [
      ".....aa.....",
      "....aaaa....",
      "....aaaa....",
      "....aaaa....",
      "....aaaa....",
      "....aaaa....",
      "....aaaa....",
      "..oooooooo..",
      "....oooo....",
      "....aaaa....",
      "....aaaa....",
      "...aaaaaa...",
    ],
  },
  shield: {
    fill: "#14F195",
    altFill: "#FFFAEC",
    grid: [
      ".aaaaaaaaaa.",
      "aaaaaaaaaaaa",
      "aaaaaaaaaaaa",
      "aaaaooooaaaa",
      "aaaaoooaaaaa",
      "aaaaooaaaaaa",
      "aaaooooooaaa",
      ".aaaaaaaaaa.",
      "..aaaaaaaa..",
      "...aaaaaa...",
      "....aaaa....",
      ".....aa.....",
    ],
  },
  crown: {
    fill: "#FFB700",
    altFill: "#FF2E88",
    grid: [
      "............",
      "aa........aa",
      "aaa..aa..aaa",
      "aaa.aaaa.aaa",
      "aaaaaaaaaaaa",
      "aaaaaaaaaaaa",
      "aaaaooooaaaa",
      "aaaaoooo aaaa",
      "aaaaaaaaaaaa",
      "aaaaaaaaaaaa",
      "aaaaaaaaaaaa",
      "............",
    ],
  },
  box: {
    fill: "#9945FF",
    altFill: "#FFB700",
    grid: [
      "............",
      ".aaaaaaaaaa.",
      "aaaaaaaaaaaa",
      "aaaaaaaaaaaa",
      "aaooooooooaa",
      "aaaaaaaaaaaa",
      "aaooooooooaa",
      "aaaaaaaaaaaa",
      "aaaa oooo aaaa",
      "aaaaaaaaaaaa",
      "aaaaaaaaaaaa",
      ".aaaaaaaaaa.",
    ],
  },
  home: {
    fill: "#14F195",
    altFill: "#9945FF",
    grid: [
      ".....aa.....",
      "....aaaa....",
      "...aaaaaa...",
      "..aaaaaaaa..",
      ".aaaaaaaaaa.",
      "aaaaaaaaaaaa",
      "aaaaaaaaaaaa",
      "aaaaooooaaaa",
      "aaaaooooaaaa",
      "aaaaooooaaaa",
      "aaaaooooaaaa",
      "aaaaaaaaaaaa",
    ],
  },
  lock: {
    fill: "#FFB700",
    altFill: "#0B0014",
    grid: [
      "............",
      "...aaaaaa...",
      "..aa....aa..",
      "..aa....aa..",
      "..aa....aa..",
      "aaaaaaaaaaaa",
      "aaaaaaaaaaaa",
      "aaaaooooaaaa",
      "aaaaooooaaaa",
      "aaaaooooaaaa",
      "aaaaaaaaaaaa",
      "aaaaaaaaaaaa",
    ],
  },
  spark: {
    fill: "#FFB700",
    altFill: "#FF2E88",
    grid: [
      "............",
      "....oo......",
      "....aa......",
      "....aa......",
      "oo..aa..oo..",
      "aaaaaaaaaa..",
      "aaaaaaaaaa..",
      "oo..aa..oo..",
      "....aa......",
      "....aa......",
      "....oo......",
      "............",
    ],
  },
  heart: {
    fill: "#FF2E88",
    grid: [
      "............",
      "..aaa..aaa..",
      ".aaaaaaaaaa.",
      "aaaaaaaaaaaa",
      "aaaaaaaaaaaa",
      "aaaaaaaaaaaa",
      ".aaaaaaaaaa.",
      "..aaaaaaaa..",
      "...aaaaaa...",
      "....aaaa....",
      ".....aa.....",
      "............",
    ],
  },
  coin: {
    fill: "#FFB700",
    altFill: "#FFFAEC",
    grid: [
      "............",
      "...aaaaaa...",
      "..aaaaaaaa..",
      ".aaaooooaaa.",
      ".aaoo..ooaa.",
      ".aaoo..ooaa.",
      ".aaoo..ooaa.",
      ".aaoo..ooaa.",
      ".aaaooooaaa.",
      "..aaaaaaaa..",
      "...aaaaaa...",
      "............",
    ],
  },
  skull: {
    fill: "#FFFAEC",
    altFill: "#000000",
    grid: [
      "............",
      "..aaaaaaaa..",
      ".aaaaaaaaaa.",
      "aaaaaaaaaaaa",
      "aaooaaaaooaa",
      "aaooaaaaooaa",
      "aaaaaaaaaaaa",
      "aaaooooooaaa",
      ".aaaaaaaaaa.",
      "..a.a.a.a.a.",
      "..a.a.a.a.a.",
      "............",
    ],
  },
  boot: {
    fill: "#9945FF",
    altFill: "#FFB700",
    grid: [
      "............",
      "...aaaaa....",
      "...aaaaa....",
      "...aaaaa....",
      "...aaaaa....",
      "...aaaaa....",
      "...aaaaaaaa.",
      "...aaaaaaaaa",
      "..aaaaaaaaaa",
      ".aaaaaaaaaaa",
      "oooooooooooo",
      "oooooooooooo",
    ],
  },
  construction: {
    fill: "#FFB700",
    altFill: "#0B0014",
    grid: [
      ".....aa.....",
      "....aaaa....",
      "....oooo....",
      "...aaaaaa...",
      "...oooooo...",
      "..aaaaaaaa..",
      "..oooooooo..",
      ".aaaaaaaaaa.",
      ".oooooooooo.",
      "aaaaaaaaaaaa",
      "oooooooooooo",
      "............",
    ],
  },
  "arrow-up": {
    fill: "#0B0014",
    grid: [
      "............",
      ".....aa.....",
      "....aaaa....",
      "...aaaaaa...",
      "..aaaaaaaa..",
      ".aaaaaaaaaa.",
      "aaaaaaaaaaaa",
      "....aaaa....",
      "....aaaa....",
      "....aaaa....",
      "....aaaa....",
      "....aaaa....",
    ],
  },
};

type Props = {
  name: IconName;
  className?: string;
  color?: string;
  altColor?: string;
};

export function PixelIcon({ name, className, color, altColor }: Props) {
  const icon = ICONS[name];
  const fill = color ?? icon.fill;
  const alt = altColor ?? icon.altFill ?? fill;
  return (
    <svg
      className={cn("pixel inline-block align-middle", className)}
      viewBox="0 0 12 12"
      shapeRendering="crispEdges"
      aria-hidden
    >
      {icon.grid.flatMap((row, y) =>
        row.split("").map((c, x) => {
          if (x >= 12) return null;
          if (c === "#") return <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} fill={K} />;
          if (c === "a") return <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} fill={fill} />;
          if (c === "o") return <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} fill={alt} />;
          return null;
        }),
      )}
    </svg>
  );
}
