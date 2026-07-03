import Link from "next/link";
import type { AppCategory, AppRelease } from "@/lib/apps";

const categoryBadge: Record<AppCategory, string> = {
  utility: "tool",
  game: "game",
};

type AppEntryProps = {
  app: AppRelease;
};

export function AppEntry({ app }: AppEntryProps) {
  return (
    <article className="py-4">
      <div className="flex flex-wrap items-start gap-4">
        <div
          className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[10px] border border-lavender-mist bg-lavender-mist/30 font-mono text-[10px] uppercase tracking-wide text-fog"
          aria-hidden={Boolean(app.iconUrl)}
        >
          {app.iconUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={app.iconUrl}
              alt=""
              className="h-full w-full rounded-[10px] object-cover"
            />
          ) : (
            <span>{categoryBadge[app.category]}</span>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
            <span className="text-code-plum">[</span>
            <time dateTime={app.releaseDate} className="text-ink">
              {app.releaseDate}
            </time>
            <span className="text-code-plum">]</span>
            <span className="text-mist">·</span>
            <h2 className="font-semibold text-ink">{app.name}</h2>
            {app.version ? (
              <>
                <span className="text-mist">·</span>
                <span className="text-xs text-fog">v{app.version}</span>
              </>
            ) : null}
          </div>

          <p className="prose-terminal mt-1 text-sm text-code-cobalt">{app.tagline}</p>
          <p className="prose-terminal mt-2 text-sm leading-[1.7] text-slate">{app.description}</p>

          {app.tags && app.tags.length > 0 ? (
            <div className="mt-2 flex flex-wrap gap-2">
              {app.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-[4px] border border-lavender-mist px-2 py-0.5 text-[11px] text-fog"
                >
                  {tag}
                </span>
              ))}
            </div>
          ) : null}

          <div className="mt-3 font-mono text-xs">
            <Link
              href={app.appStoreUrl}
              target="_blank"
              rel="noreferrer"
              className="text-code-teal transition-colors hover:text-code-cobalt hover:underline"
            >
              open App Store →
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
