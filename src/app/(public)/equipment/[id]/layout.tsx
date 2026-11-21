import type { ReactNode } from "react"
import { redirect } from "next/navigation"
import { connection } from "next/server"

import { getDashboardSession } from "@/lib/dashboard-session"

export const instant = false

type EquipmentDetailsLayoutProps = {
  children: ReactNode
  params: Promise<{ id: string }>
}

export default async function EquipmentDetailsLayout({
  children,
  params,
}: EquipmentDetailsLayoutProps) {
  await connection()

  const { id } = await params
  const session = await getDashboardSession()

  if (!session) {
    redirect(`/login?redirect=${encodeURIComponent(`/equipment/${id}`)}`)
  }

  return <>{children}</>
}