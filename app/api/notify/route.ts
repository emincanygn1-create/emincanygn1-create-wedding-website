import { NextResponse, type NextRequest } from "next/server";

/**
 * Supabase Database Webhook buraya POST atar; biz de e-posta göndeririz.
 *
 * Gerekli ortam değişkenleri (yoksa uç nokta sessizce devre dışı kalır):
 *   NOTIFY_SECRET     — webhook başlığında beklenen gizli anahtar
 *   RESEND_API_KEY    — resend.com üzerinden e-posta göndermek için
 *   NOTIFY_TO         — bildirimlerin gideceği adres
 *   NOTIFY_FROM       — gönderen adres (Resend'de doğrulanmış alan adı)
 */

type RsvpRow = {
  name?: string;
  email?: string;
  phone?: string;
  attending?: boolean;
  guest_count?: number;
  side?: string;
  diet?: string;
  message?: string;
  locale?: string;
};

export async function POST(request: NextRequest) {
  const secret = process.env.NOTIFY_SECRET;
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.NOTIFY_TO;
  const from = process.env.NOTIFY_FROM;

  // Kurulmadıysa hiçbir şey yapma. Webhook 200 alsın, kuyruk tıkanmasın.
  if (!secret || !apiKey || !to || !from) {
    return NextResponse.json({ skipped: "yapılandırılmamış" });
  }

  if (request.headers.get("x-notify-secret") !== secret) {
    return NextResponse.json({ error: "yetkisiz" }, { status: 401 });
  }

  let row: RsvpRow;
  try {
    const body = (await request.json()) as { record?: RsvpRow };
    if (!body.record) throw new Error("kayıt yok");
    row = body.record;
  } catch {
    return NextResponse.json({ error: "geçersiz gövde" }, { status: 400 });
  }

  const attending = row.attending ? "Katılıyor" : "Katılmıyor";
  const lines = [
    `<p><strong>${escapeHtml(row.name ?? "")}</strong> — ${attending}</p>`,
    row.attending ? `<p>Kişi sayısı: ${row.guest_count ?? 1}</p>` : "",
    row.email ? `<p>E-posta: ${escapeHtml(row.email)}</p>` : "",
    row.phone ? `<p>Telefon: ${escapeHtml(row.phone)}</p>` : "",
    row.diet ? `<p>Yemek / alerji: ${escapeHtml(row.diet)}</p>` : "",
    row.message ? `<p>Not: ${escapeHtml(row.message)}</p>` : "",
  ].filter(Boolean);

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to,
        subject: `Yeni RSVP: ${row.name ?? "İsimsiz"} — ${attending}`,
        html: lines.join("\n"),
      }),
    });

    if (!response.ok) {
      return NextResponse.json({ error: "e-posta gönderilemedi" }, { status: 502 });
    }
  } catch {
    return NextResponse.json({ error: "ağ hatası" }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
