import type { Equipment, EquipmentOwner } from "@/types/equipment"

export interface EquipmentOwnerDetail extends EquipmentOwner {
  email?: string
}

export interface EquipmentDetails extends Omit<Equipment, "owner"> {
  owner: EquipmentOwnerDetail
  brand?: string
  model?: string
  condition?: string
  rentalTerms?: string
}