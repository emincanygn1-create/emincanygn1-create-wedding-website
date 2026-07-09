"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

/**
 * Görseli aşağıdan yukarı açılan bir perdeyle gösterir.
 *
 * Katmanlar ayrı: perde (clip-path), parallax (translate), görsel (scale).
 * Üçü aynı elemana yazılırsa biri diğerinin transform'unu ezer.
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
  /** Ekranın üstünde görünen görseller için: erken yükle. */
  priority?: boolean;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const layerRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = wrapRef.current;
    if (!node) return;

    let timer: ReturnType<typeof setTimeout> | undefined;
    let observer: IntersectionObserver | undefined;

    const show = () => {
      timer = setTimeout(() => setVisible(true), delay);
    };

    const rect = node.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      show();
    } else {
      observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            show();
            observer?.disconnect();
          }
        },
        { threshold: 0.12 }
      );
      observer.observe(node);
    }

    return () => {
      if (timer) clearTimeout(timer);
      observer?.disconnect();
    };
  }, [delay]);

  useEffect(() => {
    if (!parallax) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

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
      } ${className}`}
    >
      <div ref={layerRef} className="img-parallax">
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          loading={priority ? undefined : "lazy"}
          className={`object-cover ${imgClassName}`}
        />
      </div>
    </div>
  );
}
