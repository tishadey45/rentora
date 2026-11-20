import { DashboardPageHeader } from "@/components/dashboard/page-header"
import { EquipmentForm } from "@/components/dashboard/equipment-form"
import { requireDashboardRole } from "@/lib/dashboard-session"

export default async function AddEquipmentPage() {
  const { session } = await requireDashboardRole("owner")

  return (
    <div className="flex flex-col gap-6">
      <DashboardPageHeader
        title="Add Equipment"
        description="Create a new listing for the Rentora marketplace. New equipment starts in pending review."
      />
      <EquipmentForm ownerName={session.user.name} ownerEmail={session.user.email} />
    </div>
  )
}