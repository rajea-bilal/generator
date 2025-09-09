/**
 * Brand Kit Generator - Spec V2 (icon/shape-first)
 */

export type BgSolid = { type: "solid"; color: string };
export type BgLinear = { type: "linear-gradient"; angle: number; stops: { color: string; at: number }[] };
export type BackgroundSpec = BgSolid | BgLinear;

export type TemplateV2 = "mark-only" | "left-lockup" | "stacked" | "badge";

export type BrandSpecV2 = {
  version: 2;
  name: string;
  initial: string;
  template: TemplateV2;
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

export const defaultSpecV2: BrandSpecV2 = {
  version: 2,
  name: "",
  initial: "",
  template: "left-lockup",
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