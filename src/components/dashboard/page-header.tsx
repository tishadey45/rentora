import type { ReactNode } from "react"

import { H1, Muted } from "@/components/ui/typography"

type DashboardPageHeaderProps = {
  title: string
  description: string
  action?: ReactNode
}

function DashboardPageHeader({
  title,
  description,
  action,
}: DashboardPageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <H1 className="text-2xl sm:text-3xl">{title}</H1>
        <Muted className="mt-2 max-w-2xl">{description}</Muted>
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  )
}

export { DashboardPageHeader }