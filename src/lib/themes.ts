// The colour tokens components already use by role: ink is the background, paper the text, ink-2 a raised surface.
// A chapter theme gives each role a value, so swapping the values recolours the page without touching a class.
export const TOKENS = ["ink", "ink-2", "paper", "muted", "line", "accent"] as const;
export type Token = (typeof TOKENS)[number];
export type Theme = Record<Token, string>;

export const THEMES = {
  ink: { ink: "#0c0c0b", "ink-2": "#161614", paper: "#efede6", muted: "#8f8d85", line: "#2a2a27", accent: "#d4ff3a" },
  // Lime fails on cream, so paper chapters carry a deep olive accent instead.
  paper: { ink: "#efede6", "ink-2": "#e4e1d7", paper: "#0c0c0b", muted: "#65635c", line: "#cfccc2", accent: "#3d5200" },
  lime: { ink: "#d4ff3a", "ink-2": "#c6f02c", paper: "#0c0c0b", muted: "#3f4d12", line: "#a9cc2e", accent: "#0c0c0b" },
} satisfies Record<string, Theme>;

export type ThemeName = keyof typeof THEMES;
export const THEME_NAMES = Object.keys(THEMES) as ThemeName[];

export function isThemeName(value: string | undefined): value is ThemeName {
  return value !== undefined && Object.hasOwn(THEMES, value);
}

const channels = (hex: string) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
const toHex = (values: number[]) => `#${values.map((v) => Math.round(v).toString(16).padStart(2, "0")).join("")}`;

// Surfaces blend with the scroll; text and its companions flip at once, at the point where the incoming text colour
// starts to beat the outgoing one against the surface of that moment. Blending text too would pass it through the
// same grey as the surface and leave a stretch of unreadable copy.
const SURFACES: readonly Token[] = ["ink", "ink-2"];

const mix = (a: string, b: string, t: number) => {
  const start = channels(a);
  const end = channels(b);
  return toHex(start.map((value, i) => value + (end[i] - value) * t));
};

export function blendThemes(from: ThemeName, to: ThemeName, progress: number): Theme {
  const t = Math.min(1, Math.max(0, progress));
  const a = THEMES[from];
  const b = THEMES[to];
  const surface = mix(a.ink, b.ink, t);
  const text = t >= 1 || contrast(b.paper, surface) > contrast(a.paper, surface) ? b : a;
  const blended = {} as Theme;
  for (const token of TOKENS) blended[token] = SURFACES.includes(token) ? mix(a[token], b[token], t) : text[token];
  return blended;
}

function luminance(hex: string) {
  const [r, g, b] = channels(hex).map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrast(a: string, b: string) {
  const [high, low] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (high + 0.05) / (low + 0.05);
}
