"use client";

import type { Dict } from "@/lib/i18n/dictionaries";

function toIcsDate(date: Date) {
  return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
}

export default function AddToCalendar({
  weddingDate,
  title,
  location,
  d,
}: {
  weddingDate: string;
  title: string;
  location: string;
  d: Dict;
}) {
  const download = () => {
    const start = new Date(weddingDate);
    const end = new Date(start.getTime() + 4 * 60 * 60 * 1000);

    const ics = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Wedding//TR",
      "BEGIN:VEVENT",
      `UID:${start.getTime()}@wedding`,
      `DTSTAMP:${toIcsDate(new Date())}`,
      `DTSTART:${toIcsDate(start)}`,
      `DTEND:${toIcsDate(end)}`,
      `SUMMARY:${title}`,
      location ? `LOCATION:${location.replace(/\n/g, " ")}` : "",
      "END:VEVENT",
      "END:VCALENDAR",
    ]
      .filter(Boolean)
      .join("\r\n");

    const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "wedding.ics";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <button
      onClick={download}
      className="inline-flex items-center gap-2 border border-olive-400 text-olive-700 rounded-full px-6 py-2.5 text-xs tracking-widest uppercase hover:bg-olive-700 hover:text-cream transition-colors"
    >
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
        <rect x="4" y="5" width="16" height="15" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <path d="M4 10h16M9 3v4M15 3v4M12 13v4M10 15h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
      {d.countdown.addToCalendar}
    </button>
  );
}
