import Image from "next/image"

import { ActionDialog } from "@/components/dashboard/action-dialog"
import { DashboardEmptyState } from "@/components/dashboard/empty-state"
import { DashboardPageHeader } from "@/components/dashboard/page-header"
import { DashboardTable } from "@/components/dashboard/dashboard-table"
import { StatusBadge } from "@/components/dashboard/status-badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { TableCell, TableRow } from "@/components/ui/table"
import { requireDashboardRole } from "@/lib/dashboard-session"
import { formatCurrency } from "@/lib/format"
import { ownerEquipment } from "@/lib/mock/dashboard"

export default async function MyEquipmentPage() {
  await requireDashboardRole("owner")

  return (
    <div className="flex flex-col gap-6">
      <DashboardPageHeader
        title="My Equipment"
        description="Manage your marketplace listings, availability, and review status."
      />

      {ownerEquipment.length === 0 ? (
        <DashboardEmptyState
          title="No equipment listed"
          description="Add your first equipment listing to start receiving rental requests."
        />
      ) : (
        <DashboardTable
          headers={[
            "Equipment",
            "Category",
            "Rental Price",
            "Available Quantity",
            "Status",
            "Actions",
          ]}
          minWidthClassName="min-w-[1040px]"
        >
          {ownerEquipment.map((equipment) => (
            <TableRow key={equipment.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Image
                    src={equipment.image}
                    alt={equipment.name}
                    width={44}
                    height={44}
                    className="size-11 rounded-lg object-cover"
                  />
                  <div>
                    <p className="font-medium">{equipment.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {equipment.brand} {equipment.model}
                    </p>
                  </div>
                </div>
              </TableCell>
              <TableCell>{equipment.category}</TableCell>
              <TableCell className="font-medium">
                {formatCurrency(equipment.rentalPrice)}
                <span className="ml-1 text-xs font-normal text-muted-foreground">
                  / {equipment.rentalType.toLowerCase()}
                </span>
              </TableCell>
              <TableCell>{equipment.quantity}</TableCell>
              <TableCell>
                <StatusBadge status={equipment.status} />
              </TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1.5">
                  <ActionDialog
                    triggerLabel="View"
                    title={equipment.name}
                    description="Equipment listing details."
                    confirmLabel="Close"
                    confirmVariant="outline"
                  >
                    <div className="grid gap-3 rounded-lg border border-border p-4 text-sm">
                      <div className="flex justify-between gap-4">
                        <span className="text-muted-foreground">Brand</span>
                        <span className="font-medium">{equipment.brand}</span>
                      </div>
                      <div className="flex justify-between gap-4">
                        <span className="text-muted-foreground">Model</span>
                        <span className="font-medium">{equipment.model}</span>
                      </div>
                      <div className="flex justify-between gap-4">
                        <span className="text-muted-foreground">Condition</span>
                        <span className="font-medium">{equipment.condition}</span>
                      </div>
                      <div className="flex justify-between gap-4">
                        <span className="text-muted-foreground">Status</span>
                        <StatusBadge status={equipment.status} />
                      </div>
                    </div>
                  </ActionDialog>

                  <ActionDialog
                    triggerLabel="Update"
                    title="Update equipment"
                    description="This form is a static preview. Changes are not saved."
                    confirmLabel="Save changes"
                  >
                    <div className="grid gap-3">
                      <div className="space-y-1.5">
                        <Label htmlFor={`update-name-${equipment.id}`}>
                          Equipment name
                        </Label>
                        <Input
                          id={`update-name-${equipment.id}`}
                          defaultValue={equipment.name}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor={`update-price-${equipment.id}`}>
                          Rental price
                        </Label>
                        <Input
                          id={`update-price-${equipment.id}`}
                          type="number"
                          defaultValue={equipment.rentalPrice}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor={`update-quantity-${equipment.id}`}>
                          Available quantity
                        </Label>
                        <Input
                          id={`update-quantity-${equipment.id}`}
                          type="number"
                          defaultValue={equipment.quantity}
                        />
                      </div>
                    </div>
                  </ActionDialog>

                  <ActionDialog
                    triggerLabel="Delete"
                    triggerVariant="ghost"
                    title="Delete equipment?"
                    description="This is a UI preview. Listing deletion requires backend integration."
                    confirmLabel="Delete"
                    destructive
                  >
                    <p className="rounded-lg border border-border bg-muted/50 p-3 text-sm">
                      The listing will remain in the table for this static
                      dashboard.
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