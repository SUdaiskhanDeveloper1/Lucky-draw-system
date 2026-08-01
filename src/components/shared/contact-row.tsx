import { cn } from "@/lib/utils";

/** Icon + label + value tile used on the home and contact pages. */
export function ContactRow({
  icon: Icon,
  label,
  value,
  href,
  external,
  className,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  href?: string;
  external?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "card-surface flex items-center gap-4 p-4 transition-all duration-300 ease-out-expo hover:border-primary/25 hover:shadow-soft",
        className
      )}
    >
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent text-accent-foreground">
        <Icon className="h-5 w-5" aria-hidden />
      </span>
      <div className="min-w-0">
        <p className="eyebrow">{label}</p>
        {href ? (
          <a
            href={href}
            {...(external
              ? { target: "_blank", rel: "noopener noreferrer" }
              : {})}
            className="block truncate font-medium transition-colors duration-200 hover:text-primary"
          >
            {value}
          </a>
        ) : (
          <p className="font-medium">{value}</p>
        )}
      </div>
    </div>
  );
}
