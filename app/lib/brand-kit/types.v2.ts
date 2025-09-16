/**
 * Brand Kit Generator - Spec V2 (icon/shape-first)
 */

export type BgSolid = { type: "solid"; color: string };
export type BgLinear = { type: "linear-gradient"; angle: number; stops: { color: string; at: number }[] };
export type BackgroundSpec = BgSolid | BgLinear;

export type TemplateV2 = "mark-only" | "left-lockup" | "stacked" | "badge";

// Asset context types for smart selection
export type AssetContext = 
  | "favicon"
  | "social-avatar" 
  | "app-icon"
  | "website-header"
  | "business-card"
  | "hero-preview"
  | "export";

// Generated brand assets
export type BrandAssets = {
  icon?: string;        // SVG for icon/mark only (if iconId provided)
  wordmark: string;     // SVG for text-only with styling
  monogram?: string;    // SVG fallback monogram from initials (if no icon)
  lockups: {
    left: string;       // SVG for left lockup
    stacked: string;    // SVG for stacked layout  
    badge: string;      // SVG for badge layout
  };
};

export type BrandSpecV2 = {
  version: 2;
  name: string;
  initial: string;
  heroStyle: TemplateV2; // What shows in main preview (renamed from 'template')
  iconId: string; // e.g. "shape:rounded-square" or "lucide:sparkles"; may be empty for no icon
  colors: {
    primary: string;
    background: string;
    text: string;
  };
  background: BackgroundSpec;
  font: "Inter" | "Sora" | "Manrope" | "Outfit";
  params: {
    scale: number;       // 0.5–1.5 (legacy, not used)
    iconScale: number;   // 0.6–1.6 multiplier for icon size in lockups
    textScale: number;   // 0.6–1.6 multiplier for wordmark font size
    letterSpacing: number; // -2–6 px letter-spacing for wordmark
    rotate: number;      // -45–45 (deg)
    stroke: number;      // 0–8 (px)
    cornerRadius: number;// 0–64 (px) for shapes
    padding: number;     // 0–40 (px)
    lockupGap: number;   // 0–48 (px) distance between mark and text
    effect: {
      shadow: boolean;
    };
  };
};

// Gradient presets for backgrounds
export const gradientPresets: BgLinear[] = [
  { type: "linear-gradient", angle: 45, stops: [{ color: "#FF6B6B", at: 0 }, { color: "#4ECDC4", at: 1 }] },
  { type: "linear-gradient", angle: 135, stops: [{ color: "#667eea", at: 0 }, { color: "#764ba2", at: 1 }] },
  { type: "linear-gradient", angle: 45, stops: [{ color: "#f093fb", at: 0 }, { color: "#f5576c", at: 1 }] },
  { type: "linear-gradient", angle: 90, stops: [{ color: "#4facfe", at: 0 }, { color: "#00f2fe", at: 1 }] },
  { type: "linear-gradient", angle: 45, stops: [{ color: "#43e97b", at: 0 }, { color: "#38f9d7", at: 1 }] },
  { type: "linear-gradient", angle: 135, stops: [{ color: "#fa709a", at: 0 }, { color: "#fee140", at: 1 }] },
  { type: "linear-gradient", angle: 90, stops: [{ color: "#a8edea", at: 0 }, { color: "#fed6e3", at: 1 }] },
  { type: "linear-gradient", angle: 45, stops: [{ color: "#000000", at: 0 }, { color: "#434343", at: 1 }] },
];

export const defaultSpecV2: BrandSpecV2 = {
  version: 2,
  name: "",
  initial: "",
  heroStyle: "left-lockup",
  iconId: "",
  colors: {
    primary: "#FFF7ED", // Tailwind orange-50
    background: "#000000",
    text: "#FFF7ED", // Tailwind orange-50
  },
  background: { type: "solid", color: "#000000" },
  font: "Inter",
  params: {
    scale: 0.8,
    iconScale: 1.0,
    textScale: 1.0,
    letterSpacing: 0,
    rotate: 0,
    stroke: 0,
    cornerRadius: 16,
    padding: 16,
    lockupGap: 12,
    effect: {
      shadow: false,
    },
  },
}; 