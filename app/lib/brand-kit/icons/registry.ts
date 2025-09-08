/**
 * Icon/Shape Registry
 * Maps iconId to SVG path data and viewBox. Keep small and curated.
 */

export type IconDef = {
  viewBox: string; // e.g. "0 0 24 24"
  paths?: { d: string; fill?: string; stroke?: string; strokeWidth?: number; fillRule?: string }[];
  raw?: string; // inner SVG markup
};

// Basic shapes are generated in code via shapes.ts. Here we include sample lucide icons.
export const ICONS: Record<string, IconDef> = {
  "lucide:sparkles": {
    viewBox: "0 0 24 24",
    paths: [
      { d: "M12 3v3m0 12v3m9-9h-3M6 12H3m12.5-6.5l-2 2m-5 10l-2 2m9 0l-2-2m-5-10l-2-2", stroke: "currentColor", strokeWidth: 2 },
    ],
  },
  "lucide:bolt": {
    viewBox: "0 0 24 24",
    paths: [
      { d: "M13 3L4 14h7l-1 7 9-11h-7l1-7z", fill: "currentColor" },
    ],
  },
};

// Small subset inspired by Iconsax (for demo). You can expand this list or generate it.
export const ICONSAX: Record<string, IconDef> = {
  "iconsax:star": {
    viewBox: "0 0 24 24",
    paths: [
      { d: "M12 2l2.9 6.1 6.7.9-4.8 4.7 1.2 6.6L12 17.8 6 20.3l1.2-6.6L2.4 9l6.7-.9L12 2z", fill: "currentColor" },
    ],
  },
  "iconsax:heart": {
    viewBox: "0 0 24 24",
    paths: [
      { d: "M12 21s-6.5-4.3-9.1-7C.7 11.8.5 8.7 2.4 6.9 4 5.3 6.6 5.5 8 7c1 1.1 1.4 1.9 4 0 1.6-1 4-1.7 5.6-.1 1.9 1.8 1.7 4.9-.5 7.1C18.2 16.7 12 21 12 21z", fill: "currentColor" },
    ],
  },
  "iconsax:shield": {
    viewBox: "0 0 24 24",
    paths: [
      { d: "M12 2l8 4v6c0 5-3.5 9-8 10-4.5-1-8-5-8-10V6l8-4z", fill: "currentColor" },
    ],
  },
};

const RUNTIME: Record<string, IconDef> = {};
export const registerRuntimeIcon = (id: string, def: IconDef) => {
  RUNTIME[id] = def;
};

export const ALL_ICONS: Record<string, IconDef> = new Proxy({}, {
  get(_t, key: string) {
    return RUNTIME[key] || ICONS[key] || ICONSAX[key];
  },
  ownKeys() {
    return Array.from(new Set([...Object.keys(ICONS), ...Object.keys(ICONSAX), ...Object.keys(RUNTIME)]));
  },
  getOwnPropertyDescriptor() {
    return { enumerable: true, configurable: true } as PropertyDescriptor;
  }
}) as unknown as Record<string, IconDef>; 