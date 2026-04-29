import { ComingSoon } from "@/components/ComingSoon";

export const metadata = { title: "Arena · Pixmon" };

export default function Page() {
  return (
    <ComingSoon
      tag="Arena"
      icon="sword"
      title="Daily elimination bracket."
      body="Lock in your equipped Pixmon before the daily reset. Survive the rounds. Top tier splits the prize pool."
    />
  );
}
