import { AppsFeed } from "@/components/apps/AppsFeed";
import {
  TerminalCommand,
  TerminalComment,
  TerminalOutput,
} from "@/components/terminal/TerminalCommand";
import { TerminalPanel } from "@/components/terminal/TerminalPanel";
import { getApps } from "@/lib/apps";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata({
  title: "Apps",
  description: "Shipped iOS utility apps and games on the App Store.",
  path: "/apps",
});

export default function AppsPage() {
  const total = getApps().length;
  const utilityCount = getApps().filter((app) => app.category === "utility").length;
  const gameCount = getApps().filter((app) => app.category === "game").length;

  return (
    <>
      <TerminalPanel title="apps">
        <TerminalCommand command="cat apps/README" />
        <TerminalOutput>
          <h1 className="prose-terminal mt-4 text-3xl font-semibold text-ink">Apps</h1>
          <p className="prose-terminal mt-4 max-w-2xl text-base leading-[1.8] text-slate">
            Shipped iOS projects on the App Store — mostly utility apps and games.
          </p>
          <TerminalComment>
            // {total} live · {utilityCount} tools · {gameCount} games
          </TerminalComment>
        </TerminalOutput>
      </TerminalPanel>

      <TerminalPanel>
        <TerminalCommand command="ls ~/apps/live/" />
        <div className="mt-4">
          <AppsFeed />
        </div>
      </TerminalPanel>
    </>
  );
}
