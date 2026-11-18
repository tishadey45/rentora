import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, Mail } from "lucide-react"

import { Section } from "@/components/layout/section"
import { PageHeader } from "@/components/shared/page-header"
import { buttonVariants } from "@/components/ui/button"
import { H3, Muted } from "@/components/ui/typography"

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Contact options for Rentora renters and equipment owners are being prepared.",
}

export default function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="Contact Rentora"
        description="Support for renters and equipment owners is being set up. Until then, explore the marketplace or learn how renting works."
      />

      <Section tone="muted">
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-3 rounded-xl border border-border bg-card px-6 py-12 text-center shadow-card">
          <span className="grid size-12 place-items-center rounded-full bg-muted text-muted-foreground">
            <Mail aria-hidden="true" className="size-6" />
          </span>
          <H3>Support channels are on the way</H3>
          <Muted className="max-w-md">
            We are preparing contact options for rental questions, listing
            support, and account help. No contact details are published yet.
          </Muted>
          <div className="mt-2 flex flex-col gap-3 sm:flex-row">
            <Link href="/equipment" className={buttonVariants()}>
              Browse equipment
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