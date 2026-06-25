import { useEffect, useId, useState } from "react";
import { ChevronDown } from "lucide-react";
import type { MenuItem, MenuSection } from "@/data/menu";

const colorMap = {
  green: { text: "neon-green-text", box: "neon-box-green", dot: "bg-neon-green" },
  gold: { text: "neon-gold-text", box: "neon-box-gold", dot: "bg-neon-gold" },
  red: { text: "neon-red-text", box: "neon-box-red", dot: "bg-neon-red" },
} as const;

type Props = {
  section: MenuSection;
  onItemClick: (item: MenuItem, section: MenuSection) => void;
};

export function MenuSectionBlock({ section, onItemClick }: Props) {
  const c = colorMap[section.color];
  const [isDesktop, setIsDesktop] = useState(false);
  // Default to expanded on mobile too — user wants tabs open by default
  const [open, setOpen] = useState(true);
  // Temporarily suppress animations during viewport resize and reduced-motion
  // changes so the panel snaps to the correct final height instead of
  // animating from a stale state.
  const [suppressAnim, setSuppressAnim] = useState(false);
  const panelId = useId();

  useEffect(() => {
    const mqDesktop = window.matchMedia("(min-width: 640px)");
    const mqReduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateDesktop = () => setIsDesktop(mqDesktop.matches);
    updateDesktop();

    let timer: number | undefined;
    const snap = () => {
      setSuppressAnim(true);
      if (timer) window.clearTimeout(timer);
      // Re-enable transitions after layout settles past one animation cycle.
      timer = window.setTimeout(() => setSuppressAnim(false), 350);
    };
    const onResize = () => {
      updateDesktop();
      snap();
    };

    mqDesktop.addEventListener("change", updateDesktop);
    mqReduced.addEventListener("change", snap);
    window.addEventListener("resize", onResize);
    return () => {
      mqDesktop.removeEventListener("change", updateDesktop);
      mqReduced.removeEventListener("change", snap);
      window.removeEventListener("resize", onResize);
      if (timer) window.clearTimeout(timer);
    };
  }, []);

  const effectiveOpen = isDesktop || open;
  const animClasses = suppressAnim
    ? ""
    : "motion-safe:transition-[grid-template-rows,opacity] motion-safe:duration-300 motion-safe:ease-out";

  return (
    <section id={section.id} className="scroll-mt-32">
      <button
        type="button"
        aria-expanded={effectiveOpen}
        aria-controls={panelId}
        onClick={() => {
          if (isDesktop) return;
          setOpen((v) => !v);
        }}
        className={`w-full text-left list-none cursor-pointer sm:cursor-default grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 mb-6 min-h-12 py-3 px-3 -mx-3 rounded-lg border border-transparent sm:flex sm:items-baseline sm:gap-4 sm:min-h-0 sm:py-0 sm:px-0 sm:mx-0 sm:rounded-none sm:border-0 motion-safe:transition-colors motion-safe:duration-200 hover:bg-foreground/5 sm:hover:bg-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:ring-foreground/60 ${
          open && !isDesktop ? `bg-foreground/[0.04] border-foreground/10` : ""
        }`}
      >
        <div className="min-w-0 flex flex-wrap items-baseline gap-x-3 gap-y-1 sm:contents">
          <h3 className={`min-w-0 break-words text-2xl sm:text-4xl md:text-5xl font-display ${c.text}`}>
            {section.title}
          </h3>
          {section.subtitle && (
            <span className="text-[10px] sm:text-sm tracking-widest uppercase text-muted-foreground break-words">
              {section.subtitle}
            </span>
          )}
        </div>
        <ChevronDown
          aria-hidden
          className={`sm:hidden shrink-0 h-6 w-6 self-center ${c.text.replace("-text", "")} motion-safe:transition-transform motion-safe:duration-300 ${effectiveOpen ? "rotate-180" : ""}`}
        />
      </button>

      {/* Animated collapsible panel — uses grid-rows trick for smooth height transition.
          Honors prefers-reduced-motion via motion-safe: variant. */}
      <div
        id={panelId}
        aria-hidden={!effectiveOpen}
        className={`grid ${animClasses} ${
          effectiveOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        } sm:!grid-rows-[1fr] sm:!opacity-100`}
      >
        <div className={`overflow-hidden ${effectiveOpen ? "" : "pointer-events-none"} sm:overflow-visible`}>
          {section.note && (
            <p className="mb-6 text-sm text-muted-foreground italic max-w-3xl">
              {section.note}
            </p>
          )}

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {section.items.map((item, i) => (
              <button
                type="button"
                key={`${item.code ?? ""}-${item.name}-${i}`}
                onClick={() => onItemClick(item, section)}
                className={`group relative text-left rounded-xl p-5 bg-card/60 backdrop-blur ${c.box} transition-all hover:-translate-y-1 hover:bg-card/80 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground/40`}
              >
                <div className="flex items-baseline justify-between gap-3">
                  <h4 className="min-w-0 flex-1 font-display text-lg sm:text-xl leading-snug tracking-wide text-foreground break-words">
                    {item.code && (
                      <span className={`mr-2 ${c.text}`}>{item.code}.</span>
                    )}
                    {item.name}
                    {item.veg && <span className="ml-1.5 text-neon-green text-lg sm:text-xl leading-none align-baseline whitespace-nowrap" aria-label="vegetariskt">🌱</span>}
                  </h4>
                  <span className={`shrink-0 font-display text-base sm:text-lg leading-snug ${c.text}`}>
                    {item.price}
                  </span>
                </div>
                {item.desc && (
                  <p className="mt-2 text-sm text-foreground/70 leading-relaxed line-clamp-3">
                    {item.desc}
                  </p>
                )}
                <div className="mt-3 flex items-center justify-between gap-2">
                  {item.options ? (
                    <div className="flex flex-wrap gap-1.5">
                      {item.options.map((o) => (
                        <span
                          key={o}
                          className="text-xs px-2 py-0.5 rounded-full border border-border/70 text-foreground/70"
                        >
                          {o}
                        </span>
                      ))}
                    </div>
                  ) : <span />}
                  <span className={`text-[10px] tracking-[0.25em] uppercase opacity-0 group-hover:opacity-100 transition-opacity ${c.text}`}>
                    Se detaljer →
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

