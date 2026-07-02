import Link from "next/link";

const navItems = [
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-paper">
      <div className="relative mx-auto flex h-[56px] max-w-[1200px] items-center justify-between px-6 lg:px-8">
        <Link
          href="/"
          className="flex items-center gap-2 font-sans text-[15px] font-semibold text-ink"
        >
          <CloudIcon />
          <span className="hidden sm:inline">crazycloudcc&apos;s blog</span>
          <span className="sm:hidden">crazycloudcc</span>
        </Link>

        <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-10 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="font-sans text-sm font-medium text-fog transition-colors hover:text-ink"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="w-[1px] md:w-auto" aria-hidden="true" />
      </div>
    </header>
  );
}

function CloudIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className="text-ink"
    >
      <path
        d="M7 18h11a4 4 0 0 0 .4-8 5.5 5.5 0 0 0-10.7 1.5A3.5 3.5 0 0 0 7 18Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}
