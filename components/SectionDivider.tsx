export default function SectionDivider() {
  return (
    <div className="flex items-center justify-center py-10">
      <svg
        width="180"
        height="28"
        viewBox="0 0 180 28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-olive-400"
      >
        <line x1="0" y1="14" x2="70" y2="14" stroke="currentColor" strokeWidth="1" />
        <line x1="110" y1="14" x2="180" y2="14" stroke="currentColor" strokeWidth="1" />
        <g transform="translate(90,14)">
          <circle r="3" fill="currentColor" />
          <path
            d="M -18 0 C -14 -8, -6 -8, -2 0 C -6 4, -14 4, -18 0 Z"
            fill="currentColor"
            opacity="0.6"
          />
          <path
            d="M 18 0 C 14 -8, 6 -8, 2 0 C 6 4, 14 4, 18 0 Z"
            fill="currentColor"
            opacity="0.6"
          />
        </g>
      </svg>
    </div>
  );
}
