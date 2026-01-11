"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { extractThemeFromImage } from "@/lib/themes/extract-theme-from-image";
import { ThemeColor } from "@/lib/themes/extract-theme-from-image/types";
import { applyThemeToDocument, resetTheme } from "@/lib/themes/apply-theme";

export default function AlbumCoverUploader() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [themeColors, setThemeColors] = useState<ThemeColor | null>(null);

  useEffect(() => {
    if (!file) return;

    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    return () => URL.revokeObjectURL(url);
  }, [file]);

  const handleExtractThemeFromImage = async () => {
    if (!file) return;
    const theme = await extractThemeFromImage(file);
    setThemeColors(theme);
    applyThemeToDocument(theme); // Apply the theme to the entire app
    console.log("theme:", theme);
  };

  const handleResetTheme = () => {
    resetTheme();
    setThemeColors(null);
  };

  return (
    <div className="min-h-screen p-6 space-y-4">
      <h1 className="text-xl font-semibold">Theme Lab</h1>

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files?.[0] ?? null)}
      />

      {previewUrl && (
        <img
          src={previewUrl}
          alt="Album cover preview"
          className="w-64 h-64 object-cover rounded-lg border"
        />
      )}
      <div className="flex gap-2">
        {file && (
          <Button onClick={handleExtractThemeFromImage}>Extract Theme</Button>
        )}
      </div>
      {themeColors && (
        <div className="space-y-3">
          <h2 className="font-medium">Theme Colors</h2>
          <div className="flex gap-4">
            {(
              [
                { label: "Primary", color: themeColors.primary },
                { label: "Secondary", color: themeColors.secondary },
                { label: "Accent", color: themeColors.accent },
                { label: "Background", color: themeColors.background },
              ] as const
            ).map(({ label, color }) => (
              <div key={label} className="flex flex-col items-center gap-1">
                <div
                  className="w-12 h-12 rounded-full border border-gray-300 shadow-sm"
                  style={{ backgroundColor: color }}
                  title={color}
                />
                <span className="text-xs text-muted-foreground">{label}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
