"use client";

import { useEffect, useMemo, useState } from "react";

/** Kapak üzerinde yavaşça süzülen taç yaprakları. */
export default function Petals({ count = 14 }: { count?: number }) {
  // Rastgele konumlar sunucu ve tarayıcıda farklı olacağı için
  // yaprakları ancak tarayıcıda çiziyoruz.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const petals = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        size: 6 + Math.random() * 9,
        duration: 14 + Math.random() * 14,
        delay: -Math.random() * 25,
        opacity: 0.25 + Math.random() * 0.3,
      })),
    [count]
  );

  if (!mounted) return null;

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {petals.map((petal) => (
        <span
          key={petal.id}
          className="petal"
          style={{
            left: `${petal.left}%`,
            animationDuration: `${petal.duration}s`,
            animationDelay: `${petal.delay}s`,
          }}
        >
          <svg
            width={petal.size}
            height={petal.size * 1.6}
            viewBox="0 0 10 16"
            fill="none"
            style={{ opacity: petal.opacity }}
          >
            <path
              d="M5 0C9 4 10 10 5 16 0 10 1 4 5 0Z"
              fill="currentColor"
              className="text-gold-light"
            />
          </svg>
        </span>
      ))}
    </div>
  );
}
