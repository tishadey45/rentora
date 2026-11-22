import { notFound } from "next/navigation"

import { DashboardPageHeader } from "@/components/dashboard/page-header"
import { EquipmentForm } from "@/components/dashboard/equipment-form"
import { requireDashboardRole } from "@/lib/dashboard-session"
import { apiFetch } from "@/lib/api-client"
import type { MyEquipmentItem } from "@/lib/equipment/get-my-equipment"

export default async function EditEquipmentPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  await requireDashboardRole("owner")

  const { id } = await params

  const response = await apiFetch(
    `/api/v1/equipment/${encodeURIComponent(id)}`,
    {
      method: "GET",
      cache: "no-store",
    }
  )

  if (response.status === 404) {
    notFound()
  }

  if (!response.ok) {
    return (
      <div className="flex flex-col gap-6 p-6">
        <DashboardPageHeader
          title="Edit Equipment"
          description="Unable to load this equipment listing."
        />
      </div>
    )
  }

  const record = await response.json()

  const equipment: MyEquipmentItem = {
    id: typeof record._id === "string" ? record._id : String(record.id ?? ""),
    name: typeof record.name === "string" ? record.name : "",
    description: typeof record.description === "string" ? record.description : "",
    category: record.category,
    rentalPrice:
      typeof record.rentalPrice === "number" ? record.rentalPrice : 0,
    rentalType: record.rentalType,
    location: typeof record.location === "string" ? record.location : "",
    availableQuantity:
      typeof record.availableQuantity === "number"
        ? record.availableQuantity
        : 0,
    availability: record.availability,
    image: typeof record.image === "string" ? record.image : "",
    imageAlt:
      typeof record.imageAlt === "string" && record.imageAlt.length > 0
        ? record.imageAlt
        : undefined,
    brand:
      typeof record.brand === "string" && record.brand.length > 0
        ? record.brand
        : undefined,
    model:
      typeof record.model === "string" && record.model.length > 0
        ? record.model
        : undefined,
    condition:
      typeof record.condition === "string" && record.condition.length > 0
        ? record.condition
        : undefined,
    isApproved: record.isApproved === true,
    createdAt:
      typeof record.createdAt === "string" && record.createdAt.length > 0
        ? record.createdAt
        : undefined,
  }

  return (
    <div className="flex flex-col gap-6">
      <DashboardPageHeader
        title="Edit Equipment"
        description="Update your equipment listing details."
      />
      <EquipmentForm equipmentId={id} equipment={equipment} />
    </div>
  )
}
