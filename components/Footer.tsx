import type { Dict } from "@/lib/i18n/dictionaries";

export default function Footer({
  brideName,
  groomName,
  dateText,
  city,
  d,
}: {
  brideName: string;
  groomName: string;
  dateText: string;
  city: string;
  d: Dict;
}) {
  return (
    <footer className="py-16 pb-28 px-6 bg-olive-800 text-cream/80 text-center">
      <p className="font-display italic text-2xl text-cream mb-3">
        {brideName} & {groomName}
      </p>
      <p className="font-body text-sm mb-8">{d.footer.thanks}</p>
      <p className="text-xs text-cream/50 font-body">
        {dateText}
        {dateText && city ? " · " : ""}
        {city}
      </p>
    </footer>
  );
}
