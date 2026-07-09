"use client";

import type { AdminDict } from "@/lib/i18n/admin";
import { DEFAULT_SECTIONS, type SectionSetting } from "@/lib/sections";

export default function SectionOrderEditor({
  sections,
  onChange,
  t,
}: {
  sections: SectionSetting[];
  onChange: (next: SectionSetting[]) => void;
  t: AdminDict;
}) {
  const move = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= sections.length) return;

    const next = [...sections];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  };

  const toggle = (index: number) => {
    const next = sections.map((section, i) =>
      i === index ? { ...section, visible: !section.visible } : section
    );
    onChange(next);
  };

  return (
    <div className="space-y-2">
      {sections.map((section, index) => (
        <div
          key={section.key}
          className={`flex items-center gap-3 rounded-lg border px-4 py-3 ${
            section.visible
              ? "border-olive-200 bg-white"
              : "border-olive-200 bg-olive-50 opacity-60"
          }`}
        >
          <span className="w-6 text-center font-body text-xs text-olive-400 tabular-nums">
            {index + 1}
          </span>

          <span className="flex-1 font-body text-sm text-olive-800">
            {t.sectionNames[section.key]}
          </span>

          <button
            type="button"
            onClick={() => toggle(index)}
            className="rounded-full border border-olive-300 px-3 py-1 font-body text-xs text-olive-600 transition-colors hover:bg-olive-100"
          >
            {section.visible ? t.common.hide : t.common.show}
          </button>

          <div className="flex gap-1">
            <button
              type="button"
              onClick={() => move(index, -1)}
              disabled={index === 0}
              aria-label={t.content.moveUp}
              className="flex h-7 w-7 items-center justify-center rounded-md border border-olive-300 text-olive-600 transition-colors hover:bg-olive-100 disabled:opacity-30"
            >
              ↑
            </button>
            <button
              type="button"
              onClick={() => move(index, 1)}
              disabled={index === sections.length - 1}
              aria-label={t.content.moveDown}
              className="flex h-7 w-7 items-center justify-center rounded-md border border-olive-300 text-olive-600 transition-colors hover:bg-olive-100 disabled:opacity-30"
            >
              ↓
            </button>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={() => onChange(DEFAULT_SECTIONS)}
        className="pt-2 font-body text-xs text-olive-500 hover:underline"
      >
        {t.content.resetOrder}
      </button>
    </div>
  );
}
