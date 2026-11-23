import { DashboardPageHeader } from "@/components/dashboard/page-header"
import { AdminUsersList } from "@/components/dashboard/admin-users-list"
import { requireDashboardRole } from "@/lib/dashboard-session"

export const instant = false

export default async function AdminUsersPage() {
  const { session } = await requireDashboardRole("admin")

  return (
    <div className="flex flex-col gap-6">
      <DashboardPageHeader
        title="Users"
        description="View all registered users and manage their roles and account status."
      />
      <AdminUsersList currentUserId={session.user.id} />
    </div>
  )
}
