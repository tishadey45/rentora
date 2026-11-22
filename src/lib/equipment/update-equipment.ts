import type { EquipmentCategory } from "@/types/equipment"
import { apiFetch } from "@/lib/api-client"

const REQUEST_TIMEOUT_MS = 8000

export type UpdateEquipmentInput = {
  name?: string
  category?: EquipmentCategory
  rentalPrice?: number
  availableQuantity?: number
  description?: string
  image?: string
}

export type UpdateEquipmentResult =
  | { status: "success" }
  | { status: "error"; message: string }

/**
 * Updates an equipment listing via the Rentora backend API.
 * Only sends fields supported by the PATCH /api/v1/equipment/:id endpoint.
 * `apiFetch` attaches the Better Auth JWT as `Authorization: Bearer`.
 */
export async function updateEquipment(
  id: string,
  input: UpdateEquipmentInput
): Promise<UpdateEquipmentResult> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "")

  if (!apiUrl) {
    return {
      status: "error",
      message: "The equipment service is not configured.",
    }
  }

  try {
    const response = await apiFetch(
      `/api/v1/equipment/${encodeURIComponent(id)}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      }
    )

    if (!response.ok) {
      return {
        status: "error",
        message: `The equipment service responded with ${response.status}. Please try again.`,
      }
    }

    return { status: "success" }
  } catch {
    return {
      status: "error",
      message: "We couldn't reach the equipment service. Please try again.",
    }
  }
}
