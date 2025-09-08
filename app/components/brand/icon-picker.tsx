import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { ALL_ICONS, registerRuntimeIcon, type IconDef } from "~/lib/brand-kit/icons/registry";
import { cn } from "~/lib/utils";

type IconPickerProps = {
  value: string;
  onChange: (id: string) => void;
  trigger?: React.ReactNode;
  /**
   * Additional classes for the dialog content container (overall size/width/height)
   */
  className?: string;
  /**
   * Additional classes for the internal icon grid (e.g., to change max height)
   */
  gridClassName?: string;
};

export function IconPicker({ value, onChange, trigger, className, gridClassName }: IconPickerProps) {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [loaded, setLoaded] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  // Keep a local list of lucide keys for paging
  const lucideKeysRef = React.useRef<string[]>([]);
  const [limit, setLimit] = React.useState(144); // 12 cols * 12 rows to start
  const pageSize = 144;
  const endRef = React.useRef<HTMLDivElement | null>(null);

  const filtered = React.useMemo(() => {
    const source = lucideKeysRef.current;
    if (!query.trim()) return source;
    const q = query.toLowerCase();
    return source.filter(k => k.toLowerCase().includes(q));
  }, [query, loaded]);

  const visible = React.useMemo(() => filtered.slice(0, limit), [filtered, limit]);

  React.useEffect(() => {
    // reset limit when query changes
    setLimit(pageSize);
  }, [query]);

  async function loadLucide() {
    if (loaded || loading) return;
    try {
      setLoading(true);
      const res = await fetch('/lucide-subset.json', { cache: 'no-store' });
      if (!res.ok) return;
      const data: Record<string, IconDef> = await res.json();
      Object.entries(data).forEach(([id, def]) => registerRuntimeIcon(`lucide:${id}`, def));
      // Build ordered list of lucide keys
      lucideKeysRef.current = Object.keys(data).map(k => `lucide:${k}`);
      setLoaded(true);
    } finally {
      setLoading(false);
    }
  }

  // Auto-load when dialog opens
  React.useEffect(() => {
    if (open) void loadLucide();
  }, [open]);

  // Infinite scroll observer
  React.useEffect(() => {
    if (!open) return;
    const el = endRef.current;
    if (!el) return;
    const io = new IntersectionObserver((entries) => {
      const entry = entries[0];
      if (entry.isIntersecting) {
        setLimit(prev => Math.min(prev + pageSize, filtered.length));
      }
    }, { root: document.querySelector('[data-icon-grid-root]') as Element | null ?? null, rootMargin: '0px', threshold: 1.0 });
    io.observe(el);
    return () => io.disconnect();
  }, [open, filtered.length]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? <Button variant="outline" size="sm">Choose Icon</Button>}
      </DialogTrigger>
      <DialogContent className={cn("max-w-[900px] sm:!max-w-[900px]", className)}>
        <DialogHeader>
          <DialogTitle>Pick an icon</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Input placeholder="Search icons" value={query} onChange={(e) => setQuery(e.target.value)} />
          </div>
          <div data-icon-grid-root className={cn("grid grid-cols-12 gap-x-10 gap-y-4 max-h-[580px] overflow-auto p-2 bg-background", gridClassName)}>
            {visible.map((id) => {
              const def = ALL_ICONS[id];
              if (!def) return null;
              const inner = def.raw ?? (def.paths ? def.paths.map((p) => `<path d=\"${p.d}\" ${p.fill ? `fill='${p.fill}'` : ''} ${p.stroke ? `stroke='${p.stroke}'` : ''} ${p.strokeWidth ? `stroke-width='${p.strokeWidth}'` : ''}/>`).join("") : "");
              const svg = `<svg width='32' height='32' viewBox='${def.viewBox}' xmlns='http://www.w3.org/2000/svg' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'>${inner}</svg>`;
              return (
                <button
                  key={id}
                  className={`rounded p-4 h-15 w-15 flex items-center justify-center bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200 transition-colors ${value === id ? 'ring-2 ring-primary bg-primary/10' : ''}`}
                  onClick={() => { onChange(id); setOpen(false); }}
                  title={id}
                  dangerouslySetInnerHTML={{ __html: svg }}
                />
              );
            })}
            {/* Sentinel */}
            <div ref={endRef} className="col-span-12 h-2" />
          </div>
          {!loaded && <div className="text-xs text-muted-foreground">Loading Lucide icons… if you still see only a few icons, ensure public/lucide-subset.json exists and reload.</div>}
        </div>
      </DialogContent>
    </Dialog>
  );
} 