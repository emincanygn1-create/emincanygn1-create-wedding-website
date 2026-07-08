"use client";

import { useEffect, useMemo, useState } from "react";
import { onGateOpen } from "@/lib/gate";

/** Davetiye açıldığı anda birkaç saniyeliğine düşen kalpler. */
export default function Celebration() {
  const [active, setActive] = useState(false);

  useEffect(() => {
    const stop = onGateOpen(() => {
      setActive(true);
      setTimeout(() => setActive(false), 4200);
    });
    return stop;
  }, []);

  const hearts = useMemo(
    () =>
      Array.from({ length: 26 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        size: 10 + Math.random() * 14,
        duration: 2.6 + Math.random() * 1.8,
        delay: Math.random() * 1.2,
        gold: Math.random() > 0.55,
      })),
    []
  );

  if (!active) return null;

  return (
    <div
      className="celebration pointer-events-none fixed inset-0 z-[85] overflow-hidden"
      aria-hidden
    >
      {hearts.map((heart) => (
        <span
          key={heart.id}
          style={{
            left: `${heart.left}%`,
            animationDuration: `${heart.duration}s`,
            animationDelay: `${heart.delay}s`,
          }}
        >
          <svg
            width={heart.size}
            height={heart.size}
            viewBox="0 0 24 24"
            fill="none"
            className={heart.gold ? "text-gold-light" : "text-cream/70"}
          >
            <path
              d="M12 20s-7-4.6-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.4-7 10-7 10Z"
              fill="currentColor"
            />
          </svg>
        </span>
      ))}
    </div>
  );
}
