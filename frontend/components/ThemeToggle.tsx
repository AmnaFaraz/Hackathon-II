"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="w-20 h-9 bg-bg-surface rounded-full border border-border-primary" />;

  const isDark = theme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={cn(
        "relative flex h-9 w-20 items-center rounded-full border border-border-primary p-1 transition-colors duration-300 btn-click",
        isDark ? "bg-[#0D1117]" : "bg-[#F6F8FA]"
      )}
    >
      <div
        className={cn(
          "flex h-7 w-7 items-center justify-center rounded-full bg-accent-primary text-bg-primary transition-all duration-300 shadow-md",
          isDark ? "translate-x-11" : "translate-x-0"
        )}
      >
        {isDark ? <Moon size={14} /> : <Sun size={14} />}
      </div>
      <span
        className={cn(
          "absolute text-[10px] font-bold uppercase transition-all duration-300",
          isDark ? "left-3 text-text-secondary" : "right-3 text-text-secondary"
        )}
      >
        {isDark ? "Dark" : "Light"}
      </span>
    </button>
  );
}
