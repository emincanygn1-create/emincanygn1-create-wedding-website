"use client";

import { useRef, useState, type FormEvent } from "react";
import Reveal from "./Reveal";
import Spinner from "./Spinner";
import RevealText from "./RevealText";
import { OrnamentDivider } from "./Ornament";
import { createClient } from "@/lib/supabase/client";
import type { Dict } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/config";

const inputClass =
  "w-full border border-olive-200 rounded-lg px-4 py-3 bg-white text-olive-800 font-body text-sm placeholder:text-olive-400 focus:outline-none focus:border-olive-400 transition-colors";

export default function Rsvp({
  d,
  locale,
  open = true,
  closedMessage = "",
  deadlineText = "",
}: {
  d: Dict;
  locale: Locale;
  /** Panelden kapatıldıysa veya son tarih geçtiyse false. */
  open?: boolean;
  closedMessage?: string;
  deadlineText?: string;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [attending, setAttending] = useState(true);
  const [guestCount, setGuestCount] = useState(1);
  const [side, setSide] = useState("");
  const [message, setMessage] = useState("");
  const [honeypot, setHoneypot] = useState("");

  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [canRetry, setCanRetry] = useState(false);

  // Çift tıklama, Enter'a basılı tutma veya yavaş ağda ikinci gönderimi engeller.
  const inFlight = useRef(false);

  const reset = () => {
    setName("");
    setEmail("");
    setPhone("");
    setAttending(true);
    setGuestCount(1);
    setSide("");
    setMessage("");
    setSent(false);
    setError("");
    setCanRetry(false);
  };

  const submit = async () => {
    if (inFlight.current) return;

    if (!name.trim()) {
      setError(d.rsvp.required);
      setCanRetry(false);
      return;
    }

    if (typeof navigator !== "undefined" && navigator.onLine === false) {
      setError(d.rsvp.offline);
      setCanRetry(true);
      return;
    }

    inFlight.current = true;
    setSending(true);
    setError("");
    setCanRetry(false);

    try {
      const supabase = createClient();
      const { error: insertError } = await supabase.from("rsvps").insert({
        name: name.trim().slice(0, 80),
        email: email.trim(),
        phone: phone.trim(),
        attending,
        guest_count: attending ? guestCount : 1,
        side,
        message: message.trim().slice(0, 1000),
        locale,
      });

      if (insertError) {
        // Veritabanı kuralı reddettiyse form bu arada kapatılmış demektir.
        const closed =
          insertError.code === "42501" ||
          insertError.message.toLowerCase().includes("row-level security");

        setError(closed ? d.rsvp.closedNow : d.rsvp.error);
        setCanRetry(!closed);
        return;
      }

      setSent(true);
    } catch {
      setError(d.rsvp.error);
      setCanRetry(true);
    } finally {
      inFlight.current = false;
      setSending(false);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (honeypot) return; // bot tuzağı
    void submit();
  };

  return (
    <section id="rsvp" className="px-6 py-24 scroll-mt-8">
      <Reveal>
        <p className="eyebrow text-center mb-3">{d.rsvp.eyebrow}</p>
        <RevealText
          text={d.rsvp.title}
          as="h2"
          className="mb-4 text-center font-display text-4xl text-olive-800"
        />
        <OrnamentDivider className="w-40 h-8 text-olive-400 mx-auto mb-6" />
        <p className="text-center text-olive-500 font-body text-sm mb-3 max-w-md mx-auto leading-relaxed">
          {d.rsvp.subtitle}
        </p>
        {open && deadlineText && (
          <p className="eyebrow mb-14 text-center text-gold-dark">
            {d.rsvp.deadlineNote} {deadlineText}
          </p>
        )}
        {(!open || !deadlineText) && <div className="mb-11" />}
      </Reveal>

      <div className="max-w-lg mx-auto">
        {!open ? (
          <Reveal variant="zoom">
            <div className="rounded-2xl border border-olive-200 bg-white p-10 text-center">
              <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full border border-olive-300 text-olive-600">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <rect x="4" y="10" width="16" height="10" rx="2" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M8 10V7a4 4 0 1 1 8 0v3" stroke="currentColor" strokeWidth="1.5" />
                </svg>
              </div>
              <h3 className="mb-3 font-display text-2xl text-olive-800">
                {d.rsvp.closedTitle}
              </h3>
              <p className="whitespace-pre-line font-body text-sm leading-relaxed text-olive-600">
                {closedMessage || d.rsvp.closedDefault}
              </p>
            </div>
          </Reveal>
        ) : sent ? (
          <Reveal variant="zoom">
            <div className="rounded-2xl border border-olive-200 bg-white p-10 text-center">
              <div className="w-14 h-14 rounded-full bg-olive-700 text-cream flex items-center justify-center mx-auto mb-5 text-2xl">
                ♥
              </div>
              <h3 className="font-display text-2xl text-olive-800 mb-3">
                {d.rsvp.successTitle}
              </h3>
              <p className="font-body text-olive-600 text-sm leading-relaxed mb-6">
                {attending ? d.rsvp.successYes : d.rsvp.successNo}
              </p>
              <button
                onClick={reset}
                className="border border-olive-400 text-olive-700 rounded-full px-6 py-2 text-sm tracking-wide hover:bg-olive-700 hover:text-cream transition-colors"
              >
                {d.rsvp.again}
              </button>
            </div>
          </Reveal>
        ) : (
          <Reveal>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                className="hidden"
              />

              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={d.rsvp.name}
                maxLength={80}
                className={inputClass}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={d.rsvp.email}
                  className={inputClass}
                />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder={d.rsvp.phone}
                  className={inputClass}
                />
              </div>

              <fieldset className="pt-2">
                <legend className="text-xs text-olive-500 font-body mb-3">
                  {d.rsvp.attendingQuestion}
                </legend>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setAttending(true)}
                    className={`rounded-lg border px-4 py-3 text-sm font-body transition-colors ${
                      attending
                        ? "bg-olive-700 border-olive-700 text-cream"
                        : "border-olive-200 text-olive-600 hover:border-olive-400"
                    }`}
                  >
                    {d.rsvp.yes}
                  </button>
                  <button
                    type="button"
                    onClick={() => setAttending(false)}
                    className={`rounded-lg border px-4 py-3 text-sm font-body transition-colors ${
                      !attending
                        ? "bg-rust border-rust text-cream"
                        : "border-olive-200 text-olive-600 hover:border-olive-400"
                    }`}
                  >
                    {d.rsvp.no}
                  </button>
                </div>
              </fieldset>

              {attending && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="block text-xs text-olive-500 font-body mb-2">
                      {d.rsvp.guestCount}
                    </label>
                    <select
                      value={guestCount}
                      onChange={(e) => setGuestCount(Number(e.target.value))}
                      className={inputClass}
                    >
                      {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                        <option key={n} value={n}>
                          {n}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs text-olive-500 font-body mb-2">
                      {d.rsvp.side}
                    </label>
                    <select
                      value={side}
                      onChange={(e) => setSide(e.target.value)}
                      className={inputClass}
                    >
                      <option value="">—</option>
                      <option value="bride">{d.rsvp.sideBride}</option>
                      <option value="groom">{d.rsvp.sideGroom}</option>
                      <option value="both">{d.rsvp.sideBoth}</option>
                    </select>
                  </div>
                </div>
              )}

              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={d.rsvp.message}
                rows={3}
                maxLength={1000}
                className={`${inputClass} resize-none`}
              />

              <div aria-live="polite" className="min-h-[1.25rem]">
                {error && (
                  <p className="flex flex-wrap items-center gap-2 font-body text-sm text-rust">
                    <span>{error}</span>
                    {canRetry && (
                      <button
                        type="button"
                        onClick={() => void submit()}
                        className="underline underline-offset-2"
                      >
                        {d.rsvp.retry}
                      </button>
                    )}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={sending}
                aria-busy={sending}
                className="flex w-full items-center justify-center gap-2.5 rounded-full bg-olive-700 py-3.5 text-sm uppercase tracking-widest text-cream transition-colors hover:bg-olive-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {sending && <Spinner />}
                {sending ? d.rsvp.submitting : d.rsvp.submit}
              </button>
            </form>
          </Reveal>
        )}
      </div>
    </section>
  );
}
