import { cn } from "@/lib/utils";
import { LABEL_HUE_CLASSES, labelHue } from "@/lib/labels";

/** A label on a listing row, as the kit draws one (Thry ui feedback/Badge with a hue tone): the hue's tint as the plate and the hue as the text, darkened toward the text color in light mode so it stays readable. An uncolored label is the neutral badge. */
export function LabelChip({ label, color, className }: { label: string; color?: string | null; className?: string }) {
  const hue = labelHue(color);
  return (
    <span
      data-tone={hue ?? undefined}
      className={cn(
        "badge inline-flex h-5 max-w-40 shrink-0 items-center rounded-[var(--radius-inset)] bg-surface-hover px-1.5 type-micro leading-none font-semibold whitespace-nowrap text-muted-foreground",
        "data-tone:bg-[color-mix(in_oklch,var(--badge-tone)_18%,transparent)] data-tone:text-[var(--badge-tone)] light:data-tone:text-[color-mix(in_oklch,var(--badge-tone)_80%,var(--foreground))]",
        hue && LABEL_HUE_CLASSES[hue].tone,
        className,
      )}
    >
      <span className="truncate">{label}</span>
    </span>
  );
}
