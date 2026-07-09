"use client";

import { useEffect, useState } from "react";
import type { Dict } from "@/lib/i18n/dictionaries";

function getTimeLeft(targetDate: string) {
  const diff = new Date(targetDate).getTime() - Date.now();
  const clamped = Math.max(diff, 0);
  return {
    days: Math.floor(clamped / (1000 * 60 * 60 * 24)),
    hours: Math.floor((clamped / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((clamped / (1000 * 60)) % 60),
    seconds: Math.floor((clamped / 1000) % 60),
  };
}

/** Her rakam ayrı ayrı, sadece değiştiğinde dönerek yenilenir. */
function Digits({ value, pad = 2 }: { value: number; pad?: number }) {
  const chars = String(value).padStart(pad, "0").split("");

  return (
    <span className="flex justify-center [perspective:600px]">
      {chars.map((char, i) => (
        <span
          key={`${i}-${char}`}
          className="digit-roll font-display text-2xl sm:text-4xl text-olive-700 tabular-nums w-[0.62em] text-center"
        >
          {char}
        </span>
      ))}
    </span>
  );
}

export default function Countdown({
  weddingDate,
  d,
}: {
  weddingDate: string;
  d: Dict;
}) {
  const [time, setTime] = useState(() => getTimeLeft(weddingDate));

  useEffect(() => {
    const timer = setInterval(() => setTime(getTimeLeft(weddingDate)), 1000);
    return () => clearInterval(timer);
  }, [weddingDate]);

  const units = [
    { label: d.countdown.days, value: time.days, pad: time.days > 99 ? 3 : 2 },
    { label: d.countdown.hours, value: time.hours, pad: 2 },
    { label: d.countdown.minutes, value: time.minutes, pad: 2 },
    { label: d.countdown.seconds, value: time.seconds, pad: 2 },
  ];

  return (
    <div className="flex justify-center gap-3 sm:gap-5">
      {units.map((unit) => (
        <div key={unit.label} className="flex flex-col items-center">
          <div className="frame-digit flex h-[78px] w-[72px] items-center justify-center border border-olive-300 bg-white/85 shadow-sm backdrop-blur sm:h-24 sm:w-24">
            <Digits value={unit.value} pad={unit.pad} />
          </div>
          <span className="eyebrow mt-3 text-[10px] text-olive-500">{unit.label}</span>
        </div>
      ))}
    </div>
  );
}
