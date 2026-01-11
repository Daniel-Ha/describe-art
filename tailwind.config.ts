import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Use these like: bg-background, text-foreground, bg-card, text-muted-foreground, etc.
        background: "var(--background)",
        foreground: "var(--foreground)",

        card: "var(--card)",
        "card-foreground": "var(--card-foreground)",

        popover: "var(--popover)",
        "popover-foreground": "var(--popover-foreground)",

        primary: "var(--primary)",
        "primary-foreground": "var(--primary-foreground)",

        secondary: "var(--secondary)",
        "secondary-foreground": "var(--secondary-foreground)",

        muted: "var(--muted)",
        "muted-foreground": "var(--muted-foreground)",

        accent: "var(--accent)",
        "accent-foreground": "var(--accent-foreground)",

        destructive: "var(--destructive)",
        "destructive-foreground": "var(--destructive-foreground)",

        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
      },
      fontFamily: {
        // Uses a CSS variable so themes can swap fonts without changing layout metrics much
        sans: ["var(--font-ui)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        // Use: shadow-theme
        theme: "var(--shadow-elev-1)",
        "theme-lg": "var(--shadow-elev-2)",
      },
    },
  },
  plugins: [],
} satisfies Config;
