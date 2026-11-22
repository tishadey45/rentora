import Link from "next/link"
import Image from "next/image"
import { ArrowRight, BadgeCheck, MapPin, User } from "lucide-react"
import { cn } from "cn"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import type {
  Equipment,
  EquipmentAvailability,
} from "@/types/equipment"

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
})

const availabilityConfig: Record<
  EquipmentAvailability,
  { label: string; variant: "success" | "warning" | "danger" }
> = {
  available: { label: "Available", variant: "success" },
  limited: { label: "Limited", variant: "warning" },
  unavailable: { label: "Unavailable", variant: "danger" },
}

type EquipmentCardProps = {
  equipment: Equipment
}

function EquipmentCard({ equipment }: EquipmentCardProps) {
  const availability = availabilityConfig[equipment.availability]
  const href = `/equipment/${equipment.id}`

  return (
    <Card className="group/card h-full gap-0 p-0 transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover">
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <Image
          src={equipment.image}
          alt={equipment.imageAlt ?? `${equipment.name} available for rent`}
          fill
          sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
          className="object-cover transition-transform duration-500 ease-out group-hover/card:scale-[1.04]"
        />
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-navy-950/45 to-transparent"
        />
        <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-2 p-4">
          <Badge
            variant="secondary"
            className="bg-background/90 text-foreground backdrop-blur-sm"
          >
            {equipment.category}
          </Badge>
          <Badge variant={availability.variant} className="backdrop-blur-sm">
            {availability.label}
          </Badge>
        </div>
      </div>

      <CardHeader className="gap-2 pt-5">
        <CardTitle className="line-clamp-1 text-lg">{equipment.name}</CardTitle>
        <CardDescription className="line-clamp-2 min-h-10 leading-relaxed">
          {equipment.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="mt-auto flex flex-col gap-4 pb-5 pt-4">
        <div className="flex items-end justify-between gap-3">
          <p className="font-heading text-xl font-semibold tracking-tight text-foreground">
            {currencyFormatter.format(equipment.rentalPrice)}
            <span className="ml-1 text-xs font-normal text-muted-foreground">
              / {equipment.rentalType.toLowerCase()}
            </span>
          </p>
          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin aria-hidden="true" className="size-3.5 shrink-0" />
            {equipment.location}
          </span>
        </div>

        <div className="flex flex-col gap-3 border-t border-border pt-4 sm:flex-row sm:items-center sm:justify-between">
          <span className="inline-flex min-w-0 items-center gap-1.5 text-xs text-muted-foreground">
            {equipment.owner.verified ? (
              <BadgeCheck
                aria-hidden="true"
                className="size-4 shrink-0 text-emerald-strong"
              />
            ) : (
              <User aria-hidden="true" className="size-4 shrink-0" />
            )}
            <span className="min-w-0 break-words">{equipment.owner.name}</span>
          </span>
          <Link
            href={href}
            aria-label={`View details for ${equipment.name}`}
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              "h-11 w-full shrink-0 px-4 sm:w-auto"
            )}
          >
            View Details
            <ArrowRight
              aria-hidden="true"
              className="transition-transform duration-200 group-hover/card:translate-x-0.5"
            />
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}

export { EquipmentCard }