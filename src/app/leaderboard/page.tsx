import { ComingSoon } from "@/components/ComingSoon";

export const metadata = { title: "Leaderboard · Pixmon" };

export default function Page() {
  return (
    <ComingSoon
      tag="Leaderboard"
      emoji="👑"
      title="Hall of survivors."
      body="All-time wins, current streaks, biggest payouts. Updates live from the on-chain bracket."
    />
  );
}
