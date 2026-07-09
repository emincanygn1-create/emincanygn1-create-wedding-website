"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Görseli aşağıdan yukarı açılan bir perdeyle gösterir.
 *
 * Kararlılık notları:
 *  - Gözlemciye tek başına güvenilmez; ekrandalık ayrıca yoklanır.
 *    Yazı tipleri geç yüklendiğinde ilk ölçüm yanlış çıkabiliyor.
 *  - Parallax mobilde kapalı. Android Chrome'da clip-path ile dönüşüm
 *    aynı katmanda çakışıp görseli boyanmaz hale getirebiliyor.
 *  - Ne olursa olsun 1,2 saniye içinde görsel açılır.
 */
export default function RevealImage({
  src,
  alt = "",
  className = "",
  imgClassName = "",
  delay = 0,
  parallax = false,
  strength = 20,
  sizes = "(max-width: 640px) 50vw, 33vw",
  priority = false,
}: {
  src: string;
  alt?: string;
  className?: string;
  imgClassName?: string;
  delay?: number;
  parallax?: boolean;
  strength?: number;
  sizes?: string;
  priority?: boolean;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const layerRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [forced, setForced] = useState(false);
  const [failed, setFailed] = useState(false);

  const show = useCallback(() => setVisible(true), []);

  useEffect(() => {
    const node = wrapRef.current;
    if (!node) return;
    if (visible) return;

    let timer: ReturnType<typeof setTimeout> | undefined;
    let guard: ReturnType<typeof setTimeout> | undefined;

    const onScreen = () => {
      const rect = node.getBoundingClientRect();
      return rect.top < window.innerHeight && rect.bottom > 0;
    };

    const trigger = () => {
      if (timer) return;
      timer = setTimeout(show, delay);

      // Perde bir sebeple açılmazsa kilidi kaldır.
      guard = setTimeout(() => setForced(true), delay + 1200);
    };

    if (onScreen()) trigger();

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          trigger();
          observer.disconnect();
        }
      },
      { threshold: 0.08 }
    );
    observer.observe(node);

    // Gözlemci ateşlemezse (kaydırma kilidi, geç yerleşim) yedek yoklama.
    const poll = setInterval(() => {
      if (onScreen()) {
        trigger();
        clearInterval(poll);
      }
    }, 400);

    return () => {
      observer.disconnect();
      clearInterval(poll);
      if (timer) clearTimeout(timer);
      if (guard) clearTimeout(guard);
    };
  }, [delay, show, visible]);

  useEffect(() => {
    if (!parallax) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.innerWidth < 768) return;

    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const wrap = wrapRef.current;
        const layer = layerRef.current;
        if (!wrap || !layer) return;

        const rect = wrap.getBoundingClientRect();
        if (rect.bottom < 0 || rect.top > window.innerHeight) return;

        const progress = (rect.top + rect.height / 2) / window.innerHeight - 0.5;
        layer.style.transform = `translate3d(0, ${-progress * strength}px, 0)`;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    onScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(frame);
    };
  }, [parallax, strength]);

  return (
    <div
      ref={wrapRef}
      className={`img-wipe ${parallax ? "has-parallax" : ""} ${
        visible ? "is-visible" : ""
      } ${forced ? "is-shown" : ""} ${className}`}
    >
      <div ref={layerRef} className="img-parallax">
        {failed ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={src}
            alt={alt}
            className={`absolute inset-0 h-full w-full object-cover ${imgClassName}`}
          />
        ) : (
          <Image
            src={src}
            alt={alt}
            fill
            sizes={sizes}
            priority={priority}
            loading={priority ? undefined : "lazy"}
            onError={() => setFailed(true)}
            className={`object-cover ${imgClassName}`}
          />
        )}
      </div>
    </div>
  );
}
