"use client";

import { useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { PixelButton } from "@/components/ui/PixelButton";

function shortAddr(addr: string) {
  return `${addr.slice(0, 4)}…${addr.slice(-4)}`;
}

export function WalletButton() {
  const { publicKey, connecting, disconnect, connected } = useWallet();
  const { setVisible } = useWalletModal();
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
      onClick={() => setVisible(true)}
      disabled={connecting}
    >
      {connecting ? "…" : "Connect"}
    </PixelButton>
  );
}
