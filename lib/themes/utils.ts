// Extract theme names from loaded stylesheets by finding [data-theme="..."] selectors
export function getThemesFromStylesheets(): string[] {
  if (typeof document === "undefined") return [];

  const themes = new Set<string>();
  const themeRegex = /\[data-theme=["']([^"']+)["']\]/g;

  try {
    for (const sheet of document.styleSheets) {
      try {
        const rules = sheet.cssRules || sheet.rules;
        for (const rule of rules) {
          if (rule instanceof CSSStyleRule) {
            let match;
            while ((match = themeRegex.exec(rule.selectorText)) !== null) {
              // Skip if it's a .dark variant (we only want base theme names)
              if (!rule.selectorText.includes(".dark")) {
                themes.add(match[1]);
              }
            }
          }
        }
      } catch {
        // Can't access cross-origin stylesheets, skip silently
      }
    }
  } catch {
    // Fallback if stylesheet parsing fails
  }

  return Array.from(themes);
}
