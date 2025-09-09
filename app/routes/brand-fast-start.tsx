import React, { useMemo, useState } from "react";
import type { Route } from "./+types/brand-fast-start";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Separator } from "~/components/ui/separator";
import { Link } from "react-router";
import { IconPicker } from "~/components/brand/icon-picker";

// Minimal fast-start wizard that collects a few high-signal choices,
// then deep-links to /brand-kit with them as query params.

export function meta(_: Route.MetaArgs) {
  return [
    { title: "Fast Start – Brand Kit" },
    { name: "description", content: "Create a brand in 60 seconds with smart defaults." },
  ];
}

type WizardState = {
  name: string;
  template: "mark-only" | "left-lockup" | "stacked" | "badge";
  font: "Inter" | "Sora" | "Manrope" | "Outfit" | "Poppins" | "Montserrat" | "Roboto" | "Open Sans" | "Plus Jakarta Sans" | "Nunito" | "Work Sans";
  vibe: "Minimal" | "Playful" | "Bold" | "Elegant";
  iconId: string;
  primary: string;
  text: string;
};

const initialState: WizardState = {
  name: "",
  template: "left-lockup",
  font: "Inter",
  vibe: "Minimal",
  iconId: "shape:rounded-square",
  primary: "#FFF7ED",
  text: "#FFF7ED",
};

export default function FastStartWizard(_: Route.ComponentProps) {
  const [step, setStep] = useState<number>(1);
  const [state, setState] = useState<WizardState>(initialState);

  const toBrandKit = useMemo(() => {
    // Build querystring for brand-kit; path has no dynamic segments
    const qs = new URLSearchParams({
      name: state.name || "",
      template: state.template,
      font: state.font,
      vibe: state.vibe,
      iconId: state.iconId,
      primary: state.primary,
      text: state.text,
    });
    return `/brand-kit?${qs.toString()}`;
  }, [state]);

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Fast Start</h1>
        <p className="text-muted-foreground">Three quick steps. You can refine everything later.</p>
      </div>

      <Card className="shadow-none border-none">
        <CardContent className="p-6 space-y-8">
          {/* Step 1: Brand */}
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-lg font-medium">Brand basics</h2>
              <div className="max-w-md space-y-6">
                <div>
                  <Label className="uppercase tracking-[0.2em] text-xs font-semibold mb-2">Brand name</Label>
                  <Input
                    placeholder="Acme"
                    value={state.name}
                    onChange={(e) => setState((s) => ({ ...s, name: e.target.value }))}
                  />
                </div>
                <div>
                  <Label className="uppercase tracking-[0.2em] text-xs font-semibold mb-2">Style</Label>
                  <div className="flex flex-wrap gap-2">
                    {["mark-only", "left-lockup", "stacked", "badge"].map((t) => {
                      const selected = state.template === t;
                      const label = t === "mark-only" ? "Mark only" : t === "left-lockup" ? "Left lockup" : (t as string).charAt(0).toUpperCase() + (t as string).slice(1);
                      return (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setState((s) => ({ ...s, template: t as WizardState["template"] }))}
                          className={`rounded-full px-4 py-2 text-sm font-medium border transition-colors outline-none focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 ${selected ? "bg-black text-white border-transparent" : "bg-card text-foreground border-neutral-300 hover:bg-neutral-100"}`}
                        >
                          {label}
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div>
                  <Label className="uppercase tracking-[0.2em] text-xs font-semibold mb-2">Vibe</Label>
                  <div className="flex flex-wrap gap-2">
                    {["Minimal", "Playful", "Bold", "Elegant"].map((v) => {
                      const selected = state.vibe === v;
                      return (
                        <button
                          key={v}
                          type="button"
                          onClick={() => setState((s) => ({ ...s, vibe: v as WizardState["vibe"] }))}
                          className={`rounded-full px-4 py-2 text-sm font-medium border transition-colors outline-none focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 ${selected ? "bg-black text-white border-transparent" : "bg-card text-foreground border-neutral-300 hover:bg-neutral-100"}`}
                        >
                          {v}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button disabled={!state.name.trim()} onClick={() => setStep(2)}>Next</Button>
              </div>
            </div>
          )}

          {/* Step 2: Look */}
          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-lg font-medium">Look & feel</h2>
              <div className="max-w-md space-y-6">
                <div>
                  <Label className="uppercase tracking-[0.2em] text-xs font-semibold mb-2">Font</Label>
                  <div className="flex flex-wrap gap-2">
                    {["Inter", "Sora", "Manrope", "Outfit", "Poppins", "Montserrat", "Roboto", "Open Sans", "Plus Jakarta Sans", "Nunito", "Work Sans"].map((f) => {
                      const selected = state.font === f;
                      return (
                        <button
                          key={f}
                          type="button"
                          onClick={() => setState((s) => ({ ...s, font: f as WizardState["font"] }))}
                          className={`rounded-full px-4 py-2 uppercase tracking-[0.2em] text-xs font-semibold border transition-colors outline-none focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 ${selected ? "bg-black text-white border-transparent" : "bg-card text-foreground border-neutral-300 hover:bg-neutral-100"}`}
                        >
                          {f}
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div>
                  <Label className="uppercase tracking-[0.2em] text-xs font-semibold mb-2">Icon</Label>
                  <div className="flex items-center gap-2">
                    <IconPicker value={state.iconId} onChange={(id) => setState((s) => ({ ...s, iconId: id }))} />
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" onClick={() => setStep(1)}>Back</Button>
                <Button onClick={() => setStep(3)}>Next</Button>
              </div>
            </div>
          )}

          {/* Step 3: Colors */}
          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-lg font-medium">Colors</h2>
              <div className="max-w-md space-y-6">
                <div>
                  <Label className="uppercase tracking-[0.2em] text-xs font-semibold mb-2">Icon Color</Label>
                  <ColorSwatchRow
                    value={state.primary}
                    onChange={(v) => setState((s) => ({ ...s, primary: v }))}
                    presets={["#F97316", "#EF4444", "#06B6D4", "#10B981", "#8B5CF6", "#FFF7ED"]}
                  />
                </div>
                <div>
                  <Label className="uppercase tracking-[0.2em] text-xs font-semibold mb-2">Text Color</Label>
                  <ColorSwatchRow
                    value={state.text}
                    onChange={(v) => setState((s) => ({ ...s, text: v }))}
                    presets={["#0B0B0F", "#111827", "#FFFFFF", "#E5E7EB", "#9CA3AF", "#FFF7ED"]}
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" onClick={() => setStep(2)}>Back</Button>
                <Link to={toBrandKit} className="w-fit">
                  <Button disabled={!state.name.trim()}>Generate in Brand Kit</Button>
                </Link>
              </div>
            </div>
          )}

          <Separator />
          <div className="text-xs text-muted-foreground">You can fine-tune everything on the next screen.</div>
        </CardContent>
      </Card>
    </div>
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


