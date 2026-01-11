import { getPixelData } from "./get-pixel-data";
import { ThemeColor } from "./types";
import { convertToLAB, convertClustersToHSL } from "./color-conversions";
import { kMeansClustering } from "./kMeansClustering";
import { scoreAndAssignRoles } from "./score-and-assign-roles";

export const extractThemeFromImage = async (
  image: File
): Promise<ThemeColor> => {
  // 1. Sample pixels from downscaled image (RGB)
  const pixelData = await getPixelData(image);

  // 2. Convert to LAB for clustering
  const labData = convertToLAB(pixelData);

  // 3. cluster in LAB space
  const clusters = kMeansClustering(labData, 6); // 6 dominant colors

  // 4. Convert cluster centers to HSL for classification
  const hslClusters = convertClustersToHSL(clusters); // 6 HSL colors

  // 4. Score & assign roles based on saturation, lightness, frequency
  const scores = scoreAndAssignRoles(hslClusters);

  return scores;
};
