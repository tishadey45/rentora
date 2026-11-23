import { apiFetch } from "@/lib/api-client"
import {
  mapAdminEquipmentRecord,
  type AdminEquipment,
} from "@/lib/admin/get-equipment"

const REQUEST_TIMEOUT_MS = 8000

/**
 * The 14 fields an admin may edit. Protected fields
 * (_id, id, owner, isApproved, status) are intentionally excluded.
 */
export interface AdminEquipmentUpdateFields {
  name: string
  description: string
  category: string
  rentalPrice: number
  rentalType: string
  location: string
  availableQuantity: number
  availability: string
  image: string
  imageAlt: string
  brand: string
  model: string
  condition: string
  rentalTerms: string
}

export type UpdateAdminEquipmentResult =
  | { status: "success"; equipment: AdminEquipment }
  | { status: "error"; message: string }

/**
 * Updates an equipment listing via the admin endpoint.
 * `apiFetch` attaches the Better Auth JWT as `Authorization: Bearer`.
 */
export async function updateAdminEquipment(
  id: string,
  fields: AdminEquipmentUpdateFields
): Promise<UpdateAdminEquipmentResult> {
  try {
    const response = await apiFetch(
      `/api/v1/admin/equipment/${encodeURIComponent(id)}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fields),
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      }
    )

    if (!response.ok) {
      return { status: "error", message: await readErrorMessage(response) }
    }

    const payload: unknown = await response.json().catch(() => null)
    const data =
      payload !== null && typeof payload === "object"
        ? (payload as { data?: unknown }).data
        : undefined

    if (data === undefined || data === null) {
      return {
        status: "error",
        message: "The equipment service returned an unexpected response.",
      }
    }

    return { status: "success", equipment: mapAdminEquipmentRecord(data) }
  } catch {
    return {
      status: "error",
      message: "We couldn't reach the equipment service. Please try again.",
    }
  }
}

async function readErrorMessage(response: Response) {
  const body: unknown = await response.json().catch(() => null)

  if (
    body !== null &&
    typeof body === "object" &&
    typeof (body as { message?: unknown }).message === "string"
  ) {
    return (body as { message: string }).message
  }

  return `The equipment service responded with ${response.status}. Please try again.`
}