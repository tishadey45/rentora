import { cacheLife } from "next/cache"

import { mockEquipment } from "@/lib/equipment/mock-equipment"
import type { Equipment } from "@/types/equipment"

const FEATURED_LIMIT = 6
const REQUEST_TIMEOUT_MS = 8000
const ERROR_MESSAGE =
  "We couldn't load featured equipment right now. Please try again."

export type FeaturedEquipmentResult =
  | { data: Equipment[]; error: null }
  | { data: null; error: string }

export async function getFeaturedEquipment(
  limit = FEATURED_LIMIT
): Promise<FeaturedEquipmentResult> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "")

  if (!apiUrl) {
    return {
      data: mockEquipment
        .filter((equipment) => equipment.isApproved)
        .slice(0, limit),
      error: null,
    }
  }

  try {
    const equipment = await fetchFeaturedEquipment(apiUrl, limit)

    return {
      data: equipment
        .filter((item) => item.isApproved !== false)
        .slice(0, limit),
      error: null,
    }
  } catch {
    return { data: null, error: ERROR_MESSAGE }
  }
}

async function fetchFeaturedEquipment(
  apiUrl: string,
  limit: number
): Promise<Equipment[]> {
  "use cache"
  cacheLife("minutes")

  const response = await fetch(
    `${apiUrl}/api/equipment?status=approved&limit=${limit}`,
    { signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS) }
  )

  if (!response.ok) {
    throw new Error(`Equipment API responded with ${response.status}`)
  }

  const payload: unknown = await response.json()
  const equipment = extractEquipment(payload)

  if (!equipment) {
    throw new Error("Equipment API returned an unexpected response shape")
  }

  return equipment
}

function extractEquipment(payload: unknown): Equipment[] | null {
  if (Array.isArray(payload)) {
    return payload as Equipment[]
  }

  if (typeof payload !== "object" || payload === null) {
    return null
  }

  const record = payload as Record<string, unknown>

  if (Array.isArray(record.data)) {
    return record.data as Equipment[]
  }

  if (Array.isArray(record.equipment)) {
    return record.equipment as Equipment[]
  }

  return null
}