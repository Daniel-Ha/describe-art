"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Moon, Sun } from "lucide-react";
import { getThemesFromStylesheets } from "@/lib/themes/utils";
import { ThemeSwatch } from "./ThemeSwatch";

type Mode = "light" | "dark";

// Default theme if none found
const DEFAULT_THEME = "blue";

function applyTheme(theme: string, mode: Mode) {
  document.documentElement.setAttribute("data-theme", theme);
  if (mode === "dark") {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
  localStorage.setItem("theme", theme);
  localStorage.setItem("mode", mode);
}

export function ThemeSwitcher() {
  const [themes, setThemes] = useState<string[]>([]);
  const [theme, setTheme] = useState<string>(DEFAULT_THEME);
  const [mode, setMode] = useState<Mode>("light");

  // Detect themes from stylesheets and load saved preferences on mount
  useEffect(() => {
    // Small delay to ensure stylesheets are loaded
    const timer = setTimeout(() => {
      const detectedThemes = getThemesFromStylesheets();
      const availableThemes = detectedThemes.length > 0 ? detectedThemes : [DEFAULT_THEME];
      setThemes(availableThemes);
      
      const savedTheme = localStorage.getItem("theme");
      const savedMode = localStorage.getItem("mode") as Mode | null;

      const initialTheme =
        savedTheme && availableThemes.includes(savedTheme) ? savedTheme : availableThemes[0];
      const initialMode = savedMode === "dark" ? "dark" : "light";

      setTheme(initialTheme);
      setMode(initialMode);
      applyTheme(initialTheme, initialMode);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
    applyTheme(newTheme, mode);
  };

  const toggleMode = () => {
    const newMode = mode === "light" ? "dark" : "light";
    setMode(newMode);
    applyTheme(theme, newMode);
  };

  return (
    <div className="flex items-center gap-2">
      {/* Dark/Light mode toggle */}
      <Button variant="outline" size="icon" onClick={toggleMode}>
        {mode === "light" ? (
          <Sun className="h-4 w-4" />
        ) : (
          <Moon className="h-4 w-4" />
        )}
      </Button>
      {/* Theme selector dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="px-2">
            <ThemeSwatch theme={theme} mode={mode} size={18} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {themes.map((t) => (
            <DropdownMenuItem
              key={t}
              onClick={() => handleThemeChange(t)}
              onSelect={(e) => e.preventDefault()}
              className={`flex items-center gap-3 ${theme === t ? "bg-accent" : ""}`}
            >
              <ThemeSwatch theme={t} mode={mode} size={28} />
              <span className="capitalize">{t.replace(/-/g, " ")}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
