/**
 * Brand Kit Generator Page
 * 
 * A one-page logo & brand kit generator with live preview and export functionality.
 * Features two-panel layout: form inputs on left, live SVG previews on right.
 */

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { getInitialFromName } from '../lib/brand-kit';
import { defaultSpecV2, renderSvgsV2, renderFormatsV2, renderMarkV2, renderLockupV2, type BrandSpecV2 } from '../lib/brand-kit';
import { AppIconMockup } from "../components/mockups/app-icon";
import { BrowserMockup } from "../components/mockups/browser-mockup";
import { IPhoneMockup } from "../components/mockups/iphone-mockup";
import { NativeIOSMockup } from "../components/mockups/native-ios-mockup";
import { WebsiteMockup } from "../components/mockups/website-mockup";
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select';
import { Slider } from '../components/ui/slider';
import { Card, CardContent } from '~/components/ui/card';
import { Separator } from '~/components/ui/separator';
import { Download, PaintbrushVerticalIcon, Type, Settings, LoaderPinwheel, AudioWaveformIcon, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { IconPicker } from '../components/brand/icon-picker';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '../components/ui/form';

// Debug helper
const dbg = (...args: any[]) => console.debug('[BrandKit]', ...args);
const BrandSchema = z.object({
  name: z.string().min(1, 'Brand name is required').max(40),
  font: z.enum(['Inter', 'Sora', 'Manrope', 'Outfit']),
  template: z.enum(['mark-only', 'left-lockup', 'stacked', 'badge']), 
  iconId: z.string(),
  colors: z.object({
    primary: z.string().regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/, 'Invalid hex'),
    text: z.string().regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/, 'Invalid hex'),
    background: z.string().regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/, 'Invalid hex'),
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
  const advancedRef = useRef<HTMLDivElement>(null!);
  const [spec, setSpec] = useState<BrandSpecV2>(defaultSpecV2);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [view, setView] = useState<"hero" | "header" | "app" | "card" | "social" | "browser" | "phone" | "ios" | "website">("hero");
  
  // Hydrate defaults from query string (Fast Start wizard)
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const next = { ...defaultSpecV2 };
      const name = params.get('name') || '';
      const template = params.get('template') as BrandSpecV2['template'] | null;
      const font = params.get('font') as BrandSpecV2['font'] | null;
      const iconId = params.get('iconId');
      const primary = params.get('primary');
      const text = params.get('text');
      const background = params.get('background');

      if (name) next.name = name;
      if (name) next.initial = getInitialFromName(name);
      if (template) next.template = template;
      if (font) next.font = font;
      if (iconId) next.iconId = iconId;
      if (primary) next.colors.primary = primary;
      if (text) next.colors.text = text;
      if (background) {
        next.colors.background = background;
        (next as any).background = { type: 'solid', color: background };
      }

      // Only update if at least one param provided
      if (name || template || font || iconId || primary || text || background) {
        setSpec(next);
      }
    } catch {}
  }, []);
  
  const form = useForm<z.infer<typeof BrandSchema>>({
    resolver: zodResolver(BrandSchema),
    defaultValues: {
      name: spec.name,
      font: spec.font,
      template: spec.template,
      iconId: spec.iconId,
      colors: { primary: spec.colors.primary, text: spec.colors.text, background: spec.colors.background },
    },
    mode: 'onChange',
  });

  useEffect(() => {
    const sub = form.watch((values) => {
      if (!values) return;
      setSpec((prev) => ({
        ...prev,
        name: values.name ?? prev.name,
        // Derive initial from brand name (first character or sensible default)
        initial: getInitialFromName(values.name ?? prev.name),
        font: (values.font as BrandSpecV2['font']) ?? prev.font,
        template: (values.template as BrandSpecV2['template']) ?? prev.template,
        iconId: values.iconId ?? prev.iconId,
        colors: {
          ...prev.colors,
          primary: values.colors?.primary ?? prev.colors.primary,
          text: values.colors?.text ?? prev.colors.text,
          background: values.colors?.background ?? prev.colors.background,
        },
        // Keep renderer background in sync with the chosen background color
        background: values.colors?.background
          ? ({ type: 'solid', color: values.colors.background } as const)
          : prev.background,
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
                  <form className="space-y-10" onSubmit={form.handleSubmit(() => {})}>
                  <div className="flex items-center gap-2 mb-10">
                    <AudioWaveformIcon className="w-6 h-6 text-zinc-700" />
                    <h3 className="text-xl font-semibold text-zinc-700">Brand Details</h3>
                  </div>
                  
                  <div className="flex flex-col gap-10">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="uppercase tracking-[0.2em] text-xs font-semibold mb-2">Brand Name</FormLabel>
                          <FormControl>
                            <div className="flex items-center gap-3">
                              <Input className="h-12 text-lg placeholder:text-lg placeholder:text-zinc-300" placeholder="Enter brand name" {...field} />
                              {field.value && (
                                <Button 
                                  type="button" 
                                  variant="secondary" 
                                  size="sm"
                                  onClick={() => field.onChange('')}
                                  className="whitespace-nowrap"
                                >
                                  Clear Text
                                </Button>
                              )}
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div>
                    <FormField control={form.control} name="font" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="uppercase tracking-[0.2em] text-xs font-semibold mb-2">Font</FormLabel>
                        <FormControl>
                          <div className="flex flex-wrap gap-2">
                            {(["Inter", "Sora", "Manrope", "Outfit"] as const).map((f) => {
                              const selected = field.value === f;
                              return (
                                <button
                                  type="button"
                                  key={f}
                                  onClick={() => field.onChange(f)}
                                  className={`rounded-full px-4 py-2 uppercase tracking-[0.2em] text-xs font-semibold border transition-colors outline-none focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 ${selected ? "bg-black text-white border-transparent" : "bg-card text-foreground border-neutral-300 hover:bg-neutral-100"}`}
                                >
                                  {f}
                                </button>
                              );
                            })}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>
                  </form>
                </Form>
                
                {/* Style & Color – Conditional icon controls: show "Add icon" when none; expose modify/remove under Advanced */}
                <div className="space-y-10">
                  <div>
                    <FormField control={form.control} name="template" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="uppercase tracking-[0.2em] text-xs font-semibold mb-2">Style</FormLabel>
                        <FormControl>
                          <div className="flex flex-wrap gap-2">
                            {(["mark-only", "left-lockup", "stacked", "badge"] as const).map((t) => {
                              const selected = field.value === t;
                              const label = t === "mark-only" ? "Mark only" : t === "left-lockup" ? "Left lockup" : t.charAt(0).toUpperCase() + t.slice(1);
                              return (
                                <button
                                  type="button"
                                  key={t}
                                  onClick={() => field.onChange(t)}
                                  className={`rounded-full px-4 py-2 text-sm font-medium border transition-colors outline-none focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 ${selected ? "bg-black text-white border-transparent" : "bg-card text-foreground border-neutral-300 hover:bg-neutral-100"}`}
                                >
                                  {label}
                                </button>
                              );
                            })}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>
                  {!spec.iconId && (
                    <div>
                      <FormLabel className="uppercase tracking-[0.2em] text-xs font-semibold mb-2">Icon</FormLabel>
                      <div className="flex items-center gap-2">
                        <IconPicker value={spec.iconId} onChange={(id) => form.setValue('iconId', id)} />
                      </div>
                    </div>
                  )}
                  <div>
                    <FormLabel className="uppercase tracking-[0.2em] text-xs font-semibold mb-2">Icon Color</FormLabel>
                    <div className="mt-2">
                      <FormField control={form.control} name="colors.primary" render={({ field }) => (
                        <ColorSwatchRow
                          value={field.value}
                          onChange={(v) => field.onChange(v)}
                          presets={["#F97316", "#EF4444", "#06B6D4", "#10B981", "#8B5CF6", "#FFF7ED"]}
                        />
                      )} />
                    </div>
                  </div>
                  <div>
                    <FormLabel className="uppercase tracking-[0.2em] text-xs font-semibold mb-2">Background Color</FormLabel>
                    <div className="mt-2">
                      <FormField control={form.control} name="colors.background" render={({ field }) => (
                        <ColorSwatchRow
                          value={field.value}
                          onChange={(v) => field.onChange(v)}
                          presets={["#000000", "#0B0B0F", "#111827", "#FFFFFF", "#F9FAFB", "#FFF7ED"]}
                        />
                      )} />
                    </div>
                  </div>
                  <div>
                    <FormLabel className="uppercase tracking-[0.2em] text-xs font-semibold mb-2">Text Color</FormLabel>
                    <div className="mt-2">
                      <FormField control={form.control} name="colors.text" render={({ field }) => (
                        <ColorSwatchRow
                          value={field.value}
                          onChange={(v) => field.onChange(v)}
                          presets={["#0B0B0F", "#111827", "#FFFFFF", "#E5E7EB", "#9CA3AF", "#FFF7ED"]}
                        />
                      )} />
                    </div>
                  </div>
                  {/* Theme controls removed */}
                </div>
                
                <Separator />
                
                {/* Advanced Parameters */}
                <div className="space-y-4">
                  <Button
                    onClick={() => {
                      const next = !showAdvanced;
                      setShowAdvanced(next);
                      // Smoothly scroll into view slightly after expansion begins to avoid jolt
                      if (next) {
                        window.setTimeout(() => {
                          advancedRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                        }, 150);
                      }
                    }}
                    className="w-full justify-between rounded-lg bg-black text-white hover:bg-black/90 h-14 px-8 outline-none ring-0 ring-offset-0 focus:outline-none focus:ring-0 focus:ring-offset-0 focus-visible:outline-none focus-visible:ring-0 uppercase tracking-[0.2em] text-xs font-semibold"
                  >
                    <span className="uppercase tracking-[0.2em] text-xs font-semibold">{showAdvanced ? 'Hide Advanced' : 'Advanced Parameters'}</span>
                    <ArrowRight className={`w-5 h-5 transition-transform ${showAdvanced ? 'rotate-90' : ''}`} />
                  </Button>
                  
                  <AnimatePresence initial={false}>
                  {showAdvanced ? (
                    <SmoothAdvanced innerRef={advancedRef}>
                      <div className="space-y-8 pt-4">
                      {spec.iconId && (
                        <div className="space-y-4">
                          <Label className="uppercase tracking-[0.2em] text-xs font-semibold mb-3">Icon</Label>
                          <div className="flex items-center gap-3">
                            <IconPicker value={spec.iconId} onChange={(id) => form.setValue('iconId', id)} />
                            <Button type="button" variant="secondary" onClick={() => form.setValue('iconId', '')}>Remove</Button>
                          </div>
                        </div>
                      )}
                      {/* Rotate */}
                      <div className="space-y-4">
                        <Label className="uppercase tracking-[0.2em] text-xs font-semibold mb-3">Rotate</Label>
                        <Slider
                          value={[spec.params.rotate]}
                          onValueChange={([v]) => updateParams({ rotate: v })}
                          min={-45}
                          max={45}
                          step={1}
                          trackClassName="bg-neutral-200"
                          rangeClassName="bg-neutral-900"
                          thumbClassName="h-6 w-6 border-neutral-900"
                        />
                      </div>
                      <div className="space-y-4">
                        <Label className="uppercase tracking-[0.2em] text-xs font-semibold mb-3">Stroke</Label>
                        <Slider
                          value={[spec.params.stroke]}
                          onValueChange={([v]) => updateParams({ stroke: v })}
                          min={0}
                          max={8}
                          step={1}
                          trackClassName="bg-neutral-200"
                          rangeClassName="bg-neutral-900"
                          thumbClassName="h-6 w-6 border-neutral-900"
                        />
                      </div>
                      <div className="space-y-4">
                        <Label className="uppercase tracking-[0.2em] text-xs font-semibold mb-3">Corner Radius</Label>
                        <Slider
                          value={[spec.params.cornerRadius]}
                          onValueChange={([v]) => updateParams({ cornerRadius: v })}
                          min={0}
                          max={64}
                          step={2}
                          trackClassName="bg-neutral-200"
                          rangeClassName="bg-neutral-900"
                          thumbClassName="h-6 w-6 border-neutral-900"
                        />
                      </div>
                      <div className="space-y-4">
                        <Label className="uppercase tracking-[0.2em] text-xs font-semibold mb-3">Padding</Label>
                        <Slider
                          value={[spec.params.padding]}
                          onValueChange={([v]) => updateParams({ padding: v })}
                          min={0}
                          max={40}
                          step={2}
                          trackClassName="bg-neutral-200"
                          rangeClassName="bg-neutral-900"
                          thumbClassName="h-6 w-6 border-neutral-900"
                        />
                      </div>
                      {/* Lockup spacing locked by renderer */}
                      </div>
                    </SmoothAdvanced>
                  ) : null}
                  </AnimatePresence>
                </div>
                
              </CardContent>
            </Card>
          </div>
          
          {/* Middle Separator */}
          <Separator orientation="vertical" className="hidden lg:block h-[calc(100vh-220px)] my-6 mx-auto bg-muted-foreground/20" />

          {/* Right Panel: Preview */}
          <div className="space-y-6 h-[calc(100vh-220px)] overflow-auto pr-2">
            {/* View toggles */}
            <div className="flex flex-wrap gap-2">
              {[
                { key: "hero", label: "Hero" },
                { key: "header", label: "Website header" },
                { key: "app", label: "App icon" },
                { key: "browser", label: "Browser" },
                { key: "phone", label: "Phone" },
                { key: "ios", label: "iOS" },
                { key: "website", label: "Website" },
                { key: "card", label: "Business card" },
                { key: "social", label: "Social profile" },
              ].map(({ key, label }) => {
                const k = key as typeof view;
                const selected = view === k;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setView(k)}
                    className={`rounded-full px-4 py-2 text-sm font-medium border transition-colors outline-none focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 ${selected ? "bg-black text-white border-transparent" : "bg-card text-foreground border-neutral-300 hover:bg-neutral-100"}`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
            
            {/* Main Preview */}
            <Card className="shadow-none border-none">
              <CardContent className="">
                {view === "hero" && (
                  <div
                    className="mx-auto rounded-2xl flex items-center justify-center overflow-hidden aspect-square"
                    style={{
                      width: 'min(100%, 640px, calc(100vh - 240px))',
                      backgroundColor: spec.colors.background,
                    }}
                  >
                    {renderResult.lockup ? (
                      <div
                        key={`${spec.name}|${spec.iconId}|${spec.colors.primary}|${spec.template}`}
                        className="w-full h-full grid place-items-center"
                        style={{ transform: 'scale(0.8)', transformOrigin: 'center' }}
                        dangerouslySetInnerHTML={{ __html: renderResult.lockup }}
                      />
                    ) : null}
                  </div>
                )}
                {view === "header" && (
                  <div className="mx-auto w-full max-w-3xl rounded-lg border bg-white">
                    <div className="h-12 w-full border-b bg-neutral-50" />
                    <div className="p-6">
                      <div
                        className="w-full"
                        dangerouslySetInnerHTML={{ __html: renderLockupV2({ ...spec, template: 'left-lockup' }, 256) }}
                      />
                    </div>
                  </div>
                )}
                {view === "app" && (
                  <div className="mx-auto">
                    <div className="grid grid-cols-3 gap-6">
                      {[64, 128, 192].map((sz) => (
                        <div key={sz} className="flex flex-col items-center gap-2">
                          <AppIconMockup spec={spec} size={sz} />
                          <span className="text-xs text-muted-foreground">{sz}×{sz}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {view === "card" && (
                  <div className="mx-auto w-full max-w-3xl">
                    <div className="aspect-[3/2] rounded-xl bg-white border grid place-items-center">
                      <div className="scale-90" dangerouslySetInnerHTML={{ __html: renderLockupV2({ ...spec, template: 'left-lockup' }, 256) }} />
                    </div>
                  </div>
                )}
                {view === "social" && (
                  <div className="mx-auto flex items-center gap-8">
                    {[64, 96, 128].map((sz) => (
                      <div key={sz} className="flex flex-col items-center gap-2">
                        <div className="rounded-full overflow-hidden bg-black grid place-items-center" style={{ width: sz, height: sz }}>
                          <div className="scale-75" dangerouslySetInnerHTML={{ __html: renderMarkV2(spec, 256) }} />
                        </div>
                        <span className="text-xs text-muted-foreground">{sz}×{sz}</span>
                      </div>
                    ))}
                  </div>
                )}
                {view === "browser" && (
                  <BrowserMockup spec={spec} />
                )}
                {view === "phone" && (
                  <IPhoneMockup spec={spec} />
                )}
                {view === "ios" && (
                  <NativeIOSMockup spec={spec} />
                )}
                {view === "website" && (
                  <WebsiteMockup spec={spec} />
                )}
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

// Smooth container with expand/collapse animation and scroll anchor
function SmoothAdvanced({ children, innerRef }: { children: React.ReactNode; innerRef?: React.RefObject<HTMLDivElement> }) {
  return (
    <motion.div
      ref={innerRef as any}
      key="advanced"
      initial={{ opacity: 0, height: 0, y: -4, filter: 'blur(2px)' }}
      animate={{ opacity: 1, height: 'auto', y: 0, filter: 'blur(0px)' }}
      exit={{ opacity: 0, height: 0, y: -4, filter: 'blur(2px)' }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

function ColorSwatchRow({ value, onChange, presets }: { value: string; onChange: (v: string) => void; presets: string[] }) {
  return (
    <div className="flex items-center gap-3">
      {presets.map((c) => (
        <button
          key={c}
          type="button"
          aria-label={`Choose ${c}`}
          onClick={() => onChange(c)}
          className={`h-8 w-8 rounded-full border-2 ${value?.toLowerCase() === c.toLowerCase() ? 'border-black' : 'border-transparent'} shadow-sm`}
          style={{ backgroundColor: c }}
        />
      ))}
      <label className="relative h-8 w-8 rounded-full border-2 border-neutral-900 grid place-items-center cursor-pointer">
        <span className="text-[12px] font-semibold">•••</span>
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="absolute inset-0 opacity-0 cursor-pointer"
        />
      </label>
    </div>
  );
}