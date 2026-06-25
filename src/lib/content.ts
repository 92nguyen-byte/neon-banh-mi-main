import { useQuery } from "@tanstack/react-query";
import { queryOptions } from "@tanstack/react-query";
import { getMenuData, getSiteTexts, type DbMenuItem, type DbMenuSection } from "./content.functions";
import { menu as defaultMenu, type MenuSection } from "@/data/menu";

export const siteTextsQO = queryOptions({
  queryKey: ["site_texts"],
  queryFn: () => getSiteTexts(),
  staleTime: 60_000,
});

export const menuDataQO = queryOptions({
  queryKey: ["menu_data"],
  queryFn: () => getMenuData(),
  staleTime: 60_000,
});

export function useSiteText(key: string, fallback = ""): string {
  const { data } = useQuery(siteTextsQO);
  if (!data) return fallback;
  const hit = data.find((t) => t.key === key);
  return hit?.value ?? fallback;
}

export function useMenuSections(): { sections: MenuSection[]; lunch: MenuSection | null } {
  const { data } = useQuery(menuDataQO);
  if (!data) {
    return { sections: defaultMenu, lunch: null };
  }
  return buildSections(data.sections, data.items);
}

export function buildSections(
  sections: DbMenuSection[],
  items: DbMenuItem[],
): { sections: MenuSection[]; lunch: MenuSection | null } {
  const grouped = new Map<string, DbMenuItem[]>();
  for (const it of items) {
    const arr = grouped.get(it.section_id) ?? [];
    arr.push(it);
    grouped.set(it.section_id, arr);
  }
  const all: MenuSection[] = sections.map((s) => ({
    id: s.id,
    title: s.title,
    subtitle: s.subtitle ?? undefined,
    note: s.note ?? undefined,
    color: s.color,
    items: (grouped.get(s.id) ?? []).map((it) => ({
      code: it.code ?? undefined,
      name: it.name,
      desc: it.description ?? undefined,
      price: it.price,
      veg: it.veg || undefined,
      options: it.options.length ? it.options : undefined,
    })),
  }));
  const lunchSec = sections.find((s) => s.is_lunch);
  return {
    sections: all.filter((s) => {
      const meta = sections.find((m) => m.id === s.id);
      return meta && !meta.is_lunch;
    }),
    lunch: lunchSec ? all.find((s) => s.id === lunchSec.id) ?? null : null,
  };
}
