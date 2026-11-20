"use client"

import { useEffect, useState, type ReactNode } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  CalendarCheck,
  ClipboardList,
  Heart,
  Home,
  LayoutDashboard,
  LogOut,
  Menu,
  PackageCheck,
  PlusCircle,
  UserRound,
  Users,
  Wrench,
  X,
  type LucideIcon,
} from "lucide-react"
import { cn } from "cn"

import { Logo } from "@/components/layout/logo"
import { ThemeToggle } from "@/components/layout/theme-toggle"
import { StatusBadge } from "@/components/dashboard/status-badge"
import { Button } from "@/components/ui/button"
import { authClient } from "@/lib/auth-client"
import { formatRole, getInitials } from "@/lib/format"
import type { DashboardRole, DashboardUser } from "@/types/dashboard"

type NavItem = {
  label: string
  href: string
  icon: LucideIcon
}

const navByRole: Record<DashboardRole, NavItem[]> = {
  customer: [
    { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { label: "My Rentals", href: "/dashboard/my-rentals", icon: PackageCheck },
    { label: "Favorites", href: "/dashboard/favorites", icon: Heart },
    { label: "Profile", href: "/dashboard/profile", icon: UserRound },
  ],
  owner: [
    { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { label: "Add Equipment", href: "/dashboard/add-equipment", icon: PlusCircle },
    { label: "My Equipment", href: "/dashboard/my-equipment", icon: Wrench },
    {
      label: "My Equipment Rentals",
      href: "/dashboard/my-equipment-rentals",
      icon: CalendarCheck,
    },
    { label: "Profile", href: "/dashboard/profile", icon: UserRound },
  ],
  admin: [
    { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { label: "All Users", href: "/dashboard/users", icon: Users },
    { label: "All Equipment", href: "/dashboard/equipment", icon: Wrench },
    { label: "All Rentals", href: "/dashboard/rentals", icon: ClipboardList },
    { label: "Profile", href: "/dashboard/profile", icon: UserRound },
  ],
}

function getActiveItem(pathname: string, items: NavItem[]) {
  const exact = items.find((item) => item.href === pathname)
  if (exact) return exact

  return (
    items
      .filter((item) => pathname.startsWith(`${item.href}/`))
      .sort((first, second) => second.href.length - first.href.length)[0] ??
    items[0]
  )
}

type SidebarContentProps = {
  role: DashboardRole
  user: DashboardUser
  activeHref: string
  isSigningOut: boolean
  onLogout: () => void
  onNavigate?: () => void
}

function SidebarContent({
  role,
  user,
  activeHref,
  isSigningOut,
  onLogout,
  onNavigate,
}: SidebarContentProps) {
  return (
    <div className="flex h-full flex-col gap-5 p-4">
      <div className="flex items-center justify-between gap-3 px-1">
        <Logo />
        {onNavigate ? (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Close dashboard navigation"
            onClick={onNavigate}
          >
            <X aria-hidden="true" />
          </Button>
        ) : null}
      </div>

      <div className="rounded-xl border border-sidebar-border bg-sidebar-accent/60 p-3">
        <p className="text-[10px] font-semibold tracking-[0.14em] text-sidebar-foreground/60 uppercase">
          Signed in as
        </p>
        <div className="mt-2 flex items-center gap-3">
          <span className="grid size-9 shrink-0 place-items-center rounded-full bg-sidebar-primary text-xs font-semibold text-sidebar-primary-foreground">
            {getInitials(user.name)}
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-sidebar-foreground">
              {user.name}
            </p>
            <div className="mt-1">
              <StatusBadge status={role} />
            </div>
          </div>
        </div>
      </div>

      <nav aria-label="Dashboard navigation" className="flex-1">
        <ul className="flex flex-col gap-1">
          {navByRole[role].map((item) => {
            const Icon = item.icon
            const isActive = item.href === activeHref

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onNavigate}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-sidebar-foreground/70 hover:bg-sidebar-accent/70 hover:text-sidebar-foreground"
                  )}
                >
                  <Icon
                    aria-hidden="true"
                    className={cn(
                      "size-4 shrink-0",
                      isActive
                        ? "text-emerald-strong"
                        : "text-sidebar-foreground/50 group-hover:text-sidebar-foreground"
                    )}
                  />
                  <span className="truncate">{item.label}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      <div className="flex flex-col gap-1 border-t border-sidebar-border pt-4">
        <Link
          href="/"
          onClick={onNavigate}
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-sidebar-foreground/60 transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground"
        >
          <Home aria-hidden="true" className="size-4" />
          Back to website
        </Link>
        <button
          type="button"
          onClick={onLogout}
          disabled={isSigningOut}
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-left text-xs font-medium text-sidebar-foreground/60 transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground disabled:pointer-events-none disabled:opacity-50"
        >
          <LogOut aria-hidden="true" className="size-4" />
          {isSigningOut ? "Signing out..." : "Log out"}
        </button>
      </div>
    </div>
  )
}

type DashboardShellProps = {
  role: DashboardRole
  user: DashboardUser
  children: ReactNode
}

function DashboardShell({ role, user, children }: DashboardShellProps) {
  const pathname = usePathname()
  const router = useRouter()
  const items = navByRole[role]
  const activeItem = getActiveItem(pathname, items)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [isSigningOut, setIsSigningOut] = useState(false)

  useEffect(() => {
    if (!mobileOpen) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileOpen(false)
    }

    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [mobileOpen])

  async function handleLogout() {
    setIsSigningOut(true)

    try {
      await authClient.signOut()
    } finally {
      router.push("/")
      router.refresh()
    }
  }

  return (
    <div className="flex min-h-svh bg-muted/30">
      <aside className="hidden w-64 shrink-0 border-r border-sidebar-border bg-sidebar lg:block">
        <div className="sticky top-0 h-svh">
          <SidebarContent
            role={role}
            user={user}
            activeHref={activeItem.href}
            isSigningOut={isSigningOut}
            onLogout={handleLogout}
          />
        </div>
      </aside>

      {mobileOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close dashboard navigation"
            className="absolute inset-0 bg-navy-950/50"
            onClick={() => setMobileOpen(false)}
          />
          <aside
            role="dialog"
            aria-modal="true"
            aria-label="Dashboard navigation"
            className="relative h-full w-72 max-w-[85vw] border-r border-sidebar-border bg-sidebar shadow-overlay"
          >
            <SidebarContent
              role={role}
              user={user}
              activeHref={activeItem.href}
              isSigningOut={isSigningOut}
              onLogout={handleLogout}
              onNavigate={() => setMobileOpen(false)}
            />
          </aside>
        </div>
      ) : null}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 border-b border-border bg-background/90 backdrop-blur">
          <div className="flex h-16 items-center gap-3 px-4 sm:px-6">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="lg:hidden"
              aria-label="Open dashboard navigation"
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen(true)}
            >
              <Menu aria-hidden="true" />
            </Button>

            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-semibold tracking-[0.14em] text-muted-foreground uppercase">
                {formatRole(role)} dashboard
              </p>
              <p className="truncate font-heading text-base font-semibold">
                {activeItem.label}
              </p>
            </div>

            <ThemeToggle />

            <Link
              href="/dashboard/profile"
              className="flex items-center gap-3 rounded-lg border border-border bg-card px-2.5 py-1.5 transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
            >
              <span className="grid size-8 place-items-center rounded-full bg-emerald-soft text-xs font-semibold text-emerald-strong">
                {getInitials(user.name)}
              </span>
              <span className="hidden min-w-0 sm:block">
                <span className="block truncate text-sm font-medium">
                  {user.name}
                </span>
                <span className="block text-xs text-muted-foreground">
                  {formatRole(role)}
                </span>
              </span>
            </Link>
          </div>
        </header>

        <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">
          <div className="mx-auto w-full max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  )
}

export { DashboardShell }