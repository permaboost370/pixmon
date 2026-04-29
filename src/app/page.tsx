import { Header } from "@/components/Header";
import { Hero } from "@/components/landing/Hero";
import { Marquee } from "@/components/landing/Marquee";
import { PrizePool } from "@/components/landing/PrizePool";
import { Features } from "@/components/landing/Features";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Footer } from "@/components/landing/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <Hero />
        <Marquee />
        <PrizePool />
        <Features />
        <HowItWorks />
      </main>
      <Footer />
    </>
  );
}
