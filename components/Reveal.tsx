"use client";

import { useEffect, useRef, useState } from "react";

type Variant = "up" | "down" | "left" | "right" | "zoom" | "fade";

const variantClass: Record<Variant, string> = {
  up: "reveal-up",
  down: "reveal-down",
  left: "reveal-left",
  right: "reveal-right",
  zoom: "reveal-zoom",
  fade: "",
};

export default function Reveal({
  children,
  className = "",
  delay = 0,
  variant = "up",
  soft = false,
  once = true,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  variant?: Variant;
  /** Hafif bulanıklıkla açılsın mı */
  soft?: boolean;
  once?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    let timer: ReturnType<typeof setTimeout> | undefined;

    // Öğe sayfa açılırken zaten ekrandaysa gözlemciyi bekletme.
    const rect = node.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      timer = setTimeout(() => setVisible(true), delay);
      return () => {
        if (timer) clearTimeout(timer);
      };
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          timer = setTimeout(() => setVisible(true), delay);
          if (once) observer.disconnect();
          return;
        }
        if (!once) setVisible(false);
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    observer.observe(node);
    return () => {
      if (timer) clearTimeout(timer);
      observer.disconnect();
    };
  }, [delay, once]);

  return (
    <div
      ref={ref}
      className={`reveal ${variantClass[variant]} ${soft ? "reveal-soft" : ""} ${
        visible ? "reveal-visible" : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}
