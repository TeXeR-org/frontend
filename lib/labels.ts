/**
 * Labels a person colors. A label's color is one of the theme's ten hues, so
 * it reads right in light and dark. Older labels saved a hex value from the
 * previous picker; those map to their nearest hue for display.
 */

export const LABEL_HUES = [
  "grey",
  "red",
  "orange",
  "amber",
  "green",
  "teal",
  "blue",
  "indigo",
  "purple",
  "pink",
] as const;

export type LabelHue = (typeof LABEL_HUES)[number];

/** The hue each class names, written out so the class scanner sees each one: `tone` for a label chip (the kit's Badge tone, read as --badge-tone), `swatch` for a color picker swatch (the kit's colorSwatch, read as --swatch). */
export const LABEL_HUE_CLASSES: Record<LabelHue, { tone: string; swatch: string }> = {
  grey: { tone: "[--badge-tone:var(--hue-grey)]", swatch: "[--swatch:var(--hue-grey)]" },
  red: { tone: "[--badge-tone:var(--hue-red)]", swatch: "[--swatch:var(--hue-red)]" },
  orange: { tone: "[--badge-tone:var(--hue-orange)]", swatch: "[--swatch:var(--hue-orange)]" },
  amber: { tone: "[--badge-tone:var(--hue-amber)]", swatch: "[--swatch:var(--hue-amber)]" },
  green: { tone: "[--badge-tone:var(--hue-green)]", swatch: "[--swatch:var(--hue-green)]" },
  teal: { tone: "[--badge-tone:var(--hue-teal)]", swatch: "[--swatch:var(--hue-teal)]" },
  blue: { tone: "[--badge-tone:var(--hue-blue)]", swatch: "[--swatch:var(--hue-blue)]" },
  indigo: { tone: "[--badge-tone:var(--hue-indigo)]", swatch: "[--swatch:var(--hue-indigo)]" },
  purple: { tone: "[--badge-tone:var(--hue-purple)]", swatch: "[--swatch:var(--hue-purple)]" },
  pink: { tone: "[--badge-tone:var(--hue-pink)]", swatch: "[--swatch:var(--hue-pink)]" },
};

export const LABEL_HUE_NAMES: Record<LabelHue, string> = {
  grey: "Grey",
  red: "Red",
  orange: "Orange",
  amber: "Amber",
  green: "Green",
  teal: "Teal",
  blue: "Blue",
  indigo: "Indigo",
  purple: "Purple",
  pink: "Pink",
};

function isHue(value: string): value is LabelHue {
  return (LABEL_HUES as readonly string[]).includes(value);
}

/** Where each hue sits on the HSV wheel (degrees), for matching a legacy hex. */
const HUE_ANGLES: [LabelHue, number][] = [
  ["red", 0],
  ["orange", 25],
  ["amber", 55],
  ["green", 115],
  ["teal", 170],
  ["blue", 220],
  ["indigo", 255],
  ["purple", 285],
  ["pink", 330],
];

/** A stored label color (a hue name, or a legacy hex) as one of the ten hues. */
export function labelHue(color: string | null | undefined): LabelHue | null {
  if (!color) return null;
  const value = color.trim().toLowerCase();
  if (isHue(value)) return value;
  const hex = /^#?([0-9a-f]{6})$/.exec(value)?.[1];
  if (!hex) return null;
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  if (max - min < 0.08) return "grey";
  let h: number;
  if (max === r) h = ((g - b) / (max - min)) % 6;
  else if (max === g) h = (b - r) / (max - min) + 2;
  else h = (r - g) / (max - min) + 4;
  const angle = (h * 60 + 360) % 360;
  let best: LabelHue = "grey";
  let distance = Infinity;
  for (const [hue, a] of HUE_ANGLES) {
    const d = Math.min(Math.abs(angle - a), 360 - Math.abs(angle - a));
    if (d < distance) {
      distance = d;
      best = hue;
    }
  }
  return best;
}
