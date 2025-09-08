/**
 * Soft Mark Generator
 * 
 * Creates a gentle, approachable logo mark similar to minimal style but with
 * enhanced rounding (radius + 8) and vertical offset controlled by gap parameter.
 * Features softer, more organic shapes with increased corner radius.
 */

import type { BrandSpecV1 } from '../types';
import { weightToBarWidth, clampRadius, gapToPixels, clamp } from '../utils';

export function markSoft(spec: BrandSpecV1): string {
  // Calculate dimensions from parameters with enhanced softness
  const barWidth = weightToBarWidth(spec.params.weight);
  const baseRadius = clampRadius(spec.params.radius);
  const softRadius = clamp(baseRadius + 8, 8, 32); // Enhanced rounding for soft feel
  const gapPx = gapToPixels(spec.params.gap);
  
  // Main element dimensions (larger, softer shape)
  const mainHeight = 100;
  const mainY = (256 - mainHeight) / 2 - gapPx * 0.5;
  
  // Secondary element dimensions (smaller companion shape)
  const secondaryHeight = 80;
  const secondaryWidth = Math.max(barWidth * 0.7, 20);
  const secondaryY = mainY + mainHeight + gapPx * 1.5; // Vertical offset from gap
  const secondaryX = -barWidth * 0.2; // Slight leftward offset for organic feel
  
  // Tertiary accent (small soft dot)
  const accentSize = 24;
  const accentX = barWidth * 0.4;
  const accentY = mainY - gapPx - accentSize;
  
  return `<svg width="256" height="256" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
  <!-- Main soft shape -->
  <rect 
    x="${(256 - barWidth) / 2}" 
    y="${mainY}" 
    width="${barWidth}" 
    height="${mainHeight}" 
    rx="${softRadius}" 
    ry="${softRadius}" 
    fill="${spec.color}"
  />
  
  <!-- Secondary soft shape -->
  <rect 
    x="${(256 - barWidth) / 2 + secondaryX}" 
    y="${secondaryY}" 
    width="${secondaryWidth}" 
    height="${secondaryHeight}" 
    rx="${softRadius * 0.8}" 
    ry="${softRadius * 0.8}" 
    fill="${spec.color}" 
    opacity="0.65"
  />
  
  <!-- Accent dot for additional softness -->
  <circle 
    cx="${(256 - barWidth) / 2 + barWidth/2 + accentX}" 
    cy="${accentY + accentSize/2}" 
    r="${accentSize/2}" 
    fill="${spec.color}" 
    opacity="0.4"
  />
</svg>`;
}