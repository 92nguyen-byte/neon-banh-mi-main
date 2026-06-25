import { Link } from "@tanstack/react-router";
import { useState } from "react";
import logo from "@/assets/logo.png.asset.json";
import { Menu, X } from "lucide-react";
import { useSiteText } from "@/lib/content";

export function SiteNav() {
  const [open, setOpen] = useState(false);
  const brand1 = useSiteText("brand.part1", "Bamboo");
  const brand2 = useSiteText("brand.part2", "House");
  const phone = useSiteText("contact.phone", "072 005 26 88");
  const phoneTel = useSiteText("contact.phone_tel", "+46720052688");
  const links = [
    { to: "/", label: useSiteText("nav.home", "Hem") },
    { to: "/lunch", label: useSiteText("nav.lunch", "Lunch") },
    { to: "/kontakt", label: useSiteText("nav.kontakt", "Kontakt") },
  ] as const;

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-background/70 border-b border-border">
      <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 h-16 sm:h-20">
        <Link to="/" className="flex items-center gap-2 sm:gap-3 group min-w-0">
          <img src={logo.url} alt="Bamboo House" className="h-11 sm:h-14 w-auto flicker shrink-0" />
          <span className="flex items-baseline gap-1.5 font-display text-xl sm:text-3xl md:text-4xl leading-none tracking-tight min-w-0 truncate whitespace-nowrap">
            <span className="neon-outline-green">{brand1}</span>
            <span className="neon-outline-gold">{brand2}</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1 shrink-0">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="px-4 py-2 rounded-md text-sm font-display tracking-widest uppercase text-foreground/80 hover:text-foreground hover:bg-foreground/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-green focus-visible:ring-offset-2 focus-visible:ring-offset-background transition-colors"
              activeProps={{ className: "neon-green-text bg-foreground/5" }}
              activeOptions={{ exact: true }}
            >
              {l.label}
            </Link>
          ))}
          <a
            href={`tel:${phoneTel}`}
            className="ml-3 px-4 py-2 rounded-md font-display tracking-widest uppercase text-sm neon-box-red text-foreground hover:neon-red-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-red focus-visible:ring-offset-2 focus-visible:ring-offset-background transition-all"
          >
            {phone}
          </a>
        </nav>

        <button
          aria-label="Öppna meny"
          aria-expanded={open}
          className="md:hidden p-2 rounded-md neon-box-green bg-background/60 text-foreground hover:bg-foreground/10 hover:neon-green-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-green focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-95 transition-all shrink-0"
          onClick={() => setOpen(!open)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-border bg-background/95 backdrop-blur">
          <nav className="flex flex-col p-4 gap-2">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="px-3 py-3 rounded-md font-display tracking-widest uppercase text-foreground/80 hover:text-foreground hover:bg-foreground/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-green focus-visible:ring-offset-2 focus-visible:ring-offset-background transition-colors"
                activeProps={{ className: "neon-green-text bg-foreground/5" }}
                activeOptions={{ exact: true }}
              >
                {l.label}
              </Link>
            ))}
            <a
              href={`tel:${phoneTel}`}
              className="px-3 py-3 rounded-md neon-box-red font-display tracking-widest uppercase text-center hover:neon-red-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-red focus-visible:ring-offset-2 focus-visible:ring-offset-background transition-all"
            >
              {phone}
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
