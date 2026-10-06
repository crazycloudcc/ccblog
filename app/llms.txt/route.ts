import { renderLlmsIndex } from "@/lib/ai-docs";

export const dynamic = "force-static";

export function GET() {
  return new Response(renderLlmsIndex(), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
