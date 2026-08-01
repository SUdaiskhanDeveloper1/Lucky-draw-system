"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { EmptyState, Pagination } from "@/components/ui/misc";

export type Column<T> = {
  key: string;
  label: string;
  className?: string;
  render?: (row: T) => React.ReactNode;
};

export function DataTable<T extends Record<string, unknown>>({
  columns,
  rows,
  searchable = false,
  searchKeys,
  searchPlaceholder = "Search…",
  pageSize = 10,
  emptyMessage = "No records found.",
  toolbar,
}: {
  columns: Column<T>[];
  rows: T[];
  searchable?: boolean;
  searchKeys?: string[];
  searchPlaceholder?: string;
  pageSize?: number;
  emptyMessage?: string;
  toolbar?: React.ReactNode;
}) {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    if (!query.trim()) return rows;
    const q = query.toLowerCase();
    const keys = searchKeys ?? columns.map((c) => c.key);
    return rows.filter((r) =>
      keys.some((k) => String(r[k] ?? "").toLowerCase().includes(q))
    );
  }, [rows, query, searchKeys, columns]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, pageCount);
  const paged = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);

  return (
    <div className="space-y-4">
      {(searchable || toolbar) && (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {searchable ? (
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setPage(1);
                }}
                placeholder={searchPlaceholder}
                className="pl-9"
              />
            </div>
          ) : (
            <span />
          )}
          {toolbar}
        </div>
      )}

      {paged.length === 0 ? (
        <EmptyState title="Nothing here" description={emptyMessage} />
      ) : (
        <div className="card-surface overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
                  {columns.map((c) => (
                    <th key={c.key} className={`px-4 py-3 font-medium ${c.className ?? ""}`}>
                      {c.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paged.map((row, i) => (
                  <tr
                    key={(row.id as string) ?? i}
                    className="border-b last:border-0 hover:bg-muted/30"
                  >
                    {columns.map((c) => (
                      <td key={c.key} className={`px-4 py-3 align-middle ${c.className ?? ""}`}>
                        {c.render ? c.render(row) : String(row[c.key] ?? "—")}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Pagination page={safePage} pageCount={pageCount} onChange={setPage} />
    </div>
  );
}
