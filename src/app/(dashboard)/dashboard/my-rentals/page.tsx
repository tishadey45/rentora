import Image from "next/image"

import { DashboardEmptyState } from "@/components/dashboard/empty-state"
import { DashboardPageHeader } from "@/components/dashboard/page-header"
import { DashboardTable } from "@/components/dashboard/dashboard-table"
import { StatusBadge } from "@/components/dashboard/status-badge"
import { TableCell, TableRow } from "@/components/ui/table"
import { requireDashboardRole } from "@/lib/dashboard-session"
import { formatCurrency, formatDate } from "@/lib/format"
import { customerRentals } from "@/lib/mock/dashboard"

export default async function CustomerRentalsPage() {
  await requireDashboardRole("customer")

  return (
    <div className="flex flex-col gap-6">
      <DashboardPageHeader
        title="My Rentals"
        description="Review your equipment bookings, payment status, and rental progress."
      />

      {customerRentals.length === 0 ? (
        <DashboardEmptyState
          title="No rentals yet"
          description="Your equipment bookings will appear here once you make your first reservation."
        />
      ) : (
        <DashboardTable
          headers={[
            "Equipment",
            "Rental Start",
            "Rental End",
            "Booking Date",
            "Total Amount",
            "Payment",
            "Booking Status",
          ]}
          minWidthClassName="min-w-[1040px]"
        >
          {customerRentals.map((rental) => (
            <TableRow key={rental.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Image
                    src={rental.equipmentImage}
                    alt={rental.equipmentName}
                    width={44}
                    height={44}
                    className="size-11 rounded-lg object-cover"
                  />
                  <div>
                    <p className="font-medium">{rental.equipmentName}</p>
                    <p className="text-xs text-muted-foreground">{rental.id}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell>{formatDate(rental.startDate)}</TableCell>
              <TableCell>{formatDate(rental.endDate)}</TableCell>
              <TableCell>{formatDate(rental.bookingDate)}</TableCell>
              <TableCell className="font-medium">
                {formatCurrency(rental.totalAmount)}
              </TableCell>
              <TableCell>
                <StatusBadge status={rental.paymentStatus} />
              </TableCell>
              <TableCell>
                <StatusBadge status={rental.bookingStatus} />
              </TableCell>
            </TableRow>
          ))}
        </DashboardTable>
      )}
    </div>
  )
}