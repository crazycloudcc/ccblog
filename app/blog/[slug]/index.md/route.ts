import { AI_DOC_SLUGS, getAiDoc, renderAiDoc } from "@/lib/ai-docs";
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return AI_DOC_SLUGS.filter((slug) => getAiDoc(slug)).map((slug) => ({ slug }));
}

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getAiDoc(slug);
  if (!post) return new Response("Not found", { status: 404 });
  return new Response(renderAiDoc(post), {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      Link: `<${SITE_URL}/blog/${slug}>; rel="canonical", <${SITE_URL}/llms.txt>; rel="describedby"`,
    },
  });
}
