import { forwardRef } from "react";
import { cn } from "@/lib/utils";

/** Shared field chrome so inputs, textareas and selects stay visually identical. */
const fieldBase = [
  "w-full rounded-lg border border-input bg-card text-sm text-foreground",
  "placeholder:text-muted-foreground/70",
  "shadow-xs transition-all duration-200 ease-out-expo",
  "hover:border-primary/30",
  "focus-visible:border-primary focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/12",
  "disabled:cursor-not-allowed disabled:bg-muted disabled:opacity-60",
  "aria-[invalid=true]:border-destructive aria-[invalid=true]:focus-visible:ring-destructive/15",
].join(" ");

export const Input = forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, type, ...props }, ref) => (
  <input
    type={type}
    ref={ref}
    className={cn(
      fieldBase,
      "flex h-11 px-3.5 py-2",
      "file:mr-3 file:rounded-md file:border-0 file:bg-secondary file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-secondary-foreground",
      className
    )}
    {...props}
  />
));
Input.displayName = "Input";

export const Textarea = forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(fieldBase, "flex min-h-[110px] resize-y px-3.5 py-2.5 leading-relaxed", className)}
    {...props}
  />
));
Textarea.displayName = "Textarea";

export const Select = forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement>
>(({ className, children, ...props }, ref) => (
  <select
    ref={ref}
    className={cn(fieldBase, "select-field flex h-11 cursor-pointer py-2 pl-3.5 pr-10", className)}
    {...props}
  >
    {children}
  </select>
));
Select.displayName = "Select";

export function Label({
  className,
  ...props
}: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={cn(
        "mb-2 block text-sm font-medium leading-none text-foreground",
        className
      )}
      {...props}
    />
  );
}

/** Small helper text rendered under a field. */
export function FieldHint({
  className,
  error,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement> & { error?: boolean }) {
  return (
    <p
      className={cn(
        "mt-1.5 text-xs",
        error ? "text-destructive" : "text-muted-foreground",
        className
      )}
      {...props}
    />
  );
}
