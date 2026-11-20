import type { LucideIcon } from "lucide-react"

import { Card } from "@/components/ui/card"
import { Muted } from "@/components/ui/typography"

type DashboardStatCardProps = {
  label: string
  value: string
  detail: string
  icon: LucideIcon
}

function DashboardStatCard({
  label,
  value,
  detail,
  icon: Icon,
}: DashboardStatCardProps) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <p className="mt-2 font-heading text-3xl font-semibold tracking-tight">
            {value}
          </p>
          <Muted className="mt-2 text-xs">{detail}</Muted>
        </div>
        <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-emerald-soft text-emerald-strong">
          <Icon aria-hidden="true" className="size-5" />
        </span>
      </div>
    </Card>
  )
}

export { DashboardStatCard }