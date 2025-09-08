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
  createSlug, 
  clampBrandSpec 
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

const ExportRequestSchema = z.object({
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

export async function action({ request }: ActionFunctionArgs) {
  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  try {
    // Parse and validate request
    const body = await request.json();
    const { spec: rawSpec, targets, formats } = ExportRequestSchema.parse(body);
    
    // Clamp spec parameters to safe ranges
    const spec: BrandSpecV1 = clampBrandSpec(rawSpec);
    const slug = createSlug(spec.name);
    
    // Generate SVGs
    const { mark, lockup } = renderSvgs(spec);
    
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
      // /logo/ directory
      if (formats.includes('svg')) {
        archive.append(mark, { name: 'logo/logo-mark.svg' });
        archive.append(lockup, { name: 'logo/logo-horizontal.svg' });
      }
      
      if (formats.includes('png')) {
        // Logo PNGs at multiple scales
        const markPng256 = await svgToPng(mark, 256);
        const markPng512 = await svgToPng(mark, 512);
        const lockupPng1200 = await svgToPng(lockup, 1200);
        
        archive.append(markPng256, { name: 'logo/logo-mark-256.png' });
        archive.append(markPng512, { name: 'logo/logo-mark-512.png' });
        archive.append(lockupPng1200, { name: 'logo/logo-horizontal-1200.png' });
      }
      
      // /web/ directory
      if (targets.includes('web')) {
        const markPng16 = await svgToPng(mark, 16);
        const markPng32 = await svgToPng(mark, 32);
        const markPng48 = await svgToPng(mark, 48);
        const markPng180 = await svgToPng(mark, 180); // Apple touch icon
        const markPng192 = await svgToPng(mark, 192);
        const markPng512 = await svgToPng(mark, 512);
        
        archive.append(markPng16, { name: 'web/favicon-16.png' });
        archive.append(markPng32, { name: 'web/favicon-32.png' });
        archive.append(markPng48, { name: 'web/favicon-48.png' });
        archive.append(markPng180, { name: 'web/apple-touch-icon.png' });
        archive.append(markPng192, { name: 'web/favicon-192.png' });
        archive.append(markPng512, { name: 'web/favicon-512.png' });
        
        // Create multi-size ICO
        const icoBuffer = await createIco(markPng16, markPng32, markPng48);
        archive.append(icoBuffer, { name: 'web/favicon.ico' });
        
        // Web manifest
        archive.append(createWebManifest(spec), { name: 'web/site.webmanifest' });
      }
      
      // /ios/ directory  
      if (targets.includes('ios')) {
        const iosSizes = [20, 29, 40, 60, 76, 83.5, 1024];
        
        for (const size of iosSizes) {
          const pngBuffer = await svgToPng(mark, Math.round(size));
          const filename = `ios/icon-${size === 83.5 ? '83_5' : size}.png`;
          archive.append(pngBuffer, { name: filename });
        }
      }
      
      // /android/ directory
      if (targets.includes('android')) {
        const androidSizes = [48, 72, 96, 144, 192, 512]; // mdpi to xxxhdpi + maskable
        
        for (const size of androidSizes) {
          const pngBuffer = await svgToPng(mark, size);
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
      
      // OG image
      if (targets.includes('og')) {
        const ogSvg = createOgImageSvg(lockup, spec);
        const ogPng = await svgToPng(ogSvg, 1200);
        archive.append(ogPng, { name: 'web/og-image.png' });
      }
      
      // /tokens/ directory
      archive.append(createBrandTokens(spec), { name: 'tokens/brand.json' });
      archive.append(createTailwindConfig(spec), { name: 'tokens/tailwind.brand.config.snippet.js' });
      
      // /docs/ directory
      archive.append(createReadme(spec), { name: 'docs/README.md' });
      
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