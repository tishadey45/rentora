"use client"

import { useCallback, useEffect, useRef, useState } from "react"

import { FeaturedEquipment } from "@/components/home/featured-equipment"
import { FeaturedEquipmentSkeleton } from "@/components/home/featured-equipment-skeleton"
import {
  FEATURED_EQUIPMENT_ERROR_MESSAGE,
  getFeaturedEquipment,
} from "@/lib/equipment/get-featured-equipment"
import type { Equipment } from "@/types/equipment"

function FeaturedEquipmentSection() {
  const [equipment, setEquipment] = useState<Equipment[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [reloadKey, setReloadKey] = useState(0)
  const inFlightRef = useRef(false)

  useEffect(() => {
    let active = true
    inFlightRef.current = true

    async function fetchEquipment() {
      try {
        const result = await getFeaturedEquipment()
        if (!active) return
        setEquipment(result.data ?? [])
        setError(result.error)
      } catch {
        if (!active) return
        setEquipment([])
        setError(FEATURED_EQUIPMENT_ERROR_MESSAGE)
      } finally {
        if (active) {
          setLoading(false)
          inFlightRef.current = false
        }
      }
    }

    fetchEquipment()

    return () => {
      active = false
    }
  }, [reloadKey])

  const handleRetry = useCallback(() => {
    if (inFlightRef.current) return
    setLoading(true)
    setError(null)
    setReloadKey((key) => key + 1)
  }, [])

  if (loading) {
    return <FeaturedEquipmentSkeleton />
  }

  return (
    <FeaturedEquipment
      equipment={equipment}
      error={error}
      onRetry={handleRetry}
    />
  )
}

export { FeaturedEquipmentSection }
