import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Pixmon — Catch. Evolve. Battle. On Sol.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#FFF6E5",
          backgroundImage:
            "radial-gradient(circle at 15% 0%, rgba(153, 69, 255, 0.18), transparent 45%), radial-gradient(circle at 85% 100%, rgba(20, 241, 149, 0.18), transparent 50%)",
          padding: 64,
          color: "#0B0014",
          fontFamily: "monospace",
          position: "relative",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            fontSize: 24,
            fontWeight: 800,
            letterSpacing: 2,
            textTransform: "uppercase",
          }}
        >
          <div
            style={{
              width: 16,
              height: 16,
              backgroundColor: "#14F195",
              border: "3px solid #000",
            }}
          />
          PIXMON · DEVNET
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginTop: "auto",
            gap: 16,
          }}
        >
          <div
            style={{
              fontSize: 110,
              fontWeight: 900,
              lineHeight: 1.05,
              letterSpacing: -1,
              display: "flex",
              flexWrap: "wrap",
              gap: 24,
            }}
          >
            <span style={{ color: "#9945FF" }}>Catch.</span>
            <span style={{ color: "#00B57A" }}>Evolve.</span>
            <span style={{ color: "#FF2E88" }}>Battle.</span>
          </div>
          <div
            style={{
              fontSize: 36,
              color: "#5B4F7A",
              maxWidth: 900,
              lineHeight: 1.2,
            }}
          >
            On-chain creature battler on Solana. Mint a Pixmon, gear it from the
            gacha, survive the daily arena.
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            bottom: 64,
            right: 64,
            display: "flex",
            alignItems: "center",
            gap: 16,
            fontSize: 24,
            color: "#0B0014",
            backgroundColor: "#FFB700",
            border: "4px solid #000",
            padding: "16px 24px",
            boxShadow: "8px 8px 0 0 #000",
          }}
        >
          PIXMON.VERCEL.APP
        </div>
      </div>
    ),
    { ...size },
  );
}
