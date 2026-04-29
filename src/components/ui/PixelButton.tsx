"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

type Tone = "green" | "pink" | "purple" | "gold" | "cyan" | "ink" | "ghost";
type Size = "sm" | "md" | "lg";

const toneStyle: Record<Tone, string> = {
  green: "bg-sol-green text-on-light hover:brightness-105",
  pink: "bg-pix-pink text-on-dark hover:brightness-110",
  purple: "bg-sol-purple text-on-dark hover:brightness-110",
  gold: "bg-pix-gold text-on-light hover:brightness-105",
  cyan: "bg-pix-cyan text-on-light hover:brightness-105",
  ink: "bg-ink text-on-dark hover:brightness-110",
  ghost: "bg-bg-elevated text-ink hover:bg-bg-sunk",
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
