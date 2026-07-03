"use client";

import { useEffect, useState } from "react";

type TypewriterLineProps = {
  text: string;
  active: boolean;
  speed?: number;
  showPrompt?: boolean;
  className?: string;
  onComplete?: () => void;
};

export function TypewriterLine({
  text,
  active,
  speed = 32,
  showPrompt = false,
  className = "",
  onComplete,
}: TypewriterLineProps) {
  const [length, setLength] = useState(active ? 0 : text.length);
  const done = !active || length >= text.length;

  useEffect(() => {
    if (!active) {
      return;
    }

    if (text.length === 0) {
      onComplete?.();
      return;
    }

    let index = 0;
    const timer = window.setInterval(() => {
      index += 1;
      setLength(index);

      if (index >= text.length) {
        window.clearInterval(timer);
        onComplete?.();
      }
    }, speed);

    return () => window.clearInterval(timer);
  }, [active, onComplete, speed, text]);

  const visible = text.slice(0, active ? length : text.length);

  return (
    <div className={`font-mono text-sm ${className}`}>
      {showPrompt ? <span className="text-mist">{"> "}</span> : null}
      <span className={showPrompt ? "font-semibold text-ink" : "text-ink"}>{visible}</span>
      {active && !done ? (
        <span className="ml-0.5 inline-block animate-pulse text-code-teal">▋</span>
      ) : null}
    </div>
  );
}
