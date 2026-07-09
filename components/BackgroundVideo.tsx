"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { GATE_EVENT, isGateOpen } from "@/lib/gate";

type Connection = { saveData?: boolean };

/**
 * Kapak arka planı için sessiz, döngüsel video.
 *
 * ÖNEMLİ: Video asla gizlenmez. WebKit görünmeyen bir videoyu
 * (opacity: 0, display: none, ekran dışı) oynatmayı reddeder —
 * gizlersek asla hazır olmaz, hazır olmadığı için gizli kalır.
 * Bunun yerine poster videonun ÜSTÜNDE durur ve hazır olunca solar.
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

  const startPlayback = useCallback(() => {
    const video = videoRef.current;
    if (!video) return Promise.resolve();

    // React `muted` özelliğini DOM'a güvenilir şekilde yansıtmıyor.
    // Elle sessize almazsak tarayıcı otomatik oynatmayı reddeder.
    video.muted = true;
    video.defaultMuted = true;
    video.volume = 0;

    return video.play().catch(() => {});
  }, []);

  useEffect(() => {
    if (waiting || !allowed) return;

    void startPlayback();

    // iOS'ta düşük güç modu otomatik oynatmayı tamamen engeller.
    // İlk dokunuşta tekrar deniyoruz; kullanıcı hareketi kilidi açar.
    const unlock = () => {
      void startPlayback();
    };

    window.addEventListener("touchstart", unlock, { once: true, passive: true });
    window.addEventListener("click", unlock, { once: true });
    window.addEventListener("scroll", unlock, { once: true, passive: true });

    return () => {
      window.removeEventListener("touchstart", unlock);
      window.removeEventListener("click", unlock);
      window.removeEventListener("scroll", unlock);
    };
  }, [waiting, allowed, startPlayback]);

  const reveal = useCallback(() => setReady(true), []);

  const showVideo = Boolean(src) && allowed && !failed;

  // Poster, video ilk karesini boyayana kadar üstte durur.
  const posterVisible = !showVideo || !ready;

  return (
    <div className={`absolute inset-0 overflow-hidden bg-olive-800 ${className}`}>
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
          onLoadedData={reveal}
          onCanPlay={reveal}
          onPlaying={reveal}
          onError={() => setFailed(true)}
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}

      {posterUrl && (
        <div
          className={`pointer-events-none absolute inset-0 animate-slowZoom transition-opacity duration-1000 ${
            posterVisible ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image
            src={posterUrl}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </div>
      )}
    </div>
  );
}
