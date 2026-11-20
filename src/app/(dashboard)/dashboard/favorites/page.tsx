import Image from "next/image"

import { ActionDialog } from "@/components/dashboard/action-dialog"
import { DashboardEmptyState } from "@/components/dashboard/empty-state"
import { DashboardPageHeader } from "@/components/dashboard/page-header"
import { DashboardTable } from "@/components/dashboard/dashboard-table"
import { StatusBadge } from "@/components/dashboard/status-badge"
import { TableCell, TableRow } from "@/components/ui/table"
import { requireDashboardRole } from "@/lib/dashboard-session"
import { formatCurrency } from "@/lib/format"
import { favoriteEquipment } from "@/lib/mock/dashboard"

export default async function CustomerFavoritesPage() {
  await requireDashboardRole("customer")

  return (
    <div className="flex flex-col gap-6">
      <DashboardPageHeader
        title="Favorites"
        description="Keep track of equipment you want to rent for future projects."
      />

      {favoriteEquipment.length === 0 ? (
        <DashboardEmptyState
          title="No favorites yet"
          description="Save equipment from the marketplace and it will appear here."
        />
      ) : (
        <DashboardTable
          headers={[
            "Equipment",
            "Category",
            "Rental Price",
            "Location",
            "Availability",
            "Actions",
          ]}
          minWidthClassName="min-w-[960px]"
        >
          {favoriteEquipment.map((favorite) => (
            <TableRow key={favorite.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Image
                    src={favorite.image}
                    alt={favorite.name}
                    width={44}
                    height={44}
                    className="size-11 rounded-lg object-cover"
                  />
                  <p className="font-medium">{favorite.name}</p>
                </div>
              </TableCell>
              <TableCell>{favorite.category}</TableCell>
              <TableCell className="font-medium">
                {formatCurrency(favorite.rentalPrice)}
                <span className="ml-1 text-xs font-normal text-muted-foreground">
                  / {favorite.rentalType.toLowerCase()}
                </span>
              </TableCell>
              <TableCell>{favorite.location}</TableCell>
              <TableCell>
                <StatusBadge status={favorite.availability} />
              </TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1.5">
                  <ActionDialog
                    triggerLabel="View Details"
                    title={favorite.name}
                    description="Saved equipment preview."
                    confirmLabel="Close"
                    confirmVariant="outline"
                  >
                    <div className="grid gap-3 rounded-lg border border-border p-4 text-sm">
                      <div className="flex justify-between gap-4">
                        <span className="text-muted-foreground">Category</span>
                        <span className="font-medium">{favorite.category}</span>
                      </div>
                      <div className="flex justify-between gap-4">
                        <span className="text-muted-foreground">Location</span>
                        <span className="font-medium">{favorite.location}</span>
                      </div>
                      <div className="flex justify-between gap-4">
                        <span className="text-muted-foreground">Price</span>
                        <span className="font-medium">
                          {formatCurrency(favorite.rentalPrice)} /{" "}
                          {favorite.rentalType.toLowerCase()}
                        </span>
                      </div>
                    </div>
                  </ActionDialog>

                  <ActionDialog
                    triggerLabel="Remove"
                    triggerVariant="ghost"
                    title="Remove favorite?"
                    description="This is a static preview. Removing favorites will be enabled with backend integration."
                    confirmLabel="Remove Favorite"
                    destructive
                  >
                    <p className="rounded-lg border border-border bg-muted/50 p-3 text-sm">
                      The favorite will remain in the table for this static UI.
                    </p>
                  </ActionDialog>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </DashboardTable>
      )}
    </div>
  )
}