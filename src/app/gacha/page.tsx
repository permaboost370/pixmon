import { ComingSoon } from "@/components/ComingSoon";

export const metadata = { title: "Gacha · Pixmon" };

export default function Page() {
  return (
    <ComingSoon
      tag="Gacha"
      icon="dice"
      title="Pull weapons, charms, relics."
      body="Burn a Key, get a random item with weighted rarities. Flat + percent bonuses. Animated reveal incoming."
    />
  );
}
