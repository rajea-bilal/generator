/**
 * Brand Kit Renderer
 * 
 * Main rendering system that combines mark generators with text lockups
 * to create complete brand assets. Handles mark selection and composition.
 */

import type { BrandSpecV1, RenderResult } from './types';
import { fontFamilies, themeColors } from './types';
import { markMinimal } from './marks/minimal';
import { markAngular } from './marks/angular';
import { markRibbon } from './marks/ribbon';
import { markSoft } from './marks/soft';

/**
 * Selects the appropriate mark generator based on style
 */
function getMarkRenderer(style: BrandSpecV1['style']) {
  switch (style) {
    case 'minimal':
      return markMinimal;
    case 'angular':
      return markAngular;
    case 'ribbon':
      return markRibbon;
    case 'soft':
      return markSoft;
    default:
      return markMinimal;
  }
}

/**
 * Creates a horizontal lockup combining mark and text
 * Converts mark SVG to nested group and positions with text
 */
export function lockupHorizontal(markSvg: string, spec: BrandSpecV1): string {
  // Convert mark outer <svg> to nested <g> by string replacement
  const markGroup = markSvg
    .replace('<svg width="256" height="256" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">', '<g>')
    .replace('</svg>', '</g>');
  
  // Get theme colors
  const colors = themeColors[spec.theme];
  const fontFamily = fontFamilies[spec.font];
  
  // Text positioning and sizing
  const textX = 320;
  const textY = 160;
  const fontSize = 48;
  
  console.debug('[BrandKit][renderer] lockup', { name: spec.name, font: spec.font, theme: spec.theme, textX, textY, fontFamily });
  
  return `<svg width="1024" height="256" viewBox="0 0 1024 256" xmlns="http://www.w3.org/2000/svg">
  <!-- Mark positioned on left -->
  <g transform="translate(24, 0)">
    ${markGroup}
  </g>
  
  <!-- Brand name text -->
  <text 
    x="${textX}" 
    y="${textY}" 
    font-family="${fontFamily}" 
    font-size="${fontSize}" 
    font-weight="600" 
    fill="${colors.text}" 
    dominant-baseline="middle"
  >
    ${(spec.name || 'Brand Name').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}
  </text>
</svg>`;
}

/**
 * Main rendering function - generates both mark and lockup SVGs
 */
export function renderSvgs(spec: BrandSpecV1): RenderResult {
  // Get the appropriate mark renderer and generate mark
  const markRenderer = getMarkRenderer(spec.style);
  console.debug('[BrandKit][renderer] style', spec.style);
  const mark = markRenderer(spec);
  
  // Create horizontal lockup
  const lockup = lockupHorizontal(mark, spec);
  
  return {
    mark,
    lockup
  };
}