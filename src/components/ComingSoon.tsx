import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/landing/Footer";
import { PixelPanel } from "@/components/ui/PixelPanel";
import { PixelButton } from "@/components/ui/PixelButton";

type Props = {
  tag: string;
  title: string;
  body: string;
  emoji?: string;
};

export function ComingSoon({ tag, title, body, emoji = "🚧" }: Props) {
  return (
    <>
      <Header />
      <main className="flex-1">
        <section className="mx-auto max-w-3xl px-4 sm:px-6 py-20">
          <PixelPanel tone="default" title={tag} titleTone="pink">
            <div className="p-10 sm:p-14 text-center space-y-6">
              <div className="text-6xl">{emoji}</div>
              <h1 className="font-display text-2xl sm:text-3xl text-ink leading-tight">
                {title}
              </h1>
              <p className="text-ink-muted text-xl max-w-md mx-auto leading-snug">
                {body}
              </p>
              <div className="flex flex-wrap gap-4 justify-center pt-2">
                <Link href="/">
                  <PixelButton tone="cyan" size="md">
                    ← Home
                  </PixelButton>
                </Link>
                <Link href="/mint">
                  <PixelButton tone="green" size="md">
                    Mint a Pixmon
                  </PixelButton>
                </Link>
              </div>
            </div>
          </PixelPanel>
        </section>
      </main>
      <Footer />
    </>
  );
}
