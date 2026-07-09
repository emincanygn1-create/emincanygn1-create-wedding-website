"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
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

  // Kapı bu oturumda zaten açıldıysa beklenecek bir olay yok.
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

    const video = videoRef.current;
    if (!video) return;

    // React `muted` özelliğini DOM'a güvenilir şekilde yansıtmıyor.
    // Elemanı elle sessize almazsak tarayıcı otomatik oynatmayı reddeder.
    video.muted = true;
    video.defaultMuted = true;
    video.volume = 0;

    video.play().catch(() => {
      // Oynatma yine de engellendiyse videoyu gizleme:
      // hareketsiz ilk kare, boş ekrandan iyidir.
      setReady(true);
    });
  }, [waiting, allowed]);

  // readyState 2 (ilk kare hazır) videoyu göstermek için yeterli.
  // `canplay` beklemek bazı tarayıcılarda hiç gelmiyor.
  const reveal = useCallback(() => setReady(true), []);

  const showVideo = Boolean(src) && allowed && !failed;
  const posterVisible = !showVideo || !ready;

  return (
    <div className={`absolute inset-0 overflow-hidden bg-olive-800 ${className}`}>
      {posterUrl && (
        <div
          className={`absolute inset-0 animate-slowZoom transition-opacity duration-1000 ${
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
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${
            ready ? "opacity-100" : "opacity-0"
          }`}
        />
      )}
    </div>
  );
}
