"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { PixelIcon } from "@/components/PixelIcon";

export function BackToTop() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 480);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.button
          type="button"
          aria-label="Back to top"
          onClick={() =>
            window.scrollTo({ top: 0, behavior: "smooth" })
          }
          initial={{ opacity: 0, y: 12, scale: 0.92 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.92 }}
          transition={{ type: "spring", stiffness: 320, damping: 24 }}
          className="fixed right-4 bottom-20 md:bottom-6 z-40 flex items-center gap-2 bg-pix-gold text-on-light px-3 py-2 border-[3px] border-stroke pixel-shadow pixel-press"
          style={{ paddingBottom: "calc(0.5rem + env(safe-area-inset-bottom))" }}
        >
          <PixelIcon name="arrow-up" className="w-4 h-4" />
          <span className="font-display text-[9px] uppercase tracking-wider">
            Top
          </span>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
