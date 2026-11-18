import { Section } from "@/components/layout/section"
import { Skeleton } from "@/components/ui/skeleton"
import { featuredEquipmentCopy } from "@/lib/equipment/featured-copy"

const skeletonCards = Array.from(
  { length: 6 },
  (_, index) => `featured-skeleton-${index}`
)

function FeaturedEquipmentSkeleton() {
  return (
    <Section
      tone="muted"
      eyebrow={featuredEquipmentCopy.eyebrow}
      title={featuredEquipmentCopy.title}
      description={featuredEquipmentCopy.description}
    >
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {skeletonCards.map((key) => (
          <div
            key={key}
            className="overflow-hidden rounded-xl border border-border bg-card shadow-card"
          >
            <Skeleton className="aspect-[4/3] w-full rounded-none" />
            <div className="flex flex-col gap-4 p-5">
              <div className="flex flex-col gap-2">
                <Skeleton className="h-5 w-2/3" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/5" />
              </div>
              <div className="flex items-end justify-between gap-3 pt-1">
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-4 w-20" />
              </div>
              <div className="flex items-center justify-between gap-3 border-t border-border pt-4">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-9 w-28" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </Section>
  )
}

export { FeaturedEquipmentSkeleton }