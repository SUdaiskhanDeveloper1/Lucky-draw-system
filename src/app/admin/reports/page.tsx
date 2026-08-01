import { ReportsExport } from "@/components/admin/reports-export";

export const dynamic = "force-dynamic";

export default function AdminReportsPage() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold">Reports</h1>
        <p className="text-sm text-muted-foreground">
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
