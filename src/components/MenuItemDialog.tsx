import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import type { MenuItem, MenuSection } from "@/data/menu";

const colorMap = {
  green: { text: "neon-green-text", box: "neon-box-green" },
  gold: { text: "neon-gold-text", box: "neon-box-gold" },
  red: { text: "neon-red-text", box: "neon-box-red" },
} as const;

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: MenuItem | null;
  section: MenuSection | null;
};

export function MenuItemDialog({ open, onOpenChange, item, section }: Props) {
  if (!item || !section) return null;
  const c = colorMap[section.color];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`bg-card/95 backdrop-blur border-0 ${c.box} max-w-lg`}>
        <DialogHeader>
          <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground">
            {section.title}
          </p>
          <DialogTitle className={`font-display text-2xl sm:text-3xl tracking-wide break-words ${c.text}`}>
            {item.code && <span className="mr-2">{item.code}.</span>}
            {item.name}
            {item.veg && <span className="ml-2 text-neon-green text-xl sm:text-2xl align-middle whitespace-nowrap">🌱</span>}
          </DialogTitle>
          <DialogDescription className="sr-only">
            Detaljer för {item.name}
          </DialogDescription>
        </DialogHeader>

        <div className={`font-display text-4xl ${c.text}`}>{item.price}</div>

        {item.desc && (
          <p className="text-foreground/85 leading-relaxed">{item.desc}</p>
        )}

        {item.options && item.options.length > 0 && (
          <div>
            <p className="text-xs tracking-widest uppercase text-muted-foreground mb-2">
              Välj protein
            </p>
            <div className="flex flex-wrap gap-2">
              {item.options.map((o) => (
                <span
                  key={o}
                  className="text-sm px-3 py-1 rounded-full border border-border/70 text-foreground/80"
                >
                  {o}
                </span>
              ))}
            </div>
          </div>
        )}

        {section.note && (
          <div className="mt-2 pt-4 border-t border-border/40">
            <p className="text-xs tracking-widest uppercase text-muted-foreground mb-2">
              Bra att veta
            </p>
            <p className="text-sm text-foreground/70 italic">{section.note}</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
