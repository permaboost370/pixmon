# Pixmon

> Catch. Evolve. Battle. On Sol.

An on-chain creature battler on Solana. Mint a Pixmon, evolve it with Energy, gear it with Gacha drops, lock it in before the daily reset, and survive the elimination bracket to split the prize pool.

> Working name. Subject to change.

## Stack

- **Next.js 16** (App Router) + **React 19**
- **Tailwind 4** + **Press Start 2P** / **VT323** for the retro pixel feel
- **Framer Motion** for the hatch / battle animations
- **Solana Wallet Adapter** + `@solana/web3.js` (devnet by default)
- Pixel sprites generated via the [PixelLab](https://pixellab.ai) MCP

## Status

| Surface         | State                            |
| --------------- | -------------------------------- |
| Landing page    | Built                            |
| Mint page       | Stubbed (simulated rolls)        |
| Collection      | Coming soon                      |
| Gacha           | Coming soon                      |
| Arena           | Coming soon                      |
| Leaderboard     | Coming soon                      |
| Solana program  | Separate repo (in progress)      |

## Run locally

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

## Env

| Var                   | Default                            | Notes                       |
| --------------------- | ---------------------------------- | --------------------------- |
| `NEXT_PUBLIC_RPC_URL` | `clusterApiUrl("devnet")`          | Override for mainnet/Helius |

## Inspiration

Mechanics borrowed from [Unimon V2](https://unimon.gitbook.io/unimon-v2) — re-imagined for Solana. NFT, items, equipment, gacha, daily elimination — all coming on-chain via the separate program.
