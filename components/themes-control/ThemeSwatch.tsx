type Mode = "light" | "dark";

// Square color swatch (2x2 grid) that reads colors from CSS variables
export function ThemeSwatch({
  theme,
  mode,
  size = 18,
}: {
  theme: string;
  mode: Mode;
  size?: number;
}) {
  const cellSize = size * 0.48;
  const gap = size * 0.04;

  return (
    // Wrapper applies the theme's data-theme and dark class so CSS variables resolve correctly
    <div
      data-theme={theme}
      className={mode === "dark" ? "dark" : ""}
      style={{
        width: size,
        height: size,
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gridTemplateRows: "1fr 1fr",
        gap: gap,
      }}
    >
      {/* Top left - Primary */}
      <div
        className="rounded-full"
        style={{
          width: cellSize,
          height: cellSize,
          backgroundColor: "var(--primary)",
        }}
      />
      {/* Top right - Secondary */}
      <div
        className="rounded-full"
        style={{
          width: cellSize,
          height: cellSize,
          backgroundColor: "var(--secondary)",
        }}
      />
      {/* Bottom left - Accent */}
      <div
        className="rounded-full"
        style={{
          width: cellSize,
          height: cellSize,
          backgroundColor: "var(--accent)",
        }}
      />
      {/* Bottom right - Background */}
      <div
        className="rounded-full"
        style={{
          width: cellSize,
          height: cellSize,
          backgroundColor: "var(--background)",
          border: "1px solid var(--border)",
        }}
      />
    </div>
  );
}