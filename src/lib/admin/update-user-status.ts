import { apiFetch } from "@/lib/api-client"
import type { UserAccountStatus } from "@/lib/admin/get-users"

const REQUEST_TIMEOUT_MS = 8000

export type UpdateUserStatusResult =
  | { status: "success" }
  | { status: "error"; message: string }

/**
 * Activates or deactivates a user account via the protected admin endpoint.
 * `apiFetch` attaches the Better Auth JWT as `Authorization: Bearer`.
 */
export async function updateUserStatus(
  id: string,
  status: UserAccountStatus
): Promise<UpdateUserStatusResult> {
  try {
    const response = await apiFetch(
      `/api/v1/admin/users/${encodeURIComponent(id)}/status`,
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
      message: "We couldn't reach the users service. Please try again.",
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

  return `The users service responded with ${response.status}. Please try again.`
}
