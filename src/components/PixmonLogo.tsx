type Props = { className?: string };

export function PixmonLogo({ className }: Props) {
  return (
    <svg
      className={className}
      viewBox="0 0 16 16"
      shapeRendering="crispEdges"
      aria-hidden
    >
      {(() => {
        const _ = "transparent";
        const K = "#000";
        const G = "#14f195";
        const P = "#9945ff";
        const Y = "#ffe57a";
        const W = "#fff8e7";
        const grid = [
          [_, _, _, K, K, K, K, K, K, K, K, _, _, _, _, _],
          [_, _, K, P, P, P, P, P, P, P, P, K, _, _, _, _],
          [_, K, P, P, W, W, P, P, W, W, P, P, K, _, _, _],
          [_, K, P, W, K, K, W, W, K, K, W, P, K, _, _, _],
          [_, K, P, P, W, W, P, P, W, W, P, P, K, _, _, _],
          [_, K, P, P, P, P, P, P, P, P, P, P, K, _, K, _],
          [_, K, P, P, G, G, G, G, G, G, P, P, K, K, P, K],
          [_, K, P, P, G, Y, G, G, Y, G, P, P, K, P, P, K],
          [_, K, P, P, G, G, G, G, G, G, P, P, K, K, P, K],
          [_, _, K, P, P, G, G, G, G, P, P, K, _, _, K, _],
          [_, _, _, K, P, P, P, P, P, P, K, _, _, _, _, _],
          [_, _, _, _, K, K, K, K, K, K, _, _, _, _, _, _],
          [_, _, _, K, P, _, _, _, _, P, K, _, _, _, _, _],
          [_, _, K, P, P, _, _, _, _, P, P, K, _, _, _, _],
          [_, _, K, K, _, _, _, _, _, _, K, K, _, _, _, _],
          [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
        ];
        return grid.flatMap((row, y) =>
          row.map((c, x) =>
            c === "transparent" ? null : (
              <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} fill={c} />
            ),
          ),
        );
      })()}
    </svg>
  );
}
