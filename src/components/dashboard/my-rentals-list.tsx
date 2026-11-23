"use client"

import { useCallback, useEffect, useState } from "react"
import Image from "next/image"

import { AlertTriangle, ImageOff, PackageCheck, RefreshCw } from "lucide-react"
import toast from "react-hot-toast"

import { DashboardEmptyState } from "@/components/dashboard/empty-state"
import { DashboardTable } from "@/components/dashboard/dashboard-table"
import { StatusBadge } from "@/components/dashboard/status-badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { TableCell, TableRow } from "@/components/ui/table"
import { formatCurrency, formatDate } from "@/lib/format"
import { getMyBookings, type MyBooking } from "@/lib/bookings/get-my-bookings"

type ListState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "success"; bookings: MyBooking[] }

function MyRentalsList() {
  const [state, setState] = useState<ListState>({ status: "loading" })
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    let active = true

    async function load() {
      const result = await getMyBookings()
      if (!active) return
      if (result.status === "error") {
        setState({ status: "error", message: result.message })
        toast.error(result.message)
        return
      }
      setState({ status: "success", bookings: result.bookings })
    }

    load()

    return () => {
      active = false
    }
  }, [reloadKey])

  const handleRetry = useCallback(() => {
    setReloadKey((key) => key + 1)
  }, [])

  if (state.status === "loading") {
    return <MyRentalsSkeleton />
  }

  if (state.status === "error") {
    return (
      <DashboardEmptyState
        title="Couldn't load your rentals"
        description={state.message}
        icon={AlertTriangle}
        action={
          <Button
            type="button"
            variant="outline"
            onClick={handleRetry}
            className="mt-2 flex items-center gap-1.5"
          >
            <RefreshCw aria-hidden="true" />
            Try again
          </Button>
        }
      />
    )
  }

  if (state.bookings.length === 0) {
    return (
      <DashboardEmptyState
        title="No rentals yet"
        description="Your equipment bookings will appear here once you make your first reservation."
        icon={PackageCheck}
      />
    )
  }

  return (
    <DashboardTable
      headers={[
        "Equipment Name",
        "Rental Start Date",
        "Rental End Date",
        "Booking Date",
        "Total Amount",
        "Payment Status",
        "Booking Status",
      ]}
      minWidthClassName="min-w-[1040px]"
    >
      {state.bookings.map((booking) => (
        <TableRow key={booking.id}>
          <TableCell>
            <div className="flex items-center gap-3">
              <EquipmentThumbnail
                src={booking.equipmentImage}
                alt={booking.equipmentName ?? "Equipment"}
              />
              <div className="min-w-0">
                <p className="truncate font-medium">
                  {booking.equipmentName ?? "Unknown equipment"}
                </p>
                {booking.id ? (
                  <p className="truncate text-xs text-muted-foreground">
                    {booking.id}
                  </p>
                ) : null}
              </div>
            </div>
          </TableCell>
          <TableCell>{formatBookingDate(booking.startDate)}</TableCell>
          <TableCell>{formatBookingDate(booking.endDate)}</TableCell>
          <TableCell>{formatBookingDate(booking.bookingDate)}</TableCell>
          <TableCell className="font-medium">
            {formatCurrency(booking.totalAmount)}
          </TableCell>
          <TableCell>
            {booking.paymentStatus ? (
              <StatusBadge status={booking.paymentStatus} />
            ) : (
              "—"
            )}
          </TableCell>
          <TableCell>
            {booking.bookingStatus ? (
              <StatusBadge status={booking.bookingStatus} />
            ) : (
              "—"
            )}
          </TableCell>
        </TableRow>
      ))}
    </DashboardTable>
  )
}

function EquipmentThumbnail({
  src,
  alt,
}: {
  src?: string
  alt: string
}) {
  const [failed, setFailed] = useState(false)

  if (!src || failed) {
    return (
      <div className="grid size-11 shrink-0 place-items-center rounded-lg bg-muted text-muted-foreground">
        <ImageOff aria-hidden="true" className="size-4" />
      </div>
    )
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={44}
      height={44}
      unoptimized
      className="size-11 shrink-0 rounded-lg object-cover"
      loading="lazy"
      onError={() => setFailed(true)}
    />
  )
}

function MyRentalsSkeleton() {
  return (
    <Card className="overflow-hidden p-0">
      <div className="border-b border-border bg-muted/60 p-3">
        <Skeleton className="h-4 w-40" />
      </div>
      <div className="divide-y divide-border">
        {Array.from({ length: 4 }, (_, index) => (
          <div key={index} className="flex items-center gap-3 p-3">
            <Skeleton className="size-11 rounded-lg" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-48 max-w-full" />
              <Skeleton className="h-3 w-32" />
            </div>
            <Skeleton className="hidden h-4 w-24 sm:block" />
            <Skeleton className="hidden h-4 w-24 sm:block" />
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-6 w-20" />
          </div>
        ))}
      </div>
    </Card>
  )
}

/**
 * Formats a booking date. Handles plain `YYYY-MM-DD` values (via the shared
 * `formatDate`) as well as fuller ISO strings, and never crashes on bad data.
 */
function formatBookingDate(value?: string) {
  if (!value) return "—"

  const dateOnly = value.slice(0, 10)
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateOnly)) {
    const parsed = new Date(`${dateOnly}T00:00:00`)
    if (!Number.isNaN(parsed.getTime())) {
      return formatDate(dateOnly)
    }
  }

  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return "—"

  return parsed.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

export { MyRentalsList }