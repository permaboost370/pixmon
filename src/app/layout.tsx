import type { Metadata } from "next";
import { Press_Start_2P, VT323 } from "next/font/google";
import "./globals.css";
import { WalletProviders } from "@/components/providers/WalletProviders";
import { MobileNav } from "@/components/MobileNav";
import { BackToTop } from "@/components/BackToTop";

const pressStart = Press_Start_2P({
  variable: "--font-press-start",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const vt323 = VT323({
  variable: "--font-vt323",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://pixmon.vercel.app",
  ),
  title: "Pixmon — Catch. Evolve. Battle. On Sol.",
  description:
    "Pixmon is an on-chain creature battler on Solana. Mint your pixmon, evolve it with energy, gear it up from gacha drops, and survive the daily elimination arena.",
  openGraph: {
    title: "Pixmon — Catch. Evolve. Battle. On Sol.",
    description:
      "On-chain creature battler on Solana. Mint, evolve, gear up, and survive the daily arena.",
    type: "website",
    siteName: "Pixmon",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pixmon — Catch. Evolve. Battle. On Sol.",
    description:
      "On-chain creature battler on Solana. Mint, evolve, gear up, and survive the daily arena.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${pressStart.variable} ${vt323.variable} h-full`}
    >
      <body className="min-h-full flex flex-col">
        <WalletProviders>
          {children}
          <BackToTop />
          <MobileNav />
        </WalletProviders>
      </body>
    </html>
  );
}
