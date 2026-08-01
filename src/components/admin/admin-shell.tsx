"use client";

import { useState } from "react";
import { AdminSidebar } from "./sidebar";
import { AdminTopbar } from "./topbar";

/**
 * Client shell that composes the admin sidebar + topbar and shares the
 * mobile drawer open state between them.
 */
export function AdminShell({
  children,
  email,
}: {
  children: React.ReactNode;
  email?: string | null;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar open={open} onClose={() => setOpen(false)} />
      <div className="flex min-w-0 flex-1 flex-col">
        <AdminTopbar onMenu={() => setOpen(true)} email={email} />
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
