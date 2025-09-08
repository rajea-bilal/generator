/**
 * Brand Kit Generator - Core Type Definitions
 * 
 * Defines the stable, versioned specification for brand generation
 * and all related types for the logo & brand kit system.
 */

export type BrandSpecV1 = {
  version: 1;
  name: string;
  initial: string;
  style: "minimal" | "angular" | "ribbon" | "soft";
  color: string; // hex e.g. "#6C5CE7"
  font: "Inter" | "Sora" | "Manrope" | "Outfit";
  theme: "light" | "dark";
  params: {
    weight: number; // 0.08–0.20
    slant: number;  // -20–20 (degrees)
    radius: number; // 0–24 (px)
    gap: number;    // 0–0.40 (relative)
  };
};

export type ExportTarget = "web" | "ios" | "android" | "og";
export type ExportFormat = "svg" | "png";

export interface ExportRequest {
  spec: BrandSpecV1;
  targets: ExportTarget[];
  formats: ExportFormat[];
}

export interface RenderResult {
  mark: string;
  lockup: string;
}

/**
 * Predefined color swatches for quick selection
 */
export const colorSwatches = [
  "#6C5CE7",
  "#22C55E", 
  "#06B6D4",
  "#F43F5E",
  "#0EA5E9",
  "#111827"
] as const;

/**
 * Default brand specification with tasteful defaults
 */
export const defaultSpec: BrandSpecV1 = {
  version: 1,
  name: "",
  initial: "",
  style: "minimal",
  color: "#6C5CE7",
  font: "Inter",
  theme: "light",
  params: {
    weight: 0.12,
    slant: 0,
    radius: 8,
    gap: 0.20
  }
};

/**
 * Font family mappings for proper CSS font-family declarations
 */
export const fontFamilies = {
  Inter: "Inter, system-ui, sans-serif",
  Sora: "Sora, system-ui, sans-serif", 
  Manrope: "Manrope, system-ui, sans-serif",
  Outfit: "Outfit, system-ui, sans-serif"
} as const;

/**
 * Theme color mappings
 */
export const themeColors = {
  light: {
    background: "#FFFFFF",
    text: "#111827"
  },
  dark: {
    background: "#0B0F1A", 
    text: "#FFFFFF"
  }
} as const;