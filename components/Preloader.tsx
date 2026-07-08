"use client";

import { useEffect, useState } from "react";

/**
 * Açılış ekranı: fontlar ve kapak görseli hazırlanırken
 * isimler ve ince bir ilerleme çizgisi görünür.
 */
export default function Preloader({
  brideName,
  groomName,
}: {
  brideName: string;
  groomName: string;
}) {
  const [progress, setProgress] = useState(8);
  const [done, setDone] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const tick = setInterval(() => {
      setProgress((p) => (p >= 90 ? p : p + Math.random() * 12));
    }, 180);

    const finish = () => {
      setProgress(100);
      setTimeout(() => setDone(true), 350);
      setTimeout(() => setHidden(true), 1250);
    };

    if (document.readyState === "complete") {
      setTimeout(finish, 500);
    } else {
      window.addEventListener("load", finish);
    }

    // Ağ çok yavaşsa da sonsuza kadar bekletme.
    const safety = setTimeout(finish, 5000);

    return () => {
      clearInterval(tick);
      clearTimeout(safety);
      window.removeEventListener("load", finish);
    };
  }, []);

  if (hidden) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-olive-900 text-cream transition-opacity duration-700 ${
        done ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
    >
      <p className="font-script text-4xl sm:text-5xl">
        {brideName}
        <span className="mx-3 text-gold-light">&</span>
        {groomName}
      </p>

      <div className="mt-8 h-px w-40 overflow-hidden bg-cream/15">
        <div
          className="preloader-bar"
          style={{ width: `${Math.min(progress, 100)}%` }}
        />
      </div>

      <p className="mt-5 text-[10px] uppercase tracking-[0.35em] text-cream/40 tabular-nums">
        {Math.round(Math.min(progress, 100))}%
      </p>
    </div>
  );
}
