import * as React from "react";
import { type FieldValues, type ControllerRenderProps, type ControllerFieldState, type UseFormStateReturn, FormProvider, useFormContext, Controller } from "react-hook-form";
import { cn } from "~/lib/utils";

type FormProps<TFieldValues extends FieldValues = FieldValues> = React.ComponentProps<typeof FormProvider<TFieldValues>>;

export function Form<TFieldValues extends FieldValues>(props: FormProps<TFieldValues>) {
  return <FormProvider {...props} />;
}

export function useFormField() {
  const fieldContext = React.useContext(FieldContext);
  if (!fieldContext) throw new Error("useFormField must be used within a FormItem");
  const { name } = fieldContext;

  const formContext = useFormContext();
  const fieldState = formContext.getFieldState(name, formContext.formState);

  return {
    id: name,
    name,
    formItemId: `${name}-form-item`,
    formDescriptionId: `${name}-form-item-description`,
    formMessageId: `${name}-form-item-message`,
    ...fieldState,
  } as const;
}

const FieldContext = React.createContext<{ name: string } | undefined>(undefined);

export function FormField<TFieldValues extends FieldValues, TName extends string = string>(
  props: {
    control: ReturnType<typeof useFormContext>["control"] | any;
    name: TName;
    render: (options: {
      field: ControllerRenderProps<TFieldValues, TName>;
      fieldState: ControllerFieldState;
      formState: UseFormStateReturn<TFieldValues>;
    }) => React.ReactNode;
  }
) {
  const { name } = props;
  return (
    <FieldContext.Provider value={{ name }}>
      <Controller {...props} />
    </FieldContext.Provider>
  );
}

export function FormItem({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("space-y-2", className)} {...props} />;
}

export function FormLabel({ className, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) {
  const { formItemId } = useFormField();
  return <label htmlFor={formItemId} className={cn("text-sm font-medium leading-none", className)} {...props} />;
}

export function FormControl({ ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const { formItemId } = useFormField();
  return <div id={formItemId} {...props} />;
}

export function FormDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  const { formDescriptionId } = useFormField();
  return <p id={formDescriptionId} className={cn("text-sm text-muted-foreground", className)} {...props} />;
}

export function FormMessage({ className, children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  const { formMessageId, error } = useFormField();
  const body = children ?? (error?.message as React.ReactNode);
  if (!body) return null;
  return (
    <p id={formMessageId} className={cn("text-sm font-medium text-red-600", className)} {...props}>
      {body}
    </p>
  );
}

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { Controller, type ControllerProps } from "react-hook-form";
import { Label } from "./label";
import { cn } from "~/lib/utils";

// Use as <Form {...form}>
export const Form = ({ ...props }: React.ComponentProps<"form">) => <form {...props} />;

export function FormField<TFieldValues extends Record<string, any>, TName extends import("react-hook-form").FieldPath<TFieldValues>>({
  control,
  name,
  render,
}: ControllerProps<TFieldValues, TName>) {
  return <Controller control={control} name={name} render={render as any} />;
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