import { getLesson, lessons, type LessonSlug } from "@/lib/visualizations/lessons";
import { renderLessonMarkdown } from "@/lib/visualizations/lesson-publication";
import { isRouteEnabled, SITE_URL } from "@/lib/site";

export const dynamic = "force-static";
export const dynamicParams = false;
export function generateStaticParams() {
  return isRouteEnabled("/learn") ? Object.keys(lessons).map((slug) => ({ slug })) : [];
}
export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!isRouteEnabled("/learn") || !getLesson(slug)) return new Response("Not found", { status: 404 });
  return new Response(renderLessonMarkdown(slug as LessonSlug), { headers: {
    "Content-Type": "text/markdown; charset=utf-8",
    Link: `<${SITE_URL}/learn/${slug}>; rel="canonical", <${SITE_URL}/llms.txt>; rel="describedby"`,
  } });
}
