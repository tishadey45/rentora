import { Section } from "@/components/layout/section"
import { Skeleton } from "@/components/ui/skeleton"

export default function EquipmentDetailsLoading() {
  return (
    <Section>
      <Skeleton className="mb-6 h-9 w-40" />

      <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
        <Skeleton className="aspect-4/3 w-full rounded-xl" />

        <div className="flex flex-col gap-4">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-6 w-40" />
          <Skeleton className="mt-2 h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="mt-4 h-14 w-full" />
          <div className="mt-2 flex flex-col gap-3 sm:flex-row">
            <Skeleton className="h-12 flex-1 rounded-lg" />
            <Skeleton className="h-12 w-full rounded-lg sm:w-48" />
          </div>
        </div>
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-3">
        <Skeleton className="h-56 w-full rounded-xl lg:col-span-2" />
        <Skeleton className="h-56 w-full rounded-xl" />
      </div>
    </Section>
  )
}