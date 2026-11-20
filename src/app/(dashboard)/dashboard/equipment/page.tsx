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
import { allEquipment } from "@/lib/mock/dashboard"

export default async function AdminEquipmentPage() {
  await requireDashboardRole("admin")

  return (
    <div className="flex flex-col gap-6">
      <DashboardPageHeader
        title="All Equipment"
        description="Review marketplace listings and take action on pending submissions."
      />

      {allEquipment.length === 0 ? (
        <DashboardEmptyState
          title="No equipment found"
          description="Marketplace listings will appear here."
        />
      ) : (
        <DashboardTable
          headers={[
            "Equipment",
            "Owner",
            "Category",
            "Rental Price",
            "Status",
            "Actions",
          ]}
          minWidthClassName="min-w-[1120px]"
        >
          {allEquipment.map((equipment) => (
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
                      {equipment.id}
                    </p>
                  </div>
                </div>
              </TableCell>
              <TableCell>{equipment.ownerName}</TableCell>
              <TableCell>{equipment.category}</TableCell>
              <TableCell className="font-medium">
                {formatCurrency(equipment.rentalPrice)}
                <span className="ml-1 text-xs font-normal text-muted-foreground">
                  / {equipment.rentalType.toLowerCase()}
                </span>
              </TableCell>
              <TableCell>
                <StatusBadge status={equipment.status} />
              </TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1.5">
                  {equipment.status === "pending" ? (
                    <>
                      <ActionDialog
                        triggerLabel="Approve"
                        title={`Approve ${equipment.name}?`}
                        description="This is a UI preview. Approval is not saved."
                        confirmLabel="Approve"
                      >
                        <p className="rounded-lg border border-border bg-muted/50 p-3 text-sm">
                          The listing will remain pending in this static
                          dashboard.
                        </p>
                      </ActionDialog>

                      <ActionDialog
                        triggerLabel="Reject"
                        title={`Reject ${equipment.name}?`}
                        description="This is a UI preview. Rejection is not saved."
                        confirmLabel="Reject"
                        destructive
                      >
                        <p className="rounded-lg border border-border bg-muted/50 p-3 text-sm">
                          The listing will remain pending in this static
                          dashboard.
                        </p>
                      </ActionDialog>
                    </>
                  ) : null}

                  <ActionDialog
                    triggerLabel="Update"
                    triggerVariant="ghost"
                    title="Update equipment"
                    description="This form is a static preview. Changes are not saved."
                    confirmLabel="Save changes"
                  >
                    <div className="grid gap-3">
                      <div className="space-y-1.5">
                        <Label htmlFor={`admin-name-${equipment.id}`}>
                          Equipment name
                        </Label>
                        <Input
                          id={`admin-name-${equipment.id}`}
                          defaultValue={equipment.name}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor={`admin-price-${equipment.id}`}>
                          Rental price
                        </Label>
                        <Input
                          id={`admin-price-${equipment.id}`}
                          type="number"
                          defaultValue={equipment.rentalPrice}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor={`admin-quantity-${equipment.id}`}>
                          Available quantity
                        </Label>
                        <Input
                          id={`admin-quantity-${equipment.id}`}
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
                    description="This is a UI preview. Deletion requires backend integration."
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