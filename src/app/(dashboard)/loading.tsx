import { Skeleton } from "@/components/ui/skeleton"

export default function DashboardLoading() {
  return (
    <div className="flex min-h-svh bg-muted/30">
      <div className="hidden w-64 shrink-0 border-r border-border bg-sidebar p-4 lg:block">
        <Skeleton className="h-10 w-32" />
        <Skeleton className="mt-6 h-20 w-full" />
        <div className="mt-6 space-y-2">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex h-16 items-center justify-between border-b border-border px-4 sm:px-6">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="size-9 rounded-full" />
        </div>
        <div className="flex-1 p-4 sm:p-6 lg:p-8">
          <Skeleton className="h-9 w-64" />
          <Skeleton className="mt-3 h-4 w-96 max-w-full" />
          <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 4 }, (_, index) => (
              <Skeleton key={index} className="h-32 w-full" />
            ))}
          </div>
          <Skeleton className="mt-6 h-64 w-full" />
        </div>
      </div>
    </div>
  )
}