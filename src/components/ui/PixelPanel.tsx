import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

type Tone = "default" | "purple" | "green" | "pink" | "gold" | "cyan";

const toneBg: Record<Tone, string> = {
  default: "bg-bg-panel",
  purple: "bg-sol-purple",
  green: "bg-sol-green",
  pink: "bg-pix-pink",
  gold: "bg-pix-gold",
  cyan: "bg-pix-cyan",
};

const toneInk: Record<Tone, string> = {
  default: "text-ink",
  purple: "text-ink",
  green: "text-bg",
  pink: "text-ink",
  gold: "text-bg",
  cyan: "text-bg",
};

type Props = HTMLAttributes<HTMLDivElement> & {
  tone?: Tone;
  title?: string;
  titleTone?: Tone;
  withScanlines?: boolean;
  children?: ReactNode;
};

export function PixelPanel({
  tone = "default",
  title,
  titleTone = "purple",
  withScanlines = false,
  className,
  children,
  ...rest
}: Props) {
  return (
    <div
      className={cn(
        "relative pixel-border",
        toneBg[tone],
        toneInk[tone],
        withScanlines && "scanlines overflow-hidden",
        className,
      )}
      {...rest}
    >
      {title && (
        <div
          className={cn(
            "font-display text-[10px] sm:text-xs px-3 py-2 border-b-[3px] border-stroke uppercase tracking-wider",
            toneBg[titleTone],
            toneInk[titleTone],
          )}
        >
          {title}
        </div>
      )}
      <div className="relative">{children}</div>
    </div>
  );
}
