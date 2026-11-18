import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, BadgeCheck, CalendarClock, ShieldCheck } from "lucide-react"

import { Section } from "@/components/layout/section"
import { PageHeader } from "@/components/shared/page-header"
import { buttonVariants } from "@/components/ui/button"
import { H3, Muted } from "@/components/ui/typography"

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn how Rentora connects renters with trusted equipment owners across construction, photography, agriculture, and events.",
}

const values = [
  {
    icon: BadgeCheck,
    title: "Verified owners",
    description:
      "Every listing is reviewed before it goes live, so renters can browse with confidence.",
  },
  {
    icon: CalendarClock,
    title: "Flexible rental terms",
    description:
      "Compare daily, weekly, and monthly options to match the length of your project.",
  },
  {
    icon: ShieldCheck,
    title: "Secure payments",
    description:
      "Rentora is designed around a secure checkout that protects both renters and owners.",
  },
]

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="About Rentora"
        title="Built for the work that needs the right tools"
        description="Rentora connects renters with trusted equipment owners across construction, photography, agriculture, and events."
      />

      <Section tone="muted">
        <div className="grid gap-6 md:grid-cols-3">
          {values.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="flex h-full flex-col gap-3 rounded-xl border border-border bg-card p-6 shadow-card"
            >
              <span className="grid size-11 place-items-center rounded-lg bg-emerald-soft text-emerald-strong">
                <Icon aria-hidden="true" className="size-5" />
              </span>
              <H3>{title}</H3>
              <Muted>{description}</Muted>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Link href="/" className={buttonVariants()}>
            Explore featured equipment
            <ArrowRight aria-hidden="true" />
          </Link>
          <Link
            href="/how-it-works"
            className={buttonVariants({ variant: "outline" })}
          >
            How it works
          </Link>
        </div>
      </Section>
    </>
  )
}