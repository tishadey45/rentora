import { DashboardPageHeader } from "@/components/dashboard/page-header"
import { AdminEquipmentList } from "@/components/dashboard/admin-equipment-list"
import { requireDashboardRole } from "@/lib/dashboard-session"

export const instant = false

export default async function AdminEquipmentPage() {
  await requireDashboardRole("admin")

  return (
    <div className="flex flex-col gap-6">
      <DashboardPageHeader
        title="All Equipment"
        description="Review marketplace listings and their current approval status."
      />
      <AdminEquipmentList />
    </div>
  )
}
