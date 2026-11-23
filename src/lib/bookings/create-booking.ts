import { apiFetch } from "@/lib/api-client"

const REQUEST_TIMEOUT_MS = 8000

export interface CreateBookingInput {
  equipmentId: string
  startDate: string
  endDate: string
  quantity: number
  contactNumber: string
  deliveryAddress: string
  notes?: string
}

export type CreateBookingResult =
  | { status: "success" }
  | { status: "error"; message: string }

/**
 * Creates a booking via the protected backend endpoint. `apiFetch` attaches the
 * Better Auth JWT as `Authorization: Bearer`; the customer identity, rental
 * price, and total amount are all derived on the server, never sent here.
 */
export async function createBooking(
  input: CreateBookingInput
): Promise<CreateBookingResult> {
  try {
    const response = await apiFetch("/api/v1/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    })

    if (!response.ok) {
      return { status: "error", message: await readErrorMessage(response) }
    }

    return { status: "success" }
  } catch {
    return {
      status: "error",
      message: "We couldn't reach the booking service. Please try again.",
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

  return `The booking service responded with ${response.status}. Please try again.`
}