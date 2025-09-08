export type ShapeParams = {
  size: number; // square canvas size (e.g. 256)
  color: string;
  cornerRadius: number;
  stroke: number;
};

export function shapeRoundedSquare({ size, color, cornerRadius, stroke }: ShapeParams): string {
  const pad = stroke > 0 ? stroke : 0;
  const rectSize = size - pad * 2;
  const r = Math.min(cornerRadius, size / 2);
  return `<g>
    <rect x="${pad}" y="${pad}" width="${rectSize}" height="${rectSize}" rx="${r}" ry="${r}" fill="${color}" ${stroke > 0 ? `stroke="white" stroke-width="${stroke}"` : ''} />
  </g>`;
}

export function shapeCircle({ size, color, stroke }: ShapeParams): string {
  const pad = stroke > 0 ? stroke : 0;
  const r = size / 2 - pad;
  return `<g>
    <circle cx="${size / 2}" cy="${size / 2}" r="${r}" fill="${color}" ${stroke > 0 ? `stroke="white" stroke-width="${stroke}"` : ''} />
  </g>`;
}

export function shapeCapsule({ size, color, stroke }: ShapeParams): string {
  const pad = stroke > 0 ? stroke : 0;
  const width = size * 0.75;
  const height = size * 0.35;
  const x = (size - width) / 2 + pad;
  const y = (size - height) / 2 + pad;
  const r = height / 2;
  return `<g>
    <rect x="${x}" y="${y}" width="${width - pad * 2}" height="${height - pad * 2}" rx="${r}" ry="${r}" fill="${color}" ${stroke > 0 ? `stroke="white" stroke-width="${stroke}"` : ''} />
  </g>`;
} 