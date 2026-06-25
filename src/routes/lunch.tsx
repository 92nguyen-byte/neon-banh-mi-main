import { createFileRoute, Link } from "@tanstack/react-router";
import { Clock } from "lucide-react";
import { useSiteText, useMenuSections } from "@/lib/content";

const SITE_URL = "https://neon-banh-mi.lovable.app";

export const Route = createFileRoute("/lunch")({
  head: () => ({
    meta: [
      { title: "Lunch · Bamboo House Uddevalla — Vietnamesisk & koreansk lunch" },
      { name: "description", content: "Lunch på Bamboo House i Uddevalla, mån–fre 11–14. Samma meny varje dag." },
      { property: "og:title", content: "Lunch · Bamboo House Uddevalla" },
      { property: "og:description", content: "Snabb och smakrik lunch mån–fre 11–14. Samma rätter varje dag." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: SITE_URL + "/lunch" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Lunch · Bamboo House Uddevalla" },
      { name: "twitter:description", content: "Snabb och smakrik lunch mån–fre 11–14 i centrala Uddevalla." },
    ],
    links: [{ rel: "canonical", href: SITE_URL + "/lunch" }],
  }),
  component: LunchPage,
});

const colorOrder: Array<"green" | "gold" | "red"> = ["gold", "green", "red"];
const colorClasses: Record<"green" | "gold" | "red", { box: string; text: string }> = {
  green: { box: "neon-box-green", text: "neon-green-text" },
  gold: { box: "neon-box-gold", text: "neon-gold-text" },
  red: { box: "neon-box-red", text: "neon-red-text" },
};

function LunchPage() {
  const { lunch } = useMenuSections();
  const phoneTel = useSiteText("contact.phone_tel", "+46720052688");
  const kicker = useSiteText("lunch.kicker", "Mån–Fre");
  const title = useSiteText("lunch.title", "Lunch");
  const intro = useSiteText("lunch.intro", "Samma smakrika rätter varje dag — handplockade favoriter från vår ordinarie meny, serverade snabbt så att du hinner luncha och njuta.");
  const hoursBadge = useSiteText("lunch.hours_badge", "Lunchtider: Mån–Fre 11:00–14:00");
  const drinkNote = useSiteText("lunch.drink_note", "Valfri dricka för 10 kr till lunchen.");
  const ctaTitle = useSiteText("lunch.cta_title", "Vill du ha hela menyn?");
  const ctaText = useSiteText("lunch.cta_text", "Vår ordinarie meny finns att beställa under hela vår öppettid.");
  const sectionHeading = lunch?.subtitle || "Dagens favoriter";

  const items = lunch?.items ?? [];

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-20">
      <header className="text-center">
        <p className="text-sm tracking-[0.4em] uppercase text-muted-foreground">{kicker}</p>
        <h1 className="font-display text-6xl md:text-8xl neon-green-text mt-2">{title}</h1>
        <p className="mt-6 text-lg text-foreground/80 max-w-2xl mx-auto leading-relaxed">{intro}</p>
        <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-full neon-box-gold text-sm">
          <Clock className="h-4 w-4" aria-hidden="true" /> {hoursBadge}
        </div>
        <p className="mt-4 text-sm text-foreground/80">{drinkNote}</p>
      </header>

      <section aria-labelledby="lunchmeny-rubrik" className="mt-16">
        <div className="text-center">
          <p className="text-xs tracking-[0.4em] uppercase text-muted-foreground">— Lunchmeny —</p>
          <h2 id="lunchmeny-rubrik" className="font-display text-4xl md:text-5xl mt-2">
            {sectionHeading}
          </h2>
        </div>

        <ul className="mt-12 space-y-6">
          {items.map((item, i) => {
            const color = colorOrder[i % colorOrder.length];
            const c = colorClasses[color];
            return (
              <li key={(item.code ?? "") + item.name} className={`rounded-2xl p-6 md:p-8 bg-card/50 backdrop-blur ${c.box}`}>
                <div className="flex flex-col md:flex-row md:items-baseline md:justify-between gap-2">
                  <h3 className="font-display text-2xl md:text-3xl tracking-wide">
                    {item.code && <span className={`mr-3 text-base align-middle ${c.text}`}>{item.code}</span>}
                    {item.name}
                  </h3>
                  <span className={`font-display text-xl ${c.text}`}>{item.price}</span>
                </div>
                {item.desc && <p className="mt-3 text-foreground/80 leading-relaxed">{item.desc}</p>}
                {item.options && item.options.length > 0 && (
                  <p className="mt-2 text-sm text-muted-foreground italic">{item.options.join(" · ")}</p>
                )}
              </li>
            );
          })}
        </ul>
      </section>

      <div className="mt-20 rounded-3xl p-10 md:p-14 neon-box-red bg-card/40 backdrop-blur text-center">
        <h2 className="font-display text-3xl md:text-4xl neon-red-text">{ctaTitle}</h2>
        <p className="mt-4 text-foreground/80 max-w-xl mx-auto leading-relaxed">{ctaText}</p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Link to="/" hash="meny" className="px-6 py-3 rounded-md font-display tracking-widest uppercase neon-box-green hover:neon-green-text">
            Se ordinarie meny
          </Link>
          <a href={`tel:${phoneTel}`} className="px-6 py-3 rounded-md font-display tracking-widest uppercase neon-box-gold hover:neon-gold-text">
            Ring & förbeställ
          </a>
        </div>
      </div>
    </div>
  );
}
