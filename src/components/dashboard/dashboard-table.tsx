import type { ReactNode } from "react"
import { cn } from "cn"

import { Card } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

type DashboardTableProps = {
  headers: string[]
  children: ReactNode
  minWidthClassName?: string
  className?: string
}

function DashboardTable({
  headers,
  children,
  minWidthClassName = "min-w-[880px]",
  className,
}: DashboardTableProps) {
  return (
    <Card className={cn("overflow-hidden p-0", className)}>
      <Table className={minWidthClassName}>
        <TableHeader>
          <TableRow>
            {headers.map((header) => (
              <TableHead key={header}>{header}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>{children}</TableBody>
      </Table>
    </Card>
  )
}

export { DashboardTable }