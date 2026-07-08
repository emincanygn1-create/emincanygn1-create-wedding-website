"use client";

import { useState, type FormEvent } from "react";
import Reveal from "./Reveal";
import RevealText from "./RevealText";
import { OrnamentDivider } from "./Ornament";
import { createClient } from "@/lib/supabase/client";
import type { Dict } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/config";

const inputClass =
  "w-full border border-olive-200 rounded-lg px-4 py-3 bg-cream text-olive-800 font-body text-sm placeholder:text-olive-400 focus:outline-none focus:border-olive-400 transition-colors";

export default function Rsvp({ d, locale }: { d: Dict; locale: Locale }) {
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
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (honeypot) return; // bot tuzağı

    if (!name.trim()) {
      setError(d.rsvp.required);
      return;
    }

    setSending(true);
    setError("");

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

    setSending(false);

    if (insertError) {
      setError(d.rsvp.error);
      return;
    }

    setSent(true);
  };

  return (
    <section id="rsvp" className="py-24 px-6 bg-cream scroll-mt-8">
      <Reveal>
        <p className="eyebrow text-center mb-3">{d.rsvp.eyebrow}</p>
        <RevealText
          text={d.rsvp.title}
          as="h2"
          className="mb-4 text-center font-display text-4xl text-olive-800"
        />
        <OrnamentDivider className="w-40 h-8 text-olive-400 mx-auto mb-6" />
        <p className="text-center text-olive-500 font-body text-sm mb-14 max-w-md mx-auto leading-relaxed">
          {d.rsvp.subtitle}
        </p>
      </Reveal>

      <div className="max-w-lg mx-auto">
        {sent ? (
          <Reveal variant="zoom">
            <div className="bg-olive-50 border border-olive-200 rounded-2xl p-10 text-center">
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

              {error && <p className="text-rust text-sm font-body">{error}</p>}

              <button
                type="submit"
                disabled={sending}
                className="w-full bg-olive-700 text-cream rounded-full py-3.5 text-sm tracking-widest uppercase hover:bg-olive-800 transition-colors disabled:opacity-50"
              >
                {sending ? d.rsvp.submitting : d.rsvp.submit}
              </button>
            </form>
          </Reveal>
        )}
      </div>
    </section>
  );
}
