"use client";

import React, { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { sound } from "@/lib/sound";

export function ThemeToggle() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem("ro-theme") as "dark" | "light" | null;
    if (savedTheme) {
      setTheme(savedTheme);
      applyTheme(savedTheme);
    } else {
      // Default to dark
      applyTheme("dark");
    }
  }, []);

  const applyTheme = (t: "dark" | "light") => {
    const root = document.documentElement;
    if (t === "light") {
      root.classList.remove("dark");
      root.classList.add("light");
      root.setAttribute("data-theme", "light");
    } else {
      root.classList.remove("light");
      root.classList.add("dark");
      root.setAttribute("data-theme", "dark");
    }
  };

  const toggleTheme = () => {
    try {
      sound.playClick();
    } catch {}
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    applyTheme(newTheme);
    localStorage.setItem("ro-theme", newTheme);
  };

  if (!mounted) {
    return (
      <button
        type="button"
        aria-label="Toggle theme"
        className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/80 transition-colors"
      >
        <Sun className="h-4 w-4" />
      </button>
    );
  }

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to editorial light theme" : "Switch to cinema dark theme"}
      title={isDark ? "Switch to light theme" : "Switch to dark theme"}
      data-cursor={isDark ? "LIGHT" : "DARK"}
      className="group relative flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/80 hover:border-orchid hover:bg-orchid/15 hover:text-white transition-all duration-300 cursor-pointer active:scale-90 touch-manipulation"
    >
      <div className="relative flex items-center justify-center">
        {isDark ? (
          <Sun className="h-4 w-4 transition-transform duration-300 group-hover:rotate-45 text-amber-300" />
        ) : (
          <Moon className="h-4 w-4 transition-transform duration-300 group-hover:-rotate-12 text-orchid" />
        )}
      </div>
    </button>
  );
}

export default ThemeToggle;
