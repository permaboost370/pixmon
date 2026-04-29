type Props = { className?: string };

export function PixelEgg({ className }: Props) {
  const _ = "transparent";
  const K = "#000";
  const A = "#9945ff";
  const B = "#5ee7ff";
  const C = "#fff8e7";
  const D = "#ffe57a";
  const grid = [
    [_, _, _, _, _, _, K, K, K, K, K, _, _, _, _, _, _],
    [_, _, _, _, K, K, A, A, A, A, A, K, K, _, _, _, _],
    [_, _, _, K, A, A, A, C, C, A, A, A, A, K, _, _, _],
    [_, _, K, A, A, A, C, C, C, C, A, A, A, A, K, _, _],
    [_, K, A, A, A, A, A, A, A, A, A, A, A, A, A, K, _],
    [_, K, A, A, B, B, A, A, A, A, B, B, A, A, A, K, _],
    [K, A, A, B, B, B, B, A, A, B, B, B, B, A, A, A, K],
    [K, A, A, A, B, B, A, A, A, A, B, B, A, A, A, A, K],
    [K, A, A, A, A, A, A, D, D, A, A, A, A, A, A, A, K],
    [K, A, A, B, B, A, D, D, D, D, A, B, B, A, A, A, K],
    [K, A, A, B, B, B, A, D, D, A, B, B, B, A, A, A, K],
    [_, K, A, A, B, A, A, A, A, A, A, B, A, A, A, K, _],
    [_, K, A, A, A, A, A, A, A, A, A, A, A, A, A, K, _],
    [_, _, K, A, A, A, A, A, A, A, A, A, A, A, K, _, _],
    [_, _, _, K, A, A, A, A, A, A, A, A, A, K, _, _, _],
    [_, _, _, _, K, K, A, A, A, A, A, K, K, _, _, _, _],
    [_, _, _, _, _, _, K, K, K, K, K, _, _, _, _, _, _],
  ];
  return (
    <svg
      className={className}
      viewBox="0 0 17 17"
      shapeRendering="crispEdges"
      aria-hidden
    >
      {grid.flatMap((row, y) =>
        row.map((c, x) =>
          c === "transparent" ? null : (
            <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} fill={c} />
          ),
        ),
      )}
    </svg>
  );
}
