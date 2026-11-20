import { ActionDialog } from "@/components/dashboard/action-dialog"
import { DashboardEmptyState } from "@/components/dashboard/empty-state"
import { DashboardPageHeader } from "@/components/dashboard/page-header"
import { DashboardTable } from "@/components/dashboard/dashboard-table"
import { StatusBadge } from "@/components/dashboard/status-badge"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { TableCell, TableRow } from "@/components/ui/table"
import { requireDashboardRole } from "@/lib/dashboard-session"
import { formatDate, getInitials } from "@/lib/format"
import { adminUsers } from "@/lib/mock/dashboard"

export default async function AdminUsersPage() {
  await requireDashboardRole("admin")

  return (
    <div className="flex flex-col gap-6">
      <DashboardPageHeader
        title="All Users"
        description="Review registered accounts and manage marketplace roles."
      />

      {adminUsers.length === 0 ? (
        <DashboardEmptyState
          title="No users found"
          description="Registered users will appear here."
        />
      ) : (
        <DashboardTable
          headers={["Name", "Email", "Role", "Registration Date", "Actions"]}
          minWidthClassName="min-w-[980px]"
        >
          {adminUsers.map((user) => (
            <TableRow key={user.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <span className="grid size-9 shrink-0 place-items-center rounded-full bg-emerald-soft text-xs font-semibold text-emerald-strong">
                    {getInitials(user.name)}
                  </span>
                  <p className="font-medium">{user.name}</p>
                </div>
              </TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <StatusBadge status={user.role} />
              </TableCell>
              <TableCell>{formatDate(user.joinedAt)}</TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1.5">
                  <ActionDialog
                    triggerLabel="Change Role"
                    title={`Change role for ${user.name}`}
                    description="This is a static preview. Role changes are not saved."
                    confirmLabel="Update role"
                  >
                    <div className="space-y-2">
                      <Label htmlFor={`role-${user.id}`}>Account role</Label>
                      <Select defaultValue={user.role}>
                        <SelectTrigger id={`role-${user.id}`} className="w-full">
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="customer">Customer</SelectItem>
                          <SelectItem value="owner">Owner</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </ActionDialog>

                  <ActionDialog
                    triggerLabel="Manage"
                    triggerVariant="ghost"
                    title={user.name}
                    description="Account overview."
                    confirmLabel="Close"
                    confirmVariant="outline"
                  >
                    <div className="grid gap-3 rounded-lg border border-border p-4 text-sm">
                      <div className="flex justify-between gap-4">
                        <span className="text-muted-foreground">Email</span>
                        <span className="text-right font-medium">
                          {user.email}
                        </span>
                      </div>
                      <div className="flex justify-between gap-4">
                        <span className="text-muted-foreground">Role</span>
                        <StatusBadge status={user.role} />
                      </div>
                      <div className="flex justify-between gap-4">
                        <span className="text-muted-foreground">Status</span>
                        <StatusBadge status={user.status} />
                      </div>
                      <div className="flex justify-between gap-4">
                        <span className="text-muted-foreground">Joined</span>
                        <span className="font-medium">
                          {formatDate(user.joinedAt)}
                        </span>
                      </div>
                    </div>
                  </ActionDialog>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </DashboardTable>
      )}
    </div>
  )
}