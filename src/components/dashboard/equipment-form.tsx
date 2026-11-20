"use client"

import Image from "next/image"
import { Upload } from "lucide-react"

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
import { EQUIPMENT_CATEGORIES } from "@/types/equipment"

const rentalTypes = ["Daily", "Weekly", "Monthly"]
const conditions = ["Excellent", "Good", "Fair"]

function Field({
  label,
  htmlFor,
  required = false,
  hint,
  children,
}: {
  label: string
  htmlFor: string
  required?: boolean
  hint?: string
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
      {hint ? <Muted className="text-xs">{hint}</Muted> : null}
    </div>
  )
}

type EquipmentFormProps = {
  ownerName: string
  ownerEmail: string
}

function EquipmentForm({ ownerName, ownerEmail }: EquipmentFormProps) {
  return (
    <form
      noValidate
      onSubmit={(event) => event.preventDefault()}
      className="flex flex-col gap-6"
    >
      <Card className="p-6">
        <h2 className="font-heading text-lg font-semibold">
          Equipment details
        </h2>
        <Muted className="mt-1">
          Add the core information renters will see in the marketplace.
        </Muted>

        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <div className="md:col-span-2">
            <Field label="Equipment Name" htmlFor="equipment-name" required>
              <Input
                id="equipment-name"
                placeholder="e.g. 20T Hydraulic Excavator"
                className="h-11"
              />
            </Field>
          </div>

          <div className="md:col-span-2">
            <Field label="Description" htmlFor="equipment-description" required>
              <Textarea
                id="equipment-description"
                placeholder="Describe the equipment, its capabilities, and what is included."
                rows={4}
              />
            </Field>
          </div>

          <Field label="Category" htmlFor="equipment-category" required>
            <Select defaultValue="Construction">
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

          <Field label="Location" htmlFor="equipment-location" required>
            <Input
              id="equipment-location"
              placeholder="City, State"
              className="h-11"
            />
          </Field>

          <Field label="Brand" htmlFor="equipment-brand">
            <Input
              id="equipment-brand"
              placeholder="e.g. Caterpillar"
              className="h-11"
            />
          </Field>

          <Field label="Model" htmlFor="equipment-model">
            <Input
              id="equipment-model"
              placeholder="e.g. 320 GC"
              className="h-11"
            />
          </Field>

          <Field
            label="Equipment Condition"
            htmlFor="equipment-condition"
            required
          >
            <Select defaultValue="Excellent">
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
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="font-heading text-lg font-semibold">Rental details</h2>
        <Muted className="mt-1">
          Set the price, rental period, and available quantity.
        </Muted>

        <div className="mt-6 grid gap-5 md:grid-cols-3">
          <Field label="Rental Price (USD)" htmlFor="equipment-price" required>
            <Input
              id="equipment-price"
              type="number"
              min="0"
              placeholder="420"
              className="h-11"
            />
          </Field>

          <Field label="Rental Type" htmlFor="equipment-rental-type" required>
            <Select defaultValue="Daily">
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
          >
            <Input
              id="equipment-quantity"
              type="number"
              min="1"
              placeholder="1"
              className="h-11"
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
            >
              <Textarea
                id="equipment-terms"
                placeholder="Add pickup, delivery, usage, and return terms."
                rows={4}
              />
            </Field>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="font-heading text-lg font-semibold">Equipment image</h2>
        <Muted className="mt-1">
          Add a clear photo so renters know what to expect.
        </Muted>

        <div className="mt-6 grid gap-5 sm:grid-cols-[220px_1fr]">
          <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-border bg-muted">
            <Image
              src="/images/equipment/excavator.jpg"
              alt="Sample equipment image preview"
              fill
              sizes="(min-width: 640px) 220px, 100vw"
              className="object-cover"
            />
            <span className="absolute inset-x-0 bottom-0 bg-navy-950/65 px-3 py-2 text-center text-xs font-medium text-white">
              Sample preview
            </span>
          </div>

          <div className="flex flex-col justify-center gap-3 rounded-xl border border-dashed border-border p-5">
            <span className="grid size-11 place-items-center rounded-lg bg-emerald-soft text-emerald-strong">
              <Upload aria-hidden="true" className="size-5" />
            </span>
            <div>
              <p className="text-sm font-medium">Upload equipment image</p>
              <Muted className="mt-1 text-xs">
                Image upload is UI-only. ImgBB integration will be added later.
              </Muted>
            </div>
            <Button type="button" variant="outline" size="sm" className="w-fit">
              Choose image
            </Button>
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
          This form is a static preview. Nothing will be sent to the server.
        </Muted>
        <Button type="submit" variant="brand" size="lg">
          Submit for approval
        </Button>
      </div>
    </form>
  )
}

export { EquipmentForm }