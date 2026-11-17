import { FeaturedEquipment } from "@/components/home/featured-equipment"
import { getFeaturedEquipment } from "@/lib/equipment/get-featured-equipment"

type FeaturedEquipmentSectionProps = {
  isAuthenticated?: boolean
}

async function FeaturedEquipmentSection({
  isAuthenticated = false,
}: FeaturedEquipmentSectionProps) {
  const result = await getFeaturedEquipment()

  return (
    <FeaturedEquipment
      equipment={result.data ?? []}
      error={result.error}
      isAuthenticated={isAuthenticated}
    />
  )
}

export { FeaturedEquipmentSection }