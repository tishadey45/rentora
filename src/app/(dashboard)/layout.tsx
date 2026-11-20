import type { ReactNode } from "react"

import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import {
  getDashboardContext,
  toDashboardUser,
} from "@/lib/dashboard-session"

type DashboardLayoutProps = {
  children: ReactNode
}

export const instant = false

export default async function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  const { session, role } = await getDashboardContext()
  const user = toDashboardUser(session, role)

  return (
    <DashboardShell role={role} user={user}>
      {children}
    </DashboardShell>
  )
}