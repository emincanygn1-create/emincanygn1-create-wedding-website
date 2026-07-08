"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Görseli aşağıdan yukarı açılan bir perdeyle gösterir.
 * `parallax` açıkken sayfa kaydıkça görsel hafifçe zıt yönde kayar.
 */
export default function RevealImage({
  src,
  alt = "",
  className = "",
  imgClassName = "",
  delay = 0,
  parallax = false,
  strength = 24,
}: {
  src: string;
  alt?: string;
  className?: string;
  imgClassName?: string;
  delay?: number;
  parallax?: boolean;
  strength?: number;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = wrapRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const timer = setTimeout(() => setVisible(true), delay);
          observer.disconnect();
          return () => clearTimeout(timer);
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [delay]);

  useEffect(() => {
    if (!parallax) return;

    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const wrap = wrapRef.current;
        const img = imgRef.current;
        if (!wrap || !img || !visible) return;

        const rect = wrap.getBoundingClientRect();
        const progress = (rect.top + rect.height / 2) / window.innerHeight - 0.5;
        img.style.transform = `scale(1.08) translateY(${-progress * strength}px)`;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, [parallax, strength, visible]);

  return (
    <div
      ref={wrapRef}
      className={`img-wipe ${visible ? "is-visible" : ""} ${className}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        loading="lazy"
        className={`w-full h-full object-cover ${imgClassName}`}
      />
    </div>
  );
}
