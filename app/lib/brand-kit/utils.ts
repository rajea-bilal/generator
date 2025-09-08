/**
 * Brand Kit Generator - Utility Functions
 * 
 * Math helpers and utility functions for SVG generation
 * and brand specification manipulation.
 */

import type { BrandSpecV1 } from './types';

/**
 * Clamps a number between min and max values
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Converts weight parameter to bar width in pixels
 */
export function weightToBarWidth(weight: number): number {
  return clamp(Math.round(weight * 180), 24, 200);
}

/**
 * Converts gap parameter to pixels
 */
export function gapToPixels(gap: number): number {
  return gap * 40;
}

/**
 * Calculates cut size for angular style based on slant
 */
export function slantToCutSize(slant: number): number {
  return 24 + Math.abs(slant) * 2;
}

/**
 * Clamps radius to safe range
 */
export function clampRadius(radius: number): number {
  return clamp(radius, 0, 24);
}

/**
 * Clamps all numeric parameters in a brand spec to safe ranges
 */
export function clampBrandSpec(spec: BrandSpecV1): BrandSpecV1 {
  return {
    ...spec,
    params: {
      weight: clamp(spec.params.weight, 0.08, 0.20),
      slant: clamp(spec.params.slant, -20, 20),
      radius: clamp(spec.params.radius, 0, 24),
      gap: clamp(spec.params.gap, 0, 0.40)
    }
  };
}

/**
 * Creates a URL-safe slug from a brand name
 */
export function createSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

/**
 * Extracts the first letter from a name and uppercases it
 */
export function getInitialFromName(name: string): string {
  return name.charAt(0).toUpperCase() || 'B';
}

/**
 * Generates deterministic parameter variations for the variant grid
 * Creates 12 tasteful variations of weight, slant, radius, and gap
 */
export function buildVariants(baseSpec: BrandSpecV1, count: number = 12): BrandSpecV1[] {
  const variants: BrandSpecV1[] = [];
  const base = clampBrandSpec(baseSpec);
  
  // Define variation ranges as deltas from base values
  const weightRange = [0.08, 0.10, 0.12, 0.14, 0.16, 0.18, 0.20];
  const slantRange = [-15, -10, -5, 0, 5, 10, 15];
  const radiusRange = [0, 4, 8, 12, 16, 20, 24];
  const gapRange = [0.0, 0.10, 0.15, 0.20, 0.25, 0.30, 0.35, 0.40];
  
  // Create deterministic variations
  for (let i = 0; i < count; i++) {
    const variant: BrandSpecV1 = {
      ...base,
      params: {
        weight: weightRange[i % weightRange.length],
        slant: slantRange[(i + 2) % slantRange.length],
        radius: radiusRange[(i + 4) % radiusRange.length],
        gap: gapRange[(i + 6) % gapRange.length]
      }
    };
    
    variants.push(clampBrandSpec(variant));
  }
  
  return variants;
}