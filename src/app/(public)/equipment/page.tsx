import type { Metadata } from "next"
import { Suspense } from "react"

import {
  EquipmentCatalog,
  EquipmentGridSkeleton,
} from "@/components/equipment/equipment-catalog"
import { Section } from "@/components/layout/section"
import { PageHeader } from "@/components/shared/page-header"

export const metadata: Metadata = {
  title: "All Equipment",
  description:
    "Browse approved construction, photography, agriculture, vehicle, electronics, and event equipment available to rent on Rentora.",
}

export default function EquipmentPage() {
  return (
    <>
      <PageHeader
        eyebrow="Marketplace"
        title="All Equipment"
        description="Browse approved equipment available to rent. Search by name or location, filter by category, rental type, price, and availability, then sort to find the right fit."
      />

      <Section tone="muted">
        <Suspense fallback={<EquipmentGridSkeleton />}>
          <EquipmentCatalog />
        </Suspense>
      </Section>
    </>
  )
}