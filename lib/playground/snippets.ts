import { templates } from "@/lib/playground/templates";
import type { PlaygroundLanguage } from "@/lib/playground/types";

export type PlaygroundSnippet = {
  lang: PlaygroundLanguage;
  source: string;
  stdin?: string;
  title?: string;
};

const SLUG_ALIASES: Record<string, { lang: PlaygroundLanguage; label: string }> = {
  "hello-cpp": { lang: "cpp", label: "hello.cpp" },
  "hello-c": { lang: "c", label: "hello.c" },
  "a-plus-b-cpp": { lang: "cpp", label: "a+b.cpp" },
  "a-plus-b-c": { lang: "c", label: "a+b.c" },
  "sort-cpp": { lang: "cpp", label: "sort.cpp" },
};

export function resolvePlaygroundSnippet(slug: string): PlaygroundSnippet | null {
  const normalized = slug.trim().toLowerCase();
  const alias = SLUG_ALIASES[normalized];

  if (alias) {
    const template = templates[alias.lang].find((item) => item.label === alias.label);
    if (template) {
      return { lang: alias.lang, source: template.source, title: template.label };
    }
  }

  for (const lang of ["c", "cpp"] as const) {
    const template = templates[lang].find(
      (item) => item.label.replace(/\./g, "-") === normalized || item.label === normalized,
    );
    if (template) {
      return { lang, source: template.source, title: template.label };
    }
  }

  return null;
}
