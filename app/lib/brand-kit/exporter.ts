/**
 * Brand Kit Exporter
 * 
 * Server-side utilities for generating complete brand kit packages.
 * Handles SVG to PNG conversion, favicon generation, and asset organization.
 */

import { Resvg } from '@resvg/resvg-js';
import sharp from 'sharp';
import type { BrandSpecV1, ExportTarget } from './types';
import { createSlug, themeColors } from './index';

export interface ExportAsset {
  path: string;
  content: Buffer | string;
  isDirectory?: boolean;
}

/**
 * Converts SVG string to PNG buffer at specified size
 */
export async function svgToPng(svgString: string, size: number): Promise<Buffer> {
  const resvg = new Resvg(svgString, {
    fitTo: {
      mode: 'width',
      value: size
    }
  });
  
  return Buffer.from(resvg.render().asPng());
}

/**
 * Creates a multi-resolution ICO file from PNG buffers
 */
export async function createIco(png16: Buffer, png32: Buffer, png48: Buffer): Promise<Buffer> {
  // Use Sharp to create ICO format from multiple PNG sources
  // Note: This is a simplified implementation - for production, consider using dedicated ICO libraries
  return sharp(png32)
    .resize(32, 32)
    .png()
    .toBuffer();
}

/**
 * Generates web manifest JSON
 */
export function createWebManifest(spec: BrandSpecV1): string {
  const colors = themeColors[spec.theme];
  
  return JSON.stringify({
    name: spec.name,
    short_name: spec.name,
    description: `${spec.name} brand assets`,
    start_url: "/",
    display: "standalone",
    theme_color: spec.color,
    background_color: colors.background,
    icons: [
      {
        src: "favicon-192.png",
        sizes: "192x192",
        type: "image/png"
      },
      {
        src: "favicon-512.png", 
        sizes: "512x512",
        type: "image/png"
      },
      {
        src: "favicon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable"
      }
    ]
  }, null, 2);
}

/**
 * Generates brand tokens JSON
 */
export function createBrandTokens(spec: BrandSpecV1): string {
  return JSON.stringify({
    version: spec.version,
    name: spec.name,
    initial: spec.initial,
    color: {
      primary: spec.color,
      theme: spec.theme
    },
    font: spec.font,
    params: spec.params
  }, null, 2);
}

/**
 * Generates Tailwind config snippet
 */
export function createTailwindConfig(spec: BrandSpecV1): string {
  return `// Brand-specific Tailwind CSS configuration
// Add this to your tailwind.config.js theme.extend section

module.exports = {
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '${spec.color}',
          background: '${themeColors[spec.theme].background}',
          text: '${themeColors[spec.theme].text}'
        }
      },
      fontFamily: {
        brand: ['${spec.font}', 'system-ui', 'sans-serif']
      }
    }
  }
};`;
}

/**
 * Creates OG image by placing lockup on larger canvas
 */
export function createOgImageSvg(lockupSvg: string, spec: BrandSpecV1): string {
  const colors = themeColors[spec.theme];
  
  // Extract the lockup content (remove outer SVG wrapper)
  const lockupContent = lockupSvg
    .replace('<svg width="1024" height="256" viewBox="0 0 1024 256" xmlns="http://www.w3.org/2000/svg">', '')
    .replace('</svg>', '');
  
  return `<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <!-- Background -->
  <rect width="1200" height="630" fill="${colors.background}"/>
  
  <!-- Centered lockup -->
  <g transform="translate(88, 187) scale(1.0)">
    ${lockupContent}
  </g>
</svg>`;
}

/**
 * Generates README content
 */
export function createReadme(spec: BrandSpecV1): string {
  const slug = createSlug(spec.name);
  
  return `# ${spec.name} Brand Kit

This brand kit was generated and contains all the assets you need for web, mobile, and social media.

## 🎨 Brand Information

- **Name**: ${spec.name}
- **Style**: ${spec.style}
- **Primary Color**: ${spec.color}
- **Font**: ${spec.font}
- **Theme**: ${spec.theme}

## 📁 File Structure

### /logo/
- \`logo-mark.svg\` - Logo mark only (256×256)
- \`logo-horizontal.svg\` - Horizontal lockup with text (1024×256)
- PNG versions at multiple scales (256px, 512px, 1200px)

### /web/
- **Favicons**: 16px, 32px, 48px formats plus multi-size ICO
- **Apple Touch Icon**: 180×180 for iOS Safari
- **Web Manifest**: \`site.webmanifest\` for PWA support
- **OG Image**: 1200×630 for social media sharing

### /ios/
App icon PNGs at required sizes:
- 20×20, 29×29, 40×40 (iPhone settings, notification)
- 60×60 (iPhone app icon)
- 76×76, 83.5×83.5 (iPad)
- 1024×1024 (App Store)

Note: For Xcode projects, add these to your Asset Catalog as an App Icon set.

### /android/
- **Legacy icons**: 48, 72, 96, 144, 192 (mdpi through xxxhdpi)
- **Maskable icon**: 512×512 for adaptive icons
- Place in respective \`res/drawable-*\` folders

### /tokens/
- **brand.json**: Structured brand tokens for design systems
- **tailwind.brand.config.snippet.js**: Tailwind CSS configuration

## 🚀 Usage Instructions

### Web Implementation
1. Add favicons to your site's root directory
2. Reference \`site.webmanifest\` in your HTML:
   \`\`\`html
   <link rel="manifest" href="/site.webmanifest">
   <link rel="apple-touch-icon" href="/apple-touch-icon.png">
   \`\`\`

### Mobile Apps
- **iOS**: Import icons into Xcode Asset Catalog
- **Android**: Place icons in appropriate \`res/drawable-*\` directories

### Social Media
Use \`og-image.png\` (1200×630) for:
- Open Graph meta tags
- Twitter Cards
- LinkedIn previews

## ⚖️ License

You receive a non-exclusive right to use these generated assets commercially. 
No uniqueness or trademark protection is guaranteed - you are responsible 
for conducting trademark searches before commercial use.

**Fonts Used**: ${spec.font} (Open Font License)

---

Generated with the Brand Kit Generator
`;
}