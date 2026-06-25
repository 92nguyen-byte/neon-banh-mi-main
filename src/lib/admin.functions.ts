import { createServerFn } from "@tanstack/react-start";

export const adminLogin = createServerFn({ method: "POST" })
  .inputValidator((data: { username: string; password: string }) => data)
  .handler(async ({ data }) => {
    const { tryLogin } = await import("./admin.server");
    const ok = await tryLogin(data.username, data.password);
    return { ok };
  });

export const adminLogout = createServerFn({ method: "POST" }).handler(async () => {
  const { clearAdminSession } = await import("./admin.server");
  await clearAdminSession();
  return { ok: true as const };
});

export const adminMe = createServerFn({ method: "GET" }).handler(async () => {
  const { isAdmin } = await import("./admin.server");
  return { admin: await isAdmin() };
});

async function adminSb() {
  const { requireAdmin } = await import("./admin.server");
  await requireAdmin();
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  return supabaseAdmin;
}

export const adminUpsertText = createServerFn({ method: "POST" })
  .inputValidator((data: { key: string; value: string }) => data)
  .handler(async ({ data }) => {
    const sb = await adminSb();
    const { error } = await sb
      .from("site_texts")
      .update({ value: data.value, updated_at: new Date().toISOString() })
      .eq("key", data.key);
    if (error) throw error;
    return { ok: true };
  });

export const adminUpsertSection = createServerFn({ method: "POST" })
  .inputValidator((data: {
    id: string;
    title: string;
    subtitle: string | null;
    note: string | null;
    color: "green" | "gold" | "red";
    sort_order: number;
    is_lunch: boolean;
    isNew?: boolean;
  }) => data)
  .handler(async ({ data }) => {
    const sb = await adminSb();
    const payload = {
      id: data.id,
      title: data.title,
      subtitle: data.subtitle,
      note: data.note,
      color: data.color,
      sort_order: data.sort_order,
      is_lunch: data.is_lunch,
      updated_at: new Date().toISOString(),
    };
    const { error } = data.isNew
      ? await sb.from("menu_sections").insert(payload)
      : await sb.from("menu_sections").update(payload).eq("id", data.id);
    if (error) throw error;
    return { ok: true };
  });

export const adminDeleteSection = createServerFn({ method: "POST" })
  .inputValidator((data: { id: string }) => data)
  .handler(async ({ data }) => {
    const sb = await adminSb();
    const { error } = await sb.from("menu_sections").delete().eq("id", data.id);
    if (error) throw error;
    return { ok: true };
  });

export const adminUpsertItem = createServerFn({ method: "POST" })
  .inputValidator((data: {
    id?: string;
    section_id: string;
    code: string | null;
    name: string;
    description: string | null;
    price: string;
    veg: boolean;
    options: string[];
    sort_order: number;
  }) => data)
  .handler(async ({ data }) => {
    const sb = await adminSb();
    const payload = {
      section_id: data.section_id,
      code: data.code,
      name: data.name,
      description: data.description,
      price: data.price,
      veg: data.veg,
      options: data.options,
      sort_order: data.sort_order,
      updated_at: new Date().toISOString(),
    };
    if (data.id) {
      const { error } = await sb.from("menu_items").update(payload).eq("id", data.id);
      if (error) throw error;
      return { ok: true, id: data.id };
    } else {
      const { data: row, error } = await sb
        .from("menu_items")
        .insert(payload)
        .select("id")
        .single();
      if (error) throw error;
      return { ok: true, id: row.id as string };
    }
  });

export const adminDeleteItem = createServerFn({ method: "POST" })
  .inputValidator((data: { id: string }) => data)
  .handler(async ({ data }) => {
    const sb = await adminSb();
    const { error } = await sb.from("menu_items").delete().eq("id", data.id);
    if (error) throw error;
    return { ok: true };
  });
