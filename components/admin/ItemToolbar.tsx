"use client";

import type { AdminDict } from "@/lib/i18n/admin";

/** Bir kaydın sırasını, görünürlüğünü ve silinmesini yöneten düğmeler. */
export default function ItemToolbar({
  index,
  total,
  visible,
  onMove,
  onToggle,
  onDelete,
  t,
}: {
  index: number;
  total: number;
  visible: boolean;
  onMove: (direction: -1 | 1) => void;
  onToggle: () => void;
  onDelete: () => void;
  t: AdminDict;
}) {
  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={() => onMove(-1)}
        disabled={index === 0}
        aria-label={t.content.moveUp}
        className="flex h-7 w-7 items-center justify-center rounded-md border border-olive-300 text-olive-600 transition-colors hover:bg-olive-100 disabled:opacity-30"
      >
        ↑
      </button>
      <button
        type="button"
        onClick={() => onMove(1)}
        disabled={index === total - 1}
        aria-label={t.content.moveDown}
        className="flex h-7 w-7 items-center justify-center rounded-md border border-olive-300 text-olive-600 transition-colors hover:bg-olive-100 disabled:opacity-30"
      >
        ↓
      </button>

      <button
        type="button"
        onClick={onToggle}
        className="rounded-full border border-olive-300 px-3 py-1 font-body text-xs text-olive-600 transition-colors hover:bg-olive-100"
      >
        {visible ? t.common.hide : t.common.show}
      </button>

      <button
        type="button"
        onClick={onDelete}
        className="ml-auto font-body text-xs text-rust hover:underline"
      >
        {t.common.delete}
      </button>
    </div>
  );
}
