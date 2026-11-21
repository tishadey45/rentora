"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ImageOff } from "lucide-react"
import toast from "react-hot-toast"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Muted } from "@/components/ui/typography"
import { createEquipment } from "@/lib/equipment/create-equipment"
import {
  EQUIPMENT_CATEGORIES,
  type EquipmentAvailability,
  type EquipmentCategory,
  type RentalType,
} from "@/types/equipment"

const rentalTypes: RentalType[] = ["Daily", "Weekly", "Monthly"]

const conditions = ["Excellent", "Good", "Fair"]

const availabilityOptions: { value: EquipmentAvailability; label: string }[] = [
  { value: "available", label: "Available" },
  { value: "limited", label: "Limited" },
  { value: "unavailable", label: "Unavailable" },
]

type FormValues = {
  name: string
  description: string
  category: EquipmentCategory
  location: string
  brand: string
  model: string
  condition: string
  rentalPrice: string
  rentalType: RentalType
  availableQuantity: string
  availability: EquipmentAvailability
  image: string
  imageAlt: string
  rentalTerms: string
}

const initialValues: FormValues = {
  name: "",
  description: "",
  category: "Construction",
  location: "",
  brand: "",
  model: "",
  condition: "Excellent",
  rentalPrice: "",
  rentalType: "Daily",
  availableQuantity: "1",
  availability: "available",
  image: "",
  imageAlt: "",
  rentalTerms: "",
}

function isHttpUrl(value: string) {
  try {
    const url = new URL(value)
    return url.protocol === "http:" || url.protocol === "https:"
  } catch {
    return false
  }
}

function validate(values: FormValues): Record<string, string> {
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

function Field({
  label,
  htmlFor,
  required = false,
  hint,
  error,
  children,
}: {
  label: string
  htmlFor: string
  required?: boolean
  hint?: string
  error?: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={htmlFor}>
        {label}
        {required ? (
          <span aria-hidden="true" className="text-danger">
            *
          </span>
        ) : null}
      </Label>
      {children}
      {error ? (
        <p className="text-xs font-medium text-danger">{error}</p>
      ) : hint ? (
        <Muted className="text-xs">{hint}</Muted>
      ) : null}
    </div>
  )
}

type EquipmentFormProps = {
  ownerId: string
  ownerName: string
  ownerEmail: string
}

function EquipmentForm({ ownerId, ownerName, ownerEmail }: EquipmentFormProps) {
  const router = useRouter()
  const [values, setValues] = useState<FormValues>(initialValues)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)
  const [failedPreviewUrl, setFailedPreviewUrl] = useState<string | null>(null)

  function update<K extends keyof FormValues>(field: K, value: FormValues[K]) {
    setValues((current) => ({ ...current, [field]: value }))
    setErrors((current) => {
      if (!current[field]) return current
      const next = { ...current }
      delete next[field]
      return next
    })
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (submitting) return

    const validation = validate(values)
    if (Object.keys(validation).length > 0) {
      setErrors(validation)
      toast.error("Please fix the highlighted fields.")
      return
    }

    setSubmitting(true)
    setErrors({})

    const result = await createEquipment({
      name: values.name.trim(),
      description: values.description.trim(),
      category: values.category,
      brand: values.brand.trim() || undefined,
      model: values.model.trim() || undefined,
      condition: values.condition,
      rentalPrice: Number(values.rentalPrice),
      rentalType: values.rentalType,
      location: values.location.trim(),
      availableQuantity: Number(values.availableQuantity),
      availability: values.availability,
      image: values.image.trim(),
      imageAlt: values.imageAlt.trim() || undefined,
      rentalTerms: values.rentalTerms.trim(),
      owner: {
        id: ownerId,
        name: ownerName,
        email: ownerEmail,
        verified: false,
      },
    })

    if (result.status === "error") {
      setSubmitting(false)
      setErrors({ form: result.message })
      toast.error(result.message)
      return
    }

    toast.success("Equipment added and submitted for review.")
    setValues(initialValues)
    router.push("/dashboard/my-equipment")
    router.refresh()
  }

  const imageUrl = values.image.trim()
  const showPreview = imageUrl.length > 0 && failedPreviewUrl !== imageUrl

  return (
    <form noValidate onSubmit={handleSubmit} className="flex flex-col gap-6">
      <Card className="p-6">
        <h2 className="font-heading text-lg font-semibold">
          Equipment details
        </h2>
        <Muted className="mt-1">
          Add the core information renters will see in the marketplace.
        </Muted>

        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <div className="md:col-span-2">
            <Field
              label="Equipment Name"
              htmlFor="equipment-name"
              required
              error={errors.name}
            >
              <Input
                id="equipment-name"
                value={values.name}
                onChange={(event) => update("name", event.target.value)}
                placeholder="e.g. 20T Hydraulic Excavator"
                className="h-11"
                aria-invalid={Boolean(errors.name)}
              />
            </Field>
          </div>

          <div className="md:col-span-2">
            <Field
              label="Description"
              htmlFor="equipment-description"
              required
              error={errors.description}
            >
              <Textarea
                id="equipment-description"
                value={values.description}
                onChange={(event) => update("description", event.target.value)}
                placeholder="Describe the equipment, its capabilities, and what is included."
                rows={4}
                aria-invalid={Boolean(errors.description)}
              />
            </Field>
          </div>

          <Field label="Category" htmlFor="equipment-category" required>
            <Select
              value={values.category}
              onValueChange={(value) =>
                update("category", value as EquipmentCategory)
              }
            >
              <SelectTrigger id="equipment-category" className="h-11 w-full">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {EQUIPMENT_CATEGORIES.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          <Field
            label="Location"
            htmlFor="equipment-location"
            required
            error={errors.location}
          >
            <Input
              id="equipment-location"
              value={values.location}
              onChange={(event) => update("location", event.target.value)}
              placeholder="City, State"
              className="h-11"
              aria-invalid={Boolean(errors.location)}
            />
          </Field>

          <Field label="Brand" htmlFor="equipment-brand">
            <Input
              id="equipment-brand"
              value={values.brand}
              onChange={(event) => update("brand", event.target.value)}
              placeholder="e.g. Caterpillar"
              className="h-11"
            />
          </Field>

          <Field label="Model" htmlFor="equipment-model">
            <Input
              id="equipment-model"
              value={values.model}
              onChange={(event) => update("model", event.target.value)}
              placeholder="e.g. 320 GC"
              className="h-11"
            />
          </Field>

          <Field
            label="Equipment Condition"
            htmlFor="equipment-condition"
            required
          >
            <Select
              value={values.condition}
              onValueChange={(value) => update("condition", String(value))}
            >
              <SelectTrigger id="equipment-condition" className="h-11 w-full">
                <SelectValue placeholder="Select condition" />
              </SelectTrigger>
              <SelectContent>
                {conditions.map((condition) => (
                  <SelectItem key={condition} value={condition}>
                    {condition}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          <Field
            label="Availability"
            htmlFor="equipment-availability"
            required
            hint="How available this equipment is right now."
          >
            <Select
              value={values.availability}
              onValueChange={(value) =>
                update("availability", value as EquipmentAvailability)
              }
            >
              <SelectTrigger id="equipment-availability" className="h-11 w-full">
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
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="font-heading text-lg font-semibold">Rental details</h2>
        <Muted className="mt-1">
          Set the price, rental period, and available quantity.
        </Muted>

        <div className="mt-6 grid gap-5 md:grid-cols-3">
          <Field
            label="Rental Price (USD)"
            htmlFor="equipment-price"
            required
            error={errors.rentalPrice}
          >
            <Input
              id="equipment-price"
              type="number"
              min="0"
              value={values.rentalPrice}
              onChange={(event) => update("rentalPrice", event.target.value)}
              placeholder="420"
              className="h-11"
              aria-invalid={Boolean(errors.rentalPrice)}
            />
          </Field>

          <Field label="Rental Type" htmlFor="equipment-rental-type" required>
            <Select
              value={values.rentalType}
              onValueChange={(value) =>
                update("rentalType", value as RentalType)
              }
            >
              <SelectTrigger
                id="equipment-rental-type"
                className="h-11 w-full"
              >
                <SelectValue placeholder="Select rental type" />
              </SelectTrigger>
              <SelectContent>
                {rentalTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          <Field
            label="Available Quantity"
            htmlFor="equipment-quantity"
            required
            error={errors.availableQuantity}
          >
            <Input
              id="equipment-quantity"
              type="number"
              min="1"
              value={values.availableQuantity}
              onChange={(event) =>
                update("availableQuantity", event.target.value)
              }
              placeholder="1"
              className="h-11"
              aria-invalid={Boolean(errors.availableQuantity)}
            />
          </Field>

          <div className="md:col-span-3">
            <Field
              label="Status"
              htmlFor="equipment-status"
              hint="New equipment is submitted for admin review before going live."
            >
              <div id="equipment-status" className="flex items-center gap-2">
                <Badge variant="pending">Pending</Badge>
                <Muted className="text-xs">Default status</Muted>
              </div>
            </Field>
          </div>

          <div className="md:col-span-3">
            <Field
              label="Rental Terms and Conditions"
              htmlFor="equipment-terms"
              required
              error={errors.rentalTerms}
            >
              <Textarea
                id="equipment-terms"
                value={values.rentalTerms}
                onChange={(event) => update("rentalTerms", event.target.value)}
                placeholder="Add pickup, delivery, usage, and return terms."
                rows={4}
                aria-invalid={Boolean(errors.rentalTerms)}
              />
            </Field>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="font-heading text-lg font-semibold">Equipment image</h2>
        <Muted className="mt-1">
          Paste a direct image URL so renters know what to expect.
        </Muted>

        <div className="mt-6 grid gap-5 sm:grid-cols-[220px_1fr]">
          <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-border bg-muted">
            {showPreview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={imageUrl}
                alt="Equipment image preview"
                className="size-full object-cover"
                onError={() => setFailedPreviewUrl(imageUrl)}
              />
            ) : (
              <div className="flex h-full flex-col items-center justify-center gap-2 p-4 text-center text-muted-foreground">
                <ImageOff aria-hidden="true" className="size-6" />
                <span className="text-xs font-medium">Image preview</span>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-5">
            <Field
              label="Image URL"
              htmlFor="equipment-image"
              required
              hint="Use a direct link to an image, e.g. https://images.example.com/photo.jpg"
              error={errors.image}
            >
              <Input
                id="equipment-image"
                type="url"
                value={values.image}
                onChange={(event) => update("image", event.target.value)}
                placeholder="https://images.example.com/excavator.jpg"
                className="h-11"
                aria-invalid={Boolean(errors.image)}
              />
            </Field>

            <Field
              label="Image alt text"
              htmlFor="equipment-image-alt"
              hint="Optional. Describe the image for accessibility."
            >
              <Input
                id="equipment-image-alt"
                value={values.imageAlt}
                onChange={(event) => update("imageAlt", event.target.value)}
                placeholder="Yellow excavator on a construction site"
                className="h-11"
              />
            </Field>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="font-heading text-lg font-semibold">
          Owner information
        </h2>
        <Muted className="mt-1">
          This information comes from your signed-in owner account.
        </Muted>

        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <Field label="Owner Name" htmlFor="owner-name">
            <Input
              id="owner-name"
              defaultValue={ownerName}
              readOnly
              className="h-11"
            />
          </Field>
          <Field label="Owner Email" htmlFor="owner-email">
            <Input
              id="owner-email"
              defaultValue={ownerEmail}
              readOnly
              className="h-11"
            />
          </Field>
        </div>
      </Card>

      <div className="flex flex-col items-start justify-between gap-4 rounded-xl border border-border bg-card p-5 shadow-card sm:flex-row sm:items-center">
        <Muted className="text-xs">
          {errors.form ?? (
            <>
              New listings are submitted for review and appear as pending until
              an admin approves them.
            </>
          )}
        </Muted>
        <Button
          type="submit"
          variant="brand"
          size="lg"
          disabled={submitting}
        >
          {submitting ? "Submitting..." : "Submit for approval"}
        </Button>
      </div>
    </form>
  )
}

export { EquipmentForm }