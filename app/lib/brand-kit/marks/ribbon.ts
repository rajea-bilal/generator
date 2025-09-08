/**
 * Ribbon Mark Generator
 * 
 * Creates an elegant ribbon-style logo mark with two tilted rounded rectangles
 * that resemble ribbon strips. The slant parameter rotates the entire group,
 * gap shifts the second strip, and radius controls corner rounding.
 */

import type { BrandSpecV1 } from '../types';
import { weightToBarWidth, clampRadius, gapToPixels, clamp } from '../utils';

export function markRibbon(spec: BrandSpecV1): string {
  // Calculate dimensions from parameters
  const barWidth = weightToBarWidth(spec.params.weight);
  const radius = clampRadius(spec.params.radius);
  const gapPx = gapToPixels(spec.params.gap);
  const slant = clamp(spec.params.slant, -20, 20);
  
  // Ribbon strip dimensions
  const stripHeight = 40;
  const stripLength = barWidth + 20;
  
  // Positioning for centered composition
  const centerX = 128;
  const centerY = 128;
  
  // First ribbon strip
  const strip1Y = centerY - stripHeight/2 - gapPx/2;
  
  // Second ribbon strip (offset by gap)
  const strip2Y = centerY + stripHeight/2 + gapPx/2;
  const strip2X = gapPx; // Horizontal shift based on gap
  
  return `<svg width="256" height="256" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
  <g transform="rotate(${slant} ${centerX} ${centerY})">
    <!-- First ribbon strip -->
    <rect 
      x="${centerX - stripLength/2}" 
      y="${strip1Y}" 
      width="${stripLength}" 
      height="${stripHeight}" 
      rx="${radius}" 
      ry="${radius}" 
      fill="${spec.color}"
    />
    <!-- Second ribbon strip (offset) -->
    <rect 
      x="${centerX - stripLength/2 + strip2X}" 
      y="${strip2Y}" 
      width="${stripLength * 0.8}" 
      height="${stripHeight}" 
      rx="${radius}" 
      ry="${radius}" 
      fill="${spec.color}" 
      opacity="0.75"
    />
  </g>
</svg>`;
}