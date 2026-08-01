import { Inbox } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./button";

// ThemeToggle is a client component; re-export so existing imports from
// "@/components/ui/misc" keep working.
export { ThemeToggle } from "./theme-toggle";

// The components below have no hooks, so they are "shared" components: they
// render on the server when used by Server Components (allowing icon
// components to be passed directly) and on the client when used by Client
// Components. This is why they must NOT be marked "use client".

export function EmptyState({
  title = "Nothing here yet",
  description,
  icon: Icon = Inbox,
  action,
}: {
  title?: string;
  description?: string;
  icon?: React.ComponentType<{ className?: string }>;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed p-12 text-center">
      <Icon className="mb-3 h-10 w-10 text-muted-foreground" />
      <p className="font-medium">{title}</p>
      {description && (
        <p className="mt-1 max-w-sm text-sm text-muted-foreground">
          {description}
        </p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function Pagination({
  page,
  pageCount,
  onChange,
}: {
  page: number;
  pageCount: number;
  onChange: (p: number) => void;
}) {
  if (pageCount <= 1) return null;
  return (
    <div className="flex items-center justify-center gap-2 pt-4">
      <Button
        variant="outline"
        size="sm"
        disabled={page <= 1}
        onClick={() => onChange(page - 1)}
      >
        Prev
      </Button>
      <span className="text-sm text-muted-foreground">
        Page {page} of {pageCount}
      </span>
      <Button
        variant="outline"
        size="sm"
        disabled={page >= pageCount}
        onClick={() => onChange(page + 1)}
      >
        Next
      </Button>
    </div>
  );
}

export function Spinner({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "h-6 w-6 animate-spin rounded-full border-2 border-muted border-t-primary",
        className
      )}
    />
  );
}
