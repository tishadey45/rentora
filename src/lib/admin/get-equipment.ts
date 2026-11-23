import { apiFetch } from "@/lib/api-client"

const REQUEST_TIMEOUT_MS = 8000

export const ADMIN_EQUIPMENT_ERROR_MESSAGE =
  "We couldn't load equipment right now. Please try again."

export type AdminEquipmentStatus = "pending" | "approved" | "rejected"

export interface AdminEquipment {
  id: string
  name: string
  description: string
  image: string
  imageAlt?: string
  category: string
  brand?: string
  model?: string
  condition?: string
  rentalTerms?: string
  rentalPrice: number
  rentalType: string
  location: string
  availableQuantity: number
  availability: string
  ownerName?: string
  ownerEmail?: string
  status: AdminEquipmentStatus
}

export type GetAdminEquipmentResult =
  | { status: "success"; equipment: AdminEquipment[] }
  | { status: "error"; message: string }

interface BackendEquipmentRecord {
  _id?: unknown
  id?: unknown
  name?: unknown
  description?: unknown
  image?: unknown
  imageAlt?: unknown
  category?: unknown
  brand?: unknown
  model?: unknown
  condition?: unknown
  rentalTerms?: unknown
  rentalPrice?: unknown
  rentalType?: unknown
  location?: unknown
  availableQuantity?: unknown
  availability?: unknown
  owner?: unknown
  status?: unknown
}

/**
 * Fetches all equipment via the protected admin endpoint.
 * `apiFetch` attaches the Better Auth JWT as `Authorization: Bearer`.
 *
 * The backend responds with `{ success, message, data: <record>[] }`,
 * where each record already includes a resolved `status`.
 */
export async function getAdminEquipment(): Promise<GetAdminEquipmentResult> {
  try {
    const response = await apiFetch("/api/v1/admin/equipment", {
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
        message: "You don't have permission to view equipment.",
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

    return { status: "success", equipment: records.map(mapEquipmentRecord) }
  } catch {
    return { status: "error", message: ADMIN_EQUIPMENT_ERROR_MESSAGE }
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

  return null
}

function mapEquipmentRecord(record: BackendEquipmentRecord): AdminEquipment {
  const owner = asRecord(record.owner)

  return {
    id: asOptionalString(record._id) ?? asOptionalString(record.id) ?? "",
    name: asString(record.name),
    description: asString(record.description),
    image: asString(record.image),
    imageAlt: asOptionalString(record.imageAlt),
    category: asString(record.category),
    brand: asOptionalString(record.brand),
    model: asOptionalString(record.model),
    condition: asOptionalString(record.condition),
    rentalTerms: asOptionalString(record.rentalTerms),
    rentalPrice: asNumber(record.rentalPrice),
    rentalType: asString(record.rentalType),
    location: asString(record.location),
    availableQuantity: asNumber(record.availableQuantity),
    availability: asString(record.availability),
    ownerName: asOptionalString(owner.name),
    ownerEmail: asOptionalString(owner.email),
    // The backend already resolves the status; default to "pending".
    status: asStatus(record.status),
  }
}

/** Maps a raw equipment document (e.g. from a PATCH response) to AdminEquipment. */
export function mapAdminEquipmentRecord(raw: unknown): AdminEquipment {
  return mapEquipmentRecord(
    typeof raw === "object" && raw !== null
      ? (raw as BackendEquipmentRecord)
      : {}
  )
}

function asRecord(value: unknown): Record<string, unknown> {
  return typeof value === "object" && value !== null
    ? (value as Record<string, unknown>)
    : {}
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

function asStatus(value: unknown): AdminEquipmentStatus {
  return value === "approved" || value === "rejected" ? value : "pending"
}
