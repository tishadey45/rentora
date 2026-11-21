"use client"

import { Heart } from "lucide-react"
import toast from "react-hot-toast"

import { BookingDialog } from "@/components/equipment/booking-dialog"
import { Button } from "@/components/ui/button"

type EquipmentActionsProps = {
  equipmentName: string
  availableQuantity: number
}

function EquipmentActions({
  equipmentName,
  availableQuantity,
}: EquipmentActionsProps) {
  function handleAddToFavorites() {
    toast("Favorites are coming soon — this item was not saved.")
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <div className="sm:flex-1">
        <BookingDialog
          equipmentName={equipmentName}
          maxQuantity={availableQuantity}
        />
      </div>
      <Button
        type="button"
        variant="outline"
        size="lg"
        onClick={handleAddToFavorites}
      >
        <Heart aria-hidden="true" />
        Add to Favorites
      </Button>
    </div>
  )
}

export { EquipmentActions }