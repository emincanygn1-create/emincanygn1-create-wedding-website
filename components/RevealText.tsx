"use client";

import { useEffect, useRef, useState } from "react";
import { isGateOpen, onGateOpen } from "@/lib/gate";

/**
 * Metni kelime kelime, sırayla aşağıdan yukarı süzerek açar.
 *
 * `waitForGate` açıkken davetiye kapısı açılmadan animasyon başlamaz —
 * yoksa kapağın arkasındaki yazılar kimse görmeden açılıp bitiyor.
 */
export default function RevealText({
  text,
  className = "",
  as: Tag = "span",
  delay = 0,
  step = 55,
  waitForGate = false,
}: {
  text: string;
  className?: string;
  as?: "h1" | "h2" | "h3" | "p" | "span";
  delay?: number;
  step?: number;
  waitForGate?: boolean;
}) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    let observer: IntersectionObserver | undefined;
    let stopGate: (() => void) | undefined;

    const watch = () => {
      // Öğe zaten ekrandaysa gözlemciyi beklemeden başlat.
      const rect = node.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        setVisible(true);
        return;
      }

      observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer?.disconnect();
          }
        },
        { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
      );
      observer.observe(node);
    };

    if (waitForGate && !isGateOpen()) {
      stopGate = onGateOpen(watch);
    } else {
      watch();
    }

    return () => {
      observer?.disconnect();
      stopGate?.();
    };
  }, [waitForGate]);

  const words = text.split(" ").filter(Boolean);

  return (
    <Tag
      ref={ref as React.RefObject<HTMLHeadingElement>}
      className={className}
      aria-label={text}
    >
      {words.map((word, i) => (
        <span key={`${word}-${i}`} className="word-mask" aria-hidden>
          <span
            className={`word ${visible ? "is-visible" : ""}`}
            style={{ transitionDelay: `${delay + i * step}ms` }}
          >
            {word}
          </span>
          {i < words.length - 1 && <span>&nbsp;</span>}
        </span>
      ))}
    </Tag>
  );
}
