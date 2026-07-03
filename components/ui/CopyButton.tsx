"use client";

import { useState } from "react";

type CopyButtonProps = {
  text: string;
  label?: string;
  copiedLabel?: string;
  className?: string;
};

export function CopyButton({
  text,
  label = "copy",
  copiedLabel = "copied",
  className = "",
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      // ignore clipboard failures
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={`rounded-[4px] border border-lavender-mist px-2 py-0.5 font-mono text-[11px] text-fog transition-colors hover:border-fog/40 hover:text-ink ${className}`}
    >
      {copied ? copiedLabel : label}
    </button>
  );
}
