"use client";

import { useEffect, useRef, useState } from "react";
import { GATE_EVENT } from "@/lib/gate";

type Connection = { saveData?: boolean };

/**
 * Kapak arka planı için sessiz, döngüsel video.
 * Video yüklenene kadar poster görseli görünür; veri tasarrufu açıksa
 * veya kullanıcı hareket azaltma istediyse video hiç indirilmez.
 */
export default function BackgroundVideo({
  src,
  posterUrl,
  playOnOpen = false,
  className = "",
}: {
  src: string | null;
  posterUrl: string | null;
  /** true ise davetiye açılana kadar oynatmaz. */
  playOnOpen?: boolean;
  className?: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [allowed, setAllowed] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const saveData = (
      navigator as Navigator & { connection?: Connection }
    ).connection?.saveData;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (saveData || reduceMotion) return;
    setAllowed(true);
  }, []);

  useEffect(() => {
    if (!allowed || !playOnOpen) return;

    const start = () => videoRef.current?.play().catch(() => {});
    window.addEventListener(GATE_EVENT, start);
    return () => window.removeEventListener(GATE_EVENT, start);
  }, [allowed, playOnOpen]);

  const showVideo = src && allowed;

  return (
    <div className={`absolute inset-0 overflow-hidden bg-olive-800 ${className}`}>
      {posterUrl && (
        <div
          className={`absolute inset-0 bg-parallax animate-slowZoom transition-opacity duration-1000 ${
            showVideo && ready ? "opacity-0" : "opacity-100"
          }`}
          style={{ backgroundImage: `url(${posterUrl})` }}
        />
      )}

      {showVideo && (
        <video
          ref={videoRef}
          src={src}
          poster={posterUrl ?? undefined}
          muted
          loop
          playsInline
          autoPlay={!playOnOpen}
          preload={playOnOpen ? "none" : "auto"}
          onCanPlay={() => setReady(true)}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
            ready ? "opacity-100" : "opacity-0"
          }`}
        />
      )}
    </div>
  );
}
