import { Badge } from "@/components/ui/badge"

type BadgeVariant =
  | "default"
  | "secondary"
  | "outline"
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "approved"
  | "pending"
  | "rejected"

const statusConfig: Record<string, { label: string; variant: BadgeVariant }> = {
  pending: { label: "Pending", variant: "pending" },
  approved: { label: "Approved", variant: "approved" },
  rejected: { label: "Rejected", variant: "rejected" },
  paid: { label: "Paid", variant: "success" },
  refunded: { label: "Refunded", variant: "info" },
  upcoming: { label: "Upcoming", variant: "info" },
  active: { label: "Active", variant: "success" },
  completed: { label: "Completed", variant: "secondary" },
  cancelled: { label: "Cancelled", variant: "danger" },
  available: { label: "Available", variant: "success" },
  limited: { label: "Limited", variant: "warning" },
  unavailable: { label: "Unavailable", variant: "danger" },
  customer: { label: "Customer", variant: "info" },
  owner: { label: "Owner", variant: "success" },
  admin: { label: "Admin", variant: "default" },
  suspended: { label: "Suspended", variant: "danger" },
}

function StatusBadge({ status }: { status: string }) {
  const config = statusConfig[status] ?? {
    label: status.replaceAll("_", " "),
    variant: "outline" as const,
  }

  return <Badge variant={config.variant}>{config.label}</Badge>
}

export { StatusBadge }