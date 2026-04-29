import { Header } from "@/components/Header";
import { Hero } from "@/components/landing/Hero";
import { ActivityTicker } from "@/components/landing/ActivityTicker";
import { SamplePixmons } from "@/components/landing/SamplePixmons";
import { Features } from "@/components/landing/Features";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Roadmap } from "@/components/landing/Roadmap";
import { FAQ } from "@/components/landing/FAQ";
import { Footer } from "@/components/landing/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <Hero />
        <ActivityTicker />
        <SamplePixmons />
        <Features />
        <HowItWorks />
        <Roadmap />
        <div id="faq">
          <FAQ />
        </div>
      </main>
      <Footer />
    </>
  );
}
