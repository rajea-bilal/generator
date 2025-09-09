import React, { useState } from 'react';
// Try to import Convex at runtime; stub if unavailable
let useAction: any = () => async () => ({ svg: '<svg/>', warnings: [] });
let api: any = {};
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  useAction = require('convex/react').useAction;
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  api = require('~/convex/_generated/api').api;
} catch {}
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { Card, CardContent } from '~/components/ui/card';
import { Loader2, Sparkles } from 'lucide-react';
import { Switch } from '~/components/ui/switch';
import { ZStyleRecipe } from '~/lib/icon/types';

interface AIPanelProps {
  selectedIconId: string | null;
  onSvg: (svg: string) => void;
}

export function AIPanel({ selectedIconId, onSvg }: AIPanelProps) {
  const [prompt, setPrompt] = useState('');
  const [matchStyle, setMatchStyle] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateIcon = api?.icons?.generateIcon ? useAction(api.icons.generateIcon) : async () => ({ svg: '<svg/>', warnings: [] });

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    setError(null);

    try {
      // Get default Lucide style
      const style = ZStyleRecipe.parse({});
      
      // Prepare seedIconId - remove 'lucide:' prefix if present
      const seedIconId = (matchStyle && selectedIconId) 
        ? selectedIconId.startsWith('lucide:') 
          ? selectedIconId.substring(7) 
          : selectedIconId
        : undefined;

      const result = await generateIcon({
        input: {
          prompt: prompt.trim(),
          style,
          seedIconId,
        }
      });

      onSvg(result.svg);
      
      // Show warnings if any
      if (result.warnings.length > 0) {
        console.warn('SVG generation warnings:', result.warnings);
      }

    } catch (err) {
      console.error('AI icon generation failed:', err);
      setError(err instanceof Error ? err.message : 'Generation failed');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isGenerating && prompt.trim()) {
      handleGenerate();
    }
  };

  return (
    <Card className="shadow-none border-none">
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-4 h-4 text-blue-600" />
          <h3 className="font-semibold text-zinc-700">AI Icon Generator</h3>
        </div>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="prompt">Describe your icon</Label>
            <Input
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="e.g., shopping bag, rocket ship, coffee cup"
              className="mt-2"
              disabled={isGenerating}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Switch
                id="match-style"
                checked={matchStyle}
                onCheckedChange={setMatchStyle}
                disabled={isGenerating || !selectedIconId}
              />
              <Label htmlFor="match-style" className="text-sm">
                Match selected icon's style
              </Label>
            </div>
          </div>

          {error && (
            <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
              {error}
            </div>
          )}

          <Button
            onClick={handleGenerate}
            disabled={isGenerating || !prompt.trim()}
            className="w-full"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Generate Icon
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}