import { RGB } from "./types";

const SAMPLE_SIZE = 64; // Downscale to 64x64 for performance

/**
 * Loads an image file and extracts RGB pixel data from a downscaled version.
 * Downscaling reduces noise and improves clustering performance.
 */
export async function getPixelData(file: File): Promise<RGB[]> {
  // Load file as an HTMLImageElement
  const img = await loadImage(file);

  // Create an offscreen canvas at the sample size
  const canvas = document.createElement("canvas");
  canvas.width = SAMPLE_SIZE;
  canvas.height = SAMPLE_SIZE;

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not get canvas context");

  // Draw the image scaled down to SAMPLE_SIZE x SAMPLE_SIZE
  ctx.drawImage(img, 0, 0, SAMPLE_SIZE, SAMPLE_SIZE);

  // Get raw pixel data (RGBA format, 4 values per pixel)
  const imageData = ctx.getImageData(0, 0, SAMPLE_SIZE, SAMPLE_SIZE);
  const { data } = imageData;

  const pixels: RGB[] = [];

  // Extract RGB values, skipping transparent pixels
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const a = data[i + 3];

    // Skip pixels with low alpha (transparent)
    if (a < 128) continue;

    pixels.push([r, g, b]);
  }

  return pixels;
}

/**
 * Helper to load a File as an HTMLImageElement
 */
function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(img.src); // Clean up
      resolve(img);
    };
    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = URL.createObjectURL(file);
  });
}
