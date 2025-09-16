/**
 * Brand Kit Export API Route
 * 
 * Handles POST requests to generate and stream brand kit zip files.
 * Takes BrandSpecV1 and export options, returns streaming zip response.
 */

import type { ActionFunctionArgs } from 'react-router';
import archiver from 'archiver';
import { z } from 'zod';
import { 
  renderSvgs, 
  type BrandSpecV1, 
  type BrandSpecV2,
  createSlug, 
  clampBrandSpec,
  generateAllAssets
} from '~/lib/brand-kit';
import {
  svgToPng,
  createIco,
  createWebManifest,
  createBrandTokens,
  createTailwindConfig,
  createOgImageSvg,
  createReadme
} from '~/lib/brand-kit/exporter';

const ExportRequestV1Schema = z.object({
  spec: z.object({
    version: z.literal(1),
    name: z.string().min(1).max(100),
    initial: z.string().min(1).max(5),
    style: z.enum(['minimal', 'angular', 'ribbon', 'soft']),
    color: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
    font: z.enum(['Inter', 'Sora', 'Manrope', 'Outfit']),
    theme: z.enum(['light', 'dark']),
    params: z.object({
      weight: z.number().min(0.08).max(0.20),
      slant: z.number().min(-20).max(20),
      radius: z.number().min(0).max(24),
      gap: z.number().min(0).max(0.40)
    })
  }),
  targets: z.array(z.enum(['web', 'ios', 'android', 'og'])).default(['web', 'ios', 'android', 'og']),
  formats: z.array(z.enum(['svg', 'png'])).default(['svg', 'png'])
});

const ExportRequestV2Schema = z.object({
  spec: z.object({
    version: z.literal(2),
    name: z.string().min(1).max(100),
    initial: z.string().min(1).max(5),
    heroStyle: z.enum(['mark-only', 'left-lockup', 'stacked', 'badge']),
    iconId: z.string(),
    colors: z.object({
      primary: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
      background: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
      text: z.string().regex(/^#[0-9A-Fa-f]{6}$/)
    }),
    background: z.object({
      type: z.enum(['solid', 'linear-gradient']),
      color: z.string().optional(),
      angle: z.number().optional(),
      stops: z.array(z.object({
        color: z.string(),
        at: z.number()
      })).optional()
    }),
    font: z.enum(['Inter', 'Sora', 'Manrope', 'Outfit']),
    params: z.object({
      scale: z.number(),
      iconScale: z.number(),
      textScale: z.number(),
      letterSpacing: z.number(),
      rotate: z.number(),
      stroke: z.number(),
      cornerRadius: z.number(),
      padding: z.number(),
      lockupGap: z.number(),
      effect: z.object({
        shadow: z.boolean()
      })
    })
  }),
  targets: z.array(z.enum(['web', 'ios', 'android', 'og'])).default(['web', 'ios', 'android', 'og']),
  formats: z.array(z.enum(['svg', 'png'])).default(['svg', 'png'])
});

const ExportRequestSchema = z.union([ExportRequestV1Schema, ExportRequestV2Schema]);

export async function action({ request }: ActionFunctionArgs) {
  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  try {
    // Parse and validate request
    const body = await request.json();
    const { spec: rawSpec, targets, formats } = ExportRequestSchema.parse(body);
    
    let assets: { icon?: string; wordmark: string; monogram?: string; lockups: { left: string; stacked: string; badge: string; }; mark?: string; lockup?: string; };
    let slug: string;
    let specName: string;
    
    if (rawSpec.version === 1) {
      // V1 handling - legacy system
      const spec: BrandSpecV1 = clampBrandSpec(rawSpec);
      const { mark, lockup } = renderSvgs(spec);
      assets = { mark, lockup, icon: mark, wordmark: lockup, lockups: { left: lockup, stacked: lockup, badge: lockup } };
      slug = createSlug(spec.name);
      specName = spec.name;
    } else {
      // V2 handling - new asset system
      const spec = rawSpec as BrandSpecV2;
      assets = generateAllAssets(spec, 256);
      slug = createSlug(spec.name);
      specName = spec.name;
    }
    
    // Create readable stream for zip
    const archive = archiver('zip', {
      zlib: { level: 9 } // Best compression
    });
    
    // Set response headers for zip download
    const headers = new Headers({
      'Content-Type': 'application/zip',
      'Content-Disposition': `attachment; filename="${slug}-brandkit.zip"`
    });
    
    // Create response stream
    const response = new Response(archive as unknown as ReadableStream, { headers });
    
    // Handle archive errors
    archive.on('error', (err: Error) => {
      console.error('Archive error:', err);
      throw err;
    });
    
    try {
      // /logo/ directory - include all asset variants
      if (formats.includes('svg')) {
        if (assets.icon) {
          archive.append(assets.icon, { name: 'logo/icon.svg' });
        }
        if (assets.monogram) {
          archive.append(assets.monogram, { name: 'logo/monogram.svg' });
        }
        archive.append(assets.wordmark, { name: 'logo/wordmark.svg' });
        archive.append(assets.lockups.left, { name: 'logo/lockup-left.svg' });
        archive.append(assets.lockups.stacked, { name: 'logo/lockup-stacked.svg' });
        archive.append(assets.lockups.badge, { name: 'logo/lockup-badge.svg' });
        
        // Legacy names for compatibility
        if (assets.mark) {
          archive.append(assets.mark, { name: 'logo/logo-mark.svg' });
        }
        if (assets.lockup) {
          archive.append(assets.lockup, { name: 'logo/logo-horizontal.svg' });
        }
      }
      
      if (formats.includes('png')) {
        // Logo PNGs at multiple scales for all asset variants
        if (assets.icon) {
          const iconPng256 = await svgToPng(assets.icon, 256);
          const iconPng512 = await svgToPng(assets.icon, 512);
          archive.append(iconPng256, { name: 'logo/icon-256.png' });
          archive.append(iconPng512, { name: 'logo/icon-512.png' });
        }
        
        if (assets.monogram) {
          const monogramPng256 = await svgToPng(assets.monogram, 256);
          archive.append(monogramPng256, { name: 'logo/monogram-256.png' });
        }
        
        const wordmarkPng1200 = await svgToPng(assets.wordmark, 1200);
        const leftLockupPng1200 = await svgToPng(assets.lockups.left, 1200);
        
        archive.append(wordmarkPng1200, { name: 'logo/wordmark-1200.png' });
        archive.append(leftLockupPng1200, { name: 'logo/lockup-left-1200.png' });
        
        // Legacy compatibility
        if (assets.mark) {
          const markPng256 = await svgToPng(assets.mark, 256);
          const markPng512 = await svgToPng(assets.mark, 512);
          archive.append(markPng256, { name: 'logo/logo-mark-256.png' });
          archive.append(markPng512, { name: 'logo/logo-mark-512.png' });
        }
        if (assets.lockup) {
          const lockupPng1200 = await svgToPng(assets.lockup, 1200);
          archive.append(lockupPng1200, { name: 'logo/logo-horizontal-1200.png' });
        }
      }
      
      // /web/ directory - use icon or monogram for favicons
      if (targets.includes('web')) {
        const faviconAsset = assets.icon || assets.monogram || assets.wordmark;
        const markPng16 = await svgToPng(faviconAsset, 16);
        const markPng32 = await svgToPng(faviconAsset, 32);
        const markPng48 = await svgToPng(faviconAsset, 48);
        const markPng180 = await svgToPng(faviconAsset, 180); // Apple touch icon
        const markPng192 = await svgToPng(faviconAsset, 192);
        const markPng512 = await svgToPng(faviconAsset, 512);
        
        archive.append(markPng16, { name: 'web/favicon-16.png' });
        archive.append(markPng32, { name: 'web/favicon-32.png' });
        archive.append(markPng48, { name: 'web/favicon-48.png' });
        archive.append(markPng180, { name: 'web/apple-touch-icon.png' });
        archive.append(markPng192, { name: 'web/favicon-192.png' });
        archive.append(markPng512, { name: 'web/favicon-512.png' });
        
        // Create multi-size ICO
        const icoBuffer = await createIco(markPng16, markPng32, markPng48);
        archive.append(icoBuffer, { name: 'web/favicon.ico' });
        
        // Web manifest - only for V1 specs for now (V2 would need updated manifest generator)
        if (rawSpec.version === 1) {
          archive.append(createWebManifest(rawSpec), { name: 'web/site.webmanifest' });
        }
      }
      
      // /ios/ directory - use icon or monogram for app icons
      if (targets.includes('ios')) {
        const appIconAsset = assets.icon || assets.monogram || assets.wordmark;
        const iosSizes = [20, 29, 40, 60, 76, 83.5, 1024];
        
        for (const size of iosSizes) {
          const pngBuffer = await svgToPng(appIconAsset, Math.round(size));
          const filename = `ios/icon-${size === 83.5 ? '83_5' : size}.png`;
          archive.append(pngBuffer, { name: filename });
        }
      }
      
      // /android/ directory - use icon or monogram for app icons
      if (targets.includes('android')) {
        const androidIconAsset = assets.icon || assets.monogram || assets.wordmark;
        const androidSizes = [48, 72, 96, 144, 192, 512]; // mdpi to xxxhdpi + maskable
        
        for (const size of androidSizes) {
          const pngBuffer = await svgToPng(androidIconAsset, size);
          const density = size === 48 ? 'mdpi' : 
                         size === 72 ? 'hdpi' :
                         size === 96 ? 'xhdpi' :
                         size === 144 ? 'xxhdpi' :
                         size === 192 ? 'xxxhdpi' :
                         'maskable';
          
          const filename = size === 512 ? 
            'android/maskable-icon-512.png' : 
            `android/icon-${size}-${density}.png`;
            
          archive.append(pngBuffer, { name: filename });
        }
      }
      
      // OG image - use lockup or wordmark for social sharing
      if (targets.includes('og')) {
        const ogAsset = assets.lockups.left || assets.wordmark;
        // Note: createOgImageSvg might need updating for V2 specs
        const ogSvg = rawSpec.version === 1 ? createOgImageSvg(ogAsset, rawSpec) : ogAsset;
        const ogPng = await svgToPng(ogSvg, 1200);
        archive.append(ogPng, { name: 'web/og-image.png' });
      }
      
      // /tokens/ directory - only for V1 specs for now (V2 would need new token generators)
      if (rawSpec.version === 1) {
        archive.append(createBrandTokens(rawSpec), { name: 'tokens/brand.json' });
        archive.append(createTailwindConfig(rawSpec), { name: 'tokens/tailwind.brand.config.snippet.js' });
        
        // /docs/ directory
        archive.append(createReadme(rawSpec), { name: 'docs/README.md' });
      }
      
      // Finalize archive
      await archive.finalize();
      
    } catch (error) {
      console.error('Error generating assets:', error);
      return new Response('Error generating brand kit', { status: 500 });
    }
    
    return response;
    
  } catch (error) {
    console.error('Export API error:', error);
    
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify({ error: 'Invalid request data', details: error.errors }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    return new Response('Internal server error', { status: 500 });
  }
}