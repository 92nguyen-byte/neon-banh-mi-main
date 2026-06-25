## Mål
Flytta "Bamboo House"-texten från hero-sektionen på förstasidan upp till headern (bredvid logotypen), så att den syns på alla sidor.

## Ändringar

### `src/components/SiteNav.tsx`
- Ersätt `<span className="sr-only">Bamboo House</span>` med en synlig wordmark bredvid logotypen:
  - "Bamboo" i neon-grön + "House" i neon-guld, i `font-display`.
  - Dold på de minsta skärmarna (`hidden sm:flex`) så headern inte trängs ihop på mobil — logotypen räcker där.

### `src/routes/index.tsx`
- Ta bort `<h1>`-blocket med "Bamboo" / "House" från hero (rad 61–64).
- Behåll badgen "Nyöppnat i Uddevalla" och brödtexten under.
- Justera toppmarginalen på brödtexten så avståndet blir snyggt nu när rubriken försvinner (t.ex. `mt-6` → behålls, men badgen får lite mer luft under).
- Lämna logotyp-bilden i hero-spalten orörd.

Inga andra filer påverkas.
