import Link from "next/link";
import type { ComponentProps } from "react";

type TextLinkProps = ComponentProps<typeof Link> & {
  children: React.ReactNode;
};

export function TextLink({ children, className = "", ...props }: TextLinkProps) {
  return (
    <Link
      {...props}
      className={`inline-flex items-center gap-1 font-mono text-sm font-semibold text-ink transition-colors hover:text-code-cobalt ${className}`}
    >
      <span className="text-mist">{"> "}</span>
      {children}
    </Link>
  );
}
