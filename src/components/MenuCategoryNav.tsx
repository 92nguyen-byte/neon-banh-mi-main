import { useCallback, useEffect, useRef, useState } from "react";
import type { MenuSection } from "@/data/menu";

const colorMap = {
  green: { active: "neon-box-green neon-green-text", dot: "bg-neon-green" },
  gold: { active: "neon-box-gold neon-gold-text", dot: "bg-neon-gold" },
  red: { active: "neon-box-red neon-red-text", dot: "bg-neon-red" },
} as const;

// Offset matches the sticky header (h-16 mobile / h-20 desktop) + category nav (~56px).
const SCROLL_OFFSET = 140;

export function MenuCategoryNav({ sections }: { sections: MenuSection[] }) {
  const [active, setActive] = useState(sections[0]?.id ?? "");
  // Lock the active state briefly after a click so the IntersectionObserver
  // doesn't flip the highlight while the smooth scroll is still travelling
  // past intermediate sections.
  const lockUntil = useRef(0);

  const pickActive = useCallback(() => {
    if (performance.now() < lockUntil.current) return;
    // Choose the section whose top is closest to (but not past) the scroll
    // anchor line — same line used by handleClick. This matches the visual
    // "what's at the top of the viewport" instead of intersectionRatio,
    // which always favours larger sections.
    const anchor = SCROLL_OFFSET + 1;
    let best: { id: string; dist: number } | null = null;
    for (const s of sections) {
      const el = document.getElementById(s.id);
      if (!el) continue;
      const top = el.getBoundingClientRect().top;
      // Prefer sections whose top is at or above the anchor line.
      const dist = top <= anchor ? anchor - top : Number.POSITIVE_INFINITY;
      if (dist !== Number.POSITIVE_INFINITY && (!best || dist < best.dist)) {
        best = { id: s.id, dist };
      }
    }
    // If nothing has crossed the anchor yet (top of page), keep the first section.
    if (best) setActive(best.id);
    else if (sections[0]) setActive(sections[0].id);
  }, [sections]);

  useEffect(() => {
    pickActive();
    const onScroll = () => pickActive();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [pickActive]);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (!el) return;
    // Set active immediately and lock for the duration of the smooth scroll.
    setActive(id);
    lockUntil.current = performance.now() + 800;
    const top = el.getBoundingClientRect().top + window.scrollY - SCROLL_OFFSET;
    // Respect prefers-reduced-motion: jump instantly instead of smooth-scroll.
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top, behavior: reduce ? "auto" : "smooth" });
    // Reflect the section in the URL so the link is shareable, without
    // triggering the browser's native scroll jump.
    if (window.location.hash !== `#${id}`) {
      window.history.replaceState(null, "", `#${id}`);
    }
  };

  return (
    <nav className="sticky top-16 z-30 -mx-4 px-4 py-3 mb-10 bg-background/85 backdrop-blur border-y border-border/40">
      <div className="flex gap-2 overflow-x-auto no-scrollbar">
        {sections.map((s) => {
          const c = colorMap[s.color];
          const isActive = active === s.id;
          return (
            <a
              key={s.id}
              href={`#${s.id}`}
              onClick={(e) => handleClick(e, s.id)}
              aria-current={isActive ? "true" : undefined}
              className={`shrink-0 flex items-center gap-2 px-4 py-2 rounded-full text-sm font-display tracking-wider uppercase whitespace-nowrap transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-green focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
                isActive
                  ? c.active
                  : "border border-border/60 text-foreground/70 hover:text-foreground hover:border-foreground/60 hover:bg-foreground/5"
              }`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${c.dot}`} />
              {s.title}
            </a>
          );
        })}
      </div>
    </nav>
  );
}

