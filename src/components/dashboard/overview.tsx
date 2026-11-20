import Link from "next/link"
import {
  Activity,
  ArrowUpRight,
  BadgeCheck,
  CalendarCheck,
  CheckCircle2,
  Clock3,
  Heart,
  PackageCheck,
  Users,
  Wallet,
  Wrench,
  type LucideIcon,
} from "lucide-react"

import { DashboardPageHeader } from "@/components/dashboard/page-header"
import { DashboardStatCard } from "@/components/dashboard/stat-card"
import { StatusBadge } from "@/components/dashboard/status-badge"
import { Card } from "@/components/ui/card"
import { formatDate } from "@/lib/format"
import type {
  ActivityRecord,
  ActivityTone,
  DashboardRole,
  StatIconKey,
  StatRecord,
} from "@/types/dashboard"

const statIcons: Record<StatIconKey, LucideIcon> = {
  rentals: PackageCheck,
  active: Activity,
  favorites: Heart,
  completed: CheckCircle2,
  pendingBookings: Clock3,
  spent: Wallet,
  equipment: Wrench,
  approved: BadgeCheck,
  pending: Clock3,
  bookings: CalendarCheck,
  earnings: Wallet,
  users: Users,
  customers: Users,
  owners: BadgeCheck,
  revenue: Wallet,
}

const activityToneClasses: Record<ActivityTone, string> = {
  success: "bg-success",
  info: "bg-info",
  warning: "bg-warning",
  danger: "bg-danger",
}

type QuickLink = {
  label: string
  description: string
  href: string
  icon: LucideIcon
}

type DashboardOverviewProps = {
  role: DashboardRole
  title: string
  description: string
  stats: StatRecord[]
  activities: ActivityRecord[]
  quickLinks?: QuickLink[]
}

function DashboardOverview({
  role,
  title,
  description,
  stats,
  activities,
  quickLinks,
}: DashboardOverviewProps) {
  return (
    <div className="flex flex-col gap-6">
      <DashboardPageHeader
        title={title}
        description={description}
        action={<StatusBadge status={role} />}
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <DashboardStatCard
            key={stat.label}
            label={stat.label}
            value={stat.value}
            detail={stat.detail}
            icon={statIcons[stat.icon]}
          />
        ))}
      </div>

      {quickLinks?.length ? (
        <div className="grid gap-4 sm:grid-cols-3">
          {quickLinks.map((quickLink) => {
            const Icon = quickLink.icon

            return (
              <Link
                key={quickLink.href}
                href={quickLink.href}
                className="group rounded-xl border border-border bg-card p-5 shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:border-emerald-strong/30 hover:shadow-card-hover focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="grid size-10 place-items-center rounded-lg bg-emerald-soft text-emerald-strong">
                    <Icon aria-hidden="true" className="size-5" />
                  </span>
                  <ArrowUpRight
                    aria-hidden="true"
                    className="size-4 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  />
                </div>
                <p className="mt-4 font-heading text-sm font-semibold">
                  {quickLink.label}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {quickLink.description}
                </p>
              </Link>
            )
          })}
        </div>
      ) : null}

      <Card className="p-0">
        <div className="border-b border-border p-6">
          <h2 className="font-heading text-lg font-semibold">Recent activity</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            A quick look at what has happened recently.
          </p>
        </div>

        <ul className="divide-y divide-border">
          {activities.map((activity) => (
            <li key={activity.id} className="flex items-start gap-3 p-4 sm:p-5">
              <span
                aria-hidden="true"
                className={`mt-1.5 size-2 shrink-0 rounded-full ${activityToneClasses[activity.tone]}`}
              />
              <div className="min-w-0 flex-1">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm font-medium">{activity.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDate(activity.date)}
                  </p>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  {activity.description}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  )
}

export { DashboardOverview }