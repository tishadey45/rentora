import Image from "next/image"

import { DashboardEmptyState } from "@/components/dashboard/empty-state"
import { DashboardPageHeader } from "@/components/dashboard/page-header"
import { DashboardTable } from "@/components/dashboard/dashboard-table"
import { StatusBadge } from "@/components/dashboard/status-badge"
import { TableCell, TableRow } from "@/components/ui/table"
import { requireDashboardRole } from "@/lib/dashboard-session"
import { formatCurrency, formatDate } from "@/lib/format"
import { ownerRentals } from "@/lib/mock/dashboard"

export default async function MyEquipmentRentalsPage() {
  await requireDashboardRole("owner")

  return (
    <div className="flex flex-col gap-6">
      <DashboardPageHeader
        title="My Equipment Rentals"
        description="Track bookings for your equipment and keep an eye on upcoming rentals."
      />

      {ownerRentals.length === 0 ? (
        <DashboardEmptyState
          title="No rental bookings"
          description="Bookings for your equipment will appear here."
        />
      ) : (
        <DashboardTable
          headers={[
            "Customer Information",
            "Equipment Information",
            "Rental Duration",
            "Quantity",
            "Booking Amount",
            "Payment",
            "Booking Status",
          ]}
          minWidthClassName="min-w-[1120px]"
        >
          {ownerRentals.map((rental) => (
            <TableRow key={rental.id}>
              <TableCell>
                <div>
                  <p className="font-medium">{rental.customerName}</p>
                  <p className="text-xs text-muted-foreground">
                    {rental.customerEmail}
                  </p>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Image
                    src={rental.equipmentImage}
                    alt={rental.equipmentName}
                    width={44}
                    height={44}
                    className="size-11 rounded-lg object-cover"
                  />
                  <p className="font-medium">{rental.equipmentName}</p>
                </div>
              </TableCell>
              <TableCell>
                {formatDate(rental.startDate)} – {formatDate(rental.endDate)}
              </TableCell>
              <TableCell>{rental.quantity}</TableCell>
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