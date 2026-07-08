"use client";

import { useEffect, useRef, useState } from "react";
import type { Dict } from "@/lib/i18n/dictionaries";

export default function MusicPlayer({
  src,
  d,
}: {
  src: string | null;
  d: Dict;
}) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const start = () => {
      const audio = audioRef.current;
      if (!audio) return;
      audio.volume = 0.4;
      audio
        .play()
        .then(() => setPlaying(true))
        .catch(() => setPlaying(false));
    };

    window.addEventListener("wedding:open", start);
    return () => window.removeEventListener("wedding:open", start);
  }, []);

  if (!src) return null;

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      audio.volume = 0.4;
      audio.play().then(() => setPlaying(true)).catch(() => {});
    }
  };

  return (
    <>
      <audio ref={audioRef} src={src} loop preload="none" />
      <button
        onClick={toggle}
        aria-label={playing ? d.music.pause : d.music.play}
        className="fixed bottom-5 left-5 z-40 w-12 h-12 rounded-full bg-olive-700/90 text-cream shadow-lg backdrop-blur flex items-center justify-center hover:bg-olive-800 transition-colors"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          className={playing ? "animate-[spin_5s_linear_infinite]" : ""}
        >
          <path
            d="M9 18V5l10-2v13"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="6.5" cy="18" r="2.5" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="16.5" cy="16" r="2.5" stroke="currentColor" strokeWidth="1.5" />
          {!playing && (
            <path d="m4 4 16 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          )}
        </svg>
      </button>
    </>
  );
}
