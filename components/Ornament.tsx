/**
 * Bölüm başlarında ve köşelerde kullanılan çiçek/yaprak süslemeleri.
 * Renk için currentColor kullanır, böylece her zemine uyum sağlar.
 */

export function OrnamentDivider({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 240 40"
      fill="none"
      className={className}
      aria-hidden
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M8 20h72" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />
      <path d="M160 20h72" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />

      <g transform="translate(120 20)">
        <path
          d="M0 -14C5 -8 5 8 0 14C-5 8 -5 -8 0 -14Z"
          stroke="currentColor"
          strokeWidth="0.9"
          fill="none"
        />
        <circle r="2.2" fill="currentColor" />
        <path
          d="M-34 0c6-9 16-9 22 0-6 6-16 6-22 0Z"
          fill="currentColor"
          opacity="0.35"
        />
        <path
          d="M34 0c-6-9-16-9-22 0 6 6 16 6 22 0Z"
          fill="currentColor"
          opacity="0.35"
        />
        <path d="M-28 0h-6M28 0h6" stroke="currentColor" strokeWidth="0.8" />
        <path
          d="M-18 -7c-2-5 1-9 4-10M18 -7c2-5-1-9-4-10"
          stroke="currentColor"
          strokeWidth="0.7"
          opacity="0.6"
        />
      </g>
    </svg>
  );
}

export function OrnamentCorner({
  className = "",
  flip = false,
}: {
  className?: string;
  flip?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      className={className}
      style={flip ? { transform: "scaleX(-1)" } : undefined}
      aria-hidden
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M-10 190C40 180 80 150 100 110S140 40 190 20"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.7"
      />
      {[
        { x: 20, y: 176, r: -30 },
        { x: 52, y: 160, r: -10 },
        { x: 82, y: 132, r: 20 },
        { x: 104, y: 96, r: 40 },
        { x: 128, y: 62, r: 60 },
        { x: 158, y: 36, r: 75 },
      ].map((leaf, i) => (
        <g key={i} transform={`translate(${leaf.x} ${leaf.y}) rotate(${leaf.r})`}>
          <path
            d="M0 0C10 -12 26 -12 34 0 26 9 10 9 0 0Z"
            fill="currentColor"
            opacity={0.28 - i * 0.015}
          />
          <path
            d="M0 0C-10 -12 -26 -12 -34 0-26 9-10 9 0 0Z"
            fill="currentColor"
            opacity={0.2 - i * 0.012}
          />
        </g>
      ))}
      {[
        { x: 38, y: 150, s: 1 },
        { x: 96, y: 88, s: 0.8 },
        { x: 150, y: 40, s: 0.65 },
      ].map((flower, i) => (
        <g
          key={i}
          transform={`translate(${flower.x} ${flower.y}) scale(${flower.s})`}
          opacity="0.5"
        >
          {[0, 72, 144, 216, 288].map((angle) => (
            <ellipse
              key={angle}
              rx="3.4"
              ry="7"
              cx="0"
              cy="-7"
              fill="currentColor"
              transform={`rotate(${angle})`}
            />
          ))}
          <circle r="2.4" fill="currentColor" />
        </g>
      ))}
    </svg>
  );
}
