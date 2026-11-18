import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, CalendarCheck, Search, ShieldCheck } from "lucide-react"

import { Section } from "@/components/layout/section"
import { PageHeader } from "@/components/shared/page-header"
import { buttonVariants } from "@/components/ui/button"
import { H3, Muted } from "@/components/ui/typography"

export const metadata: Metadata = {
  title: "How It Works",
  description:
    "Learn how browsing, comparing rental terms, and booking equipment works on Rentora.",
}

const steps = [
  {
    icon: Search,
    title: "Browse equipment",
    description:
      "Explore featured listings and compare categories, locations, and availability.",
  },
  {
    icon: CalendarCheck,
    title: "Review rental terms",
    description:
      "See daily, weekly, or monthly pricing and choose terms that fit your project.",
  },
  {
    icon: ShieldCheck,
    title: "Book securely",
    description:
      "Online booking and secure payments are coming next. Check back soon to reserve equipment.",
  },
]

export default function HowItWorksPage() {
  return (
    <>
      <PageHeader
        eyebrow="How It Works"
        title="Rental, without the runaround"
        description="The marketplace is live for browsing. Booking, payments, and owner tools are being prepared next."
      />

      <Section tone="muted">
        <ol className="grid gap-6 md:grid-cols-3">
          {steps.map(({ icon: Icon, title, description }, index) => (
            <li
              key={title}
              className="flex h-full flex-col gap-4 rounded-xl border border-border bg-card p-6 shadow-card"
            >
              <div className="flex items-center gap-3">
                <span className="grid size-10 place-items-center rounded-lg bg-emerald-soft text-emerald-strong">
                  <Icon aria-hidden="true" className="size-5" />
                </span>
                <span className="font-heading text-sm font-semibold tracking-[0.14em] text-muted-foreground uppercase">
                  Step 0{index + 1}
                </span>
              </div>
              <H3>{title}</H3>
              <Muted>{description}</Muted>
            </li>
          ))}
        </ol>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Link href="/equipment" className={buttonVariants()}>
            Browse equipment
            <ArrowRight aria-hidden="true" />
          </Link>
          <Link
            href="/about"
            className={buttonVariants({ variant: "outline" })}
          >
            About Rentora
          </Link>
        </div>
      </Section>
    </>
  )
}