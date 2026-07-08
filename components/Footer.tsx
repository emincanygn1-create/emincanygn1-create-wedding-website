export default function Footer({
  brideName,
  groomName,
  dateText,
  city,
}: {
  brideName: string;
  groomName: string;
  dateText: string;
  city: string;
}) {
  return (
    <footer className="py-16 px-6 bg-olive-800 text-cream/80 text-center">
      <p className="font-display italic text-2xl text-cream mb-3">
        {brideName} & {groomName}
      </p>
      <p className="font-body text-sm mb-8">
        Bizimle bu özel günü paylaştığınız için teşekkür ederiz.
      </p>
      <p className="text-xs text-cream/50 font-body">
        {dateText}{dateText && city ? " · " : ""}{city}
      </p>
    </footer>
  );
}
