import Link from "next/link"
import { ArrowLeft, BadgeCheck, Mail, MapPin } from "lucide-react"
import { cn } from "cn"

import { StatusBadge } from "@/components/dashboard/status-badge"
import { EquipmentActions } from "@/components/equipment/equipment-actions"
import { EquipmentImage } from "@/components/equipment/equipment-image"
import { Section } from "@/components/layout/section"
import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Eyebrow, H1, Muted, Paragraph } from "@/components/ui/typography"
import { formatCurrency } from "@/lib/format"
import type { EquipmentDetails } from "@/types/equipment-details"

type EquipmentDetailsViewProps = {
  equipment: EquipmentDetails
}

function EquipmentDetailsView({ equipment }: EquipmentDetailsViewProps) {
  const specifications = [
    { label: "Brand", value: equipment.brand },
    { label: "Model", value: equipment.model },
    { label: "Condition", value: equipment.condition },
    { label: "Rental type", value: equipment.rentalType },
    {
      label: "Available quantity",
      value: equipment.availableQuantity ? String(equipment.availableQuantity) : undefined,
    },
  ].filter((spec): spec is { label: string; value: string } =>
    Boolean(spec.value)
  )

  return (
    <Section>
      <Link
        href="/equipment"
        className={cn(
          buttonVariants({ variant: "ghost", size: "sm" }),
          "-ml-3 mb-6"
        )}
      >
        <ArrowLeft aria-hidden="true" />
        Back to equipment
      </Link>

      <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
        <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-border bg-muted shadow-card">
          <EquipmentImage
            src={equipment.image}
            alt={equipment.imageAlt ?? `${equipment.name} available for rent`}
            sizes="(min-width: 1024px) 50vw, 100vw"
            eager
          />
        </div>

        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-3">
            <Eyebrow>{equipment.category}</Eyebrow>
            <H1 className="text-3xl sm:text-4xl">{equipment.name}</H1>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
              <StatusBadge status={equipment.availability} />
              <span className="inline-flex items-center gap-1.5">
                <MapPin aria-hidden="true" className="size-4 shrink-0" />
                {equipment.location}
              </span>
            </div>
          </div>

          <Paragraph>{equipment.description}</Paragraph>

          <div className="flex flex-wrap items-end gap-x-4 gap-y-1 border-y border-border py-4">
            <p className="font-heading text-3xl font-semibold tracking-tight text-foreground">
              {formatCurrency(equipment.rentalPrice)}
              <span className="ml-1.5 text-sm font-normal text-muted-foreground">
                / {equipment.rentalType.toLowerCase()}
              </span>
            </p>
          </div>

          <EquipmentActions
            equipmentName={equipment.name}
            availableQuantity={equipment.availableQuantity}
          />
        </div>
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="border-b border-border">
            <CardTitle className="text-lg">Specifications</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid gap-4 sm:grid-cols-2">
              {specifications.map((spec) => (
                <div
                  key={spec.label}
                  className="flex flex-col gap-1 rounded-lg border border-border/60 bg-muted/30 p-3"
                >
                  <dt className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                    {spec.label}
                  </dt>
                  <dd className="text-sm font-medium text-foreground">
                    {spec.value}
                  </dd>
                </div>
              ))}
            </dl>
          </CardContent>
        </Card>

        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader className="border-b border-border">
              <CardTitle className="text-lg">Owner</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-medium text-foreground">
                  {equipment.owner.name}
                </span>
                {equipment.owner.verified ? (
                  <Badge variant="success">
                    <BadgeCheck aria-hidden="true" />
                    Verified
                  </Badge>
                ) : (
                  <Badge variant="outline">Not verified</Badge>
                )}
              </div>

              {equipment.owner.email ? (
                <a
                  href={`mailto:${equipment.owner.email}`}
                  className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  <Mail aria-hidden="true" className="size-4 shrink-0" />
                  {equipment.owner.email}
                </a>
              ) : null}
            </CardContent>
          </Card>

          {equipment.rentalTerms ? (
            <Card>
              <CardHeader className="border-b border-border">
                <CardTitle className="text-lg">Rental terms</CardTitle>
              </CardHeader>
              <CardContent>
                <Muted>{equipment.rentalTerms}</Muted>
              </CardContent>
            </Card>
          ) : null}
        </div>
      </div>
    </Section>
  )
}

export { EquipmentDetailsView }