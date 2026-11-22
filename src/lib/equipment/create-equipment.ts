import type {
  EquipmentAvailability,
  EquipmentCategory,
  RentalType,
} from "@/types/equipment"

import { apiFetch } from "@/lib/api-client"

const REQUEST_TIMEOUT_MS = 8000

export type CreateEquipmentOwner = {
  id: string
  name: string
  email: string
  verified: boolean
}

export type CreateEquipmentInput = {
  name: string
  description: string
  category: EquipmentCategory
  brand?: string
  model?: string
  condition: string
  rentalPrice: number
  rentalType: RentalType
  location: string
  availableQuantity: number
  availability: EquipmentAvailability
  image: string
  imageAlt?: string
  rentalTerms: string
  owner: CreateEquipmentOwner
}

export type CreateEquipmentResult =
  | { status: "success" }
  | { status: "error"; message: string }

/**
 * Creates an equipment listing via the Rentora backend API.
 * New listings are submitted unapproved, matching the existing backend convention.
 */
export async function createEquipment(
  input: CreateEquipmentInput
): Promise<CreateEquipmentResult> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "")

  if (!apiUrl) {
    return {
      status: "error",
      message: "The equipment service is not configured.",
    }
  }

  try {
    const response = await apiFetch("/api/v1/equipment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...input, isApproved: false }),
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    })

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