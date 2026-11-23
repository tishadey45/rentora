import { apiFetch } from "@/lib/api-client"

const REQUEST_TIMEOUT_MS = 8000

export const MY_BOOKINGS_ERROR_MESSAGE =
  "We couldn't load your rentals right now. Please try again."

export interface MyBooking {
  id: string
  equipmentId?: string
  equipmentName?: string
  equipmentImage?: string
  startDate?: string
  endDate?: string
  bookingDate?: string
  totalAmount: number
  paymentStatus: string
  bookingStatus: string
}

export type GetMyBookingsResult =
  | { status: "success"; bookings: MyBooking[] }
  | { status: "error"; message: string }

interface BackendBookingRecord {
  id?: unknown
  equipmentId?: unknown
  equipmentName?: unknown
  equipmentImage?: unknown
  startDate?: unknown
  endDate?: unknown
  bookingDate?: unknown
  totalAmount?: unknown
  paymentStatus?: unknown
  bookingStatus?: unknown
}

/**
 * Fetches the signed-in customer's own bookings via the protected backend
 * endpoint. `apiFetch` attaches the Better Auth JWT as `Authorization: Bearer`,
 * and the backend derives the customer identity from that token.
 *
 * The backend responds with `{ success, message, data: <record>[] }`.
 */
export async function getMyBookings(): Promise<GetMyBookingsResult> {
  try {
    const response = await apiFetch("/api/v1/bookings/my-bookings", {
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
        message: "You don't have permission to view these rentals.",
      }
    }

    if (!response.ok) {
      return {
        status: "error",
        message: `The rentals service responded with ${response.status}. Please try again.`,
      }
    }

    const payload: unknown = await response.json()
    const records = extractBookingRecords(payload)

    if (!records) {
      return {
        status: "error",
        message: "The rentals service returned an unexpected response.",
      }
    }

    return { status: "success", bookings: records.map(mapBookingRecord) }
  } catch {
    return { status: "error", message: MY_BOOKINGS_ERROR_MESSAGE }
  }
}

function extractBookingRecords(
  payload: unknown
): BackendBookingRecord[] | null {
  if (Array.isArray(payload)) {
    return payload as BackendBookingRecord[]
  }

  if (typeof payload !== "object" || payload === null) {
    return null
  }

  const record = payload as Record<string, unknown>

  if (Array.isArray(record.data)) {
    return record.data as BackendBookingRecord[]
  }

  return null
}

function mapBookingRecord(record: BackendBookingRecord): MyBooking {
  return {
    id: asString(record.id),
    equipmentId: asOptionalString(record.equipmentId),
    equipmentName: asOptionalString(record.equipmentName),
    equipmentImage: asOptionalString(record.equipmentImage),
    startDate: asOptionalString(record.startDate),
    endDate: asOptionalString(record.endDate),
    bookingDate: asOptionalString(record.bookingDate),
    totalAmount: asNumber(record.totalAmount),
    paymentStatus: asString(record.paymentStatus),
    bookingStatus: asString(record.bookingStatus),
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
