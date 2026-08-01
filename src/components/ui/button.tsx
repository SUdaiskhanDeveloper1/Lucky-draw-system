import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  [
    "group/btn relative inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg",
    "text-sm font-semibold tracking-[-0.01em]",
    "transition-all duration-200 ease-out-expo",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
    "active:scale-[0.98] disabled:pointer-events-none disabled:opacity-55 disabled:shadow-none",
    "[&_svg]:shrink-0",
  ].join(" "),
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-soft hover:bg-primary/92 hover:shadow-glow",
        gradient:
          "bg-brand-gradient text-primary-foreground shadow-soft hover:shadow-glow hover:brightness-[1.06]",
        destructive:
          "bg-destructive text-destructive-foreground shadow-soft hover:bg-destructive/90",
        outline:
          "border border-input bg-card text-foreground shadow-xs hover:border-primary/35 hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/70",
        ghost:
          "text-muted-foreground hover:bg-secondary hover:text-foreground",
        success:
          "bg-success text-success-foreground shadow-soft hover:bg-success/90",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3 text-[0.8125rem]",
        lg: "h-12 rounded-xl px-7 text-base",
        xl: "h-14 rounded-xl px-8 text-base",
        icon: "h-10 w-10",
        "icon-sm": "h-9 w-9 rounded-md",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, loading, children, disabled, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(buttonVariants({ variant, size, className }))}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </button>
  )
);
Button.displayName = "Button";

export { Button, buttonVariants };
