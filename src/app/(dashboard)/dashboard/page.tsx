import { Heart, PackageCheck, UserRound } from "lucide-react"

import { DashboardOverview } from "@/components/dashboard/overview"
import { StatusBadge } from "@/components/dashboard/status-badge"
import { Card } from "@/components/ui/card"
import {
  getDashboardContext,
  toDashboardUser,
} from "@/lib/dashboard-session"
import {
  adminUsers,
  dashboardActivities,
  dashboardStats,
} from "@/lib/mock/dashboard"
import { formatDate, formatRole, getInitials } from "@/lib/format"
import type { LucideIcon } from "lucide-react"
import type { DashboardRole } from "@/types/dashboard"

const customerQuickLinks: {
  label: string
  description: string
  href: string
  icon: LucideIcon
}[] = [
  {
    label: "My Rentals",
    description: "Review bookings and rental progress.",
    href: "/dashboard/my-rentals",
    icon: PackageCheck,
  },
  {
    label: "Favorites",
    description: "Open your saved equipment.",
    href: "/dashboard/favorites",
    icon: Heart,
  },
  {
    label: "Profile",
    description: "Keep your contact details current.",
    href: "/dashboard/profile",
    icon: UserRound,
  },
]

function overviewTitle(role: DashboardRole) {
  return `${formatRole(role)} Overview`
}

export default async function DashboardOverviewPage() {
  const { session, role } = await getDashboardContext()
  const user = toDashboardUser(session, role)

  return (
    <div className="flex flex-col gap-6">
      <DashboardOverview
        role={role}
        title={overviewTitle(role)}
        description={`Welcome back, ${user.name}. Here is a snapshot of your ${formatRole(role).toLowerCase()} activity.`}
        stats={dashboardStats[role]}
        activities={dashboardActivities[role]}
        quickLinks={role === "customer" ? customerQuickLinks : undefined}
      />

      {role === "admin" ? (
        <Card className="p-0">
          <div className="border-b border-border p-6">
            <h2 className="font-heading text-lg font-semibold">
              Recent user registrations
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              The newest accounts created on Rentora.
            </p>
          </div>
          <ul className="divide-y divide-border">
            {[...adminUsers]
              .sort((first, second) =>
                second.joinedAt.localeCompare(first.joinedAt)
              )
              .slice(0, 4)
              .map((registeredUser) => (
                <li
                  key={registeredUser.id}
                  className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex items-center gap-3">
                    <span className="grid size-9 place-items-center rounded-full bg-emerald-soft text-xs font-semibold text-emerald-strong">
                      {getInitials(registeredUser.name)}
                    </span>
                    <div>
                      <p className="text-sm font-medium">
                        {registeredUser.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {registeredUser.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusBadge status={registeredUser.role} />
                    <p className="text-xs text-muted-foreground">
                      {formatDate(registeredUser.joinedAt)}
                    </p>
                  </div>
                </li>
              ))}
          </ul>
        </Card>
      ) : null}
    </div>
  )
}