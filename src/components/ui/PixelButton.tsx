"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

type Tone = "green" | "pink" | "purple" | "gold" | "cyan" | "ink";
type Size = "sm" | "md" | "lg";

const toneStyle: Record<Tone, string> = {
  green: "bg-sol-green text-bg hover:brightness-110",
  pink: "bg-pix-pink text-ink hover:brightness-110",
  purple: "bg-sol-purple text-ink hover:brightness-110",
  gold: "bg-pix-gold text-bg hover:brightness-110",
  cyan: "bg-pix-cyan text-bg hover:brightness-110",
  ink: "bg-bg-panel text-ink hover:bg-bg-elevated",
};

const sizeStyle: Record<Size, string> = {
  sm: "text-[9px] px-3 py-2",
  md: "text-[10px] px-4 py-3",
  lg: "text-xs px-6 py-4",
};

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  tone?: Tone;
  size?: Size;
  children?: ReactNode;
};

export function PixelButton({
  tone = "green",
  size = "md",
  className,
  children,
  ...rest
}: Props) {
  return (
    <button
      className={cn(
        "font-display uppercase tracking-wider border-[3px] border-stroke pixel-shadow pixel-press cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:brightness-100",
        toneStyle[tone],
        sizeStyle[size],
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
}
