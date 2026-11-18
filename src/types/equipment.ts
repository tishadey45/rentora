export const EQUIPMENT_CATEGORIES = [
  "Construction",
  "Photography",
  "Vehicles & Transportation",
  "Agriculture",
  "Electronics",
  "Event Equipment",
] as const

export type EquipmentCategory = (typeof EQUIPMENT_CATEGORIES)[number]

export type RentalType = "Daily" | "Weekly" | "Monthly"

export type EquipmentAvailability = "available" | "limited" | "unavailable"

export interface EquipmentOwner {
  id: string
  name: string
  verified: boolean
}

export interface Equipment {
  id: string
  name: string
  description: string
  category: EquipmentCategory
  rentalPrice: number
  rentalType: RentalType
  location: string
  availableQuantity: number
  availability: EquipmentAvailability
  image: string
  imageAlt?: string
  owner: EquipmentOwner
  isApproved: boolean
}