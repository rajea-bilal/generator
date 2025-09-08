import type { StyleRecipe } from '../../lib/icon/types';

export interface IconLLM {
  generateSVG(args: { 
    prompt: string; 
    style: StyleRecipe; 
    seedSVG?: string; 
  }): Promise<string>;
}

interface OpenAIMessage {
  role: 'system' | 'user';
  content: string;
}

interface OpenAIResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

class OpenAIProvider implements IconLLM {
  constructor(
    private baseUrl: string,
    private model: string,
    private apiKey: string
  ) {}

  async generateSVG({ prompt, style, seedSVG }: { 
    prompt: string; 
    style: StyleRecipe; 
    seedSVG?: string; 
  }): Promise<string> {
    const systemPrompt = this.buildSystemPrompt();
    const userPrompt = this.buildUserPrompt(prompt, style, seedSVG);

    const messages: OpenAIMessage[] = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ];

    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: this.model,
        messages,
        temperature: 0.1,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
    }

    const data: OpenAIResponse = await response.json();
    const content = data.choices[0]?.message?.content;
    
    if (!content) {
      throw new Error('No response from OpenAI');
    }

    return this.cleanResponse(content);
  }

  private buildSystemPrompt(): string {
    return `You are an icon generator. Output ONE valid <svg> only, no backticks, no text. Root <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">. Only <path> or <g>. No <script>, <image>, <foreignObject>, filters, masks, external URLs, or CSS with url(). Keep outline style unless told otherwise. Concise path data.`;
  }

  private buildUserPrompt(prompt: string, style: StyleRecipe, seedSVG?: string): string {
    let userPrompt = `Create an icon for: ${prompt}\n\n`;
    
    userPrompt += `Style requirements:\n`;
    userPrompt += `- Grid: ${style.grid}×${style.grid}\n`;
    userPrompt += `- Stroke width: ${style.strokeWidth}\n`;
    userPrompt += `- Line caps: ${style.linecap}\n`;
    userPrompt += `- Line joins: ${style.linejoin}\n`;
    userPrompt += `- Style: ${style.style}\n`;

    if (seedSVG) {
      userPrompt += `\nMatch this icon's visual style and proportions:\n${seedSVG}`;
    }

    return userPrompt;
  }

  private cleanResponse(content: string): string {
    // Remove code fences if present
    let cleaned = content.trim();
    
    // Remove ```svg and ``` if present
    cleaned = cleaned.replace(/^```(?:svg)?\s*\n?/, '');
    cleaned = cleaned.replace(/\n?\s*```\s*$/, '');
    
    // Remove any remaining backticks
    cleaned = cleaned.replace(/`/g, '');
    
    return cleaned.trim();
  }
}

export function getProviderFromEnv(): IconLLM {
  const provider = process.env.LLM_PROVIDER;
  const baseUrl = process.env.LLM_BASE_URL;
  const model = process.env.LLM_MODEL;
  const apiKey = process.env.LLM_API_KEY;

  if (!provider || !baseUrl || !model || !apiKey) {
    throw new Error('Missing LLM environment variables: LLM_PROVIDER, LLM_BASE_URL, LLM_MODEL, LLM_API_KEY');
  }

  if (provider !== 'openai') {
    throw new Error(`Unsupported LLM provider: ${provider}`);
  }

  return new OpenAIProvider(baseUrl, model, apiKey);
}