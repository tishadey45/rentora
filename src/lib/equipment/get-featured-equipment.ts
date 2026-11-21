import type { Equipment } from "@/types/equipment"

const FEATURED_LIMIT = 6
const REQUEST_TIMEOUT_MS = 8000

export const FEATURED_EQUIPMENT_ERROR_MESSAGE =
  "We couldn't load featured equipment right now. Please try again."

export type FeaturedEquipmentResult =
  | { data: Equipment[]; error: null }
  | { data: null; error: string }

interface BackendEquipment {
  _id: string
  name: string
  description: string
  category: string
  rentalPrice: number
  rentalType: string
  location: string
  availableQuantity: number
  availability: string
  image: string
  imageAlt?: string
  owner: {
    id: string
    name: string
    verified: boolean
  }
  isApproved?: boolean
}

function mapBackendToEquipment(item: BackendEquipment): Equipment {
  return {
    id: item._id,
    name: item.name,
    description: item.description,
    category: item.category as Equipment["category"],
    rentalPrice: item.rentalPrice,
    rentalType: item.rentalType as Equipment["rentalType"],
    location: item.location,
    availableQuantity: item.availableQuantity,
    availability: item.availability as Equipment["availability"],
    image: item.image,
    imageAlt: item.imageAlt,
    owner: {
      id: item.owner.id,
      name: item.owner.name,
      verified: item.owner.verified,
    },
    isApproved: item.isApproved === true,
  }
}

export async function getFeaturedEquipment(
  limit = FEATURED_LIMIT
): Promise<FeaturedEquipmentResult> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "")

  if (!apiUrl) {
    return { data: null, error: FEATURED_EQUIPMENT_ERROR_MESSAGE }
  }

  try {
    const response = await fetch(`${apiUrl}/api/v1/equipment`, {
      cache: "no-store",
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    })

    if (!response.ok) {
      throw new Error(`Equipment API responded with ${response.status}`)
    }

    const payload: unknown = await response.json()
    const equipment = extractEquipment(payload)

    if (!equipment) {
      throw new Error("Equipment API returned an unexpected response shape")
    }

    const approvedEquipment = equipment
      .filter((item) => item.isApproved === true)
      .map(mapBackendToEquipment)

    return {
      data: approvedEquipment.slice(0, limit),
      error: null,
    }
  } catch {
    return { data: null, error: FEATURED_EQUIPMENT_ERROR_MESSAGE }
  }
}

function extractEquipment(payload: unknown): BackendEquipment[] | null {
  if (Array.isArray(payload)) {
    return payload as BackendEquipment[]
  }

  if (typeof payload !== "object" || payload === null) {
    return null
  }

  const record = payload as Record<string, unknown>

  if (Array.isArray(record.data)) {
    return record.data as BackendEquipment[]
  }

  if (Array.isArray(record.equipment)) {
    return record.equipment as BackendEquipment[]
  }

  return null
}
