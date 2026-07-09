"use client";

import { useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { formatDateTime } from "@/lib/formatDate";
import type { Rsvp } from "@/lib/types";
import type { AdminDict } from "@/lib/i18n/admin";

const LOCALE_LABEL: Record<string, string> = {
  tr: "TR",
  en: "EN",
  it: "IT",
};

type Filter = "all" | "yes" | "no";

export default function RsvpTable({
  initialRsvps,
  t,
}: {
  initialRsvps: Rsvp[];
  t: AdminDict;
}) {
  const SIDE_LABEL: Record<string, string> = {
    bride: t.rsvps.attending === "Partecipa" ? "Sposa" : "Gelin",
    groom: t.rsvps.attending === "Partecipa" ? "Sposo" : "Damat",
    both: t.rsvps.attending === "Partecipa" ? "Entrambi" : "İkisi de",
    "": "—",
  };

  const [rsvps, setRsvps] = useState<Rsvp[]>(initialRsvps);
  const [filter, setFilter] = useState<Filter>("all");

  const stats = useMemo(() => {
    const attending = rsvps.filter((r) => r.attending);
    return {
      total: rsvps.length,
      attending: attending.length,
      declined: rsvps.length - attending.length,
      guests: attending.reduce((sum, r) => sum + (r.guest_count || 0), 0),
    };
  }, [rsvps]);

  // Aynı isim birden fazla kez geçiyorsa işaretle.
  const duplicates = useMemo(() => {
    const counts = new Map<string, number>();
    for (const r of rsvps) {
      const key = r.name.trim().toLowerCase();
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
    return counts;
  }, [rsvps]);

  const rows = useMemo(() => {
    if (filter === "yes") return rsvps.filter((r) => r.attending);
    if (filter === "no") return rsvps.filter((r) => !r.attending);
    return rsvps;
  }, [rsvps, filter]);

  const handleDelete = async (id: string) => {
    if (!window.confirm(t.common.confirmDelete)) return;
    const supabase = createClient();
    await supabase.from("rsvps").delete().eq("id", id);
    setRsvps((prev) => prev.filter((r) => r.id !== id));
  };

  const downloadCsv = () => {
    const header = [
      t.rsvps.date,
      t.rsvps.name,
      "E-mail",
      t.rsvps.contact,
      t.rsvps.status,
      t.rsvps.people,
      t.rsvps.side,
      t.rsvps.diet,
      t.rsvps.note,
      "Dil / Lingua",
    ];

    const escape = (value: string) => `"${String(value ?? "").replace(/"/g, '""')}"`;

    const lines = rsvps.map((r) =>
      [
        formatDateTime(r.created_at),
        r.name,
        r.email,
        r.phone,
        r.attending ? t.rsvps.attending : t.rsvps.declined,
        r.attending ? String(r.guest_count) : "0",
        SIDE_LABEL[r.side] ?? r.side,
        r.diet,
        r.message,
        (LOCALE_LABEL[r.locale] ?? r.locale) || "",
      ]
        .map(escape)
        .join(",")
    );

    const csv = "\uFEFF" + [header.map(escape).join(","), ...lines].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `katilim-listesi-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const filterButton = (key: Filter, label: string) => (
    <button
      onClick={() => setFilter(key)}
      className={`rounded-full px-4 py-2 text-xs tracking-wide transition-colors ${
        filter === key
          ? "bg-olive-700 text-cream"
          : "border border-olive-300 text-olive-600 hover:bg-olive-100"
      }`}
    >
      {label}
    </button>
  );

  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8 max-w-2xl">
        {[
          { label: t.rsvps.total, value: stats.total },
          { label: t.rsvps.attending, value: stats.attending },
          { label: t.rsvps.declined, value: stats.declined },
          { label: t.rsvps.totalGuests, value: stats.guests },
        ].map((item) => (
          <div
            key={item.label}
            className="bg-white border border-olive-200 rounded-xl p-4 text-center"
          >
            <p className="font-display text-3xl text-olive-800">{item.value}</p>
            <p className="text-[10px] tracking-widest uppercase text-olive-400 mt-1">
              {item.label}
            </p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-6">
        {filterButton("all", t.rsvps.all)}
        {filterButton("yes", t.rsvps.yes)}
        {filterButton("no", t.rsvps.no)}
        <button
          onClick={downloadCsv}
          disabled={rsvps.length === 0}
          className="ml-auto bg-olive-700 text-cream rounded-full px-5 py-2 text-xs tracking-wide hover:bg-olive-800 transition-colors disabled:opacity-40"
        >
          {t.rsvps.downloadCsv}
        </button>
      </div>

      {rows.length === 0 ? (
        <p className="font-body text-olive-500 text-sm">{t.rsvps.empty}</p>
      ) : (
        <div className="overflow-x-auto border border-olive-200 rounded-xl bg-white">
          <table className="w-full text-sm font-body">
            <thead>
              <tr className="bg-olive-50 text-olive-500 text-left text-xs uppercase tracking-wider">
                <th className="px-4 py-3">{t.rsvps.name}</th>
                <th className="px-4 py-3">{t.rsvps.contact}</th>
                <th className="px-4 py-3">{t.rsvps.status}</th>
                <th className="px-4 py-3">{t.rsvps.people}</th>
                <th className="px-4 py-3">{t.rsvps.side}</th>
                <th className="px-4 py-3">{t.rsvps.diet}</th>
                <th className="px-4 py-3">{t.rsvps.note}</th>
                <th className="px-4 py-3">{t.rsvps.date}</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-t border-olive-100 align-top">
                  <td className="px-4 py-3 text-olive-800">
                    {r.name}
                    <span className="ml-2 text-[10px] text-olive-400">
                      {LOCALE_LABEL[r.locale] ?? ""}
                    </span>
                    {(duplicates.get(r.name.trim().toLowerCase()) ?? 0) > 1 && (
                      <span className="ml-2 rounded-full bg-gold/15 px-2 py-0.5 text-[10px] text-gold-dark">
                        {t.rsvps.duplicate}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-olive-600">
                    {r.email && <div>{r.email}</div>}
                    {r.phone && <div>{r.phone}</div>}
                    {!r.email && !r.phone && "—"}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block rounded-full px-3 py-1 text-xs ${
                        r.attending
                          ? "bg-olive-100 text-olive-700"
                          : "bg-rust/10 text-rust"
                      }`}
                    >
                      {r.attending ? t.rsvps.attending : t.rsvps.declined}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-olive-700">
                    {r.attending ? r.guest_count : "—"}
                  </td>
                  <td className="px-4 py-3 text-olive-600">
                    {SIDE_LABEL[r.side] ?? r.side}
                  </td>
                  <td className="max-w-[10rem] px-4 py-3 text-olive-600">
                    {r.diet || "—"}
                  </td>
                  <td className="px-4 py-3 text-olive-600 max-w-xs whitespace-pre-line">
                    {r.message || "—"}
                  </td>
                  <td className="px-4 py-3 text-olive-400 whitespace-nowrap">
                    {formatDateTime(r.created_at)}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleDelete(r.id)}
                      className="text-rust text-xs hover:underline"
                    >
                      {t.common.delete}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
