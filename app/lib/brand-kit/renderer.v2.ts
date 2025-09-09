import { type BrandSpecV2, type BackgroundSpec } from './types.v2';
import { ALL_ICONS } from './icons/registry';
import { shapeRoundedSquare, shapeCircle, shapeCapsule } from './icons/shapes';
import { fontFamilies } from './types';

function renderBackground(bg: BackgroundSpec, size: number): string {
  if (bg.type === 'solid') {
    return `<rect width="${size}" height="${size}" fill="${bg.color}"/>`;
  }
  const id = `grad_${Math.random().toString(36).slice(2, 8)}`;
  const stops = bg.stops
    .map((s, i) => `<stop offset="${Math.round(s.at * 100)}%" stop-color="${s.color}"/>`)
    .join('');
  return `
  <defs>
    <linearGradient id="${id}" gradientTransform="rotate(${bg.angle})">
      ${stops}
    </linearGradient>
  </defs>
  <rect width="${size}" height="${size}" fill="url(#${id})"/>
  `;
}

function renderIconOrShape(spec: BrandSpecV2, size: number): string {
  const color = spec.colors.primary;
  const stroke = Math.max(0, Math.min(8, spec.params.stroke));
  const scale = 1.0; // avoid root clipping; size will be controlled at layout level
  const rotate = spec.params.rotate;
  const padding = spec.params.padding;

  let inner = '';
  if (!spec.iconId) {
    // No icon selected: render nothing for the icon; background still renders
    inner = '';
  } else if (spec.iconId.startsWith('shape:')) {
    const kind = spec.iconId.split(':')[1];
    if (kind === 'rounded-square') {
      inner = shapeRoundedSquare({ size: size - padding * 2, color, cornerRadius: spec.params.cornerRadius, stroke });
    } else if (kind === 'circle') {
      inner = shapeCircle({ size: size - padding * 2, color, cornerRadius: 0, stroke });
    } else if (kind === 'capsule') {
      inner = shapeCapsule({ size: size - padding * 2, color, cornerRadius: 0, stroke });
    } else {
      inner = shapeRoundedSquare({ size: size - padding * 2, color, cornerRadius: spec.params.cornerRadius, stroke });
    }
  } else {
    const def = ALL_ICONS[spec.iconId];
    if (def) {
      const vb = (def.viewBox || '0 0 24 24').split(' ');
      const vbWidth = Number(vb[2]) || 24;
      const factor = (size - padding * 2) / vbWidth; // default lucide 24x24
      const translate = padding / factor;

      if (def.paths && def.paths.length > 0) {
        const paths = def.paths
          .map(p => {
            const fill = p.fill ? `fill="${p.fill === 'currentColor' ? color : p.fill}"` : `fill="none"`;
            const strokeAttr = p.stroke ? `stroke="${p.stroke === 'currentColor' ? color : p.stroke}"` : '';
            const sw = p.strokeWidth ? `stroke-width="${p.strokeWidth}"` : '';
            return `<path d="${p.d}" ${fill} ${strokeAttr} ${sw} />`;
          })
          .join('');
        inner = `<g transform="scale(${factor}) translate(${translate}, ${translate})">${paths}</g>`;
      } else if (def.raw) {
        // Support raw inner SVG markup from lucide-subset.json
        let rawInner = def.raw;
        rawInner = rawInner.replace(/<svg[^>]*>/i, '').replace(/<\/svg>\s*$/i, '');
        // Render as outline: no fills, use stroke color, and keep stroke width constant when scaling
        inner = `<g transform="scale(${factor}) translate(${translate}, ${translate})" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" vector-effect="non-scaling-stroke">${rawInner}</g>`;
      } else {
        // Unknown icon definition: render nothing rather than forcing a shape
        inner = '';
      }
    } else {
      // Unknown icon id: render nothing
      inner = '';
    }
  }

  const center = size / 2;
  const transform = `translate(${center}, ${center}) scale(${scale}) rotate(${rotate}) translate(${-center}, ${-center})`;
  return `<g transform="${transform}">${inner}</g>`;
}

function estimateTextWidthPx(text: string, fontSizePx: number): number {
  // Roughly estimate text width: average 0.56em per glyph for these sans fonts
  const averageEmWidth = 0.56;
  return text.length * fontSizePx * averageEmWidth;
}

export function renderMarkV2(spec: BrandSpecV2, size: number = 256): string {
  const bg = renderBackground(spec.background, size);
  const icon = renderIconOrShape(spec, size);
  return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">${bg}${icon}</svg>`;
}

export function renderLockupV2(spec: BrandSpecV2, size: number = 256): string {
  const font = fontFamilies[spec.font];
  const text = (spec.name || 'Brand').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  // For left-lockup we render the mark at a larger explicit size to create a bold look without clipping
  const markSize = Math.round(size * 1.18);
  const fontSize = Math.round(markSize / 3.0); // larger text size

  // If there is no icon selected, center the text within a nicely padded canvas
  if (!spec.iconId) {
    const horizontalPadding = 64;
    const verticalPadding = 48;
    const textWidth = estimateTextWidthPx(text, fontSize);
    const width = textWidth + horizontalPadding * 2;
    const height = fontSize + verticalPadding * 2;
    const bgRect = `<rect width="${width}" height="${height}" fill="${spec.background.type === 'solid' ? spec.background.color : spec.colors.background}" />`;
    const textBlock = `<text x="${width / 2}" y="${height / 2}" font-family="${font}" font-size="${fontSize}" font-weight="600" fill="${spec.colors.text}" dominant-baseline="middle" text-anchor="middle">${text}</text>`;
    return `<svg width="100%" height="100%" viewBox="0 0 ${width} ${height}" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">${bgRect}${textBlock}</svg>`;
  }

  if (spec.template === 'mark-only') {
    return renderMarkV2(spec, size);
  }
 
  let width = size * 2;
  let height = size;
  let content = '';

  if (spec.template === 'left-lockup') {
    const gapUser = Math.min(48, Math.max(0, Math.round(spec.params.lockupGap)));
    const gap = 16; // bolder spacing to separate icon and wordmark
    const optical = 8; // moderate optical compensation

    // Layout with asymmetric padding to bias content slightly left in the preview
    const leftPadding = 8;
    const rightPadding = 56;
    const textWidth = estimateTextWidthPx(text, fontSize);
    width = leftPadding + markSize + gap + textWidth + rightPadding;
    height = markSize; // bound to larger mark size

    const mark = renderMarkV2(spec, markSize)
      .replace(`<svg width="${markSize}" height="${markSize}" viewBox="0 0 ${markSize} ${markSize}" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">`, '<g>')
      .replace('</svg>', '</g>');

    const markGroup = `<g transform="translate(${leftPadding}, 0)">${mark}</g>`;
    const textX = leftPadding + markSize + gap - optical;
    const textBlock = `<text x="${textX}" y="${markSize / 2}" font-family="${font}" font-size="${fontSize}" font-weight="600" fill="${spec.colors.text}" dominant-baseline="middle">${text}</text>`;

    const bgRect = `<rect width="${width}" height="${height}" fill="${spec.background.type === 'solid' ? spec.background.color : spec.colors.background}" />`;
    content = `${bgRect}${markGroup}${textBlock}`;
  } else if (spec.template === 'stacked') {
    // Mark centered horizontally, text centered below
    const verticalGap = 64;
    const bottomPadding = 32;
    height = size + verticalGap + fontSize + bottomPadding;
    width = size + 48 + 48; // symmetric horizontal padding

    const mark = renderMarkV2(spec, size)
      .replace(`<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">`, '<g>')
      .replace('</svg>', '</g>');

    const leftPadding = 48;
    const markGroup = `<g transform="translate(${leftPadding}, 0)">${mark}</g>`;
    const textBlock = `<text x="${width / 2}" y="${size + verticalGap}" font-family="${font}" font-size="${fontSize}" font-weight="600" fill="${spec.colors.text}" dominant-baseline="middle" text-anchor="middle">${text}</text>`;
    const bgRect = `<rect width="${width}" height="${height}" fill="${spec.background.type === 'solid' ? spec.background.color : spec.colors.background}" />`;
    content = `${bgRect}${markGroup}${textBlock}`;
  } else if (spec.template === 'badge') {
    // Keep height equal to size; center the badge vertically
    const leftPadding = 24;
    width = size + leftPadding + size; // rough badge width beside mark

    const mark = renderMarkV2(spec, size)
      .replace(`<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">`, '<g>')
      .replace('</svg>', '</g>');

    const markGroup = `<g transform="translate(${leftPadding}, 0)">${mark}</g>`;
    const badgeX = leftPadding + size + 24;
    const badge = `<rect x="${badgeX}" y="${size / 2 - 28}" width="${size}" height="56" rx="28" fill="#F3F4F6" />`;
    const badgeText = `<text x="${badgeX + 28}" y="${size / 2}" font-family="${font}" font-size="24" font-weight="600" fill="#111827" dominant-baseline="middle">${text}</text>`;
    const bgRect = `<rect width="${width}" height="${height}" fill="${spec.background.type === 'solid' ? spec.background.color : spec.colors.background}" />`;
    content = `${bgRect}${markGroup}${badge}${badgeText}`;
  }

  return `<svg width="100%" height="100%" viewBox="0 0 ${width} ${height}" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">${content}</svg>`;
}

export function renderSvgsV2(spec: BrandSpecV2): { mark: string; lockup: string } {
  const mark = renderMarkV2(spec, 256);
  const lockup = renderLockupV2(spec, 256);
  return { mark, lockup };
}

function inverseSpec(spec: BrandSpecV2): BrandSpecV2 {
  return {
    ...spec,
    colors: {
      primary: spec.colors.primary,
      background: spec.colors.text,
      text: spec.colors.background,
    },
    background: { type: 'solid', color: spec.colors.text },
  };
}

export function renderFormatsV2(spec: BrandSpecV2): {
  lockup: string;
  markOnly: string;
  inverseLockup: string;
  inverseMarkOnly: string;
} {
  const baseLockup = renderLockupV2({ ...spec, template: 'left-lockup' }, 256);
  const baseMark = renderMarkV2(spec, 256);
  const inv = inverseSpec(spec);
  const invLock = renderLockupV2({ ...inv, template: 'left-lockup' }, 256);
  const invMark = renderMarkV2(inv, 256);
  return { lockup: baseLockup, markOnly: baseMark, inverseLockup: invLock, inverseMarkOnly: invMark };
} 