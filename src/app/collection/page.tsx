import { ComingSoon } from "@/components/ComingSoon";

export const metadata = { title: "My Mons · Pixmon" };

export default function Page() {
  return (
    <ComingSoon
      tag="Collection"
      emoji="📦"
      title="Your Pixmons live here."
      body="Once the program goes live you'll see every Pixmon you own — stats, equipped gear, evolution status, battle history."
    />
  );
}
