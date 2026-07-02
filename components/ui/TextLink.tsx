import Link from "next/link";
import type { ComponentProps } from "react";

type TextLinkProps = ComponentProps<typeof Link> & {
  children: React.ReactNode;
};

export function TextLink({ children, className = "", ...props }: TextLinkProps) {
  return (
    <Link
      {...props}
      className={`inline-flex items-center gap-1 font-sans text-base font-medium text-ink transition-colors hover:underline ${className}`}
    >
      {children}
      <span aria-hidden="true">{">"}</span>
    </Link>
  );
}
