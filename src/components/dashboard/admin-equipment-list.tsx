"use client"

import {
  useCallback,
  useEffect,
  useState,
  type FormEvent,
  type ReactNode,
} from "react"
import Image from "next/image"

import { AlertTriangle, Boxes, ImageOff, RefreshCw } from "lucide-react"
import toast from "react-hot-toast"

import { DashboardEmptyState } from "@/components/dashboard/empty-state"
import { DashboardTable } from "@/components/dashboard/dashboard-table"
import { StatusBadge } from "@/components/dashboard/status-badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { Textarea } from "@/components/ui/textarea"
import { TableCell, TableRow } from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { EQUIPMENT_CATEGORIES } from "@/types/equipment"
import { formatCurrency } from "@/lib/format"
import {
  getAdminEquipment,
  type AdminEquipment,
  type AdminEquipmentStatus,
} from "@/lib/admin/get-equipment"
import { updateEquipmentStatus } from "@/lib/admin/update-equipment-status"
import { updateAdminEquipment } from "@/lib/admin/update-admin-equipment"
import { deleteAdminEquipment } from "@/lib/admin/delete-admin-equipment"

const RENTAL_TYPES = ["Daily", "Weekly", "Monthly"]
const CONDITIONS = ["Excellent", "Good", "Fair"]
const AVAILABILITY_OPTIONS = [
  { value: "available", label: "Available" },
  { value: "limited", label: "Limited" },
  { value: "unavailable", label: "Unavailable" },
]

type ListState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "success"; equipment: AdminEquipment[] }

type PendingAction = {
  equipment: AdminEquipment
  status: Extract<AdminEquipmentStatus, "approved" | "rejected">
}

function AdminEquipmentList() {
  const [state, setState] = useState<ListState>({ status: "loading" })
  const [reloadKey, setReloadKey] = useState(0)
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [pendingAction, setPendingAction] = useState<PendingAction | null>(null)
  const [editingEquipment, setEditingEquipment] = useState<AdminEquipment | null>(
    null
  )
  const [deletingEquipment, setDeletingEquipment] =
    useState<AdminEquipment | null>(null)

  useEffect(() => {
    let active = true

    async function load() {
      const result = await getAdminEquipment()
      if (!active) return
      if (result.status === "error") {
        setState({ status: "error", message: result.message })
        toast.error(result.message)
        return
      }
      setState({ status: "success", equipment: result.equipment })
    }

    load()

    return () => {
      active = false
    }
  }, [reloadKey])

  const handleRetry = useCallback(() => {
    setReloadKey((key) => key + 1)
  }, [])

  const applyStatus = useCallback((id: string, status: AdminEquipmentStatus) => {
    setState((prev) =>
      prev.status === "success"
        ? {
            status: "success",
            equipment: prev.equipment.map((item) =>
              item.id === id ? { ...item, status } : item
            ),
          }
        : prev
    )
  }, [])

  const applyEquipmentUpdate = useCallback((updated: AdminEquipment) => {
    setState((prev) =>
      prev.status === "success"
        ? {
            status: "success",
            equipment: prev.equipment.map((item) =>
              // Use the returned data but preserve the current status.
              item.id === updated.id ? { ...updated, status: item.status } : item
            ),
          }
        : prev
    )
  }, [])

  const removeEquipment = useCallback((id: string) => {
    setState((prev) =>
      prev.status === "success"
        ? {
            status: "success",
            equipment: prev.equipment.filter((item) => item.id !== id),
          }
        : prev
    )
  }, [])

  const handleConfirmStatus = useCallback(async () => {
    if (!pendingAction) return
    const { equipment, status } = pendingAction
    setUpdatingId(equipment.id)
    const result = await updateEquipmentStatus(equipment.id, status)
    setUpdatingId(null)
    setPendingAction(null)
    if (result.status === "error") {
      toast.error(result.message)
      return
    }
    toast.success(
      status === "approved"
        ? `${equipment.name} has been approved.`
        : `${equipment.name} has been rejected.`
    )
    applyStatus(equipment.id, status)
  }, [pendingAction, applyStatus])

  const handleDeleteConfirm = useCallback(async () => {
    if (!deletingEquipment) return
    const target = deletingEquipment
    setDeletingId(target.id)
    const result = await deleteAdminEquipment(target.id)
    setDeletingId(null)
    setDeletingEquipment(null)
    if (result.status === "error") {
      toast.error(result.message)
      return
    }
    toast.success(`${target.name} has been deleted.`)
    removeEquipment(target.id)
  }, [deletingEquipment, removeEquipment])

  if (state.status === "loading") {
    return <AdminEquipmentSkeleton />
  }

  if (state.status === "error") {
    return (
      <DashboardEmptyState
        title="Couldn't load equipment"
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

  if (state.equipment.length === 0) {
    return (
      <DashboardEmptyState
        title="No equipment found"
        description="Marketplace listings will appear here."
        icon={Boxes}
      />
    )
  }

  return (
    <>
      <DashboardTable
        headers={[
          "Equipment",
          "Category",
          "Brand",
          "Model",
          "Condition",
          "Rental Price",
          "Rental Type",
          "Location",
          "Available Quantity",
          "Availability",
          "Owner",
          "Status",
          "Actions",
        ]}
        minWidthClassName="min-w-[1700px]"
      >
        {state.equipment.map((item) => {
          const rowBusy = updatingId === item.id || deletingId === item.id

          return (
            <TableRow key={item.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <EquipmentThumbnail src={item.image} alt={item.name} />
                  <div className="min-w-0">
                    <p className="truncate font-medium">{item.name || "—"}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {item.id || "—"}
                    </p>
                  </div>
                </div>
              </TableCell>
              <TableCell>{item.category || "—"}</TableCell>
              <TableCell>{item.brand || "—"}</TableCell>
              <TableCell>{item.model || "—"}</TableCell>
              <TableCell>{item.condition || "—"}</TableCell>
              <TableCell className="font-medium">
                {formatCurrency(item.rentalPrice)}
              </TableCell>
              <TableCell>{item.rentalType || "—"}</TableCell>
              <TableCell>{item.location || "—"}</TableCell>
              <TableCell className="text-center">
                {item.availableQuantity}
              </TableCell>
              <TableCell className="capitalize">
                {item.availability || "—"}
              </TableCell>
              <TableCell>
                <div className="min-w-0">
                  <p className="truncate font-medium">
                    {item.ownerName || "—"}
                  </p>
                  {item.ownerEmail ? (
                    <p className="truncate text-xs text-muted-foreground">
                      {item.ownerEmail}
                    </p>
                  ) : null}
                </div>
              </TableCell>
              <TableCell>
                <StatusBadge status={item.status} />
              </TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1.5">
                  {item.status !== "approved" ? (
                    <Button
                      type="button"
                      size="sm"
                      disabled={rowBusy}
                      onClick={() =>
                        setPendingAction({ equipment: item, status: "approved" })
                      }
                    >
                      Approve
                    </Button>
                  ) : null}
                  {item.status !== "rejected" ? (
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      disabled={rowBusy}
                      onClick={() =>
                        setPendingAction({ equipment: item, status: "rejected" })
                      }
                    >
                      Reject
                    </Button>
                  ) : null}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={rowBusy}
                    onClick={() => setEditingEquipment(item)}
                  >
                    Update
                  </Button>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    disabled={rowBusy}
                    onClick={() => setDeletingEquipment(item)}
                  >
                    Delete
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          )
        })}
      </DashboardTable>

      <Dialog
        open={pendingAction !== null}
        onOpenChange={(open) => {
          if (!open) setPendingAction(null)
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {pendingAction?.status === "approved" ? "Approve" : "Reject"}{" "}
              {pendingAction?.equipment.name || "this listing"}?
            </DialogTitle>
            <DialogDescription>
              {pendingAction?.status === "approved"
                ? "This listing will be marked as approved."
                : "This listing will be marked as rejected."}
            </DialogDescription>
          </DialogHeader>

          <DialogFooter showCloseButton>
            <DialogClose render={<Button variant="outline" />}>
              Cancel
            </DialogClose>
            <DialogClose
              render={
                <Button
                  variant={
                    pendingAction?.status === "approved"
                      ? "default"
                      : "destructive"
                  }
                  onClick={handleConfirmStatus}
                  disabled={updatingId === pendingAction?.equipment.id}
                >
                  {updatingId === pendingAction?.equipment.id
                    ? "Saving..."
                    : pendingAction?.status === "approved"
                      ? "Approve"
                      : "Reject"}
                </Button>
              }
            >
              Confirm
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {editingEquipment ? (
        <AdminEquipmentEditDialog
          equipment={editingEquipment}
          onClose={() => setEditingEquipment(null)}
          onSaved={(updated) => {
            applyEquipmentUpdate(updated)
            setEditingEquipment(null)
          }}
        />
      ) : null}

      {deletingEquipment ? (
        <Dialog
          open
          onOpenChange={(open) => {
            if (!open) setDeletingEquipment(null)
          }}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                Delete {deletingEquipment.name || "this listing"}?
              </DialogTitle>
              <DialogDescription>
                This will permanently delete this equipment listing. This
                action cannot be undone.
              </DialogDescription>
            </DialogHeader>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setDeletingEquipment(null)}
                disabled={deletingId === deletingEquipment.id}
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="destructive"
                onClick={handleDeleteConfirm}
                disabled={deletingId === deletingEquipment.id}
              >
                {deletingId === deletingEquipment.id
                  ? "Deleting..."
                  : "Delete permanently"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      ) : null}
    </>
  )
}

type EditFormValues = {
  name: string
  description: string
  category: string
  location: string
  brand: string
  model: string
  condition: string
  rentalPrice: string
  rentalType: string
  availableQuantity: string
  availability: string
  image: string
  imageAlt: string
  rentalTerms: string
}

function AdminEquipmentEditDialog({
  equipment,
  onClose,
  onSaved,
}: {
  equipment: AdminEquipment
  onClose: () => void
  onSaved: (updated: AdminEquipment) => void
}) {
  const [values, setValues] = useState<EditFormValues>(() => ({
    name: equipment.name,
    description: equipment.description,
    category: equipment.category,
    location: equipment.location,
    brand: equipment.brand ?? "",
    model: equipment.model ?? "",
    condition: equipment.condition ?? CONDITIONS[0],
    rentalPrice: String(equipment.rentalPrice),
    rentalType: equipment.rentalType,
    availableQuantity: String(equipment.availableQuantity),
    availability: equipment.availability,
    image: equipment.image,
    imageAlt: equipment.imageAlt ?? "",
    rentalTerms: equipment.rentalTerms ?? "",
  }))
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)

  function update(field: keyof EditFormValues, value: string) {
    setValues((prev) => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const validation = validateEditForm(values)
    if (Object.keys(validation).length > 0) {
      setErrors(validation)
      return
    }

    setErrors({})
    setSubmitting(true)

    const result = await updateAdminEquipment(equipment.id, {
      name: values.name.trim(),
      description: values.description.trim(),
      category: values.category,
      rentalPrice: Number(values.rentalPrice),
      rentalType: values.rentalType,
      location: values.location.trim(),
      availableQuantity: Number(values.availableQuantity),
      availability: values.availability,
      image: values.image.trim(),
      imageAlt: values.imageAlt.trim(),
      brand: values.brand.trim(),
      model: values.model.trim(),
      condition: values.condition,
      rentalTerms: values.rentalTerms.trim(),
    })

    setSubmitting(false)

    if (result.status === "error") {
      // Keep the dialog open with the entered values.
      toast.error(result.message)
      return
    }

    toast.success(`${result.equipment.name || equipment.name} has been updated.`)
    onSaved(result.equipment)
  }

  const categoryOptions = ensureOption(
    EQUIPMENT_CATEGORIES as readonly string[],
    values.category
  )
  const rentalTypeOptions = ensureOption(RENTAL_TYPES, values.rentalType)
  const conditionOptions = ensureOption(CONDITIONS, values.condition)
  const availabilityOptions = AVAILABILITY_OPTIONS.some(
    (option) => option.value === values.availability
  )
    ? AVAILABILITY_OPTIONS
    : [
        { value: values.availability, label: capitalize(values.availability) },
        ...AVAILABILITY_OPTIONS,
      ]

  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) onClose()
      }}
    >
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            Update {equipment.name || "equipment"}
          </DialogTitle>
          <DialogDescription>
            Edit this listing. The approval status is not changed here.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
          <div className="grid max-h-[60vh] gap-4 overflow-y-auto pr-1 sm:grid-cols-2">
            <Field label="Equipment Name" htmlFor="edit-name" error={errors.name}>
              <Input
                id="edit-name"
                value={values.name}
                onChange={(event) => update("name", event.target.value)}
                aria-invalid={Boolean(errors.name)}
              />
            </Field>

            <Field
              label="Category"
              htmlFor="edit-category"
            >
              <Select
                value={values.category}
                onValueChange={(value) => update("category", value as string)}
              >
                <SelectTrigger id="edit-category" className="w-full">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categoryOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            <Field label="Rental Price" htmlFor="edit-price" error={errors.rentalPrice}>
              <Input
                id="edit-price"
                type="number"
                min="0"
                step="0.01"
                value={values.rentalPrice}
                onChange={(event) => update("rentalPrice", event.target.value)}
                aria-invalid={Boolean(errors.rentalPrice)}
              />
            </Field>

            <Field label="Rental Type" htmlFor="edit-rental-type">
              <Select
                value={values.rentalType}
                onValueChange={(value) => update("rentalType", value as string)}
              >
                <SelectTrigger id="edit-rental-type" className="w-full">
                  <SelectValue placeholder="Select rental type" />
                </SelectTrigger>
                <SelectContent>
                  {rentalTypeOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            <Field
              label="Available Quantity"
              htmlFor="edit-quantity"
              error={errors.availableQuantity}
            >
              <Input
                id="edit-quantity"
                type="number"
                min="1"
                step="1"
                value={values.availableQuantity}
                onChange={(event) =>
                  update("availableQuantity", event.target.value)
                }
                aria-invalid={Boolean(errors.availableQuantity)}
              />
            </Field>

            <Field label="Availability" htmlFor="edit-availability">
              <Select
                value={values.availability}
                onValueChange={(value) =>
                  update("availability", value as string)
                }
              >
                <SelectTrigger id="edit-availability" className="w-full">
                  <SelectValue placeholder="Select availability" />
                </SelectTrigger>
                <SelectContent>
                  {availabilityOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            <Field label="Condition" htmlFor="edit-condition">
              <Select
                value={values.condition}
                onValueChange={(value) => update("condition", value as string)}
              >
                <SelectTrigger id="edit-condition" className="w-full">
                  <SelectValue placeholder="Select condition" />
                </SelectTrigger>
                <SelectContent>
                  {conditionOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            <Field label="Location" htmlFor="edit-location" error={errors.location}>
              <Input
                id="edit-location"
                value={values.location}
                onChange={(event) => update("location", event.target.value)}
                aria-invalid={Boolean(errors.location)}
              />
            </Field>

            <Field label="Brand" htmlFor="edit-brand">
              <Input
                id="edit-brand"
                value={values.brand}
                onChange={(event) => update("brand", event.target.value)}
              />
            </Field>

            <Field label="Model" htmlFor="edit-model">
              <Input
                id="edit-model"
                value={values.model}
                onChange={(event) => update("model", event.target.value)}
              />
            </Field>

            <Field label="Image URL" htmlFor="edit-image" error={errors.image}>
              <Input
                id="edit-image"
                value={values.image}
                onChange={(event) => update("image", event.target.value)}
                aria-invalid={Boolean(errors.image)}
              />
            </Field>

            <Field label="Image Alt Text" htmlFor="edit-image-alt">
              <Input
                id="edit-image-alt"
                value={values.imageAlt}
                onChange={(event) => update("imageAlt", event.target.value)}
              />
            </Field>

            <Field
              label="Description"
              htmlFor="edit-description"
              error={errors.description}
              className="sm:col-span-2"
            >
              <Textarea
                id="edit-description"
                rows={3}
                value={values.description}
                onChange={(event) => update("description", event.target.value)}
                aria-invalid={Boolean(errors.description)}
              />
            </Field>

            <Field
              label="Rental Terms"
              htmlFor="edit-rental-terms"
              error={errors.rentalTerms}
              className="sm:col-span-2"
            >
              <Textarea
                id="edit-rental-terms"
                rows={3}
                value={values.rentalTerms}
                onChange={(event) => update("rentalTerms", event.target.value)}
                aria-invalid={Boolean(errors.rentalTerms)}
              />
            </Field>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? "Saving..." : "Save changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function Field({
  label,
  htmlFor,
  error,
  className,
  children,
}: {
  label: string
  htmlFor: string
  error?: string
  className?: string
  children: ReactNode
}) {
  return (
    <div className={className}>
      <div className="space-y-1.5">
        <Label htmlFor={htmlFor}>{label}</Label>
        {children}
        {error ? <p className="text-xs text-destructive">{error}</p> : null}
      </div>
    </div>
  )
}

function validateEditForm(values: EditFormValues): Record<string, string> {
  const errors: Record<string, string> = {}

  if (!values.name.trim()) {
    errors.name = "Equipment name is required."
  }

  if (!values.description.trim()) {
    errors.description = "Description is required."
  }

  if (!values.location.trim()) {
    errors.location = "Location is required."
  }

  const price = Number(values.rentalPrice)
  if (!values.rentalPrice.trim() || !Number.isFinite(price) || price <= 0) {
    errors.rentalPrice = "Enter a rental price greater than 0."
  }

  const quantity = Number(values.availableQuantity)
  if (
    !values.availableQuantity.trim() ||
    !Number.isInteger(quantity) ||
    quantity < 1
  ) {
    errors.availableQuantity = "Enter a whole quantity of at least 1."
  }

  if (!values.image.trim()) {
    errors.image = "Image URL is required."
  } else if (!isHttpUrl(values.image.trim())) {
    errors.image = "Enter a valid http(s) image URL."
  }

  if (!values.rentalTerms.trim()) {
    errors.rentalTerms = "Rental terms are required."
  }

  return errors
}

function isHttpUrl(value: string) {
  try {
    const url = new URL(value)
    return url.protocol === "http:" || url.protocol === "https:"
  } catch {
    return false
  }
}

function ensureOption(options: readonly string[], current: string): string[] {
  const list = [...options]
  if (current && !list.includes(current)) {
    list.unshift(current)
  }
  return list
}

function capitalize(value: string) {
  return value ? value.charAt(0).toUpperCase() + value.slice(1) : value
}

function EquipmentThumbnail({ src, alt }: { src: string; alt: string }) {
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

function AdminEquipmentSkeleton() {
  return (
    <Card className="overflow-hidden p-0">
      <div className="border-b border-border bg-muted/60 p-3">
        <Skeleton className="h-4 w-40" />
      </div>
      <div className="divide-y divide-border">
        {Array.from({ length: 5 }, (_, index) => (
          <div key={index} className="flex items-center gap-3 p-3">
            <Skeleton className="size-11 rounded-lg" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-48 max-w-full" />
              <Skeleton className="h-3 w-32" />
            </div>
            <Skeleton className="hidden h-4 w-24 sm:block" />
            <Skeleton className="hidden h-4 w-24 sm:block" />
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-9 w-24" />
          </div>
        ))}
      </div>
    </Card>
  )
}

export { AdminEquipmentList }