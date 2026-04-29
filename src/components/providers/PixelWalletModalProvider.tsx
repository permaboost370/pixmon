"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

type Ctx = {
  open: () => void;
  close: () => void;
  isOpen: boolean;
};

const PixelWalletModalCtx = createContext<Ctx | null>(null);

export function PixelWalletModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setOpen] = useState(false);
  return (
    <PixelWalletModalCtx.Provider
      value={{
        open: () => setOpen(true),
        close: () => setOpen(false),
        isOpen,
      }}
    >
      {children}
    </PixelWalletModalCtx.Provider>
  );
}

export function usePixelWalletModal() {
  const ctx = useContext(PixelWalletModalCtx);
  if (!ctx) throw new Error("usePixelWalletModal must be inside provider");
  return ctx;
}
