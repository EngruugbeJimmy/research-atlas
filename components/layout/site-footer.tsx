import Link from "next/link";
import { Compass, Github } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="border-t border-basin-500/15 bg-paper dark:bg-ink">
      <div className="mx-auto max-w-7xl px-4 py-12 md:px-8">
        <div className="grid gap-10 md:grid-cols-4">
          <div>
            <div className="flex items-center gap-2 font-display text-lg">
              <Compass className="h-5 w-5 text-basin-500" strokeWidth={1.75} />
              Research Atlas
            </div>
            <p className="mt-3 max-w-xs text-sm text-ink/60 dark:text-paper/60">
              Free and open-source. Learn research like a scientist, one
              mission into the Bluewater Basin at a time.
            </p>
          </div>

          <FooterColumn
            title="Platform"
            links={[
              { href: "/missions", label: "All Missions" },
              { href: "/dashboard", label: "Dashboard" },
              { href: "/curriculum", label: "Curriculum" },
              { href: "/simulations", label: "Simulations" },
              { href: "/certification", label: "Certification" },
            ]}
          />
          <FooterColumn
            title="Project"
            links={[
              { href: "/about", label: "About Bluewater Basin" },
              { href: "https://github.com", label: "Source on GitHub" },
              { href: "/contributing", label: "Contribute" },
              { href: "/support", label: "Support Research Atlas" },
              { href: "https://chat.whatsapp.com/FYei0E0I9JI4iwputo2RFG?s=sh&p=a&ilr=1", label: "Join WhatsApp Community" },
            ]}
          />
          <FooterColumn
            title="Legal"
            links={[
              { href: "/license", label: "MIT License" },
              { href: "/privacy", label: "Privacy" },
            ]}
          />
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-4 border-t border-basin-500/10 pt-6 text-xs text-ink/50 dark:text-paper/50 md:flex-row md:items-center">
          <p>
            © {new Date().getFullYear()} Research Atlas. Bluewater Basin is a
            fictional watershed created for education; all datasets are
            synthetic.
          </p>
          <Link
            href="https://github.com"
            className="flex items-center gap-1.5 hover:text-basin-500"
          >
            <Github className="h-3.5 w-3.5" /> Star on GitHub
          </Link>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { href: string; label: string }[];
}) {
  return (
    <div>
      <p className="type-eyebrow">{title}</p>
      <ul className="mt-3 space-y-2">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-sm text-ink/70 hover:text-basin-500 dark:text-paper/70"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
