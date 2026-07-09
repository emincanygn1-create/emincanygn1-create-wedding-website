"use client";

/**
 * Kök layout'un kendisi çökerse burası devreye girer.
 * Kendi <html> ve <body> etiketlerini yazmak zorunda —
 * bu yüzden Tailwind sınıflarına güvenmiyor, satır içi stil kullanıyor.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="tr">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "1.25rem",
          backgroundColor: "#2C3823",
          color: "#FAF6EC",
          fontFamily: "system-ui, sans-serif",
          textAlign: "center",
          padding: "1.5rem",
        }}
      >
        <p style={{ fontSize: "2rem", color: "#E3C766", margin: 0 }}>&hearts;</p>
        <h1 style={{ fontSize: "1.5rem", fontWeight: 400, margin: 0 }}>
          Bir şeyler ters gitti
        </h1>
        <p style={{ maxWidth: "24rem", opacity: 0.7, fontSize: "0.875rem", margin: 0 }}>
          Beklenmedik bir hata oluştu. Lütfen sayfayı yenileyin.
        </p>
        <button
          onClick={reset}
          style={{
            marginTop: "0.5rem",
            padding: "0.9rem 2rem",
            borderRadius: "999px",
            border: "1px solid #C9A227",
            background: "transparent",
            color: "#FAF6EC",
            letterSpacing: "0.2em",
            fontSize: "0.7rem",
            textTransform: "uppercase",
            cursor: "pointer",
          }}
        >
          Tekrar dene
        </button>
        <p style={{ fontSize: "0.65rem", opacity: 0.35, marginTop: "1rem" }}>
          {error.digest}
        </p>
      </body>
    </html>
  );
}
