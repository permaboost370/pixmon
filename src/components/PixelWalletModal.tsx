"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletReadyState, type Adapter } from "@solana/wallet-adapter-base";
import { usePixelWalletModal } from "@/components/providers/PixelWalletModalProvider";
import { PixelPanel } from "@/components/ui/PixelPanel";
import { PixelButton } from "@/components/ui/PixelButton";

export function PixelWalletModal() {
  const { isOpen, close } = usePixelWalletModal();
  const { wallets, select, connecting } = useWallet();

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, close]);

  const installed = wallets.filter(
    (w) =>
      w.readyState === WalletReadyState.Installed ||
      w.readyState === WalletReadyState.Loadable,
  );
  const others = wallets.filter(
    (w) =>
      w.readyState === WalletReadyState.NotDetected ||
      w.readyState === WalletReadyState.Unsupported,
  );

  function handlePick(adapter: Adapter) {
    select(adapter.name);
    close();
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          <button
            type="button"
            aria-label="Close"
            onClick={close}
            className="absolute inset-0 bg-ink/40 backdrop-blur-sm cursor-default"
          />

          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 320, damping: 24 }}
            className="relative w-full max-w-md"
            role="dialog"
            aria-modal="true"
            aria-labelledby="wallet-modal-title"
          >
            <PixelPanel
              tone="default"
              title="Connect a wallet"
              titleTone="purple"
            >
              <div className="p-5 space-y-5">
                <div className="flex items-start justify-between gap-4">
                  <p
                    id="wallet-modal-title"
                    className="text-ink-muted text-lg leading-snug"
                  >
                    Pick a Solana wallet to start hatching, evolving, and
                    battling.
                  </p>
                  <button
                    onClick={close}
                    aria-label="Close modal"
                    className="font-display text-[10px] bg-bg-sunk text-ink w-8 h-8 border-[3px] border-stroke pixel-shadow-sm pixel-press shrink-0"
                  >
                    ✕
                  </button>
                </div>

                {installed.length > 0 ? (
                  <div className="space-y-2">
                    <SectionLabel>Detected</SectionLabel>
                    <ul className="space-y-2">
                      {installed.map((w) => (
                        <WalletRow
                          key={w.adapter.name}
                          adapter={w.adapter}
                          onPick={handlePick}
                          highlight
                          disabled={connecting}
                        />
                      ))}
                    </ul>
                  </div>
                ) : (
                  <div className="bg-bg-sunk pixel-border-tight p-4 space-y-2">
                    <div className="font-display text-[10px] text-pix-pink uppercase">
                      No wallet detected
                    </div>
                    <p className="text-ink-muted text-base leading-snug">
                      Install Phantom or Solflare to play. They live as a
                      browser extension and a mobile app.
                    </p>
                  </div>
                )}

                {others.length > 0 && (
                  <div className="space-y-2">
                    <SectionLabel>Get a wallet</SectionLabel>
                    <ul className="space-y-2">
                      {others.map((w) => (
                        <WalletRow
                          key={w.adapter.name}
                          adapter={w.adapter}
                          onPick={() =>
                            window.open(w.adapter.url, "_blank", "noopener")
                          }
                          ctaLabel="Get →"
                        />
                      ))}
                    </ul>
                  </div>
                )}

                <div className="pt-2 text-ink-dim text-base">
                  Wallets are non-custodial. Pixmon never sees your seed phrase.
                </div>
              </div>
            </PixelPanel>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="font-display text-[9px] text-ink-muted uppercase tracking-widest px-1">
      {children}
    </div>
  );
}

function WalletRow({
  adapter,
  onPick,
  highlight = false,
  disabled = false,
  ctaLabel,
}: {
  adapter: Adapter;
  onPick: (adapter: Adapter) => void;
  highlight?: boolean;
  disabled?: boolean;
  ctaLabel?: string;
}) {
  return (
    <li>
      <button
        type="button"
        disabled={disabled}
        onClick={() => onPick(adapter)}
        className={`w-full flex items-center gap-3 p-3 text-left border-[3px] border-stroke pixel-shadow-sm pixel-press transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
          highlight
            ? "bg-bg-elevated hover:bg-pix-gold/30"
            : "bg-bg-sunk hover:bg-bg-elevated"
        }`}
      >
        {adapter.icon ? (
          <img
            src={adapter.icon}
            alt=""
            className="w-8 h-8 shrink-0 pixel"
            width={32}
            height={32}
          />
        ) : (
          <div className="w-8 h-8 shrink-0 bg-bg-sunk border-[2px] border-stroke" />
        )}
        <div className="flex-1 min-w-0">
          <div className="font-display text-[10px] text-ink uppercase truncate">
            {adapter.name}
          </div>
          {highlight && (
            <div className="text-ink-muted text-base">Detected · ready</div>
          )}
        </div>
        <span className="font-display text-[9px] text-pix-pink uppercase shrink-0">
          {ctaLabel ?? "Connect"}
        </span>
      </button>
    </li>
  );
}
