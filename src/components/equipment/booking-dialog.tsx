"use client"

import { useState } from "react"
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

type BookingDialogProps = {
  equipmentName: string
  maxQuantity: number
}

function BookingDialog({ equipmentName, maxQuantity }: BookingDialogProps) {
  const [open, setOpen] = useState(false)

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setOpen(false)
    toast("Online booking isn't available yet — your request was not submitted.")
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
            Online booking is not available yet. This form is a preview only —
            submitting it will not create a booking.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="booking-start-date">Rental start date</Label>
              <Input
                id="booking-start-date"
                name="startDate"
                type="date"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="booking-end-date">Rental end date</Label>
              <Input
                id="booking-end-date"
                name="endDate"
                type="date"
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
            <Button type="submit" variant="brand">
              Submit request
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export { BookingDialog }