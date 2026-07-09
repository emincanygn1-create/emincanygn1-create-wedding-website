/** Sunucu veriyi hazırlarken görünen sade bekleme ekranı. */
export default function Loading() {
  return (
    <div className="flex min-h-[100svh] flex-col items-center justify-center bg-olive-900 text-cream">
      <span className="spinner text-2xl text-gold-light" />
      <span className="sr-only">Yükleniyor</span>
    </div>
  );
}
