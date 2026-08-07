import { AppEntry } from "@/components/apps/AppEntry";
import { getApps } from "@/lib/apps";

export function AppsFeed() {
  const apps = getApps();

  if (apps.length === 0) {
    return (
      <div className="font-mono text-sm text-fog">
        <p>(empty - add shipped apps in lib/apps.ts)</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-lavender-mist/80 font-mono text-sm">
      {apps.map((app) => (
        <AppEntry key={app.slug} app={app} />
      ))}
    </div>
  );
}
