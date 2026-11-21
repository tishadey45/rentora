"use client"

import { useRouter } from "next/navigation"

import {
  Navbar,
  type NavbarRole,
  type NavbarUser,
} from "@/components/layout/navbar"
import { authClient } from "@/lib/auth-client"

const navbarRoles: NavbarRole[] = ["customer", "owner", "admin"]

function resolveNavbarRole(value: unknown): NavbarRole {
  return typeof value === "string" && navbarRoles.includes(value as NavbarRole)
    ? (value as NavbarRole)
    : "customer"
}

function NavbarAuth() {
  const router = useRouter()
  const { data: session } = authClient.useSession()

  const user: NavbarUser | null = session?.user
    ? {
        name: session.user.name,
        role: resolveNavbarRole((session.user as { role?: unknown }).role),
      }
    : null

  const handleLogout = async () => {
    await authClient.signOut()
    router.push("/")
    router.refresh()
  }

  return <Navbar user={user} onLogout={handleLogout} />
}

export { NavbarAuth }