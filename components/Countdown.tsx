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
    { label: d.countdown.days, value: time.days },
    { label: d.countdown.hours, value: time.hours },
    { label: d.countdown.minutes, value: time.minutes },
    { label: d.countdown.seconds, value: time.seconds },
  ];

  return (
    <div className="flex justify-center gap-3 sm:gap-6">
      {units.map((unit) => (
        <div key={unit.label} className="flex flex-col items-center">
          <div className="relative w-[70px] h-[86px] sm:w-24 sm:h-28 rounded-t-full rounded-b-xl border border-olive-300 bg-cream/90 backdrop-blur flex items-center justify-center shadow-sm">
            <span className="absolute inset-1.5 rounded-t-full rounded-b-lg border border-gold/30" />
            <span className="font-display text-2xl sm:text-4xl text-olive-700 tabular-nums">
              {String(unit.value).padStart(2, "0")}
            </span>
          </div>
          <span className="eyebrow mt-3 text-olive-500 text-[10px]">{unit.label}</span>
        </div>
      ))}
    </div>
  );
}
