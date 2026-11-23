import { apiFetch } from "@/lib/api-client"
import type { AdminEquipmentStatus } from "@/lib/admin/get-equipment"

const REQUEST_TIMEOUT_MS = 8000

export type UpdateEquipmentStatusResult =
  | { status: "success" }
  | { status: "error"; message: string }

/**
 * Approves, rejects, or resets an equipment listing via the protected admin
 * endpoint. `apiFetch` attaches the Better Auth JWT as `Authorization: Bearer`.
 */
export async function updateEquipmentStatus(
  id: string,
  status: AdminEquipmentStatus
): Promise<UpdateEquipmentStatusResult> {
  try {
    const response = await apiFetch(
      `/api/v1/admin/equipment/${encodeURIComponent(id)}/status`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      }
    )

    if (!response.ok) {
      return { status: "error", message: await readErrorMessage(response) }
    }

    return { status: "success" }
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
