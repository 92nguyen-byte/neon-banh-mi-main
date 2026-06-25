import { Link } from "@tanstack/react-router";
import logo from "@/assets/logo.png.asset.json";
import { MapPin, Phone, Clock, Instagram, Facebook, Home, UtensilsCrossed, Mail, Lock } from "lucide-react";
import { useSiteText } from "@/lib/content";

export function SiteFooter() {
  const tagline = useSiteText("footer.tagline", "Vietnamesiska & koreanska gatusmaker, lagade med själ i hjärtat av Uddevalla.");
  const phone = useSiteText("contact.phone", "072 005 26 88");
  const phoneTel = useSiteText("contact.phone_tel", "+46720052688");
  const addr1 = useSiteText("contact.address_line1", "Kungsgatan 20");
  const addr2 = useSiteText("contact.address_line2", "451 30 Uddevalla");
  const mapsQuery = useSiteText("contact.maps_query", "Kungsgatan+20+Uddevalla");
  const ig = useSiteText("social.instagram", "https://www.instagram.com/bamboohouse.uddevalla/");
  const fb = useSiteText("social.facebook", "https://www.facebook.com/profile.php?id=61591177431846");
  const tt = useSiteText("social.tiktok", "https://www.tiktok.com/");
  const hL = useSiteText("hours.weekdays_label", "Mån–Fre");
  const hV = useSiteText("hours.weekdays_value", "11:00–20:00");
  const hL2 = useSiteText("hours.weekends_label", "Lör–Sön");
  const hV2 = useSiteText("hours.weekends_value", "12:00–20:00");
  const copyrightSuffix = useSiteText("footer.copyright_suffix", "Vietnamesiska & Koreanska Ratter");
  const headLinks = useSiteText("footer.heading_links", "Snabblänkar");
  const headVisit = useSiteText("footer.heading_visit", "Besök oss");
  const headHours = useSiteText("footer.heading_hours", "Öppettider");
  const labelHome = useSiteText("nav.home", "Hem");
  const labelLunch = useSiteText("nav.lunch", "Lunch");
  const labelKontakt = useSiteText("nav.kontakt", "Kontakta oss");

  return (
    <footer className="mt-24 border-t border-border bg-background/60 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14 grid gap-10 md:grid-cols-4">
        <div className="md:col-span-1">
          <img src={logo.url} alt="Bamboo House" className="h-20 w-auto" />
          <p className="mt-4 text-sm text-muted-foreground max-w-sm">{tagline}</p>
          <div className="mt-5 flex gap-3">
            <a href={ig} target="_blank" rel="noreferrer" aria-label="Instagram"
              className="h-10 w-10 rounded-full grid place-items-center neon-box-red hover:translate-y-[-2px] transition-transform">
              <Instagram className="h-5 w-5 text-neon-red" />
            </a>
            <a href={fb} target="_blank" rel="noreferrer" aria-label="Facebook"
              className="h-10 w-10 rounded-full grid place-items-center neon-box-green hover:translate-y-[-2px] transition-transform">
              <Facebook className="h-5 w-5 text-neon-green" />
            </a>
            <a href={tt} target="_blank" rel="noreferrer" aria-label="TikTok"
              className="h-10 w-10 rounded-full grid place-items-center neon-box-gold hover:translate-y-[-2px] transition-transform">
              <svg viewBox="0 0 24 24" className="h-5 w-5 fill-neon-gold" aria-hidden="true">
                <path d="M16.5 3a5.5 5.5 0 0 0 4.5 4.5v3.1a8.6 8.6 0 0 1-4.5-1.3v6.2a6.5 6.5 0 1 1-6.5-6.5c.3 0 .6 0 .9.1v3.2a3.3 3.3 0 1 0 2.3 3.2V3h3.3Z" />
              </svg>
            </a>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-display tracking-widest uppercase neon-gold-text mb-4">{headLinks}</h4>
          <ul className="space-y-2.5 text-sm">
            <li><Link to="/" className="flex items-center gap-2 text-foreground/80 hover:neon-green-text transition-colors"><Home className="h-4 w-4" /> {labelHome}</Link></li>
            <li><Link to="/lunch" className="flex items-center gap-2 text-foreground/80 hover:neon-green-text transition-colors"><UtensilsCrossed className="h-4 w-4" /> {labelLunch}</Link></li>
            <li><Link to="/kontakt" className="flex items-center gap-2 text-foreground/80 hover:neon-green-text transition-colors"><Mail className="h-4 w-4" /> {labelKontakt}</Link></li>
            <li><Link to="/admin" className="flex items-center gap-2 text-foreground/80 hover:neon-green-text transition-colors"><Lock className="h-4 w-4" /> Admin</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-display tracking-widest uppercase neon-gold-text mb-4">{headVisit}</h4>
          <ul className="space-y-3 text-sm text-foreground/80">
            <li className="flex gap-2">
              <MapPin className="h-4 w-4 mt-0.5 text-neon-green shrink-0" />
              <a href={`https://www.google.com/maps/search/?api=1&query=${mapsQuery}`} target="_blank" rel="noreferrer" className="hover:neon-green-text">
                {addr1}<br />{addr2}
              </a>
            </li>
            <li className="flex gap-2">
              <Phone className="h-4 w-4 mt-0.5 text-neon-green shrink-0" />
              <a href={`tel:${phoneTel}`} className="hover:neon-green-text">{phone}</a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-display tracking-widest uppercase neon-gold-text mb-4">{headHours}</h4>
          <ul className="space-y-2 text-sm text-foreground/80">
            <li className="flex items-center justify-between gap-2">
              <span className="flex items-center gap-2"><Clock className="h-4 w-4 text-neon-green" /> {hL}</span>
              <span className="neon-gold-text">{hV}</span>
            </li>
            <li className="flex items-center justify-between gap-2">
              <span className="flex items-center gap-2"><Clock className="h-4 w-4 text-neon-green" /> {hL2}</span>
              <span className="neon-gold-text">{hV2}</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border py-5 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Bamboo House · {copyrightSuffix}
      </div>
    </footer>
  );
}
