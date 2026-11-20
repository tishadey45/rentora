import type { ReactNode } from "react"
import { Inbox, type LucideIcon } from "lucide-react"

import { H3, Muted } from "@/components/ui/typography"

type DashboardEmptyStateProps = {
  title: string
  description: string
  icon?: LucideIcon
  action?: ReactNode
}

function DashboardEmptyState({
  title,
  description,
  icon: Icon = Inbox,
  action,
}: DashboardEmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-border bg-card px-6 py-14 text-center shadow-card">
      <span className="grid size-12 place-items-center rounded-full bg-muted text-muted-foreground">
        <Icon aria-hidden="true" className="size-6" />
      </span>
      <H3>{title}</H3>
      <Muted className="max-w-md">{description}</Muted>
      {action ? <div className="mt-2">{action}</div> : null}
    </div>
  )
}

export { DashboardEmptyState }