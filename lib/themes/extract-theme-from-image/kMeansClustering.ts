import { LAB } from "./types";

export type Cluster = {
  center: LAB;      // The representative color
  count: number;    // How many pixels belong to this cluster (for weighting)
};

const MAX_ITERATIONS = 20;

/**
 * K-means clustering to find k dominant colors in LAB space.
 * Returns cluster centers sorted by frequency (most common first).
 */
export const kMeansClustering = (data: LAB[], k: number): Cluster[] => {
  if (data.length === 0) return [];
  if (data.length <= k) {
    // Fewer pixels than clusters - each pixel is its own cluster
    return data.map((lab) => ({ center: lab, count: 1 }));
  }

  // Step 1: Initialize centers using k-means++ for better starting positions
  let centers = initializeCenters(data, k);

  // Track which cluster each pixel belongs to
  let assignments = new Array(data.length).fill(0);

  for (let iter = 0; iter < MAX_ITERATIONS; iter++) {
    // Step 2: Assign each pixel to the nearest center
    let changed = false;
    for (let i = 0; i < data.length; i++) {
      const nearest = findNearestCenter(data[i], centers);
      if (assignments[i] !== nearest) {
        assignments[i] = nearest;
        changed = true;
      }
    }

    // If no assignments changed, we've converged
    if (!changed) break;

    // Step 3: Update centers to the mean of assigned pixels
    centers = updateCenters(data, assignments, k);
  }

  // Count pixels per cluster and return sorted by frequency
  const counts = new Array(k).fill(0);
  for (const assignment of assignments) {
    counts[assignment]++;
  }

  const clusters: Cluster[] = centers.map((center, i) => ({
    center,
    count: counts[i],
  }));

  // Sort by count (most frequent first)
  return clusters.sort((a, b) => b.count - a.count);
};

/**
 * Initialize centers using k-means++ algorithm.
 * Spreads initial centers apart for better convergence.
 */
function initializeCenters(data: LAB[], k: number): LAB[] {
  const centers: LAB[] = [];

  // Pick first center randomly
  const firstIndex = Math.floor(Math.random() * data.length);
  centers.push([...data[firstIndex]]);

  // Pick remaining centers with probability proportional to distance squared
  for (let i = 1; i < k; i++) {
    const distances = data.map((point) => {
      // Find distance to nearest existing center
      let minDist = Infinity;
      for (const center of centers) {
        const dist = labDistance(point, center);
        if (dist < minDist) minDist = dist;
      }
      return minDist * minDist; // Square for probability weighting
    });

    // Pick next center with probability proportional to distance squared
    const totalDist = distances.reduce((a, b) => a + b, 0);
    let random = Math.random() * totalDist;
    let nextIndex = 0;

    for (let j = 0; j < distances.length; j++) {
      random -= distances[j];
      if (random <= 0) {
        nextIndex = j;
        break;
      }
    }

    centers.push([...data[nextIndex]]);
  }

  return centers;
}

/**
 * Find the index of the nearest center to a given point.
 */
function findNearestCenter(point: LAB, centers: LAB[]): number {
  let minDist = Infinity;
  let nearest = 0;

  for (let i = 0; i < centers.length; i++) {
    const dist = labDistance(point, centers[i]);
    if (dist < minDist) {
      minDist = dist;
      nearest = i;
    }
  }

  return nearest;
}

/**
 * Update centers to the mean of their assigned pixels.
 */
function updateCenters(data: LAB[], assignments: number[], k: number): LAB[] {
  const sums: [number, number, number][] = Array.from({ length: k }, () => [0, 0, 0]);
  const counts = new Array(k).fill(0);

  for (let i = 0; i < data.length; i++) {
    const cluster = assignments[i];
    sums[cluster][0] += data[i][0];
    sums[cluster][1] += data[i][1];
    sums[cluster][2] += data[i][2];
    counts[cluster]++;
  }

  return sums.map((sum, i) => {
    const count = counts[i] || 1; // Avoid division by zero
    return [sum[0] / count, sum[1] / count, sum[2] / count] as LAB;
  });
}

/**
 * Euclidean distance in LAB space.
 * This approximates perceptual color difference.
 */
function labDistance(a: LAB, b: LAB): number {
  const dL = a[0] - b[0];
  const dA = a[1] - b[1];
  const dB = a[2] - b[2];
  return Math.sqrt(dL * dL + dA * dA + dB * dB);
}