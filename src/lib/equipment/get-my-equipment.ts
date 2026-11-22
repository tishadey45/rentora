import { apiFetch } from "@/lib/api-client"
import type {
  EquipmentAvailability,
  EquipmentCategory,
  RentalType,
} from "@/types/equipment"

const REQUEST_TIMEOUT_MS = 8000

export const MY_EQUIPMENT_ERROR_MESSAGE =
  "We couldn't load your equipment right now. Please try again."

export interface MyEquipmentItem {
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
  brand?: string
  model?: string
  condition?: string
  isApproved: boolean
  createdAt?: string
}

export type GetMyEquipmentResult =
  | { status: "success"; items: MyEquipmentItem[] }
  | { status: "error"; message: string }

interface BackendEquipmentRecord {
  _id?: unknown
  name?: unknown
  description?: unknown
  category?: unknown
  rentalPrice?: unknown
  rentalType?: unknown
  location?: unknown
  availableQuantity?: unknown
  availability?: unknown
  image?: unknown
  imageAlt?: unknown
  brand?: unknown
  model?: unknown
  condition?: unknown
  isApproved?: unknown
  createdAt?: unknown
}

/**
 * Fetches the signed-in owner's equipment listings via the protected backend
 * endpoint. `apiFetch` attaches the Better Auth JWT as `Authorization: Bearer`.
 *
 * The backend responds with `{ success, message, data: <record>[] }`.
 */
export async function getMyEquipment(): Promise<GetMyEquipmentResult> {
  try {
    const response = await apiFetch("/api/v1/equipment/my-equipment", {
      method: "GET",
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    })

    if (response.status === 401) {
      return {
        status: "error",
        message: "Your session could not be verified. Please sign in again.",
      }
    }

    if (response.status === 403) {
      return {
        status: "error",
        message: "You don't have permission to view these listings.",
      }
    }

    if (!response.ok) {
      return {
        status: "error",
        message: `The equipment service responded with ${response.status}. Please try again.`,
      }
    }

    const payload: unknown = await response.json()
    const records = extractEquipmentRecords(payload)

    if (!records) {
      return {
        status: "error",
        message: "The equipment service returned an unexpected response.",
      }
    }

    return { status: "success", items: records.map(mapEquipmentRecord) }
  } catch {
    return { status: "error", message: MY_EQUIPMENT_ERROR_MESSAGE }
  }
}

function extractEquipmentRecords(
  payload: unknown
): BackendEquipmentRecord[] | null {
  if (Array.isArray(payload)) {
    return payload as BackendEquipmentRecord[]
  }

  if (typeof payload !== "object" || payload === null) {
    return null
  }

  const record = payload as Record<string, unknown>

  if (Array.isArray(record.data)) {
    return record.data as BackendEquipmentRecord[]
  }

  if (Array.isArray(record.equipment)) {
    return record.equipment as BackendEquipmentRecord[]
  }

  return null
}

function mapEquipmentRecord(record: BackendEquipmentRecord): MyEquipmentItem {
  return {
    id: asString(record._id),
    name: asString(record.name),
    description: asString(record.description),
    category: record.category as EquipmentCategory,
    rentalPrice: asNumber(record.rentalPrice),
    rentalType: record.rentalType as RentalType,
    location: asString(record.location),
    availableQuantity: asNumber(record.availableQuantity),
    availability: record.availability as EquipmentAvailability,
    image: asString(record.image),
    imageAlt: asOptionalString(record.imageAlt),
    brand: asOptionalString(record.brand),
    model: asOptionalString(record.model),
    condition: asOptionalString(record.condition),
    isApproved: record.isApproved === true,
    createdAt: asOptionalString(record.createdAt),
  }
}

function asString(value: unknown) {
  return typeof value === "string" ? value : ""
}

function asOptionalString(value: unknown) {
  return typeof value === "string" && value.length > 0 ? value : undefined
}

function asNumber(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) ? value : 0
}
