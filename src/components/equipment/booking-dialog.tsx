"use client"

import { useRef, useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import { CalendarDays } from "lucide-react"
import toast from "react-hot-toast"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { createBooking } from "@/lib/bookings/create-booking"

type BookingDialogProps = {
  equipmentId: string
  equipmentName: string
  maxQuantity: number
}

function BookingDialog({
  equipmentId,
  equipmentName,
  maxQuantity,
}: BookingDialogProps) {
  const [open, setOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)
  const router = useRouter()

  // Today's date for the pickers: dates default to today and past dates are
  // disabled via the `min` attribute.
  const today = getTodayDateInput()

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (submitting) return

    const form = formRef.current
    if (!form) return

    const formData = new FormData(form)
    const startDate = String(formData.get("startDate") ?? "").trim()
    const endDate = String(formData.get("endDate") ?? "").trim()
    const quantity = Number(formData.get("quantity"))
    const contactNumber = String(formData.get("contactNumber") ?? "").trim()
    const deliveryAddress = String(formData.get("deliveryAddress") ?? "").trim()
    const notes = String(formData.get("notes") ?? "").trim()

    if (!startDate || !endDate || !contactNumber || !deliveryAddress) {
      toast.error("Please fill in all required fields.")
      return
    }

    if (!Number.isInteger(quantity) || quantity < 1) {
      toast.error("Quantity must be a whole number of at least 1.")
      return
    }

    if (endDate < startDate) {
      toast.error("End date must be on or after the start date.")
      return
    }

    setSubmitting(true)
    const result = await createBooking({
      equipmentId,
      startDate,
      endDate,
      quantity,
      contactNumber,
      deliveryAddress,
      notes: notes || undefined,
    })
    setSubmitting(false)

    if (result.status === "error") {
      // Keep the dialog open with the entered values.
      toast.error(result.message)
      return
    }

    toast.success("Booking request submitted successfully!")
    setOpen(false)
    form.reset()
    router.push("/dashboard/my-rentals")
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={<Button variant="brand" size="lg" className="w-full" />}
      >
        <CalendarDays aria-hidden="true" />
        Book Now
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Book {equipmentName}</DialogTitle>
          <DialogDescription>
            Submit a rental request for this equipment. The total will be
            calculated from the owner&apos;s listed price.
          </DialogDescription>
        </DialogHeader>

        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className="grid gap-4"
          noValidate
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="booking-start-date">Rental start date</Label>
              <Input
                id="booking-start-date"
                name="startDate"
                type="date"
                defaultValue={today}
                min={today}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="booking-end-date">Rental end date</Label>
              <Input
                id="booking-end-date"
                name="endDate"
                type="date"
                defaultValue={today}
                min={today}
                required
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="booking-quantity">Quantity</Label>
              <Input
                id="booking-quantity"
                name="quantity"
                type="number"
                min={1}
                max={maxQuantity > 0 ? maxQuantity : undefined}
                defaultValue={1}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="booking-contact">Contact number</Label>
              <Input
                id="booking-contact"
                name="contactNumber"
                type="tel"
                placeholder="+1 555 000 1234"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="booking-address">Delivery address</Label>
            <Input
              id="booking-address"
              name="deliveryAddress"
              placeholder="Street, city, state"
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="booking-notes">
              Additional notes{" "}
              <span className="font-normal text-muted-foreground">
                (optional)
              </span>
            </Label>
            <Textarea
              id="booking-notes"
              name="notes"
              placeholder="Anything the owner should know before delivery"
            />
          </div>

          <div className="mt-1 flex flex-col-reverse gap-2 border-t border-border pt-4 sm:flex-row sm:justify-end">
            <DialogClose
              render={<Button type="button" variant="outline" />}
            >
              Cancel
            </DialogClose>
            <Button type="submit" variant="brand" disabled={submitting}>
              {submitting ? "Submitting..." : "Submit request"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// Local "today" as YYYY-MM-DD for the date pickers (matches the browser's
// date input so past dates can be disabled and today is selected by default).
function getTodayDateInput() {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, "0")
  const day = String(now.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

export { BookingDialog }