"use client";

import { useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { EmptyState, Pagination } from "@/components/ui/misc";
import {
  Table,
  TableWrap,
  TBody,
  TD,
  TH,
  THead,
  TR,
} from "@/components/ui/table";

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
              <Search
                className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden
              />
              <Input
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setPage(1);
                }}
                placeholder={searchPlaceholder}
                aria-label={searchPlaceholder}
                className="pl-10 pr-10"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => {
                    setQuery("");
                    setPage(1);
                  }}
                  aria-label="Clear search"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-muted-foreground transition-colors duration-200 hover:bg-secondary hover:text-foreground"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
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
        <>
          <TableWrap>
            <Table>
              <THead>
                <tr>
                  {columns.map((c) => (
                    <TH key={c.key} className={c.className}>
                      {c.label}
                    </TH>
                  ))}
                </tr>
              </THead>
              <TBody>
                {paged.map((row, i) => (
                  <TR key={(row.id as string) ?? i}>
                    {columns.map((c) => (
                      <TD key={c.key} className={c.className}>
                        {c.render ? c.render(row) : String(row[c.key] ?? "—")}
                      </TD>
                    ))}
                  </TR>
                ))}
              </TBody>
            </Table>
          </TableWrap>

          <p className="text-xs text-muted-foreground">
            Showing{" "}
            <span className="font-semibold tabular-nums text-foreground">
              {paged.length}
            </span>{" "}
            of{" "}
            <span className="font-semibold tabular-nums text-foreground">
              {filtered.length}
            </span>{" "}
            records
          </p>
        </>
      )}

      <Pagination page={safePage} pageCount={pageCount} onChange={setPage} />
    </div>
  );
}
