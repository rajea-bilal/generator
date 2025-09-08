/**
 * Minimal Mark Generator
 * 
 * Creates a clean, minimal logo mark consisting of one strong rounded bar
 * and a smaller offset bar. Parameters affect bar width (weight), corner 
 * rounding (radius), and vertical spacing between bars (gap).
 */

import type { BrandSpecV1 } from '../types';
import { weightToBarWidth, clampRadius, gapToPixels } from '../utils';

export function markMinimal(spec: BrandSpecV1): string {
  // Calculate dimensions from parameters
  const barWidth = weightToBarWidth(spec.params.weight);
  const radius = clampRadius(spec.params.radius);
  const gapPx = gapToPixels(spec.params.gap);
  
  // Main bar dimensions (larger bar)
  const mainBarHeight = 120;
  const mainBarY = (256 - mainBarHeight) / 2;
  
  // Secondary bar dimensions (smaller offset bar)
  const secondaryBarHeight = 60;
  const secondaryBarWidth = Math.max(barWidth * 0.6, 16);
  const secondaryBarY = mainBarY + mainBarHeight + gapPx;
  const secondaryBarX = barWidth * 0.3; // Offset from main bar
  
  return `<svg width="256" height="256" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
  <rect 
    x="${(256 - barWidth) / 2}" 
    y="${mainBarY}" 
    width="${barWidth}" 
    height="${mainBarHeight}" 
    rx="${radius}" 
    ry="${radius}" 
    fill="${spec.color}"
  />
  <rect 
    x="${(256 - barWidth) / 2 + secondaryBarX}" 
    y="${secondaryBarY}" 
    width="${secondaryBarWidth}" 
    height="${secondaryBarHeight}" 
    rx="${radius}" 
    ry="${radius}" 
    fill="${spec.color}" 
    opacity="0.7"
  />
</svg>`;
}