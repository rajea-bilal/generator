export type ShapeParams = {
  size: number; // square canvas size (e.g. 256)
  color: string;
  cornerRadius: number;
};

export function shapeRoundedSquare({ size, color, cornerRadius }: ShapeParams): string {
  const r = Math.min(cornerRadius, size / 2);
  return `<g>
    <rect x="0" y="0" width="${size}" height="${size}" rx="${r}" ry="${r}" fill="${color}" />
  </g>`;
}

export function shapeCircle({ size, color }: ShapeParams): string {
  const r = size / 2;
  return `<g>
    <circle cx="${size / 2}" cy="${size / 2}" r="${r}" fill="${color}" />
  </g>`;
}

export function shapeCapsule({ size, color }: ShapeParams): string {
  const width = size * 0.75;
  const height = size * 0.35;
  const x = (size - width) / 2;
  const y = (size - height) / 2;
  const r = height / 2;
  return `<g>
    <rect x="${x}" y="${y}" width="${width}" height="${height}" rx="${r}" ry="${r}" fill="${color}" />
  </g>`;
} 