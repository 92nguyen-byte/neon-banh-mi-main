
CREATE TABLE public.site_texts (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL DEFAULT '',
  label TEXT NOT NULL DEFAULT '',
  group_name TEXT NOT NULL DEFAULT 'misc',
  multiline BOOLEAN NOT NULL DEFAULT FALSE,
  sort_order INT NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.site_texts TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.site_texts TO authenticated;
GRANT ALL ON public.site_texts TO service_role;
ALTER TABLE public.site_texts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "site_texts public read" ON public.site_texts FOR SELECT USING (true);

CREATE TABLE public.menu_sections (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT,
  note TEXT,
  color TEXT NOT NULL DEFAULT 'green',
  sort_order INT NOT NULL DEFAULT 0,
  is_lunch BOOLEAN NOT NULL DEFAULT FALSE,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.menu_sections TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.menu_sections TO authenticated;
GRANT ALL ON public.menu_sections TO service_role;
ALTER TABLE public.menu_sections ENABLE ROW LEVEL SECURITY;
CREATE POLICY "menu_sections public read" ON public.menu_sections FOR SELECT USING (true);

CREATE TABLE public.menu_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section_id TEXT NOT NULL REFERENCES public.menu_sections(id) ON DELETE CASCADE,
  code TEXT,
  name TEXT NOT NULL,
  description TEXT,
  price TEXT NOT NULL DEFAULT '',
  veg BOOLEAN NOT NULL DEFAULT FALSE,
  options JSONB NOT NULL DEFAULT '[]'::jsonb,
  sort_order INT NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX menu_items_section_idx ON public.menu_items(section_id, sort_order);
GRANT SELECT ON public.menu_items TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.menu_items TO authenticated;
GRANT ALL ON public.menu_items TO service_role;
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "menu_items public read" ON public.menu_items FOR SELECT USING (true);
