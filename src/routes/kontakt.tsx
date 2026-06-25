import { createFileRoute } from "@tanstack/react-router";
import { Phone, MapPin, Clock, Mail, Instagram } from "lucide-react";

const SITE_URL = "https://neon-banh-mi.lovable.app";

export const Route = createFileRoute("/kontakt")({
  head: () => ({
    meta: [
      { title: "Kontakt · Bamboo House Uddevalla — Kungsgatan 20" },
      { name: "description", content: "Hitta till Bamboo House på Kungsgatan 20 i Uddevalla. Telefon 072 005 26 88, öppettider och karta." },
      { property: "og:title", content: "Kontakt · Bamboo House Uddevalla" },
      { property: "og:description", content: "Kungsgatan 20, 451 30 Uddevalla · 072 005 26 88 · Öppet alla dagar." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: SITE_URL + "/kontakt" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Kontakt · Bamboo House Uddevalla" },
      { name: "twitter:description", content: "Kungsgatan 20, Uddevalla · 072 005 26 88" },
    ],
    links: [{ rel: "canonical", href: SITE_URL + "/kontakt" }],
  }),
  component: KontaktPage,
});

function KontaktPage() {
  const mapsQuery = encodeURIComponent("Kungsgatan 20, 451 30 Uddevalla");

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
      <div className="text-center">
        <p className="text-sm tracking-[0.4em] uppercase text-muted-foreground">Säg hej</p>
        <h1 className="font-display text-6xl md:text-8xl neon-gold-text mt-2">Kontakt</h1>
        <p className="mt-6 text-lg text-foreground/80 max-w-2xl mx-auto">
          Vi finns mitt i centrala Uddevalla. Kom in, ring för avhämtning eller hitta hit via kartan nedan.
        </p>
      </div>


      {/* Info + map */}
      <div className="mt-16 grid lg:grid-cols-5 gap-6">
        <div className="lg:col-span-2 space-y-5">
          <a
            href="tel:+46720052688"
            className="block rounded-2xl p-6 bg-card/50 backdrop-blur neon-box-red hover:translate-y-[-2px] transition-transform"
          >
            <Phone className="h-6 w-6 text-neon-red mb-3" />
            <h3 className="font-display text-2xl tracking-wide">Telefon</h3>
            <p className="mt-2 text-2xl neon-red-text">072 005 26 88</p>
            <p className="mt-1 text-sm text-muted-foreground">Klicka för att ringa</p>
          </a>

          <div className="rounded-2xl p-6 bg-card/50 backdrop-blur neon-box-green">
            <MapPin className="h-6 w-6 text-neon-green mb-3" />
            <h3 className="font-display text-2xl tracking-wide">Adress</h3>
            <p className="mt-2 text-foreground/80">Kungsgatan 20</p>
            <p className="text-foreground/80">451 30 Uddevalla</p>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${mapsQuery}`}
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-block text-sm neon-green-text"
            >
              Öppna i Google Maps →
            </a>
          </div>

          <div className="rounded-2xl p-6 bg-card/50 backdrop-blur neon-box-gold">
            <Clock className="h-6 w-6 text-neon-gold mb-3" />
            <h3 className="font-display text-2xl tracking-wide">Öppettider</h3>
            <ul className="mt-3 space-y-1 text-foreground/80">
              <li className="flex justify-between"><span>Måndag–Fredag</span><span className="neon-gold-text">11:00–20:00</span></li>
              <li className="flex justify-between"><span>Lördag–Söndag</span><span className="neon-gold-text">12:00–20:00</span></li>
            </ul>
          </div>

          <div className="rounded-2xl p-6 bg-card/50 backdrop-blur neon-box-red">
            <Mail className="h-6 w-6 text-neon-red mb-3" />
            <h3 className="font-display text-2xl tracking-wide">E-post</h3>
            <p className="mt-2 text-foreground/80">
              <span className="italic text-muted-foreground">E-postadress läggs till inom kort.</span>
            </p>
            <p className="mt-2 text-sm text-muted-foreground flex items-center gap-2">
              <Instagram className="h-4 w-4" /> Följ oss på sociala medier för dagens specialare.
            </p>
          </div>
        </div>

        <div className="lg:col-span-3 rounded-2xl overflow-hidden neon-box-green bg-card/40 min-h-[420px]">
          <iframe
            title="Karta till Bamboo House, Kungsgatan 20, Uddevalla"
            src={`https://www.google.com/maps?q=${mapsQuery}&output=embed`}
            className="w-full h-full min-h-[420px] border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        </div>
      </div>
    </div>
  );
}
