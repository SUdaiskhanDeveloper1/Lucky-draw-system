"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "./button";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return <div className="h-10 w-10" />;

  const isDark = theme === "dark";

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      title={isDark ? "Light mode" : "Dark mode"}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="relative overflow-hidden rounded-full"
    >
      <Sun
        className={`h-5 w-5 transition-all duration-500 ease-out-expo ${
          isDark
            ? "rotate-0 scale-100 opacity-100"
            : "absolute -rotate-90 scale-0 opacity-0"
        }`}
      />
      <Moon
        className={`h-5 w-5 transition-all duration-500 ease-out-expo ${
          isDark
            ? "absolute rotate-90 scale-0 opacity-0"
            : "rotate-0 scale-100 opacity-100"
        }`}
      />
    </Button>
  );
}
