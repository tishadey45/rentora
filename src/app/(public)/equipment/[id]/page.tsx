import type { Metadata } from "next"
import Link from "next/link"
import { AlertTriangle, ArrowLeft, PackageX, ShieldAlert } from "lucide-react"
import { cn } from "cn"

import { EquipmentDetailsView } from "@/components/equipment/equipment-details"
import { Section } from "@/components/layout/section"
import { buttonVariants } from "@/components/ui/button"
import { H3, Muted } from "@/components/ui/typography"
import { getEquipmentById } from "@/lib/equipment/get-equipment"

export const metadata: Metadata = {
  title: "Equipment Details",
  description: "View equipment specifications, owner details, and rental terms.",
}

type EquipmentDetailsPageProps = {
  params: Promise<{ id: string }>
}

export default async function EquipmentDetailsPage({
  params,
}: EquipmentDetailsPageProps) {
  const { id } = await params
  const result = await getEquipmentById(id)

  if (result.status === "invalid") {
    return (
      <EquipmentStateCard
        tone="warning"
        icon={<ShieldAlert aria-hidden="true" className="size-6" />}
        title="Invalid equipment ID"
        description="The equipment ID in this link isn't valid. Check the address and try again."
      />
    )
  }

  if (result.status === "not-found") {
    return (
      <EquipmentStateCard
        tone="muted"
        icon={<PackageX aria-hidden="true" className="size-6" />}
        title="Equipment not found"
        description="This listing doesn't exist or may have been removed."
      />
    )
  }

  if (result.status === "error") {
    return (
      <EquipmentStateCard
        tone="danger"
        icon={<AlertTriangle aria-hidden="true" className="size-6" />}
        title="We couldn't load this equipment"
        description={result.message}
      />
    )
  }

  return <EquipmentDetailsView equipment={result.equipment} />
}

type EquipmentStateCardProps = {
  tone: "muted" | "warning" | "danger"
  icon: React.ReactNode
  title: string
  description: string
}

const stateToneStyles: Record<EquipmentStateCardProps["tone"], string> = {
  muted: "bg-muted text-muted-foreground",
  warning: "bg-warning-soft text-warning",
  danger: "bg-danger-soft text-danger",
}

function EquipmentStateCard({
  tone,
  icon,
  title,
  description,
}: EquipmentStateCardProps) {
  return (
    <Section tone="muted">
      <div className="mx-auto flex max-w-xl flex-col items-center gap-3 rounded-xl border border-border bg-card px-6 py-14 text-center shadow-card">
        <span
          className={cn(
            "grid size-12 place-items-center rounded-full",
            stateToneStyles[tone]
          )}
        >
          {icon}
        </span>
        <H3>{title}</H3>
        <Muted className="max-w-md">{description}</Muted>
        <div className="mt-2 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/equipment"
            className={buttonVariants({ variant: "outline" })}
          >
            <ArrowLeft aria-hidden="true" />
            Back to equipment
          </Link>
          <Link href="/" className={buttonVariants()}>
            Go home
          </Link>
        </div>
      </div>
    </Section>
  )
}