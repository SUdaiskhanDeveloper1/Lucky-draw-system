"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import type { Profile } from "@/lib/types/database";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Topbar } from "@/components/dashboard/topbar";

const titles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/tickets": "My Tickets",
  "/payments": "Payment History",
  "/notifications": "Notifications",
  "/referrals": "Referrals",
  "/profile": "My Profile",
  "/join": "Checkout",
};

function titleFor(pathname: string) {
  const match = Object.keys(titles).find(
    (k) => pathname === k || pathname.startsWith(k + "/")
  );
  return match ? titles[match] : "Dashboard";
}

export function DashboardShell({
  profile,
  unreadCount,
  children,
}: {
  profile: Profile;
  unreadCount: number;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-background">
      <Sidebar open={open} onClose={() => setOpen(false)} />
      <div className="md:pl-64">
        <Topbar
          profile={profile}
          unreadCount={unreadCount}
          title={titleFor(pathname)}
          onMenuClick={() => setOpen(true)}
        />
        <main className="p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
