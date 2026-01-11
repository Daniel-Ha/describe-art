import { HSL, HSLCluster, hslToOklch, oklchToString } from "./color-conversions";
import { ThemeColor } from "./types";

type ScoredCluster = HSLCluster & {
  backgroundScore: number;
  primaryScore: number;
  accentScore: number;
};

/**
 * Analyze HSL clusters and assign them to semantic roles:
 * primary, secondary, accent, background
 */
export const scoreAndAssignRoles = (hslClusters: HSLCluster[]): ThemeColor => {
  if (hslClusters.length === 0) {
    // Fallback defaults in OKLCH
    return {
      primary: "oklch(55% 0.15 250)",
      secondary: "oklch(50% 0.12 230)",
      accent: "oklch(60% 0.2 15)",
      background: "oklch(95% 0 0)",
    };
  }

  // Calculate total pixels for frequency percentage
  const totalPixels = hslClusters.reduce((sum, c) => sum + c.count, 0);

  // Score each cluster for each role
  const scored: ScoredCluster[] = hslClusters.map((cluster) => {
    const [h, s, l] = cluster.center;
    const frequency = cluster.count / totalPixels;

    // Background score: low saturation OR extreme lightness
    let backgroundScore = 0;
    if (s < 15) backgroundScore += 50; // Very desaturated → likely background
    if (l > 85 || l < 15) backgroundScore += 40; // Very light or dark
    if (frequency > 0.25) backgroundScore += 20; // Large area coverage
    backgroundScore += (100 - s) * 0.3; // Less saturated = more background-like

    // Primary score: chromatic + frequent
    let primaryScore = 0;
    if (s > 25) primaryScore += 30; // Must have some saturation
    if (s > 40) primaryScore += 20; // Bonus for more saturation
    if (l > 20 && l < 80) primaryScore += 20; // Not too extreme lightness
    primaryScore += frequency * 100; // Frequency matters a lot
    primaryScore += s * 0.3; // More saturated = better primary

    // Accent score: high saturation, can be less frequent
    let accentScore = 0;
    if (s > 50) accentScore += 40; // High saturation is key
    if (s > 70) accentScore += 30; // Very saturated = great accent
    if (l > 30 && l < 70) accentScore += 20; // Mid-range lightness
    accentScore += s * 0.5; // Saturation is the main factor

    return {
      ...cluster,
      backgroundScore,
      primaryScore,
      accentScore,
    };
  });

  // Assign roles by picking best candidate for each
  const used = new Set<number>();

  // 1. Pick background (highest background score)
  const backgroundIdx = pickBest(scored, "backgroundScore", used);
  used.add(backgroundIdx);

  // 2. Pick primary (highest primary score among remaining)
  const primaryIdx = pickBest(scored, "primaryScore", used);
  used.add(primaryIdx);

  // 3. Pick accent (highest accent score, should contrast with primary)
  const accentIdx = pickBestAccent(scored, scored[primaryIdx], used);
  used.add(accentIdx);

  // 4. Pick secondary (remaining with decent saturation, different from primary)
  const secondaryIdx = pickSecondary(scored, scored[primaryIdx], used);

  return {
    background: oklchToString(hslToOklch(scored[backgroundIdx].center)),
    primary: oklchToString(hslToOklch(scored[primaryIdx].center)),
    secondary: oklchToString(hslToOklch(scored[secondaryIdx].center)),
    accent: oklchToString(hslToOklch(scored[accentIdx].center)),
  };
};

/**
 * Pick the cluster with the highest score for a given role.
 */
function pickBest(
  clusters: ScoredCluster[],
  scoreKey: keyof ScoredCluster,
  used: Set<number>
): number {
  let bestIdx = 0;
  let bestScore = -Infinity;

  for (let i = 0; i < clusters.length; i++) {
    if (used.has(i)) continue;
    const score = clusters[i][scoreKey] as number;
    if (score > bestScore) {
      bestScore = score;
      bestIdx = i;
    }
  }

  return bestIdx;
}

/**
 * Pick accent: high saturation + contrasting hue from primary.
 */
function pickBestAccent(
  clusters: ScoredCluster[],
  primary: ScoredCluster,
  used: Set<number>
): number {
  const primaryHue = primary.center[0];
  let bestIdx = 0;
  let bestScore = -Infinity;

  for (let i = 0; i < clusters.length; i++) {
    if (used.has(i)) continue;

    const cluster = clusters[i];
    let score = cluster.accentScore;

    // Bonus for contrasting hue (opposite side of color wheel)
    const hueDiff = Math.abs(cluster.center[0] - primaryHue);
    const hueDistance = Math.min(hueDiff, 360 - hueDiff);
    score += hueDistance * 0.2; // Reward hue contrast

    if (score > bestScore) {
      bestScore = score;
      bestIdx = i;
    }
  }

  return bestIdx;
}

/**
 * Pick secondary: different from primary, decent saturation.
 */
function pickSecondary(
  clusters: ScoredCluster[],
  primary: ScoredCluster,
  used: Set<number>
): number {
  const primaryHue = primary.center[0];
  let bestIdx = 0;
  let bestScore = -Infinity;

  for (let i = 0; i < clusters.length; i++) {
    if (used.has(i)) continue;

    const cluster = clusters[i];
    const [h, s, l] = cluster.center;

    let score = 0;
    score += s * 0.5; // Some saturation preferred
    score += cluster.count * 0.001; // Frequency helps

    // Prefer different hue from primary (but not as extreme as accent)
    const hueDiff = Math.abs(h - primaryHue);
    const hueDistance = Math.min(hueDiff, 360 - hueDiff);
    score += hueDistance * 0.1;

    // Prefer mid-range lightness
    if (l > 25 && l < 75) score += 20;

    if (score > bestScore) {
      bestScore = score;
      bestIdx = i;
    }
  }

  // If nothing unused, fall back to first unused or 0
  if (used.has(bestIdx)) {
    for (let i = 0; i < clusters.length; i++) {
      if (!used.has(i)) return i;
    }
    return 0;
  }

  return bestIdx;
}

