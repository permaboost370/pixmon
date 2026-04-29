type Props = { className?: string; species?: number };

const PALETTES = [
  { primary: "#14f195", secondary: "#5ee7ff", accent: "#ffe57a" },
  { primary: "#9945ff", secondary: "#ff2e88", accent: "#ffe57a" },
  { primary: "#ff2e88", secondary: "#ffe57a", accent: "#5ee7ff" },
  { primary: "#5ee7ff", secondary: "#9945ff", accent: "#fff8e7" },
];

const SHAPE = [
  [0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0],
  [0, 0, 1, 2, 2, 2, 2, 2, 1, 0, 0, 0],
  [0, 1, 2, 2, 2, 2, 2, 2, 2, 1, 0, 0],
  [0, 1, 2, 4, 4, 2, 2, 4, 4, 1, 0, 0],
  [0, 1, 2, 4, 1, 2, 2, 1, 4, 1, 0, 0],
  [0, 1, 2, 4, 4, 2, 2, 4, 4, 1, 0, 0],
  [0, 1, 2, 2, 2, 3, 3, 2, 2, 1, 0, 0],
  [1, 2, 2, 2, 3, 3, 3, 3, 2, 2, 1, 0],
  [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0],
  [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0],
  [0, 1, 2, 2, 1, 0, 0, 1, 2, 2, 1, 0],
  [0, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 0],
];

export function PixelMon({ className, species = 0 }: Props) {
  const pal = PALETTES[species % PALETTES.length];
  const colorFor = (n: number) => {
    if (n === 0) return null;
    if (n === 1) return "#000";
    if (n === 2) return pal.primary;
    if (n === 3) return pal.secondary;
    if (n === 4) return pal.accent;
    return null;
  };

  return (
    <svg
      className={className}
      viewBox="0 0 12 12"
      shapeRendering="crispEdges"
      aria-hidden
    >
      {SHAPE.flatMap((row, y) =>
        row.map((c, x) => {
          const fill = colorFor(c);
          return fill ? (
            <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} fill={fill} />
          ) : null;
        }),
      )}
    </svg>
  );
}
