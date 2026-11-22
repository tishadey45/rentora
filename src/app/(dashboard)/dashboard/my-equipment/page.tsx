import Link from "next/link"

import { Plus } from "lucide-react"

import { DashboardPageHeader } from "@/components/dashboard/page-header"
import { MyEquipmentList } from "@/components/dashboard/my-equipment-list"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "cn"
import { requireDashboardRole } from "@/lib/dashboard-session"

export default async function MyEquipmentPage() {
  await requireDashboardRole("owner")

  return (
    <div className="flex flex-col gap-6">
      <DashboardPageHeader
        title="My Equipment"
        description="Manage all equipment you have listed for rent."
        action={
          <Link
            href="/dashboard/add-equipment"
            className={cn(
              buttonVariants({ variant: "brand", size: "lg" }),
              "flex items-center gap-1.5"
            )}
          >
            <Plus aria-hidden="true" />
            Add Equipment
          </Link>
        }
      />
      <MyEquipmentList />
    </div>
  )
}
