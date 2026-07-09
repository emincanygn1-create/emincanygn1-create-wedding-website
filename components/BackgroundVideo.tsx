"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { GATE_EVENT, isGateOpen } from "@/lib/gate";

type Connection = { saveData?: boolean };

/** Bu dizeyi hata ayıklarken görüyorsan doğru dosya canlıda demektir. */
const BUILD = "bgvideo-v5";

const NETWORK_STATE = ["EMPTY", "IDLE", "LOADING", "NO_SOURCE"];
const READY_STATE = ["NOTHING", "METADATA", "CURRENT_DATA", "FUTURE_DATA", "ENOUGH_DATA"];

/**
 * Kapak arka planı için sessiz, döngüsel video.
 *
 * Tasarımı üç kural belirliyor:
 *
 * 1. Video hiçbir zaman gizlenmez. WebKit görünmeyen videoyu oynatmaz;
 *    gizlersek asla hazır olmaz, hazır olmadığı için gizli kalır.
 *
 * 2. Yükleme olaylarına GÜVENİLMEZ. Video önbellekten geliyorsa
 *    `loadeddata` React olay dinleyicisi bağlanmadan önce ateşlenir.
 *    Sayfa bazen çalışır, bazen çalışmaz. Bu yüzden `readyState`
 *    doğrudan yoklanır.
 *
 * 3. Poster, video oynamaya başlayınca DOM'dan tamamen çıkar.
 *    Videonun üstünde duran dönüşümlü bir katman onu boyanmaz yapabiliyor.
 */
export default function BackgroundVideo({
  src,
  posterUrl,
  playOnOpen = false,
  className = "",
}: {
  src: string | null;
  posterUrl: string | null;
  playOnOpen?: boolean;
  className?: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [allowed, setAllowed] = useState(false);
  const [ready, setReady] = useState(false);
  const [posterMounted, setPosterMounted] = useState(true);
  const [failed, setFailed] = useState(false);
  const [waiting, setWaiting] = useState(playOnOpen);

  const [debug, setDebug] = useState(false);
  const [note, setNote] = useState("başlamadı");
  const [, forceRender] = useState(0);

  useEffect(() => {
    setDebug(new URLSearchParams(window.location.search).has("debug"));
  }, []);

  useEffect(() => {
    const saveData = (navigator as Navigator & { connection?: Connection })
      .connection?.saveData;

    if (saveData) {
      setNote("veri tasarrufu açık");
      return;
    }
    setAllowed(true);
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

  const reveal = useCallback(() => setReady(true), []);

  const startPlayback = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    // React `muted` özelliğini DOM'a güvenilir yansıtmıyor.
    video.muted = true;
    video.defaultMuted = true;
    video.volume = 0;

    video
      .play()
      .then(() => setNote("oynuyor"))
      .catch((error: DOMException) => setNote(`play() reddedildi: ${error.name}`));
  }, []);

  useEffect(() => {
    if (waiting || !allowed) return;

    startPlayback();

    const unlock = () => startPlayback();
    window.addEventListener("touchstart", unlock, { once: true, passive: true });
    window.addEventListener("click", unlock, { once: true });
    window.addEventListener("scroll", unlock, { once: true, passive: true });

    return () => {
      window.removeEventListener("touchstart", unlock);
      window.removeEventListener("click", unlock);
      window.removeEventListener("scroll", unlock);
    };
  }, [waiting, allowed, startPlayback]);

  /**
   * Asıl düzeltme. Olayları beklemek yerine durumu yokluyoruz.
   * Video önbellekten geldiyse `loadeddata` biz dinlemeye başlamadan
   * ateşlenmiş olabilir — o zaman poster sonsuza kadar üstte kalırdı.
   */
  useEffect(() => {
    if (!allowed || failed || ready) return;

    const check = () => {
      const video = videoRef.current;
      if (video && video.readyState >= 2) reveal();
    };

    check();
    const poll = setInterval(check, 250);

    // En kötü ihtimalle posteri kaldır: donmuş bir kare, kalıcı posterden iyidir.
    const giveUp = setTimeout(() => {
      if (videoRef.current) reveal();
    }, 3000);

    return () => {
      clearInterval(poll);
      clearTimeout(giveUp);
    };
  }, [allowed, failed, ready, reveal]);

  useEffect(() => {
    if (!ready) return;
    const timer = setTimeout(() => setPosterMounted(false), 1100);
    return () => clearTimeout(timer);
  }, [ready]);

  useEffect(() => {
    if (!debug) return;
    const timer = setInterval(() => forceRender((n) => n + 1), 500);
    return () => clearInterval(timer);
  }, [debug]);

  const showVideo = Boolean(src) && allowed && !failed;
  const video = videoRef.current;

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
          onLoadedMetadata={reveal}
          onLoadedData={reveal}
          onCanPlay={reveal}
          onPlaying={reveal}
          onError={() => {
            setFailed(true);
            setNote("video error olayı");
          }}
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}

      {posterUrl && posterMounted && (
        <div
          className={`pointer-events-none absolute inset-0 transition-opacity duration-1000 ${
            ready ? "opacity-0" : "animate-slowZoom opacity-100"
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

      {debug && (
        <div className="pointer-events-none absolute inset-x-3 top-20 z-50 rounded-lg bg-black/85 p-3 font-mono text-[10px] leading-relaxed text-white">
          <p className="mb-1 text-amber-300">{BUILD}</p>
          <p>src: {src ? "var" : "YOK"}</p>
          <p>
            allowed: {String(allowed)} · waiting: {String(waiting)}
          </p>
          <p>
            ready: {String(ready)} · failed: {String(failed)}
          </p>
          <p>durum: {note}</p>
          <p>
            readyState: {video ? READY_STATE[video.readyState] : "-"} · paused:{" "}
            {video ? String(video.paused) : "-"}
          </p>
          <p>
            networkState: {video ? NETWORK_STATE[video.networkState] : "-"} · muted:{" "}
            {video ? String(video.muted) : "-"}
          </p>
          <p>hata kodu: {video?.error ? video.error.code : "yok"}</p>
          <p className="break-all opacity-60">{src?.slice(-44)}</p>
        </div>
      )}
    </div>
  );
}
