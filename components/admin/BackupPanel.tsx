"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { AdminDict } from "@/lib/i18n/admin";

const TABLES = ["rsvps", "wishes", "guest_photos", "story_posts", "faqs"] as const;

function saveFile(content: string, filename: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export default function BackupPanel({
  counts,
  t,
}: {
  counts: Record<string, number>;
  t: AdminDict;
}) {
  const [busy, setBusy] = useState(false);
  const stamp = new Date().toISOString().slice(0, 10);

  const downloadAll = async () => {
    setBusy(true);
    const supabase = createClient();
    const bundle: Record<string, unknown> = { exportedAt: new Date().toISOString() };

    for (const table of TABLES) {
      const { data } = await supabase.from(table).select("*");
      bundle[table] = data ?? [];
    }

    const { data: content } = await supabase.from("site_content").select("*").eq("id", 1);
    bundle.site_content = content ?? [];

    saveFile(JSON.stringify(bundle, null, 2), `dugun-yedek-${stamp}.json`, "application/json");
    setBusy(false);
  };

  const downloadPhotoList = async () => {
    setBusy(true);
    const supabase = createClient();
    const { data } = await supabase.from("guest_photos").select("url");
    const urls = (data ?? []).map((row) => row.url as string).join("\n");
    saveFile(urls, `misafir-fotograflari-${stamp}.txt`, "text/plain");
    setBusy(false);
  };

  const rows = [
    { key: "rsvps", label: t.backup.rsvps },
    { key: "wishes", label: t.backup.wishes },
    { key: "guest_photos", label: t.backup.photos },
    { key: "story_posts", label: t.backup.story },
    { key: "faqs", label: t.backup.faqs },
  ];

  return (
    <div className="max-w-xl space-y-8">
      <div className="overflow-hidden rounded-2xl border border-olive-200 bg-white">
        {rows.map((row, i) => (
          <div
            key={row.key}
            className={`flex items-center justify-between px-6 py-4 ${
              i > 0 ? "border-t border-olive-100" : ""
            }`}
          >
            <span className="font-body text-sm text-olive-700">{row.label}</span>
            <span className="font-display text-lg text-olive-800 tabular-nums">
              {counts[row.key] ?? 0}{" "}
              <span className="font-body text-xs text-olive-400">
                {t.backup.records}
              </span>
            </span>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          onClick={downloadAll}
          disabled={busy}
          className="rounded-full bg-olive-700 px-6 py-2.5 text-sm tracking-wide text-cream transition-colors hover:bg-olive-800 disabled:opacity-50"
        >
          {busy ? t.common.saving : t.backup.downloadAll}
        </button>
        <button
          onClick={downloadPhotoList}
          disabled={busy}
          className="rounded-full border border-olive-400 px-6 py-2.5 text-sm tracking-wide text-olive-700 transition-colors hover:bg-olive-100 disabled:opacity-50"
        >
          {t.backup.photoList}
        </button>
      </div>

      <p className="max-w-md font-body text-xs leading-relaxed text-olive-400">
        {t.backup.photoNote}
      </p>
    </div>
  );
}
