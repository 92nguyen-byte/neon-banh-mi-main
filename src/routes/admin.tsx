import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import {
  adminLogin,
  adminLogout,
  adminMe,
  adminUpsertText,
  adminUpsertItem,
  adminDeleteItem,
  adminUpsertSection,
  adminDeleteSection,
} from "@/lib/admin.functions";
import { getMenuData, getSiteTexts, type DbMenuItem, type DbMenuSection, type DbSiteText } from "@/lib/content.functions";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin · Bamboo House" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminPage,
});

function AdminPage() {
  const me = useQuery({ queryKey: ["admin_me"], queryFn: () => adminMe() });

  if (me.isLoading) {
    return <div className="mx-auto max-w-md p-12 text-center text-muted-foreground">Laddar…</div>;
  }
  if (!me.data?.admin) return <LoginForm />;
  return <AdminDashboard />;
}

function LoginForm() {
  const qc = useQueryClient();
  const login = useServerFn(adminLogin);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    try {
      const { ok } = await login({ data: { username, password } });
      if (!ok) {
        toast.error("Fel användarnamn eller lösenord");
      } else {
        await qc.invalidateQueries({ queryKey: ["admin_me"] });
      }
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-24">
      <h1 className="font-display text-4xl text-center neon-green-text">Admin</h1>
      <p className="text-center text-sm text-muted-foreground mt-2">Logga in för att redigera sidans texter och meny.</p>
      <form onSubmit={onSubmit} className="mt-10 space-y-4 rounded-2xl p-6 neon-box-green bg-card/50 backdrop-blur">
        <div>
          <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">Användarnamn</label>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            className="w-full rounded-md bg-background/60 border border-border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-neon-green"
            required
          />
        </div>
        <div>
          <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">Lösenord</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            className="w-full rounded-md bg-background/60 border border-border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-neon-green"
            required
          />
        </div>
        <button
          type="submit"
          disabled={pending}
          className="w-full px-4 py-3 rounded-md font-display tracking-widest uppercase neon-box-green hover:neon-green-text disabled:opacity-60"
        >
          {pending ? "Loggar in…" : "Logga in"}
        </button>
      </form>
    </div>
  );
}

function AdminDashboard() {
  const qc = useQueryClient();
  const logout = useServerFn(adminLogout);
  const [tab, setTab] = useState<"texts" | "menu">("texts");

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <header className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-display text-4xl neon-gold-text">Admin</h1>
          <p className="text-sm text-muted-foreground">Redigera sidans texter och meny.</p>
        </div>
        <button
          onClick={async () => {
            await logout();
            await qc.invalidateQueries({ queryKey: ["admin_me"] });
          }}
          className="px-4 py-2 rounded-md text-sm neon-box-red hover:neon-red-text"
        >
          Logga ut
        </button>
      </header>

      <nav className="mt-8 flex gap-2 border-b border-border">
        {(["texts", "menu"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 font-display tracking-widest uppercase text-sm border-b-2 -mb-px transition-colors ${
              tab === t ? "border-neon-green neon-green-text" : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {t === "texts" ? "Texter" : "Meny & rätter"}
          </button>
        ))}
      </nav>

      {tab === "texts" ? <TextsEditor /> : <MenuEditor />}
    </div>
  );
}

function TextsEditor() {
  const qc = useQueryClient();
  const upsert = useServerFn(adminUpsertText);
  const { data } = useQuery({ queryKey: ["admin_texts"], queryFn: () => getSiteTexts() });
  const [drafts, setDrafts] = useState<Record<string, string>>({});

  useEffect(() => {
    if (data) {
      setDrafts(Object.fromEntries(data.map((t) => [t.key, t.value])));
    }
  }, [data]);

  const groups = useMemo(() => {
    const map = new Map<string, DbSiteText[]>();
    (data ?? []).forEach((t) => {
      const arr = map.get(t.group_name) ?? [];
      arr.push(t);
      map.set(t.group_name, arr);
    });
    return Array.from(map.entries());
  }, [data]);

  async function save(key: string) {
    try {
      await upsert({ data: { key, value: drafts[key] ?? "" } });
      toast.success("Sparat");
      await qc.invalidateQueries({ queryKey: ["site_texts"] });
      await qc.invalidateQueries({ queryKey: ["admin_texts"] });
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Kunde inte spara");
    }
  }

  if (!data) return <p className="mt-8 text-muted-foreground">Laddar…</p>;

  return (
    <div className="mt-8 space-y-10">
      {groups.map(([group, items]) => (
        <section key={group}>
          <h2 className="font-display text-xl neon-green-text mb-4">{group}</h2>
          <div className="space-y-4">
            {items.map((t) => (
              <div key={t.key} className="rounded-xl border border-border bg-card/40 p-4">
                <div className="flex justify-between items-center mb-2 gap-3 flex-wrap">
                  <label className="text-xs uppercase tracking-widest text-muted-foreground">
                    {t.label || t.key}{" "}
                    <span className="opacity-60">({t.key})</span>
                  </label>
                  <button
                    onClick={() => save(t.key)}
                    className="px-3 py-1 rounded text-xs neon-box-gold hover:neon-gold-text"
                  >
                    Spara
                  </button>
                </div>
                {t.multiline ? (
                  <textarea
                    rows={3}
                    value={drafts[t.key] ?? ""}
                    onChange={(e) => setDrafts((d) => ({ ...d, [t.key]: e.target.value }))}
                    className="w-full rounded-md bg-background/60 border border-border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-neon-green"
                  />
                ) : (
                  <input
                    value={drafts[t.key] ?? ""}
                    onChange={(e) => setDrafts((d) => ({ ...d, [t.key]: e.target.value }))}
                    className="w-full rounded-md bg-background/60 border border-border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-neon-green"
                  />
                )}
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

function MenuEditor() {
  const qc = useQueryClient();
  const upsertItem = useServerFn(adminUpsertItem);
  const deleteItem = useServerFn(adminDeleteItem);
  const upsertSection = useServerFn(adminUpsertSection);
  const deleteSection = useServerFn(adminDeleteSection);
  const { data } = useQuery({ queryKey: ["admin_menu"], queryFn: () => getMenuData() });

  async function invalidate() {
    await qc.invalidateQueries({ queryKey: ["admin_menu"] });
    await qc.invalidateQueries({ queryKey: ["menu_data"] });
  }

  async function saveSection(s: DbMenuSection, isNew = false) {
    try {
      await upsertSection({ data: { ...s, isNew } });
      toast.success("Sektion sparad");
      await invalidate();
    } catch (e) { toast.error(e instanceof Error ? e.message : "Fel"); }
  }
  async function removeSection(id: string) {
    if (!confirm("Ta bort sektion och alla dess rätter?")) return;
    try {
      await deleteSection({ data: { id } });
      toast.success("Sektion borttagen");
      await invalidate();
    } catch (e) { toast.error(e instanceof Error ? e.message : "Fel"); }
  }
  async function saveItem(it: DbMenuItem) {
    try {
      await upsertItem({
        data: {
          id: it.id || undefined,
          section_id: it.section_id,
          code: it.code,
          name: it.name,
          description: it.description,
          price: it.price,
          veg: it.veg,
          options: it.options,
          sort_order: it.sort_order,
        },
      });
      toast.success("Rätt sparad");
      await invalidate();
    } catch (e) { toast.error(e instanceof Error ? e.message : "Fel"); }
  }
  async function removeItem(id: string) {
    if (!confirm("Ta bort denna rätt?")) return;
    try {
      await deleteItem({ data: { id } });
      toast.success("Borttagen");
      await invalidate();
    } catch (e) { toast.error(e instanceof Error ? e.message : "Fel"); }
  }

  if (!data) return <p className="mt-8 text-muted-foreground">Laddar…</p>;

  return (
    <div className="mt-8 space-y-10">
      <div className="flex justify-end">
        <NewSectionButton onCreate={(s) => saveSection(s, true)} />
      </div>
      {data.sections.map((sec) => {
        const items = data.items.filter((i) => i.section_id === sec.id);
        return (
          <SectionEditor
            key={sec.id}
            section={sec}
            items={items}
            onSaveSection={(s) => saveSection(s)}
            onDeleteSection={() => removeSection(sec.id)}
            onSaveItem={saveItem}
            onDeleteItem={removeItem}
          />
        );
      })}
    </div>
  );
}

function NewSectionButton({ onCreate }: { onCreate: (s: DbMenuSection) => void }) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<DbMenuSection>({
    id: "",
    title: "",
    subtitle: null,
    note: null,
    color: "green",
    sort_order: 1000,
    is_lunch: false,
  });
  if (!open) {
    return (
      <button onClick={() => setOpen(true)} className="px-3 py-2 rounded text-sm neon-box-green hover:neon-green-text">
        + Ny sektion
      </button>
    );
  }
  return (
    <div className="rounded-xl border border-border bg-card/40 p-4 w-full">
      <h3 className="font-display mb-3">Ny sektion</h3>
      <div className="grid sm:grid-cols-2 gap-3">
        <input placeholder="ID (t.ex. nya-ratter)" value={draft.id} onChange={(e) => setDraft({ ...draft, id: e.target.value })} className="rounded bg-background/60 border border-border px-3 py-2" />
        <input placeholder="Titel" value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} className="rounded bg-background/60 border border-border px-3 py-2" />
        <select value={draft.color} onChange={(e) => setDraft({ ...draft, color: e.target.value as DbMenuSection["color"] })} className="rounded bg-background/60 border border-border px-3 py-2">
          <option value="green">Grön</option>
          <option value="gold">Guld</option>
          <option value="red">Röd</option>
        </select>
        <input type="number" value={draft.sort_order} onChange={(e) => setDraft({ ...draft, sort_order: Number(e.target.value) })} className="rounded bg-background/60 border border-border px-3 py-2" />
      </div>
      <div className="mt-3 flex gap-2">
        <button onClick={() => { if (!draft.id || !draft.title) return toast.error("ID och titel krävs"); onCreate(draft); setOpen(false); }} className="px-3 py-2 rounded text-sm neon-box-gold hover:neon-gold-text">Skapa</button>
        <button onClick={() => setOpen(false)} className="px-3 py-2 rounded text-sm border border-border">Avbryt</button>
      </div>
    </div>
  );
}

function SectionEditor({
  section, items, onSaveSection, onDeleteSection, onSaveItem, onDeleteItem,
}: {
  section: DbMenuSection;
  items: DbMenuItem[];
  onSaveSection: (s: DbMenuSection) => void;
  onDeleteSection: () => void;
  onSaveItem: (i: DbMenuItem) => void;
  onDeleteItem: (id: string) => void;
}) {
  const [sec, setSec] = useState(section);
  useEffect(() => setSec(section), [section]);

  return (
    <section className="rounded-2xl border border-border bg-card/30 p-5">
      <div className="grid lg:grid-cols-[1fr_auto] gap-3 items-end">
        <div className="grid sm:grid-cols-2 gap-3 flex-1">
          <input value={sec.title} onChange={(e) => setSec({ ...sec, title: e.target.value })} placeholder="Sektionstitel" className="rounded bg-background/60 border border-border px-3 py-2 font-display text-lg" />
          <input value={sec.subtitle ?? ""} onChange={(e) => setSec({ ...sec, subtitle: e.target.value || null })} placeholder="Undertitel (visas på lunchsidan)" className="rounded bg-background/60 border border-border px-3 py-2" />
          <textarea value={sec.note ?? ""} onChange={(e) => setSec({ ...sec, note: e.target.value || null })} placeholder="Notering / beskrivning" className="rounded bg-background/60 border border-border px-3 py-2 sm:col-span-2" rows={2} />
          <select value={sec.color} onChange={(e) => setSec({ ...sec, color: e.target.value as DbMenuSection["color"] })} className="rounded bg-background/60 border border-border px-3 py-2">
            <option value="green">Grön</option>
            <option value="gold">Guld</option>
            <option value="red">Röd</option>
          </select>
          <input type="number" value={sec.sort_order} onChange={(e) => setSec({ ...sec, sort_order: Number(e.target.value) })} placeholder="Sortering" className="rounded bg-background/60 border border-border px-3 py-2" />
          <label className="flex items-center gap-2 text-sm sm:col-span-2">
            <input type="checkbox" checked={sec.is_lunch} onChange={(e) => setSec({ ...sec, is_lunch: e.target.checked })} />
            Lunchmeny (visas på /lunch istället för startsidan)
          </label>
        </div>
        <div className="flex gap-2">
          <button onClick={() => onSaveSection(sec)} className="px-3 py-2 rounded text-sm neon-box-gold hover:neon-gold-text">Spara sektion</button>
          <button onClick={onDeleteSection} className="px-3 py-2 rounded text-sm neon-box-red hover:neon-red-text">Ta bort</button>
        </div>
      </div>

      <div className="mt-6 space-y-3">
        {items.map((it) => <ItemRow key={it.id} item={it} onSave={onSaveItem} onDelete={() => onDeleteItem(it.id)} />)}
        <NewItemRow sectionId={sec.id} nextOrder={(items[items.length - 1]?.sort_order ?? 0) + 10} onSave={onSaveItem} />
      </div>
    </section>
  );
}

function ItemRow({ item, onSave, onDelete }: { item: DbMenuItem; onSave: (i: DbMenuItem) => void; onDelete: () => void }) {
  const [it, setIt] = useState(item);
  useEffect(() => setIt(item), [item]);
  const [optsText, setOptsText] = useState(item.options.join(", "));
  useEffect(() => setOptsText(item.options.join(", ")), [item.options]);

  return (
    <div className="rounded-xl border border-border/60 bg-background/40 p-3">
      <div className="grid md:grid-cols-[80px_1fr_120px_100px_auto] gap-2 items-start">
        <input value={it.code ?? ""} onChange={(e) => setIt({ ...it, code: e.target.value || null })} placeholder="Kod" className="rounded bg-background/60 border border-border px-2 py-1.5 text-sm" />
        <input value={it.name} onChange={(e) => setIt({ ...it, name: e.target.value })} placeholder="Namn" className="rounded bg-background/60 border border-border px-2 py-1.5 text-sm font-medium" />
        <input value={it.price} onChange={(e) => setIt({ ...it, price: e.target.value })} placeholder="Pris" className="rounded bg-background/60 border border-border px-2 py-1.5 text-sm" />
        <input type="number" value={it.sort_order} onChange={(e) => setIt({ ...it, sort_order: Number(e.target.value) })} placeholder="Sort" className="rounded bg-background/60 border border-border px-2 py-1.5 text-sm" />
        <div className="flex gap-1">
          <button onClick={() => onSave({ ...it, options: optsText.split(",").map((s) => s.trim()).filter(Boolean) })} className="px-2 py-1.5 rounded text-xs neon-box-gold hover:neon-gold-text">Spara</button>
          <button onClick={onDelete} className="px-2 py-1.5 rounded text-xs neon-box-red hover:neon-red-text">×</button>
        </div>
      </div>
      <textarea value={it.description ?? ""} onChange={(e) => setIt({ ...it, description: e.target.value || null })} placeholder="Beskrivning" rows={2} className="mt-2 w-full rounded bg-background/60 border border-border px-2 py-1.5 text-sm" />
      <div className="mt-2 grid sm:grid-cols-[1fr_auto] gap-2 items-center">
        <input value={optsText} onChange={(e) => setOptsText(e.target.value)} placeholder="Alternativ (komma-separerade, t.ex. Kyckling, Tofu)" className="rounded bg-background/60 border border-border px-2 py-1.5 text-sm" />
        <label className="flex items-center gap-2 text-xs text-muted-foreground">
          <input type="checkbox" checked={it.veg} onChange={(e) => setIt({ ...it, veg: e.target.checked })} />
          Vegetarisk
        </label>
      </div>
    </div>
  );
}

function NewItemRow({ sectionId, nextOrder, onSave }: { sectionId: string; nextOrder: number; onSave: (i: DbMenuItem) => void }) {
  const [open, setOpen] = useState(false);
  const blank: DbMenuItem = {
    id: "",
    section_id: sectionId,
    code: null,
    name: "",
    description: null,
    price: "",
    veg: false,
    options: [],
    sort_order: nextOrder,
  };
  const [it, setIt] = useState<DbMenuItem>(blank);

  if (!open) {
    return (
      <button onClick={() => { setIt({ ...blank, sort_order: nextOrder }); setOpen(true); }} className="text-sm px-3 py-2 rounded neon-box-green hover:neon-green-text">
        + Ny rätt
      </button>
    );
  }
  return (
    <div className="rounded-xl border border-border bg-card/40 p-3">
      <h4 className="text-sm font-display mb-2 neon-green-text">Ny rätt</h4>
      <div className="grid md:grid-cols-[80px_1fr_120px_100px] gap-2">
        <input value={it.code ?? ""} onChange={(e) => setIt({ ...it, code: e.target.value || null })} placeholder="Kod" className="rounded bg-background/60 border border-border px-2 py-1.5 text-sm" />
        <input value={it.name} onChange={(e) => setIt({ ...it, name: e.target.value })} placeholder="Namn" className="rounded bg-background/60 border border-border px-2 py-1.5 text-sm" />
        <input value={it.price} onChange={(e) => setIt({ ...it, price: e.target.value })} placeholder="Pris" className="rounded bg-background/60 border border-border px-2 py-1.5 text-sm" />
        <input type="number" value={it.sort_order} onChange={(e) => setIt({ ...it, sort_order: Number(e.target.value) })} className="rounded bg-background/60 border border-border px-2 py-1.5 text-sm" />
      </div>
      <textarea value={it.description ?? ""} onChange={(e) => setIt({ ...it, description: e.target.value || null })} placeholder="Beskrivning" rows={2} className="mt-2 w-full rounded bg-background/60 border border-border px-2 py-1.5 text-sm" />
      <div className="mt-2 flex gap-2">
        <button onClick={() => { if (!it.name) return toast.error("Namn krävs"); onSave({ ...it, id: "" }); setOpen(false); }} className="px-3 py-1.5 rounded text-sm neon-box-gold hover:neon-gold-text">Skapa</button>
        <button onClick={() => setOpen(false)} className="px-3 py-1.5 rounded text-sm border border-border">Avbryt</button>
      </div>
    </div>
  );
}
