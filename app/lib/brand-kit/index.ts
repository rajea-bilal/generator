/**
 * Brand Kit Generator - Main Module
 * 
 * Exports all public functions and types for the brand kit generation system.
 * This is the main entry point for consuming the brand kit functionality.
 */

// Core types and constants
export type { BrandSpecV1, ExportTarget, ExportFormat, ExportRequest, RenderResult } from './types';
export { defaultSpec, colorSwatches, fontFamilies, themeColors } from './types';

// Utility functions
export { 
  clamp,
  weightToBarWidth,
  gapToPixels,
  slantToCutSize,
  clampRadius,
  clampBrandSpec,
  createSlug,
  getInitialFromName,
  buildVariants
} from './utils';

// Main rendering functions  
export { renderSvgs, lockupHorizontal } from './renderer';

// Individual mark generators (for testing/advanced use)
export { markMinimal } from './marks/minimal';
export { markAngular } from './marks/angular';
export { markRibbon } from './marks/ribbon';
export { markSoft } from './marks/soft';

// V2 API (icon/shape-first)
export type { BrandSpecV2, BackgroundSpec, TemplateV2 } from './types.v2';
export { defaultSpecV2 } from './types.v2';
export { renderSvgsV2, renderMarkV2, renderLockupV2, renderFormatsV2 } from './renderer.v2';