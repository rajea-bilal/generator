import { z } from 'zod';

export interface StyleRecipe {
  grid: number;
  strokeWidth: number;
  linecap: 'round' | 'butt' | 'square';
  linejoin: 'round' | 'miter' | 'bevel';
  style: 'outline' | 'filled';
}

export interface GenerateIconInput {
  prompt: string;
  style: StyleRecipe;
  seedIconId?: string;
}

export interface GenerateIconResult {
  svg: string;
  warnings: string[];
}

// Zod schemas for validation
export const ZStyleRecipe = z.object({
  grid: z.number().positive().default(24),
  strokeWidth: z.number().positive().default(1.5),
  linecap: z.enum(['round', 'butt', 'square']).default('round'),
  linejoin: z.enum(['round', 'miter', 'bevel']).default('round'),
  style: z.enum(['outline', 'filled']).default('outline'),
});

export const ZGenerateIconInput = z.object({
  prompt: z.string().min(1, 'Prompt cannot be empty'),
  style: ZStyleRecipe.default({}),
  seedIconId: z.string().optional(),
});

export const ZGenerateIconResult = z.object({
  svg: z.string(),
  warnings: z.array(z.string()),
});

// Default Lucide-style configuration
export const LUCIDE_DEFAULTS: StyleRecipe = {
  grid: 24,
  strokeWidth: 1.5,
  linecap: 'round',
  linejoin: 'round',
  style: 'outline',
};