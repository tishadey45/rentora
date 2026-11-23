import { apiFetch } from "@/lib/api-client"
import type { DashboardRole } from "@/types/dashboard"

const REQUEST_TIMEOUT_MS = 8000

export const ADMIN_USERS_ERROR_MESSAGE =
  "We couldn't load users right now. Please try again."

export type UserAccountStatus = "active" | "inactive"

export interface AdminUser {
  id: string
  name: string
  email: string
  role: DashboardRole
  status: UserAccountStatus
  createdAt?: string
}

export type GetAdminUsersResult =
  | { status: "success"; users: AdminUser[] }
  | { status: "error"; message: string }

interface BackendUserRecord {
  _id?: unknown
  name?: unknown
  email?: unknown
  role?: unknown
  status?: unknown
  createdAt?: unknown
}

/**
 * Fetches all registered users via the protected admin endpoint.
 * `apiFetch` attaches the Better Auth JWT as `Authorization: Bearer`.
 *
 * The backend responds with `{ success, message, data: <record>[] }`.
 */
export async function getAdminUsers(): Promise<GetAdminUsersResult> {
  try {
    const response = await apiFetch("/api/v1/admin/users", {
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
        message: "You don't have permission to view users.",
      }
    }

    if (!response.ok) {
      return {
        status: "error",
        message: `The users service responded with ${response.status}. Please try again.`,
      }
    }

    const payload: unknown = await response.json()
    const records = extractUserRecords(payload)

    if (!records) {
      return {
        status: "error",
        message: "The users service returned an unexpected response.",
      }
    }

    return { status: "success", users: records.map(mapUserRecord) }
  } catch {
    return { status: "error", message: ADMIN_USERS_ERROR_MESSAGE }
  }
}

function extractUserRecords(payload: unknown): BackendUserRecord[] | null {
  if (Array.isArray(payload)) {
    return payload as BackendUserRecord[]
  }

  if (typeof payload !== "object" || payload === null) {
    return null
  }

  const record = payload as Record<string, unknown>

  if (Array.isArray(record.data)) {
    return record.data as BackendUserRecord[]
  }

  return null
}

function mapUserRecord(record: BackendUserRecord): AdminUser {
  return {
    id: asString(record._id),
    name: asString(record.name),
    email: asString(record.email),
    role: asRole(record.role),
    // Users created before the status field existed are treated as active.
    status: record.status === "inactive" ? "inactive" : "active",
    createdAt: asOptionalString(record.createdAt),
  }
}

function asString(value: unknown) {
  return typeof value === "string" ? value : ""
}

function asOptionalString(value: unknown) {
  return typeof value === "string" && value.length > 0 ? value : undefined
}

function asRole(value: unknown): DashboardRole {
  return value === "owner" || value === "admin" ? value : "customer"
}
