"use client"

import { useCallback, useEffect, useState } from "react"

import {
  AlertTriangle,
  RefreshCw,
  UserCheck,
  Users,
  UserX,
} from "lucide-react"
import toast from "react-hot-toast"

import { DashboardEmptyState } from "@/components/dashboard/empty-state"
import { DashboardTable } from "@/components/dashboard/dashboard-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { TableCell, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { formatRole } from "@/lib/format"
import type { DashboardRole } from "@/types/dashboard"
import {
  getAdminUsers,
  type AdminUser,
  type UserAccountStatus,
} from "@/lib/admin/get-users"
import { updateUserRole } from "@/lib/admin/update-user-role"
import { updateUserStatus } from "@/lib/admin/update-user-status"

const ROLE_OPTIONS: { value: DashboardRole; label: string }[] = [
  { value: "customer", label: "Customer" },
  { value: "owner", label: "Owner" },
  { value: "admin", label: "Admin" },
]

type ListState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "success"; users: AdminUser[] }

function AdminUsersList({ currentUserId }: { currentUserId: string }) {
  const [state, setState] = useState<ListState>({ status: "loading" })
  const [reloadKey, setReloadKey] = useState(0)
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [confirmUser, setConfirmUser] = useState<AdminUser | null>(null)

  useEffect(() => {
    let active = true

    async function load() {
      const result = await getAdminUsers()
      if (!active) return
      if (result.status === "error") {
        setState({ status: "error", message: result.message })
        toast.error(result.message)
        return
      }
      setState({ status: "success", users: result.users })
    }

    load()

    return () => {
      active = false
    }
  }, [reloadKey])

  const handleRetry = useCallback(() => {
    setReloadKey((key) => key + 1)
  }, [])

  const applyUserPatch = useCallback(
    (id: string, patch: Partial<Pick<AdminUser, "role" | "status">>) => {
      setState((prev) =>
        prev.status === "success"
          ? {
              status: "success",
              users: prev.users.map((user) =>
                user.id === id ? { ...user, ...patch } : user
              ),
            }
          : prev
      )
    },
    []
  )

  const handleRoleChange = useCallback(
    async (user: AdminUser, nextRole: DashboardRole) => {
      if (nextRole === user.role) return
      setUpdatingId(user.id)
      const result = await updateUserRole(user.id, nextRole)
      setUpdatingId(null)
      if (result.status === "error") {
        toast.error(result.message)
        return
      }
      toast.success(`${user.name} is now ${formatRole(nextRole)}.`)
      applyUserPatch(user.id, { role: nextRole })
    },
    [applyUserPatch]
  )

  const handleActivate = useCallback(
    async (user: AdminUser) => {
      setUpdatingId(user.id)
      const result = await updateUserStatus(user.id, "active")
      setUpdatingId(null)
      if (result.status === "error") {
        toast.error(result.message)
        return
      }
      toast.success(`${user.name} has been activated.`)
      applyUserPatch(user.id, { status: "active" })
    },
    [applyUserPatch]
  )

  const handleDeactivateConfirm = useCallback(async () => {
    if (!confirmUser) return
    const user = confirmUser
    setUpdatingId(user.id)
    const result = await updateUserStatus(user.id, "inactive")
    setUpdatingId(null)
    setConfirmUser(null)
    if (result.status === "error") {
      toast.error(result.message)
      return
    }
    toast.success(`${user.name} has been deactivated.`)
    applyUserPatch(user.id, { status: "inactive" })
  }, [confirmUser, applyUserPatch])

  if (state.status === "loading") {
    return <AdminUsersSkeleton />
  }

  if (state.status === "error") {
    return (
      <DashboardEmptyState
        title="Couldn't load users"
        description={state.message}
        icon={AlertTriangle}
        action={
          <Button
            type="button"
            variant="outline"
            onClick={handleRetry}
            className="mt-2 flex items-center gap-1.5"
          >
            <RefreshCw aria-hidden="true" />
            Try again
          </Button>
        }
      />
    )
  }

  if (state.users.length === 0) {
    return (
      <DashboardEmptyState
        title="No users yet"
        description="Registered users will appear here."
        icon={Users}
      />
    )
  }

  return (
    <>
      <DashboardTable
        headers={["User Name", "Email", "Role", "Status", "Actions"]}
        minWidthClassName="min-w-[900px]"
      >
        {state.users.map((user) => {
          const isSelf = user.id === currentUserId
          const isUpdating = updatingId === user.id

          return (
            <TableRow key={user.id}>
              <TableCell>
                <div className="min-w-0">
                  <p className="truncate font-medium">{user.name || "—"}</p>
                  {isSelf ? (
                    <span className="text-xs text-muted-foreground">You</span>
                  ) : null}
                </div>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {user.email || "—"}
              </TableCell>
              <TableCell>
                <Select
                  value={user.role}
                  onValueChange={(value) =>
                    handleRoleChange(user, value as DashboardRole)
                  }
                  disabled={isSelf || isUpdating}
                >
                  <SelectTrigger
                    size="sm"
                    className="w-[128px]"
                    aria-label={`Change role for ${user.name}`}
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ROLE_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell>
                <StatusCell status={user.status} />
              </TableCell>
              <TableCell>
                {user.status === "active" ? (
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    disabled={isSelf || isUpdating}
                    onClick={() => setConfirmUser(user)}
                  >
                    <UserX aria-hidden="true" />
                    {isUpdating ? "Working..." : "Deactivate"}
                  </Button>
                ) : (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={isUpdating}
                    onClick={() => handleActivate(user)}
                  >
                    <UserCheck aria-hidden="true" />
                    {isUpdating ? "Working..." : "Activate"}
                  </Button>
                )}
              </TableCell>
            </TableRow>
          )
        })}
      </DashboardTable>

      <Dialog
        open={confirmUser !== null}
        onOpenChange={(open) => {
          if (!open) setConfirmUser(null)
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Deactivate {confirmUser?.name || "this user"}?
            </DialogTitle>
            <DialogDescription>
              This user will not be able to use their account until an admin
              activates it again.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter showCloseButton>
            <DialogClose render={<Button variant="outline" />}>
              Cancel
            </DialogClose>
            <DialogClose
              render={
                <Button
                  variant="destructive"
                  onClick={handleDeactivateConfirm}
                  disabled={updatingId === confirmUser?.id}
                >
                  {updatingId === confirmUser?.id
                    ? "Deactivating..."
                    : "Deactivate"}
                </Button>
              }
            >
              Deactivate
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

function StatusCell({ status }: { status: UserAccountStatus }) {
  return (
    <Badge variant={status === "active" ? "success" : "danger"}>
      {status === "active" ? "Active" : "Inactive"}
    </Badge>
  )
}

function AdminUsersSkeleton() {
  return (
    <Card className="overflow-hidden p-0">
      <div className="border-b border-border bg-muted/60 p-3">
        <Skeleton className="h-4 w-40" />
      </div>
      <div className="divide-y divide-border">
        {Array.from({ length: 5 }, (_, index) => (
          <div key={index} className="flex items-center gap-3 p-3">
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-40 max-w-full" />
              <Skeleton className="h-3 w-56 max-w-full" />
            </div>
            <Skeleton className="hidden h-9 w-32 sm:block" />
            <Skeleton className="hidden h-6 w-16 sm:block" />
            <Skeleton className="h-9 w-24" />
          </div>
        ))}
      </div>
    </Card>
  )
}

export { AdminUsersList }
