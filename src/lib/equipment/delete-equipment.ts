import { apiFetch } from "@/lib/api-client"

const REQUEST_TIMEOUT_MS = 8000

export type DeleteEquipmentResult =
  | { status: "success" }
  | { status: "error"; message: string }

/**
 * Deletes an equipment listing via the Rentora backend API.
 * `apiFetch` attaches the Better Auth JWT as `Authorization: Bearer`.
 */
export async function deleteEquipment(
  id: string
): Promise<DeleteEquipmentResult> {
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
        method: "DELETE",
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
