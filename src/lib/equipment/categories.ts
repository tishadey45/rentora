import {
  Camera,
  Cpu,
  HardHat,
  Speaker,
  Tractor,
  Truck,
  type LucideIcon,
} from "lucide-react"

import type { EquipmentCategory } from "@/types/equipment"

export type EquipmentCategoryItem = {
  value: EquipmentCategory
  title: string
  description: string
  icon: LucideIcon
}

export const equipmentCategoryItems: EquipmentCategoryItem[] = [
  {
    value: "Construction",
    title: "Construction Equipment",
    description:
      "Excavators, loaders, and site equipment for heavy-duty work.",
    icon: HardHat,
  },
  {
    value: "Photography",
    title: "Photography Equipment",
    description:
      "Cameras, lenses, lighting, and aerial gear for every shoot.",
    icon: Camera,
  },
  {
    value: "Vehicles & Transportation",
    title: "Vehicles & Transportation",
    description:
      "Trucks, trailers, and transport equipment to keep projects moving.",
    icon: Truck,
  },
  {
    value: "Agriculture",
    title: "Agriculture Equipment",
    description:
      "Tractors, implements, and field equipment built for the land.",
    icon: Tractor,
  },
  {
    value: "Electronics",
    title: "Electronics",
    description:
      "Audio, displays, and production technology for events and installations.",
    icon: Cpu,
  },
  {
    value: "Event Equipment",
    title: "Event Equipment",
    description:
      "PA systems, lighting, and staging for live events and venues.",
    icon: Speaker,
  },
]