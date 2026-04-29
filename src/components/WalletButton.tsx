"use client";

import { useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { usePixelWalletModal } from "@/components/providers/PixelWalletModalProvider";
import { PixelButton } from "@/components/ui/PixelButton";

function shortAddr(addr: string) {
  return `${addr.slice(0, 4)}…${addr.slice(-4)}`;
}

export function WalletButton() {
  const { publicKey, connecting, disconnect, connected } = useWallet();
  const { open } = usePixelWalletModal();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) {
    return (
      <PixelButton tone="cyan" size="sm" disabled>
        Connect
      </PixelButton>
    );
  }

  if (connected && publicKey) {
    return (
      <PixelButton tone="green" size="sm" onClick={() => disconnect()}>
        {shortAddr(publicKey.toBase58())}
      </PixelButton>
    );
  }

  return (
    <PixelButton
      tone="cyan"
      size="sm"
      onClick={open}
      disabled={connecting}
    >
      {connecting ? "Connecting…" : "Connect"}
    </PixelButton>
  );
}
