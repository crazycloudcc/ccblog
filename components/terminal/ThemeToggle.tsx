"use client";

import { useTheme } from "@/components/terminal/ThemeProvider";

export function ThemeToggle() {
  const { preference, resolved, cyclePreference } = useTheme();

  const label =
    preference === "system" ? `system (${resolved})` : preference;

  return (
    <button
      type="button"
      onClick={cyclePreference}
      className="transition-colors hover:text-ink"
      aria-label={`Switch theme, current ${label}`}
      title="Click to cycle: light → dark → system"
    >
      <span className="text-code-teal">theme</span>: {label}
    </button>
  );
}
