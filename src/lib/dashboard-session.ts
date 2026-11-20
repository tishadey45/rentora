import { cache } from "react"
import { headers } from "next/headers"
import { redirect } from "next/navigation"

import { auth } from "@/lib/auth"
import type { DashboardRole, DashboardUser } from "@/types/dashboard"

const dashboardRoles: DashboardRole[] = ["customer", "owner", "admin"]

export function resolveDashboardRole(value: unknown): DashboardRole {
  if (typeof value === "string" && dashboardRoles.includes(value as DashboardRole)) {
    return value as DashboardRole
  }

  return "customer"
}

export const getDashboardSession = cache(async () => {
  return auth.api.getSession({
    headers: await headers(),
  })
})

export async function getDashboardContext() {
  const session = await getDashboardSession()

  if (!session) {
    redirect("/login?redirect=/dashboard")
  }

  const role = resolveDashboardRole(
    (session.user as { role?: unknown }).role
  )

  return { session, role }
}

export async function requireDashboardRole(role: DashboardRole) {
  const context = await getDashboardContext()

  if (context.role !== role) {
    redirect("/dashboard")
  }

  return context
}

export function toDashboardUser(
  session: NonNullable<Awaited<ReturnType<typeof getDashboardSession>>>,
  role: DashboardRole
): DashboardUser {
  const createdAt = (session.user as { createdAt?: Date | string }).createdAt

  return {
    id: session.user.id,
    name: session.user.name,
    email: session.user.email,
    role,
    imageUrl: session.user.image ?? undefined,
    joinedAt: createdAt
      ? new Date(createdAt).toISOString().slice(0, 10)
      : undefined,
  }
}