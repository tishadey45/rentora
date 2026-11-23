import { DashboardPageHeader } from "@/components/dashboard/page-header"
import { MyRentalsList } from "@/components/dashboard/my-rentals-list"
import { requireDashboardRole } from "@/lib/dashboard-session"

export const instant = false

export default async function CustomerRentalsPage() {
  await requireDashboardRole("customer")

  return (
    <div className="flex flex-col gap-6">
      <DashboardPageHeader
        title="My Rentals"
        description="Review your equipment bookings, payment status, and rental progress."
      />
      <MyRentalsList />
    </div>
  )
}