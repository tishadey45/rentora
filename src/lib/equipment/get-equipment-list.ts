import type { Equipment } from "@/types/equipment"

const REQUEST_TIMEOUT_MS = 8000

export const EQUIPMENT_LIST_ERROR_MESSAGE =
  "We couldn't load equipment right now. Please try again."

export type EquipmentSort = "price_asc" | "price_desc" | "newest"

export interface EquipmentListQuery {
  search?: string
  category?: string
  rentalType?: string
  minPrice?: string
  maxPrice?: string
  availability?: string
  sort?: EquipmentSort
}

export type GetEquipmentListResult =
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

/**
 * Fetches the public equipment catalog from the backend. All searching,
 * filtering, and sorting happen server-side; this only forwards the query.
 */
export async function getEquipmentList(
  query: EquipmentListQuery
): Promise<GetEquipmentListResult> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "")

  if (!apiUrl) {
    return { data: null, error: EQUIPMENT_LIST_ERROR_MESSAGE }
  }

  const params = new URLSearchParams()
  if (query.search?.trim()) params.set("search", query.search.trim())
  if (query.category) params.set("category", query.category)
  if (query.rentalType) params.set("rentalType", query.rentalType)
  if (query.minPrice?.trim()) params.set("minPrice", query.minPrice.trim())
  if (query.maxPrice?.trim()) params.set("maxPrice", query.maxPrice.trim())
  if (query.availability) params.set("availability", query.availability)
  if (query.sort) params.set("sort", query.sort)

  const queryString = params.toString()

  try {
    const response = await fetch(
      `${apiUrl}/api/v1/equipment${queryString ? `?${queryString}` : ""}`,
      {
        cache: "no-store",
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      }
    )

    if (!response.ok) {
      throw new Error(`Equipment API responded with ${response.status}`)
    }

    const payload: unknown = await response.json()
    const equipment = extractEquipment(payload)

    if (!equipment) {
      throw new Error("Equipment API returned an unexpected response shape")
    }

    return { data: equipment.map(mapBackendToEquipment), error: null }
  } catch {
    return { data: null, error: EQUIPMENT_LIST_ERROR_MESSAGE }
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