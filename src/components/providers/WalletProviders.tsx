"use client";

import { useEffect, useMemo, type ReactNode } from "react";
import { ConnectionProvider, WalletProvider, useWallet } from "@solana/wallet-adapter-react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { clusterApiUrl } from "@solana/web3.js";
import { PixelWalletModalProvider } from "@/components/providers/PixelWalletModalProvider";
import { PixelWalletModal } from "@/components/PixelWalletModal";

const NETWORK = WalletAdapterNetwork.Devnet;

function AutoConnectOnSelect() {
  const { wallet, connect, connected, connecting } = useWallet();
  useEffect(() => {
    if (wallet && !connected && !connecting) {
      connect().catch(() => {});
    }
  }, [wallet, connected, connecting, connect]);
  return null;
}

export function WalletProviders({ children }: { children: ReactNode }) {
  const endpoint = useMemo(
    () => process.env.NEXT_PUBLIC_RPC_URL ?? clusterApiUrl(NETWORK),
    [],
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={[]} autoConnect>
        <PixelWalletModalProvider>
          <AutoConnectOnSelect />
          {children}
          <PixelWalletModal />
        </PixelWalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
