"use client"

import { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"

import {
  AlertTriangle,
  ImageOff,
  Plus,
  RefreshCw,
  Wrench,
} from "lucide-react"
import toast from "react-hot-toast"

import { DashboardEmptyState } from "@/components/dashboard/empty-state"
import { DashboardTable } from "@/components/dashboard/dashboard-table"
import { StatusBadge } from "@/components/dashboard/status-badge"
import { Button, buttonVariants } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { TableCell, TableRow } from "@/components/ui/table"
import { formatCurrency } from "@/lib/format"
import { cn } from "cn"
import { getMyEquipment, type MyEquipmentItem } from "@/lib/equipment/get-my-equipment"
import { deleteEquipment } from "@/lib/equipment/delete-equipment"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

type ListState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "success"; items: MyEquipmentItem[] }

function MyEquipmentList() {
  const [state, setState] = useState<ListState>({ status: "loading" })
  const [reloadKey, setReloadKey] = useState(0)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleteItem, setDeleteItem] = useState<MyEquipmentItem | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    let active = true

    async function load() {
      const result = await getMyEquipment()
      if (!active) return
      if (result.status === "error") {
        setState({ status: "error", message: result.message })
        toast.error(result.message)
        return
      }
      setState({ status: "success", items: result.items })
    }

    load()

    return () => {
      active = false
    }
  }, [reloadKey])

  const handleRetry = useCallback(() => {
    setReloadKey((key) => key + 1)
  }, [])

  const handleDeleteConfirm = useCallback(async () => {
    if (!deleteItem) return
    setDeletingId(deleteItem.id)
    const result = await deleteEquipment(deleteItem.id)
    setDeletingId(null)
    setDeleteOpen(false)
    setDeleteItem(null)
    if (result.status === "error") {
      toast.error(result.message)
      return
    }
    toast.success("Equipment deleted successfully.")
    setReloadKey((key) => key + 1)
  }, [deleteItem])

  if (state.status === "loading") {
    return <MyEquipmentSkeleton />
  }

  if (state.status === "error") {
    return (
      <DashboardEmptyState
        title="Couldn't load your equipment"
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

  if (state.items.length === 0) {
    return (
      <DashboardEmptyState
        title="No equipment listed yet"
        description="Add your first equipment listing to start receiving rental requests."
        icon={Wrench}
        action={
          <Link
            href="/dashboard/add-equipment"
            className={cn(
              buttonVariants({ variant: "brand", size: "lg" }),
              "flex items-center gap-1.5"
            )}
          >
            <Plus aria-hidden="true" />
            Add Equipment
          </Link>
        }
      />
    )
  }

  return (
    <>
      <MyEquipmentTable
        items={state.items}
        onDeleteClick={(item) => {
          setDeleteItem(item)
          setDeleteOpen(true)
        }}
        deletingId={deletingId}
      />
      <DeleteConfirmationDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        item={deleteItem}
        deletingId={deletingId}
        onConfirm={handleDeleteConfirm}
      />
    </>
  )
}

function DeleteConfirmationDialog({
  open,
  onOpenChange,
  item,
  deletingId,
  onConfirm,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  item: MyEquipmentItem | null
  deletingId: string | null
  onConfirm: () => void
}) {
  if (!item) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete {item.name}?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. The listing will be removed from
            your equipment.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter showCloseButton>
          <DialogClose render={<Button variant="outline" />}>
            Cancel
          </DialogClose>
          <DialogClose
            render={
              <Button
                variant="destructive"
                onClick={onConfirm}
                disabled={deletingId === item.id}
              >
                {deletingId === item.id ? "Deleting..." : "Delete"}
              </Button>
            }
          >
            Delete
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function MyEquipmentTable({ 
  items, 
  onDeleteClick,
  deletingId,
}: { 
  items: MyEquipmentItem[] 
  onDeleteClick: (item: MyEquipmentItem) => void
  deletingId: string | null
}) {
  const showCreated = items.some((item) => item.createdAt)

  const headers = [
    "Equipment",
    "Category",
    "Rental Price",
    "Availability",
    "Quantity",
    "Approval",
    ...(showCreated ? ["Created"] : []),
    "Actions",
  ]

  return (
    <DashboardTable headers={headers} minWidthClassName="min-w-[1080px]">
      {items.map((item) => (
        <TableRow key={item.id}>
          <TableCell>
            <div className="flex items-center gap-3">
              <EquipmentThumbnail src={item.image} alt={item.name} />
              <div className="min-w-0">
                <p className="truncate font-medium">{item.name}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {[item.brand, item.model].filter(Boolean).join(" ") ||
                    item.location}
                </p>
              </div>
            </div>
          </TableCell>
          <TableCell>{item.category}</TableCell>
          <TableCell className="font-medium">
            {formatCurrency(item.rentalPrice)}
            <span className="ml-1 text-xs font-normal text-muted-foreground">
              / {item.rentalType.toLowerCase()}
            </span>
          </TableCell>
          <TableCell>
            <StatusBadge status={item.availability} />
          </TableCell>
          <TableCell className="text-center">{item.availableQuantity}</TableCell>
          <TableCell>
            <StatusBadge status={item.isApproved ? "approved" : "pending"} />
          </TableCell>
          {showCreated ? (
            <TableCell className="text-muted-foreground text-center">
              {formatCreatedAt(item.createdAt ?? "")}
            </TableCell>
          ) : null}
          <TableCell>
            <div className="flex flex-wrap gap-1.5">
              <Link
                href={`/equipment/${item.id}`}
                aria-label={`View details for ${item.name}`}
                className={cn(
                  buttonVariants({ variant: "outline", size: "sm" }),
                  "h-9"
                )}
              >
                View
              </Link>
              <Link
                href={`/dashboard/edit-equipment/${item.id}`}
                aria-label={`Edit ${item.name}`}
                className={cn(
                  buttonVariants({ variant: "outline", size: "sm" }),
                  "h-9"
                )}
              >
                Update
              </Link>
              <Button
                variant="destructive"
                size="sm"
                disabled={deletingId === item.id}
                onClick={() => onDeleteClick(item)}
              >
                {deletingId === item.id ? "Deleting..." : "Delete"}
              </Button>
            </div>
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
  src: string
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

function MyEquipmentSkeleton() {
  return (
    <Card className="overflow-hidden p-0">
      <div className="border-b border-border bg-muted/60 p-3">
        <Skeleton className="h-4 w-36" />
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
            <Skeleton className="hidden h-6 w-16 sm:block" />
            <Skeleton className="h-9 w-16" />
          </div>
        ))}
      </div>
    </Card>
  )
}

function formatCreatedAt(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return "—"
  }
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

export { MyEquipmentList }
