import Link from "next/link";

const footerLinks = [
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function Footer() {
  return (
    <footer>
      <div className="mx-auto flex max-w-[1200px] flex-col items-start justify-between gap-8 px-6 py-16 lg:flex-row lg:items-center lg:px-8">
        <p className="font-sans text-[13px] text-mist">
          © {new Date().getFullYear()} crazycloudcc
        </p>

        <div className="flex flex-wrap items-center gap-6 lg:gap-8">
          {footerLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="font-sans text-sm text-fog transition-colors hover:text-ink"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
