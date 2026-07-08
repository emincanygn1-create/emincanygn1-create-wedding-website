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
    <div className="flex justify-center gap-4 sm:gap-8">
      {units.map((unit) => (
        <div key={unit.label} className="flex flex-col items-center">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border border-olive-300 flex items-center justify-center bg-cream">
            <span className="font-display text-2xl sm:text-3xl text-olive-700">
              {String(unit.value).padStart(2, "0")}
            </span>
          </div>
          <span className="eyebrow mt-3 text-olive-500">{unit.label}</span>
        </div>
      ))}
    </div>
  );
}
