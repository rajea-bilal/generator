import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import {
  Controller,
  type ControllerProps,
  type FieldPath,
  type FieldValues,
  FormProvider,
} from "react-hook-form";
import { Label } from "./label";
import { cn } from "~/lib/utils";

// Provider wrapper: use like <Form {...form}>{children}</Form>
export const Form = FormProvider;

// Thin wrapper over RHF Controller to keep types
export function FormField<TFieldValues extends FieldValues, TName extends FieldPath<TFieldValues>>(
  props: ControllerProps<TFieldValues, TName>
) {
  return <Controller {...props} />;
}

export const FormItem = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return <div ref={ref} className={cn("space-y-2", className)} {...props} />;
  }
);
FormItem.displayName = "FormItem";

export const FormLabel = Label;

export const FormControl = React.forwardRef<React.ElementRef<typeof Slot>, React.ComponentPropsWithoutRef<typeof Slot>>(
  ({ ...props }, ref) => {
    return <Slot ref={ref} {...props} />;
  }
);
FormControl.displayName = "FormControl";

export const FormDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn("text-[0.8rem] text-muted-foreground", className)} {...props} />
  )
);
FormDescription.displayName = "FormDescription";

export const FormMessage = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, children, ...props }, ref) => {
    return (
      <p ref={ref} className={cn("text-[0.8rem] font-medium text-destructive", className)} {...props}>
        {children}
      </p>
    );
  }
);
FormMessage.displayName = "FormMessage";