/**
 * Brand Kit Generator Page
 * 
 * A one-page logo & brand kit generator with live preview and export functionality.
 * Features two-panel layout: form inputs on left, live SVG previews on right.
 */

import React, { useState, useEffect, useMemo } from 'react';
import { getInitialFromName } from '~/lib/brand-kit';
import { defaultSpecV2, renderSvgsV2, renderFormatsV2, type BrandSpecV2 } from '~/lib/brand-kit';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select';
import { Slider } from '~/components/ui/slider';
import { Card, CardContent } from '~/components/ui/card';
import { Separator } from '~/components/ui/separator';
import { Download, PaintbrushVerticalIcon, Type, Settings, LoaderPinwheel, AudioWaveformIcon } from 'lucide-react';
import { IconPicker } from '~/components/brand/icon-picker';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '~/components/ui/form';

// Debug helper
const dbg = (...args: any[]) => console.debug('[BrandKit]', ...args);
const BrandSchema = z.object({
  name: z.string().min(1, 'Brand name is required').max(40),
  initial: z.string().min(1, 'Initial is required').max(2),
  font: z.enum(['Inter', 'Sora', 'Manrope', 'Outfit']),
  template: z.enum(['mark-only', 'left-lockup', 'stacked', 'badge']), 
  iconId: z.string(),
  colors: z.object({
    primary: z.string().regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/, 'Invalid hex'),
    text: z.string().regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/, 'Invalid hex'),
  }),
});

export function meta() {
  return [
    { title: "Brand Kit Generator - Create Your Logo & Brand Assets" },
    { 
      name: "description", 
      content: "Generate professional logo marks, favicons, app icons, and brand assets. Export complete brand kits with SVG, PNG, and web-ready files." 
    }
  ];
}

export default function BrandKitGenerator() {
  const [spec, setSpec] = useState<BrandSpecV2>(defaultSpecV2);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  
  const form = useForm<z.infer<typeof BrandSchema>>({
    resolver: zodResolver(BrandSchema),
    defaultValues: {
      name: spec.name,
      initial: spec.initial,
      font: spec.font,
      template: spec.template,
      iconId: spec.iconId,
      colors: { primary: spec.colors.primary, text: spec.colors.text },
    },
    mode: 'onChange',
  });

  useEffect(() => {
    const sub = form.watch((values) => {
      if (!values) return;
      setSpec((prev) => ({
        ...prev,
        name: values.name ?? prev.name,
        initial: values.initial ?? prev.initial,
        font: (values.font as BrandSpecV2['font']) ?? prev.font,
        template: (values.template as BrandSpecV2['template']) ?? prev.template,
        iconId: values.iconId ?? prev.iconId,
        colors: {
          ...prev.colors,
          primary: values.colors?.primary ?? prev.colors.primary,
          text: values.colors?.text ?? prev.colors.text,
        },
      }));
    });
    return () => sub.unsubscribe();
  }, [form]);
  
  // Generate SVGs and formats
  const renderResult = useMemo(() => {
    try {
      dbg('Rendering SVG v2 for:', spec.name);
      return renderSvgsV2(spec);
    } catch (error) {
      console.error('Error rendering SVGs:', error);
      return { mark: '', lockup: '' };
    }
  }, [spec]);
  
  const formatsV2 = useMemo(() => {
    try {
      return renderFormatsV2(spec);
    } catch (e) {
      console.error('formats v2 error', e);
      return null;
    }
  }, [spec]);
  
  // Handlers
  const updateSpec = (updates: Partial<BrandSpecV2>) => {
    dbg('updateSpec', updates);
    setSpec(prev => ({ ...prev, ...updates }));
  };
  
  const updateParams = (paramUpdates: Partial<BrandSpecV2['params']>) => {
    dbg('updateParams', paramUpdates);
    setSpec(prev => ({
      ...prev,
      params: { ...prev.params, ...paramUpdates }
    }));
  };
  
  // Handle export
  const handleExport = async () => {
    setIsExporting(true);
    
    try {
      const response = await fetch('/api/export', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          spec,
          targets: ['web', 'ios', 'android', 'og'],
          formats: ['svg', 'png']
        }),
      });
      
      if (!response.ok) {
        throw new Error('Export failed');
      }
      
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${spec.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-brandkit.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
    } catch (error) {
      console.error('Export error:', error);
      alert('Export failed. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <LoaderPinwheel className="w-8 h-8 text-zinc-700" />
            Brand Kit Generator
          </h1>
          <p className="text-muted-foreground mt-2">
            Create professional logo marks and export complete brand asset packages
          </p>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="container mx-auto p-4">
        <div className="grid lg:grid-cols-[1fr_auto_1fr] gap-8 items-start">
          
          {/* Left Panel: Form */}
          <div className="space-y-6 h-[calc(100vh-220px)] overflow-auto pr-2 ">
            <Card className="shadow-none border-none">
              <CardContent className="p-6 space-y-6">
                
                {/* Brand Details */}
                <Form {...form}>
                  <form className="space-y-4" onSubmit={form.handleSubmit(() => {})}>
                  <div className="flex items-center gap-2 mb-10">
                    <AudioWaveformIcon className="w-6 h-6 text-zinc-700" />
                    <h3 className="text-xl font-semibold text-zinc-700">Brand Details</h3>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xl text-zinc-700">Brand Name</FormLabel>
                          <FormControl>
                            <Input className="h-14 text-lg placeholder:text-lg placeholder:text-zinc-300" placeholder="Enter brand name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="initial"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xl text-zinc-700">Initial</FormLabel>
                          <FormControl>
                            <Input className="h-14 text-lg placeholder:text-lg placeholder:text-zinc-300" maxLength={2} placeholder="B" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div>
                    <FormField control={form.control} name="font" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xl text-zinc-700">Font</FormLabel>
                        <Select defaultValue={field.value} onValueChange={(v) => field.onChange(v)}>
                      <SelectTrigger className="h-12 text-lg min-w-[260px]"><SelectValue placeholder="Select font..." /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Inter">Inter</SelectItem>
                        <SelectItem value="Sora">Sora</SelectItem>
                        <SelectItem value="Manrope">Manrope</SelectItem>
                        <SelectItem value="Outfit">Outfit</SelectItem>
                      </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>
                  </form>
                </Form>
                
                <Separator />
                
                {/* Style & Color */}
                <div className="space-y-14">
                  <div className="flex items-center gap-2 mb-10">
                    <PaintbrushVerticalIcon className="w-6 h-6 text-zinc-700" />
                    <h3 className="text-xl font-semibold text-zinc-700">Style & Color</h3>
                  </div>
                  
                  <div className="grid grid-cols-2  ">
                    <div>
                      <FormField control={form.control} name="template" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xl text-zinc-700">Style</FormLabel>
                          <Select defaultValue={field.value} onValueChange={(v) => field.onChange(v)}>
                        <SelectTrigger className="h-12 text-lg min-w-[260px]"><SelectValue placeholder="Layout template" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="mark-only">Mark only</SelectItem>
                          <SelectItem value="left-lockup">Left lockup</SelectItem>
                          <SelectItem value="stacked">Stacked</SelectItem>
                          <SelectItem value="badge">Badge</SelectItem>
                        </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </div>
                    <div className="">
                      <FormLabel className="text-xl text-zinc-700">Icon</FormLabel>
                      <div className="flex items-center gap-2">
                        <IconPicker value={spec.iconId} onChange={(id) => form.setValue('iconId', id)} />
                        <Select defaultValue={spec.iconId.startsWith('shape:') ? spec.iconId : 'shape:rounded-square'} onValueChange={(v) => form.setValue('iconId', v)}>
                          <SelectTrigger className="h-12 text-lg min-w-[260px]"><SelectValue placeholder="Pick shape" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="shape:rounded-square">Rounded Square</SelectItem>
                            <SelectItem value="shape:circle">Circle</SelectItem>
                            <SelectItem value="shape:capsule">Capsule</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-10">
                    <div>
                      <FormLabel className="text-xl text-zinc-700">Icon Color</FormLabel>
                      <div className="flex gap-3 mt-4">
                        <FormField control={form.control} name="colors.primary" render={({ field }) => (
                          <>
                            <Input type="color" className="w-16 h-12 cursor-pointer" value={field.value} onChange={field.onChange} />
                            <Input className="flex-1 cursor-pointer h-12 text-lg placeholder:text-lg placeholder:text-zinc-300" value={field.value} onChange={field.onChange} placeholder="#FFF7ED" />
                          </>
                        )} />
                      </div>
                    </div>
                    <div>
                      <FormLabel className="text-xl text-zinc-700">Text Color</FormLabel>
                      <div className="flex gap-3 mt-4">
                        <FormField control={form.control} name="colors.text" render={({ field }) => (
                          <>
                            <Input type="color" className="w-16 h-12 cursor-pointer" value={field.value} onChange={field.onChange} />
                            <Input className="flex-1 cursor-pointer h-12 text-lg placeholder:text-lg placeholder:text-zinc-300" value={field.value} onChange={field.onChange} placeholder="#FFF7ED" />
                          </>
                        )} />
                      </div>
                    </div>
                  </div>
                  
                  {/* Theme controls removed */}
                </div>
                
                <Separator />
                
                {/* Advanced Parameters */}
                <div className="space-y-4">
                  <Button
                    variant="ghost"
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    className="w-full justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <Settings className="w-4 h-4" />
                      <span>Advanced Parameters</span>
                    </div>
                    <span>{showAdvanced ? '−' : '+'}</span>
                  </Button>
                  
                  {showAdvanced && (
                    <div className="space-y-4 pt-2">
                      {/* Scale locked by renderer */}
                      <div>
                        <Label>Rotate ({spec.params.rotate}°)</Label>
                        <Slider value={[spec.params.rotate]} onValueChange={([v]) => updateParams({ rotate: v })} min={-45} max={45} step={1} className="mt-2" />
                      </div>
                      <div>
                        <Label>Stroke ({spec.params.stroke}px)</Label>
                        <Slider value={[spec.params.stroke]} onValueChange={([v]) => updateParams({ stroke: v })} min={0} max={8} step={1} className="mt-2" />
                      </div>
                      <div>
                        <Label>Corner Radius ({spec.params.cornerRadius}px)</Label>
                        <Slider value={[spec.params.cornerRadius]} onValueChange={([v]) => updateParams({ cornerRadius: v })} min={0} max={64} step={2} className="mt-2" />
                      </div>
                      <div>
                        <Label>Padding ({spec.params.padding}px)</Label>
                        <Slider value={[spec.params.padding]} onValueChange={([v]) => updateParams({ padding: v })} min={0} max={40} step={2} className="mt-2" />
                      </div>
                      {/* Lockup spacing locked by renderer */}
                    </div>
                  )}
                </div>
                
              </CardContent>
            </Card>
          </div>
          
          {/* Middle Separator */}
          <Separator orientation="vertical" className="hidden lg:block h-[calc(100vh-220px)] my-6 mx-auto bg-muted-foreground/20" />

          {/* Right Panel: Preview */}
          <div className="space-y-6 h-[calc(100vh-220px)] overflow-auto pr-2">
            
            {/* Main Preview */}
            <Card className="shadow-none border-none">
              <CardContent className="">
                <div 
                  className="rounded-2xl aspect-square flex items-center justify-center overflow-hidden bg-black"
                >
                  {renderResult.lockup ? (
                    <div
                      key={`${spec.name}|${spec.iconId}|${spec.colors.primary}|${spec.template}`}
                      className="w-full h-full grid place-items-center"
                      style={{ transform: 'scale(0.8)', transformOrigin: 'center' }}
                      dangerouslySetInnerHTML={{ __html: renderResult.lockup }}
                    />
                  ) : (
                    <div className="text-gray-300 text-center">
                      <div className="mb-2">Generating preview...</div>
                      <small className="text-xs opacity-50">
                        Brand: "{spec.name}" | Style: {spec.template} | Font: {spec.font}
                      </small>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            
            {formatsV2 && (
              <Card className="shadow-none border-none">
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4">Formats</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="border rounded-lg p-3"><div className="text-sm mb-2">Lockup</div><div dangerouslySetInnerHTML={{ __html: formatsV2.lockup }} /></div>
                    <div className="border rounded-lg p-3"><div className="text-sm mb-2">Mark Only</div><div dangerouslySetInnerHTML={{ __html: formatsV2.markOnly }} /></div>
                    <div className="border rounded-lg p-3"><div className="text-sm mb-2">Inverse Lockup</div><div dangerouslySetInnerHTML={{ __html: formatsV2.inverseLockup }} /></div>
                    <div className="border rounded-lg p-3"><div className="text-sm mb-2">Inverse Mark</div><div dangerouslySetInnerHTML={{ __html: formatsV2.inverseMarkOnly }} /></div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Export */}
            <Button
              onClick={handleExport}
              disabled={isExporting || !spec.name.trim()}
              size="lg"
              className="w-full"
            >
              <Download className="w-4 h-4 mr-2" />
              {isExporting ? 'Generating Brand Kit...' : 'Download Brand Kit'}
            </Button>
            
          </div>
        </div>
      </div>
    </div>
  );
}