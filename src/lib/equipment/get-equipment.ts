import type {
  EquipmentAvailability,
  EquipmentCategory,
  RentalType,
} from "@/types/equipment"
import type {
  EquipmentDetails,
  EquipmentOwnerDetail,
} from "@/types/equipment-details"

const REQUEST_TIMEOUT_MS = 8000

export type GetEquipmentResult =
  | { status: "success"; equipment: EquipmentDetails }
  | { status: "invalid" }
  | { status: "not-found" }
  | { status: "error"; message: string }

export async function getEquipmentById(
  id: string
): Promise<GetEquipmentResult> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "")

  if (!apiUrl) {
    return {
      status: "error",
      message: "The equipment service is not configured.",
    }
  }

  try {
    const response = await fetch(
      `${apiUrl}/api/v1/equipment/${encodeURIComponent(id)}`,
      {
        cache: "no-store",
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      }
    )

    if (response.status === 400) {
      return { status: "invalid" }
    }

    if (response.status === 404) {
      return { status: "not-found" }
    }

    if (!response.ok) {
      return {
        status: "error",
        message: `The equipment service responded with an unexpected status (${response.status}).`,
      }
    }

    const equipment = mapEquipment(await response.json())

    if (!equipment) {
      return {
        status: "error",
        message: "The equipment service returned an unexpected response.",
      }
    }

    return { status: "success", equipment }
  } catch {
    return {
      status: "error",
      message: "We couldn't reach the equipment service. Please try again.",
    }
  }
}

function mapEquipment(payload: unknown): EquipmentDetails | null {
  if (typeof payload !== "object" || payload === null) {
    return null
  }

  const record = payload as Record<string, unknown>

  if (typeof record._id !== "string" || typeof record.name !== "string") {
    return null
  }

  return {
    id: record._id,
    name: record.name,
    description: asString(record.description),
    category: record.category as EquipmentCategory,
    rentalPrice: asNumber(record.rentalPrice),
    rentalType: record.rentalType as RentalType,
    location: asString(record.location),
    availableQuantity: asNumber(record.availableQuantity),
    availability: record.availability as EquipmentAvailability,
    image: asString(record.image),
    imageAlt: asOptionalString(record.imageAlt),
    owner: mapOwner(record.owner),
    isApproved: record.isApproved === true,
    brand: asOptionalString(record.brand),
    model: asOptionalString(record.model),
    condition: asOptionalString(record.condition),
    rentalTerms: asOptionalString(record.rentalTerms),
  }
}

function mapOwner(value: unknown): EquipmentOwnerDetail {
  if (typeof value !== "object" || value === null) {
    return { id: "", name: "Unknown owner", verified: false }
  }

  const record = value as Record<string, unknown>

  return {
    id: asString(record.id),
    name: asString(record.name) || "Unknown owner",
    verified: record.verified === true,
    email: asOptionalString(record.email),
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