"use client";

import { useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { formatDateTime } from "@/lib/formatDate";
import type { Rsvp } from "@/lib/types";

const SIDE_LABEL: Record<string, string> = {
  bride: "Gelin",
  groom: "Damat",
  both: "İkisi de",
  "": "—",
};

const LOCALE_LABEL: Record<string, string> = {
  tr: "TR",
  en: "EN",
  it: "IT",
};

type Filter = "all" | "yes" | "no";

export default function RsvpTable({ initialRsvps }: { initialRsvps: Rsvp[] }) {
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

  const rows = useMemo(() => {
    if (filter === "yes") return rsvps.filter((r) => r.attending);
    if (filter === "no") return rsvps.filter((r) => !r.attending);
    return rsvps;
  }, [rsvps, filter]);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Bu cevabı silmek istediğine emin misin?")) return;
    const supabase = createClient();
    await supabase.from("rsvps").delete().eq("id", id);
    setRsvps((prev) => prev.filter((r) => r.id !== id));
  };

  const downloadCsv = () => {
    const header = [
      "Tarih",
      "Ad Soyad",
      "E-posta",
      "Telefon",
      "Katılıyor",
      "Kişi Sayısı",
      "Taraf",
      "Not",
      "Dil",
    ];

    const escape = (value: string) => `"${String(value ?? "").replace(/"/g, '""')}"`;

    const lines = rsvps.map((r) =>
      [
        formatDateTime(r.created_at),
        r.name,
        r.email,
        r.phone,
        r.attending ? "Evet" : "Hayır",
        r.attending ? String(r.guest_count) : "0",
        SIDE_LABEL[r.side] ?? r.side,
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
          { label: "Toplam Cevap", value: stats.total },
          { label: "Katılıyor", value: stats.attending },
          { label: "Katılmıyor", value: stats.declined },
          { label: "Toplam Kişi", value: stats.guests },
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
        {filterButton("all", "Hepsi")}
        {filterButton("yes", "Katılanlar")}
        {filterButton("no", "Katılmayanlar")}
        <button
          onClick={downloadCsv}
          disabled={rsvps.length === 0}
          className="ml-auto bg-olive-700 text-cream rounded-full px-5 py-2 text-xs tracking-wide hover:bg-olive-800 transition-colors disabled:opacity-40"
        >
          CSV indir
        </button>
      </div>

      {rows.length === 0 ? (
        <p className="font-body text-olive-500 text-sm">Henüz cevap yok.</p>
      ) : (
        <div className="overflow-x-auto border border-olive-200 rounded-xl bg-white">
          <table className="w-full text-sm font-body">
            <thead>
              <tr className="bg-olive-50 text-olive-500 text-left text-xs uppercase tracking-wider">
                <th className="px-4 py-3">Ad Soyad</th>
                <th className="px-4 py-3">İletişim</th>
                <th className="px-4 py-3">Durum</th>
                <th className="px-4 py-3">Kişi</th>
                <th className="px-4 py-3">Taraf</th>
                <th className="px-4 py-3">Not</th>
                <th className="px-4 py-3">Tarih</th>
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
                      {r.attending ? "Katılıyor" : "Katılmıyor"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-olive-700">
                    {r.attending ? r.guest_count : "—"}
                  </td>
                  <td className="px-4 py-3 text-olive-600">
                    {SIDE_LABEL[r.side] ?? r.side}
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
                      Sil
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
