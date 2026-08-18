import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/** Query variants of /blog and /playground should not be indexed. */
export function proxy(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;
  const response = NextResponse.next();

  const playgroundShare =
    pathname === "/playground" && (searchParams.has("z") || searchParams.get("embed") === "1");
  const blogFilter =
    pathname === "/blog" && (searchParams.has("tag") || searchParams.has("series"));

  if (playgroundShare || blogFilter) {
    response.headers.set("X-Robots-Tag", "noindex, follow");
  }

  return response;
}

export const config = {
  matcher: ["/playground", "/blog"],
};
