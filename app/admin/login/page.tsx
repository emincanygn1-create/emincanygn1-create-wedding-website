"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (signInError) {
      setError("E-posta veya şifre hatalı.");
      return;
    }

    router.push("/admin");
    router.refresh();
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-cream px-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-white border border-olive-200 rounded-2xl p-8"
      >
        <h1 className="font-display text-2xl text-olive-800 text-center mb-2">
          Yönetim Paneli
        </h1>
        <p className="text-center text-olive-500 text-sm font-body mb-8">
          Giriş yapmak için bilgilerini gir
        </p>

        <label className="block text-xs eyebrow mb-2">E-posta</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-olive-200 rounded-lg px-4 py-2 mb-4 font-body text-sm"
        />

        <label className="block text-xs eyebrow mb-2">Şifre</label>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-olive-200 rounded-lg px-4 py-2 mb-6 font-body text-sm"
        />

        {error && (
          <p className="text-rust text-sm mb-4 font-body">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-olive-700 text-cream rounded-full py-3 text-sm tracking-wide hover:bg-olive-800 transition-colors disabled:opacity-50"
        >
          {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
        </button>
      </form>
    </main>
  );
}
