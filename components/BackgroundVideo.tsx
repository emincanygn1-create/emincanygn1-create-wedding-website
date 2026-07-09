"use client";

import { useEffect, useRef, useState } from "react";
import { GATE_EVENT, isGateOpen } from "@/lib/gate";

type Connection = { saveData?: boolean };

/**
 * Kapak arka planı için sessiz, döngüsel video.
 *
 * Video hazır olana kadar poster görseli görünür.
 * Sadece telefonda "veri tasarrufu" açıkken video hiç indirilmez.
 */
export default function BackgroundVideo({
  src,
  posterUrl,
  playOnOpen = false,
  className = "",
}: {
  src: string | null;
  posterUrl: string | null;
  /** true ise davetiye kapısı açılana kadar oynatmaz. */
  playOnOpen?: boolean;
  className?: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [allowed, setAllowed] = useState(false);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);

  // Kapı bu oturumda zaten açıldıysa (sayfa yenilendi, geri gelindi)
  // beklenecek bir olay yok — hemen oynat.
  const [waiting, setWaiting] = useState(playOnOpen);

  useEffect(() => {
    const saveData = (navigator as Navigator & { connection?: Connection })
      .connection?.saveData;

    if (!saveData) setAllowed(true);
  }, []);

  useEffect(() => {
    if (!playOnOpen) return;

    if (isGateOpen()) {
      setWaiting(false);
      return;
    }

    const onOpen = () => setWaiting(false);
    window.addEventListener(GATE_EVENT, onOpen);
    return () => window.removeEventListener(GATE_EVENT, onOpen);
  }, [playOnOpen]);

  useEffect(() => {
    if (waiting || !allowed) return;
    videoRef.current?.play().catch(() => {
      // Otomatik oynatma engellendiyse poster görünmeye devam eder.
    });
  }, [waiting, allowed]);

  const showVideo = Boolean(src) && allowed && !failed;
  const posterVisible = !showVideo || !ready;

  return (
    <div className={`absolute inset-0 overflow-hidden bg-olive-800 ${className}`}>
      {posterUrl && (
        <div
          className={`absolute inset-0 bg-parallax animate-slowZoom transition-opacity duration-1000 ${
            posterVisible ? "opacity-100" : "opacity-0"
          }`}
          style={{ backgroundImage: `url(${posterUrl})` }}
        />
      )}

      {showVideo && (
        <video
          ref={videoRef}
          src={src ?? undefined}
          poster={posterUrl ?? undefined}
          muted
          loop
          playsInline
          autoPlay={!waiting}
          preload={waiting ? "metadata" : "auto"}
          onCanPlay={() => setReady(true)}
          onError={() => setFailed(true)}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${
            ready ? "opacity-100" : "opacity-0"
          }`}
        />
      )}
    </div>
  );
}
