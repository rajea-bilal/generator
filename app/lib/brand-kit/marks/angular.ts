/**
 * Angular Mark Generator
 * 
 * Creates a modern, angular logo mark with two vertical bars featuring
 * diagonal "cuts" created with polygons. The slant parameter affects
 * cut size, gap controls spacing between bars, and weight determines bar width.
 */

import type { BrandSpecV1 } from '../types';
import { weightToBarWidth, gapToPixels, slantToCutSize } from '../utils';

export function markAngular(spec: BrandSpecV1): string {
  // Calculate dimensions from parameters
  const barWidth = weightToBarWidth(spec.params.weight);
  const gapPx = gapToPixels(spec.params.gap);
  const cutSize = slantToCutSize(spec.params.slant);
  
  // Bar positioning
  const totalWidth = (barWidth * 2) + gapPx;
  const startX = (256 - totalWidth) / 2;
  const bar1X = startX;
  const bar2X = startX + barWidth + gapPx;
  
  const barHeight = 140;
  const barY = (256 - barHeight) / 2;
  
  // Create polygon points for angular cuts
  // Bar 1: Cut from top-right
  const bar1Points = [
    [bar1X, barY],
    [bar1X + barWidth - cutSize, barY],
    [bar1X + barWidth, barY + cutSize],
    [bar1X + barWidth, barY + barHeight],
    [bar1X, barY + barHeight]
  ].map(([x, y]) => `${x},${y}`).join(' ');
  
  // Bar 2: Cut from bottom-left  
  const bar2Points = [
    [bar2X, barY],
    [bar2X + barWidth, barY],
    [bar2X + barWidth, barY + barHeight],
    [bar2X + cutSize, barY + barHeight],
    [bar2X, barY + barHeight - cutSize]
  ].map(([x, y]) => `${x},${y}`).join(' ');
  
  return `<svg width="256" height="256" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
  <polygon 
    points="${bar1Points}" 
    fill="${spec.color}"
  />
  <polygon 
    points="${bar2Points}" 
    fill="${spec.color}" 
    opacity="0.85"
  />
</svg>`;
}