import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, PackageOpen } from "lucide-react"

import { Section } from "@/components/layout/section"
import { PageHeader } from "@/components/shared/page-header"
import { buttonVariants } from "@/components/ui/button"
import { H3, Muted } from "@/components/ui/typography"

export const metadata: Metadata = {
  title: "All Equipment",
  description:
    "Browse construction, photography, agriculture, and event equipment available on Rentora.",
}

export default function EquipmentPage() {
  return (
    <>
      <PageHeader
        eyebrow="Marketplace"
        title="All Equipment"
        description="The full equipment catalog is being prepared. Explore the featured listings on the home page today, or learn how renting with Rentora works."
      />

      <Section tone="muted">
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-3 rounded-xl border border-border bg-card px-6 py-12 text-center shadow-card">
          <span className="grid size-12 place-items-center rounded-full bg-muted text-muted-foreground">
            <PackageOpen aria-hidden="true" className="size-6" />
          </span>
          <H3>Equipment catalog coming soon</H3>
          <Muted className="max-w-md">
            Approved listings from verified owners will appear here with
            categories, availability, and rental terms.
          </Muted>
          <div className="mt-2 flex flex-col gap-3 sm:flex-row">
            <Link href="/" className={buttonVariants()}>
              View featured equipment
              <ArrowRight aria-hidden="true" />
            </Link>
            <Link
              href="/how-it-works"
              className={buttonVariants({ variant: "outline" })}
            >
              How it works
            </Link>
          </div>
        </div>
      </Section>
    </>
  )
}