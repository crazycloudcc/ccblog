import { AppEntry } from "@/components/apps/AppEntry";
import { getApps, getAppsByCategory } from "@/lib/apps";

export function AppsFeed() {
  const groups = getAppsByCategory();
  const total = getApps().length;

  if (total === 0) {
    return (
      <div className="font-mono text-sm text-fog">
        <p>(empty — add shipped apps in lib/apps.ts)</p>
      </div>
    );
  }

  return (
    <div className="font-mono text-sm">
      {groups.map((group) => (
        <section key={group.category}>
          <div className="border-b border-lavender-mist/80 py-3 text-xs text-code-teal">
            {"// "}
            {"─".repeat(6)} {group.label} {"─".repeat(6)} {group.items.length}{" "}
            {group.items.length === 1 ? "app" : "apps"}
          </div>

          <div className="divide-y divide-lavender-mist/80">
            {group.items.map((app) => (
              <AppEntry key={app.slug} app={app} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
