import Link from "next/link";
import type { Post } from "@/lib/posts";

type PostMetaProps = {
  post: Post;
};

export function PostMeta({ post }: PostMetaProps) {
  const hasMeta =
    post.series || post.difficulty || post.runtime || (post.prerequisites?.length ?? 0) > 0;

  if (!hasMeta) {
    return null;
  }

  return (
    <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 font-mono text-[11px]">
      {post.series ? (
        <div>
          <span className="text-code-teal">series</span>
          <span className="text-mist">: </span>
          <Link
            href={`/blog?series=${encodeURIComponent(post.series)}`}
            className="text-code-cobalt hover:text-ink"
          >
            {post.series}
          </Link>
        </div>
      ) : null}

      {post.difficulty ? (
        <div>
          <span className="text-code-teal">difficulty</span>
          <span className="text-mist">: </span>
          <span className="text-fog">{post.difficulty}</span>
        </div>
      ) : null}

      {post.runtime ? (
        <div>
          <span className="text-code-teal">runtime</span>
          <span className="text-mist">: </span>
          <span className="text-fog">{post.runtime}</span>
        </div>
      ) : null}

      {post.prerequisites && post.prerequisites.length > 0 ? (
        <div className="w-full">
          <span className="text-code-teal">prerequisites</span>
          <span className="text-mist">: </span>
          <span className="text-fog">{post.prerequisites.join(" · ")}</span>
        </div>
      ) : null}
    </div>
  );
}
