"use client";

import { useId, useLayoutEffect, useMemo, useRef, useSyncExternalStore } from "react";
import { buildPlaygroundShareUrl } from "@/lib/playground/share";
import { createShareSession } from "@/lib/playground/share-recovery";
import type { PlaygroundLanguage } from "@/lib/playground/types";

type ShareControlProps = {
  language: PlaygroundLanguage;
  source: string;
  stdin: string;
  navigationKey: string;
  disabled: boolean;
};

export function ShareControl({ language, source, stdin, navigationKey, disabled }: ShareControlProps) {
  const id = useId();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const regionRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const session = useMemo(() => {
    // Navigation invalidates a session even when its editor contents match.
    void navigationKey;
    return createShareSession(
      () => buildPlaygroundShareUrl({ lang: language, source, stdin }),
      async (url) => {
        if (!navigator.clipboard?.writeText) throw new Error("Clipboard unavailable");
        await navigator.clipboard.writeText(url);
      },
    );
  }, [language, source, stdin, navigationKey]);
  const state = useSyncExternalStore(session.subscribe, session.getSnapshot, session.getSnapshot);

  useLayoutEffect(() => () => session.dispose(), [session]);
  useLayoutEffect(() => {
    // Do not steal focus if the user moved to an editor while copy was pending.
    if (state.url && (document.activeElement === buttonRef.current || regionRef.current?.contains(document.activeElement))) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [state.url, state.busy]);

  const share = async () => {
    const restoreFocus = !!regionRef.current?.contains(document.activeElement);
    const copied = await session.share();
    if (copied && restoreFocus && !session.getSnapshot().url && buttonRef.current?.isConnected &&
        (document.activeElement === document.body || regionRef.current?.contains(document.activeElement))) {
      buttonRef.current.focus();
    }
  };

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        disabled={disabled}
        aria-disabled={disabled || state.busy}
        onClick={() => void share()}
        aria-expanded={!!state.url}
        aria-controls={state.url ? id : undefined}
        className="rounded-[4px] border border-lavender-mist px-3 py-1.5 text-fog transition-colors hover:text-ink disabled:cursor-not-allowed disabled:opacity-50"
      >
        {state.busy ? "sharing..." : "share"}
      </button>
      <span role="status" aria-live="polite" className="text-code-teal">{state.message}</span>
      {state.url ? (
        <div ref={regionRef} id={id} role="region" aria-label="Share link recovery" className="w-full min-w-0 rounded border border-lavender-mist p-3">
          <label className="block text-fog" htmlFor={`${id}-url`}>Share link (includes code and stdin)</label>
          <input
            ref={inputRef}
            id={`${id}-url`}
            readOnly
            value={state.url}
            onFocus={(event) => event.currentTarget.select()}
            className="my-2 block w-full min-w-0 rounded border border-lavender-mist bg-terminal-bg p-2 text-ink"
          />
          <div className="flex flex-wrap gap-3">
            <button type="button" disabled={disabled} aria-disabled={disabled || state.busy} onClick={() => void share()} className="text-code-teal disabled:opacity-50">retry copy</button>
            <button type="button" onClick={() => { session.close(); buttonRef.current?.focus(); }} className="text-fog">close</button>
          </div>
        </div>
      ) : null}
    </>
  );
}
