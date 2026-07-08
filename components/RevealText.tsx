"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Metni kelime kelime, sırayla aşağıdan yukarı süzerek açar.
 * `as` ile hangi etikette render edileceği seçilir.
 */
export default function RevealText({
  text,
  className = "",
  as: Tag = "span",
  delay = 0,
  step = 55,
}: {
  text: string;
  className?: string;
  as?: "h1" | "h2" | "h3" | "p" | "span";
  delay?: number;
  step?: number;
}) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2, rootMargin: "0px 0px -30px 0px" }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const words = text.split(" ").filter(Boolean);

  return (
    <Tag
      ref={ref as React.RefObject<HTMLHeadingElement>}
      className={className}
      aria-label={text}
    >
      {words.map((word, i) => (
        <span key={`${word}-${i}`} className="word-mask" aria-hidden>
          <span
            className={`word ${visible ? "is-visible" : ""}`}
            style={{ transitionDelay: `${delay + i * step}ms` }}
          >
            {word}
          </span>
          {i < words.length - 1 && <span>&nbsp;</span>}
        </span>
      ))}
    </Tag>
  );
}
