import { ThemeColor } from "./extract-theme-from-image/types";

/**
 * Parse an OKLCH string and return its components.
 * Format: "oklch(L% C H)" where L is 0-100, C is 0-0.4+, H is 0-360
 */
function parseOklch(oklch: string): { l: number; c: number; h: number } | null {
  // Match: oklch(50.5% 0.150 250.0) or oklch(50% 0.15 250)
  const match = oklch.match(/oklch\(\s*([\d.]+)%?\s+([\d.]+)\s+([\d.]+)\s*\)/);
  if (!match) return null;

  let l = parseFloat(match[1]);
  // If L > 1, it's a percentage (e.g., 50.5%), convert to 0-1
  if (l > 1) l = l / 100;

  return {
    l,
    c: parseFloat(match[2]),
    h: parseFloat(match[3]),
  };
}

/**
 * Create an OKLCH string from components.
 */
function toOklch(l: number, c: number, h: number): string {
  return `oklch(${(l * 100).toFixed(1)}% ${c.toFixed(3)} ${h.toFixed(1)})`;
}

/**
 * Generate a contrasting foreground color for text readability.
 * Uses the lightness to determine if text should be light or dark.
 */
function getForegroundColor(bgOklch: string): string {
  const parsed = parseOklch(bgOklch);
  if (!parsed) return "oklch(0.145 0 0)"; // fallback dark

  // If background is light (L > 0.5), use dark text; otherwise light text
  if (parsed.l > 0.5) {
    return "oklch(0.145 0 0)"; // Dark text
  } else {
    return "oklch(0.985 0 0)"; // Light text
  }
}

/**
 * Generate a muted version of a color (lower chroma, adjusted lightness).
 */
function getMutedColor(oklch: string, isDark: boolean): string {
  const parsed = parseOklch(oklch);
  if (!parsed) return isDark ? "oklch(0.25 0.01 0)" : "oklch(0.95 0.01 0)";

  if (isDark) {
    return toOklch(0.25, Math.min(parsed.c * 0.3, 0.02), parsed.h);
  } else {
    return toOklch(0.95, Math.min(parsed.c * 0.3, 0.02), parsed.h);
  }
}

/**
 * Generate a border color based on the background.
 */
function getBorderColor(bgOklch: string, isDark: boolean): string {
  const parsed = parseOklch(bgOklch);
  if (!parsed) return isDark ? "oklch(0.3 0.01 0)" : "oklch(0.9 0.01 0)";

  if (isDark) {
    return toOklch(0.3, Math.min(parsed.c * 0.2, 0.02), parsed.h);
  } else {
    return toOklch(0.9, Math.min(parsed.c * 0.2, 0.02), parsed.h);
  }
}

/**
 * Apply extracted theme colors to the document's CSS variables.
 * This makes the entire application use the extracted color palette.
 */
export function applyThemeToDocument(theme: ThemeColor): void {
  const root = document.documentElement;

  // Parse background to determine if it's a dark or light theme
  const bgParsed = parseOklch(theme.background);
  const isDark = bgParsed ? bgParsed.l < 0.5 : false;

  // Set the main colors
  root.style.setProperty("--background", theme.background);
  root.style.setProperty("--foreground", getForegroundColor(theme.background));

  root.style.setProperty("--primary", theme.primary);
  root.style.setProperty("--primary-foreground", getForegroundColor(theme.primary));

  root.style.setProperty("--secondary", theme.secondary);
  root.style.setProperty("--secondary-foreground", getForegroundColor(theme.secondary));

  root.style.setProperty("--accent", theme.accent);
  root.style.setProperty("--accent-foreground", getForegroundColor(theme.accent));

  // Derived colors
  root.style.setProperty("--card", theme.background);
  root.style.setProperty("--card-foreground", getForegroundColor(theme.background));

  root.style.setProperty("--popover", theme.background);
  root.style.setProperty("--popover-foreground", getForegroundColor(theme.background));

  root.style.setProperty("--muted", getMutedColor(theme.background, isDark));
  root.style.setProperty("--muted-foreground", isDark ? "oklch(0.6 0.02 0)" : "oklch(0.5 0.02 0)");

  root.style.setProperty("--border", getBorderColor(theme.background, isDark));
  root.style.setProperty("--input", getBorderColor(theme.background, isDark));
  root.style.setProperty("--ring", theme.primary);

  // Sidebar colors (match main colors)
  root.style.setProperty("--sidebar", theme.background);
  root.style.setProperty("--sidebar-foreground", getForegroundColor(theme.background));
  root.style.setProperty("--sidebar-primary", theme.primary);
  root.style.setProperty("--sidebar-primary-foreground", getForegroundColor(theme.primary));
  root.style.setProperty("--sidebar-accent", theme.accent);
  root.style.setProperty("--sidebar-accent-foreground", getForegroundColor(theme.accent));
  root.style.setProperty("--sidebar-border", getBorderColor(theme.background, isDark));
  root.style.setProperty("--sidebar-ring", theme.primary);

  // Chart colors (use the main palette)
  root.style.setProperty("--chart-1", theme.primary);
  root.style.setProperty("--chart-2", theme.secondary);
  root.style.setProperty("--chart-3", theme.accent);
  root.style.setProperty("--chart-4", theme.background);
  root.style.setProperty("--chart-5", theme.primary);

  console.log("Theme applied:", { theme, isDark });
}

/**
 * Reset the theme to the default by removing inline styles.
 */
export function resetTheme(): void {
  const root = document.documentElement;
  const properties = [
    "--background", "--foreground",
    "--primary", "--primary-foreground",
    "--secondary", "--secondary-foreground",
    "--accent", "--accent-foreground",
    "--card", "--card-foreground",
    "--popover", "--popover-foreground",
    "--muted", "--muted-foreground",
    "--border", "--input", "--ring",
    "--sidebar", "--sidebar-foreground",
    "--sidebar-primary", "--sidebar-primary-foreground",
    "--sidebar-accent", "--sidebar-accent-foreground",
    "--sidebar-border", "--sidebar-ring",
    "--chart-1", "--chart-2", "--chart-3", "--chart-4", "--chart-5",
  ];

  properties.forEach((prop) => root.style.removeProperty(prop));
  console.log("Theme reset to default");
}
