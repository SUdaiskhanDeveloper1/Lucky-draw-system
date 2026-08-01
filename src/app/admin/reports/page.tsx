import { ReportsExport } from "@/components/admin/reports-export";

export const dynamic = "force-dynamic";

export default function AdminReportsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-extrabold tracking-tight">Reports</h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Export platform data as CSV (open in Excel / Google Sheets)
        </p>
      </div>
      <ReportsExport />
      <p className="text-xs text-muted-foreground">
        Tip: CSV files open directly in Excel. For PDF, print any exported sheet to PDF.
      </p>
    </div>
  );
}
