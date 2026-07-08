import { OrnamentDivider } from "./Ornament";

export default function SectionDivider({
  tone = "olive",
}: {
  tone?: "olive" | "cream" | "gold";
}) {
  const color =
    tone === "cream"
      ? "text-cream/50"
      : tone === "gold"
        ? "text-gold"
        : "text-olive-400";

  return (
    <div className="flex items-center justify-center py-10">
      <OrnamentDivider className={`w-52 h-10 ${color}`} />
    </div>
  );
}
