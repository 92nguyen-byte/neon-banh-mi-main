import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import logo from "@/assets/logo.png.asset.json";
import dishBanhMi from "@/assets/dish-banh-mi.jpg.asset.json";
import dishKfc from "@/assets/dish-kfc.jpg.asset.json";
import dishPho from "@/assets/dish-pho.jpg.asset.json";
import dishBibimbap from "@/assets/dish-bibimbap.jpg.asset.json";
import { menu as staticMenu, type MenuItem, type MenuSection } from "@/data/menu";
import { MenuSectionBlock } from "@/components/MenuSectionBlock";
import { MenuCategoryNav } from "@/components/MenuCategoryNav";
import { MenuItemDialog } from "@/components/MenuItemDialog";
import { MapPin, Clock, Phone } from "lucide-react";
import { useSiteText, useMenuSections } from "@/lib/content";

const dishBlobStyle = {
  WebkitMaskImage: "radial-gradient(circle at center, black 30%, transparent 72%)",
  maskImage: "radial-gradient(circle at center, black 30%, transparent 72%)",
} as const;

const SITE_URL = "https://neon-banh-mi.lovable.app";

function priceNumber(p: string): number | null {
  const m = p.match(/(\d+(?:[.,]\d+)?)/);
  return m ? Number(m[1].replace(",", ".")) : null;
}

function buildRestaurantJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: "Bamboo House",
    url: SITE_URL,
    image: `${SITE_URL}/og-image.jpg`,
    servesCuisine: ["Vietnamesisk", "Koreansk", "Street food"],
    priceRange: "$$",
    telephone: "+46720052688",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Kungsgatan 20",
      postalCode: "451 30",
      addressLocality: "Uddevalla",
      addressCountry: "SE",
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "11:00",
        closes: "20:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Saturday", "Sunday"],
        opens: "12:00",
        closes: "20:00",
      },
    ],
    hasMenu: {
      "@type": "Menu",
      name: "Bamboo House meny",
      hasMenuSection: staticMenu.map((s) => ({
        "@type": "MenuSection",
        name: s.title,
        description: s.note,
        identifier: s.id,
        url: `${SITE_URL}/#${s.id}`,
        hasMenuItem: s.items.map((it) => {
          const num = priceNumber(it.price);
          return {
            "@type": "MenuItem",
            name: it.name.replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/gu, "").trim(),
            description: it.desc,
            ...(num !== null && {
              offers: { "@type": "Offer", price: num, priceCurrency: "SEK" },
            }),
            ...(it.veg && { suitableForDiet: "https://schema.org/VegetarianDiet" }),
          };
        }),
      })),
    },
  };
}

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Bamboo House · Vietnamesiska & Koreanska Ratter i Uddevalla" },
      { name: "description", content: "Banh Mi, Korean Fried Chicken, Pho och bubble tea. Street food från Vietnam och Korea mitt i Uddevalla." },
      { property: "og:title", content: "Bamboo House · Street food i Uddevalla" },
      { property: "og:description", content: "Vietnamesiska & koreanska gatusmaker — Banh Mi, KFC, Pho, Bibimbap." },
      { property: "og:type", content: "restaurant" },
      { property: "og:url", content: SITE_URL + "/" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Bamboo House · Street food i Uddevalla" },
      { name: "twitter:description", content: "Vietnamesiska & koreanska gatusmaker — Banh Mi, KFC, Pho, Bibimbap." },
    ],
    links: [{ rel: "canonical", href: SITE_URL + "/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(buildRestaurantJsonLd()),
      },
    ],
  }),
  component: Index,
});

function Index() {
  const [openItem, setOpenItem] = useState<MenuItem | null>(null);
  const [openSection, setOpenSection] = useState<MenuSection | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { sections: menu } = useMenuSections();

  const brand1 = useSiteText("brand.part1", "Bamboo");
  const brand2 = useSiteText("brand.part2", "House");
  const heroBadge = useSiteText("hero.badge", "Nyöppnat i Uddevalla");
  const heroText = useSiteText("hero.text", "Vietnamesiska & koreanska gatusmaker — Banh Mi, Korean Fried Chicken, ångande Pho och kryddig Bibimbap. Lagat med själ, serverat med glöd.");
  const ctaMenu = useSiteText("hero.cta_menu", "Se menyn");
  const ctaContact = useSiteText("hero.cta_contact", "Hitta hit");
  const addr1 = useSiteText("contact.address_line1", "Kungsgatan 20");
  const today = useSiteText("hero.today_hours", "Idag 11–20");
  const phone = useSiteText("contact.phone", "072 005 26 88");
  const phoneTel = useSiteText("contact.phone_tel", "+46720052688");
  const menuIntro = useSiteText("menu.intro", "Allt lagas från grunden. Markeringen 🌱 betyder vegetariskt. Priser i SEK.");
  const visitTitle = useSiteText("visit.title", "Besök oss");
  const visitText = useSiteText("visit.text", "Kungsgatan 20, Uddevalla. Öppet alla dagar — kom in, ta med eller ring och förbeställ.");

  const handleItemClick = (item: MenuItem, section: MenuSection) => {
    setOpenItem(item);
    setOpenSection(section);
    setDialogOpen(true);
  };
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bamboo-grid opacity-30 pointer-events-none" aria-hidden="true" />
        <img
          src={dishBanhMi.url}
          alt=""
          aria-hidden="true"
          loading="lazy"
          decoding="async"
          width={1024}
          height={1024}
          className="hidden lg:block absolute -bottom-20 -right-48 w-[32rem] opacity-70 pointer-events-none select-none rotate-6"
          style={dishBlobStyle}
        />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-14 pb-20 md:pt-24 md:pb-28 grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="order-2 lg:order-1">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-medium tracking-[0.25em] uppercase neon-box-red text-foreground/85">
              <span className="h-1.5 w-1.5 rounded-full bg-neon-red" />
              {heroBadge}
            </span>

            <h1 className="mt-6 font-display leading-[0.9] tracking-tight text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem]">
              <span className="neon-outline-green">{brand1}</span>{" "}
              <span className="neon-outline-gold">{brand2}</span>
            </h1>

            <p className="mt-6 text-base sm:text-lg text-foreground/80 max-w-xl leading-relaxed">
              {heroText}
            </p>

            <div className="mt-9 flex flex-wrap gap-3">
              <a href="#meny" className="px-6 py-3 rounded-md font-display tracking-widest uppercase neon-box-green hover:neon-green-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-green focus-visible:ring-offset-2 focus-visible:ring-offset-background transition-all">
                {ctaMenu}
              </a>
              <Link to="/kontakt" className="px-6 py-3 rounded-md font-display tracking-widest uppercase neon-box-gold hover:neon-gold-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-gold focus-visible:ring-offset-2 focus-visible:ring-offset-background transition-all">
                {ctaContact}
              </Link>
            </div>

            <dl className="mt-10 flex flex-wrap gap-x-7 gap-y-3 text-sm text-foreground/75">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-neon-green" aria-hidden="true" />
                <dt className="sr-only">Adress</dt>
                <dd>{addr1}</dd>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-neon-green" aria-hidden="true" />
                <dt className="sr-only">Öppettider idag</dt>
                <dd>{today}</dd>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-neon-green" aria-hidden="true" />
                <dt className="sr-only">Telefon</dt>
                <dd>
                  <a href={`tel:${phoneTel}`} className="hover:neon-green-text focus-visible:outline-none focus-visible:underline underline-offset-4">
                    {phone}
                  </a>
                </dd>
              </div>
            </dl>
          </div>

          <div className="order-1 lg:order-2 relative flex justify-center">
            <div className="absolute -inset-10 rounded-full bg-neon-green/10 blur-3xl" aria-hidden="true" />
            <img
              src={logo.url}
              alt="Bamboo House logotyp"
              width={768}
              height={768}
              fetchPriority="high"
              decoding="async"
              className="relative w-full max-w-xs sm:max-w-md lg:max-w-xl float-slow drop-shadow-[0_0_60px_rgba(57,255,20,0.35)]"
            />
          </div>
        </div>
      </section>

      {/* Divider ornament */}
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-hidden="true">
        <div className="flex items-center gap-4 opacity-70">
          <span className="h-px flex-1 bg-gradient-to-r from-transparent via-neon-green/40 to-transparent" />
          <span className="text-[10px] tracking-[0.5em] uppercase text-muted-foreground">街 · 食 · 堂</span>
          <span className="h-px flex-1 bg-gradient-to-l from-transparent via-neon-gold/40 to-transparent" />
        </div>
      </div>

      {/* MENU */}
      <section id="meny" className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 md:py-24 scroll-mt-32">
        <img
          src={dishKfc.url}
          alt=""
          aria-hidden="true"
          loading="lazy"
          decoding="async"
          width={1024}
          height={1024}
          className="hidden xl:block absolute top-32 -left-72 w-[30rem] opacity-70 pointer-events-none select-none -rotate-12"
          style={dishBlobStyle}
        />
        <img
          src={dishPho.url}
          alt=""
          aria-hidden="true"
          loading="lazy"
          decoding="async"
          width={1024}
          height={1024}
          className="hidden xl:block absolute top-8 -right-72 w-[30rem] opacity-70 pointer-events-none select-none rotate-3"
          style={dishBlobStyle}
        />
        <div className="text-center mb-14 md:mb-16">
          <p className="text-[11px] font-medium tracking-[0.4em] uppercase text-muted-foreground">— Vår —</p>
          <h2 className="font-display text-6xl md:text-7xl neon-gold-text mt-3 leading-none">Meny</h2>
          <p className="mt-5 text-foreground/75 max-w-2xl mx-auto leading-relaxed">
            {menuIntro}
          </p>
        </div>

        <MenuCategoryNav sections={menu} />

        <div className="space-y-16 md:space-y-20">
          {menu.map((s) => (
            <MenuSectionBlock key={s.id} section={s} onItemClick={handleItemClick} />
          ))}
        </div>
      </section>

      <MenuItemDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        item={openItem}
        section={openSection}
      />

      {/* CTA / Visit */}
      <section className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 md:py-24">
        <img
          src={dishBibimbap.url}
          alt=""
          aria-hidden="true"
          loading="lazy"
          decoding="async"
          width={1024}
          height={1024}
          className="hidden xl:block absolute top-1/2 -translate-y-1/2 -left-72 w-[30rem] opacity-70 pointer-events-none select-none rotate-3"
          style={dishBlobStyle}
        />
        <div className="relative rounded-3xl p-10 md:p-16 neon-box-green bg-card/40 backdrop-blur text-center">
          <p className="text-[11px] font-medium tracking-[0.4em] uppercase text-muted-foreground">— Välkommen —</p>
          <h2 className="mt-3 font-display text-4xl md:text-5xl neon-green-text leading-none">{visitTitle}</h2>
          <p className="mt-5 text-foreground/80 max-w-xl mx-auto leading-relaxed">
            {visitText}
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <a href={`tel:${phoneTel}`} className="px-6 py-3 rounded-md font-display tracking-widest uppercase neon-box-red hover:neon-red-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-red focus-visible:ring-offset-2 focus-visible:ring-offset-background transition-all">
              Ring {phone}
            </a>
            <Link
              to="/kontakt"
              className="px-6 py-3 rounded-md font-display tracking-widest uppercase neon-box-gold hover:neon-gold-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-gold focus-visible:ring-offset-2 focus-visible:ring-offset-background transition-all"
            >
              Karta & info
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

