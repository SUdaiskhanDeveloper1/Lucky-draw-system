"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Ban, CheckCircle2, Eye, Trash2 } from "lucide-react";
import type { Profile } from "@/lib/types/database";
import { DataTable, type Column } from "@/components/admin/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/input";
import { Modal, ConfirmDialog } from "@/components/ui/modal";
import { formatDate, initials } from "@/lib/utils";
import { deleteUser, setUserStatus } from "@/app/actions/admin";

export function UsersTable({ initial }: { initial: Profile[] }) {
  const router = useRouter();
  const [status, setStatus] = useState<string>("all");
  const [view, setView] = useState<Profile | null>(null);
  const [toDelete, setToDelete] = useState<Profile | null>(null);
  const [pending, startTransition] = useTransition();

  const rows = useMemo(
    () => (status === "all" ? initial : initial.filter((u) => u.status === status)),
    [initial, status]
  );

  const changeStatus = (u: Profile, next: "active" | "suspended") =>
    startTransition(async () => {
      const res = await setUserStatus(u.id, next);
      if (res.ok) {
        toast.success(`User ${next === "active" ? "activated" : "suspended"}`);
        router.refresh();
      } else toast.error(res.error ?? "Failed");
    });

  const remove = () =>
    toDelete &&
    startTransition(async () => {
      const res = await deleteUser(toDelete.id);
      if (res.ok) {
        toast.success("User deleted");
        setToDelete(null);
        router.refresh();
      } else toast.error(res.error ?? "Failed");
    });

  const columns: Column<any>[] = [
    {
      key: "full_name",
      label: "User",
      render: (u) => (
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
            {initials(u.full_name)}
          </span>
          <div className="min-w-0">
            <p className="truncate font-medium">{u.full_name ?? "Unnamed"}</p>
            <p className="truncate text-xs text-muted-foreground">{u.email}</p>
          </div>
        </div>
      ),
    },
    { key: "phone", label: "Phone", render: (u) => u.phone ?? "—" },
    { key: "city", label: "City", render: (u) => u.city ?? "—" },
    { key: "status", label: "Status", render: (u) => <Badge status={u.status} /> },
    { key: "created_at", label: "Joined", render: (u) => formatDate(u.created_at) },
    {
      key: "actions",
      label: "",
      className: "text-right",
      render: (u) => (
        <div className="flex justify-end gap-1">
          <Button variant="ghost" size="icon" onClick={() => setView(u)} title="View">
            <Eye className="h-4 w-4" />
          </Button>
          {u.status === "active" ? (
            <Button
              variant="ghost"
              size="icon"
              title="Suspend"
              onClick={() => changeStatus(u, "suspended")}
            >
              <Ban className="h-4 w-4 text-warning" />
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              title="Activate"
              onClick={() => changeStatus(u, "active")}
            >
              <CheckCircle2 className="h-4 w-4 text-success" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            title="Delete"
            onClick={() => setToDelete(u)}
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <>
      <DataTable
        columns={columns}
        rows={rows as any}
        searchable
        searchKeys={["full_name", "email", "phone", "city"]}
        searchPlaceholder="Search users…"
        toolbar={
          <Select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full sm:w-44"
          >
            <option value="all">All statuses</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
            <option value="banned">Banned</option>
          </Select>
        }
      />

      <Modal open={!!view} onClose={() => setView(null)} title="User details">
        {view && (
          <dl className="grid grid-cols-3 gap-3 text-sm">
            {[
              ["Name", view.full_name],
              ["Email", view.email],
              ["Phone", view.phone],
              ["Address", view.address],
              ["City", view.city],
              ["Country", view.country],
              ["CNIC", view.cnic],
              ["Referral code", view.referral_code],
              ["Status", view.status],
              ["Joined", formatDate(view.created_at)],
            ].map(([k, v]) => (
              <div key={k as string} className="col-span-3 flex justify-between border-b py-1.5 last:border-0">
                <dt className="text-muted-foreground">{k}</dt>
                <dd className="font-medium">{(v as string) || "—"}</dd>
              </div>
            ))}
          </dl>
        )}
      </Modal>

      <ConfirmDialog
        open={!!toDelete}
        onClose={() => setToDelete(null)}
        onConfirm={remove}
        loading={pending}
        title="Delete user?"
        message={`This permanently deletes ${toDelete?.full_name ?? toDelete?.email}. This cannot be undone.`}
        confirmText="Delete"
      />
    </>
  );
}
