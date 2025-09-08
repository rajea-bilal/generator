import * as React from "react";
import * as RadixSlider from "@radix-ui/react-slider";
import { cn } from "~/lib/utils";

export type SliderProps = React.ComponentProps<typeof RadixSlider.Root> & {
  value?: number[];
  onValueChange?: (value: number[]) => void;
};

export function Slider({ className, ...props }: SliderProps) {
  return (
    <RadixSlider.Root
      className={cn("relative flex w-full touch-none select-none items-center", className)}
      {...props}
    >
      <RadixSlider.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-muted">
        <RadixSlider.Range className="absolute h-full bg-primary" />
      </RadixSlider.Track>
      <RadixSlider.Thumb className="block h-5 w-5 rounded-full border-2 border-primary bg-background shadow transition-colors focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:pointer-events-none disabled:opacity-50" />
    </RadixSlider.Root>
  );
}

/**
 * Slider Component
 * A range input slider built with Radix UI primitives.
 */

import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"
import { cn } from "~/lib/utils"

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex w-full touch-none select-none items-center",
      className
    )}
    {...props}
  >
    <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-secondary">
      <SliderPrimitive.Range className="absolute h-full bg-primary" />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb className="block h-5 w-5 rounded-full border-2 border-primary bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50" />
  </SliderPrimitive.Root>
))
Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }