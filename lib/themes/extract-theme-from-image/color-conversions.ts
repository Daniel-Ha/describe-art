import { LAB, RGB } from "./types";
import convert from "color-convert";
import { Cluster } from "./kMeansClustering";

export type HSL = [h: number, s: number, l: number];
export type OKLCH = [l: number, c: number, h: number];

export type HSLCluster = {
  center: HSL;
  count: number;
};

export const convertToLAB = (rgbPixels: RGB[]): LAB[] => {
  return rgbPixels.map((rgb) => convert.rgb.lab(rgb));
};

/**
 * Convert LAB cluster centers to HSL for classification.
 * Preserves the count (frequency) for each cluster.
 */
export const convertClustersToHSL = (clusters: Cluster[]): HSLCluster[] => {
  return clusters.map((cluster) => ({
    center: convert.lab.hsl(cluster.center) as HSL,
    count: cluster.count,
  }));
};

/**
 * Convert HSL to OKLCH.
 * Pipeline: HSL → RGB → Linear RGB → OKLAB → OKLCH
 */
export function hslToOklch(hsl: HSL): OKLCH {
  // Step 1: HSL → RGB (0-255)
  const rgb = convert.hsl.rgb(hsl) as RGB;

  // Step 2: RGB → Linear RGB (0-1, with gamma correction)
  let [r, g, b] = rgb.map((c) => {
    const normalized = c / 255;
    return normalized <= 0.04045
      ? normalized / 12.92
      : Math.pow((normalized + 0.055) / 1.055, 2.4);
  });

  // Step 3: Linear RGB → OKLAB
  // Using the OKLAB transformation matrices
  const l_ = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m_ = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s_ = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);

  const okL = 0.2104542553 * l_ + 0.793617785 * m_ - 0.0040720468 * s_;
  const okA = 1.9779984951 * l_ - 2.428592205 * m_ + 0.4505937099 * s_;
  const okB = 0.0259040371 * l_ + 0.7827717662 * m_ - 0.808675766 * s_;

  // Step 4: OKLAB → OKLCH (polar coordinates)
  const C = Math.sqrt(okA * okA + okB * okB);
  let H = (Math.atan2(okB, okA) * 180) / Math.PI;
  if (H < 0) H += 360;

  // L is 0-1, C is typically 0-0.4, H is 0-360
  return [okL, C, H];
}

/**
 * Convert OKLCH to CSS string format.
 */
export function oklchToString([l, c, h]: OKLCH): string {
  return `oklch(${(l * 100).toFixed(1)}% ${c.toFixed(3)} ${h.toFixed(1)})`;
}
