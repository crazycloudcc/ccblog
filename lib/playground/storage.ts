import type { PlaygroundLanguage } from "@/lib/playground/types";

const STORAGE_PREFIX = "playground-draft";

function storageKey(language: PlaygroundLanguage): string {
  return `${STORAGE_PREFIX}:${language}`;
}

export function loadDraft(language: PlaygroundLanguage): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  return localStorage.getItem(storageKey(language));
}

export function saveDraft(language: PlaygroundLanguage, source: string): void {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem(storageKey(language), source);
}

export function loadStdin(): string {
  if (typeof window === "undefined") {
    return "";
  }

  return localStorage.getItem(`${STORAGE_PREFIX}:stdin`) ?? "";
}

export function saveStdin(stdin: string): void {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem(`${STORAGE_PREFIX}:stdin`, stdin);
}
