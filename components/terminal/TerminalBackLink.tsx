import Link from "next/link";

type TerminalBackLinkProps = {
  href: string;
  label: string;
};

export function TerminalBackLink({ href, label }: TerminalBackLinkProps) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-1 font-mono text-sm text-fog transition-colors hover:text-ink"
    >
      <span aria-hidden="true">{"<"}</span>
      {label}
    </Link>
  );
}
