import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";

function publicClient() {
  return createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_PUBLISHABLE_KEY!,
    { auth: { storage: undefined, persistSession: false, autoRefreshToken: false } },
  );
}

export type DbMenuItem = {
  id: string;
  section_id: string;
  code: string | null;
  name: string;
  description: string | null;
  price: string;
  veg: boolean;
  options: string[];
  sort_order: number;
};

export type DbMenuSection = {
  id: string;
  title: string;
  subtitle: string | null;
  note: string | null;
  color: "green" | "gold" | "red";
  sort_order: number;
  is_lunch: boolean;
};

export type DbSiteText = {
  key: string;
  value: string;
  label: string;
  group_name: string;
  multiline: boolean;
  sort_order: number;
};

export const getMenuData = createServerFn({ method: "GET" }).handler(async () => {
  const sb = publicClient();
  const [sectionsRes, itemsRes] = await Promise.all([
    sb.from("menu_sections").select("*").order("sort_order"),
    sb.from("menu_items").select("*").order("sort_order"),
  ]);
  if (sectionsRes.error) throw sectionsRes.error;
  if (itemsRes.error) throw itemsRes.error;
  return {
    sections: (sectionsRes.data ?? []) as DbMenuSection[],
    items: (itemsRes.data ?? []) as DbMenuItem[],
  };
});

export const getSiteTexts = createServerFn({ method: "GET" }).handler(async () => {
  const sb = publicClient();
  const { data, error } = await sb
    .from("site_texts")
    .select("*")
    .order("group_name")
    .order("sort_order");
  if (error) throw error;
  return (data ?? []) as DbSiteText[];
});
