"use client"

import Image from "next/image"
import {
  cubicBezier,
  MotionConfig,
  motion,
  type Variants,
} from "framer-motion"
import {
  Activity,
  ArrowRight,
  ListChecks,
  TrendingUp,
  Users,
  type LucideIcon,
} from "lucide-react"

import { Section } from "@/components/layout/section"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { H3, Muted } from "@/components/ui/typography"

// Future owner registration route: /register?role=owner
type OwnerBenefit = {
  title: string
  description: string
  icon: LucideIcon
}

const benefits: OwnerBenefit[] = [
  {
    title: "Reach More Customers",
    description:
      "Put your equipment in front of renters who are actively searching.",
    icon: Users,
  },
  {
    title: "Manage Rental Listings",
    description:
      "Keep listing details, availability, and rental terms organized.",
    icon: ListChecks,
  },
  {
    title: "Track Rental Activities",
    description:
      "Follow rental activity and stay on top of upcoming requests.",
    icon: Activity,
  },
  {
    title: "Grow Your Rental Business",
    description:
      "Build a reliable rental presence as your catalog grows.",
    icon: TrendingUp,
  },
]

const ease = cubicBezier(0.22, 1, 0.36, 1)

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease },
  },
}

const listVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.06 },
  },
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease },
  },
}

function TrustedOwners() {
  return (
    <MotionConfig reducedMotion="user">
      <Section
        eyebrow="For equipment owners"
        title="Turn Your Equipment Into a Rental Business"
        description="Reach more customers, organize your listings, and grow with a marketplace built for equipment owners."
      >
        <motion.div
          variants={cardVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <Card className="gap-0 overflow-hidden p-0 transition-[border-color,box-shadow] duration-300 hover:border-emerald-strong/20 hover:shadow-card-hover lg:grid lg:grid-cols-2">
            <div className="relative min-h-64 overflow-hidden sm:aspect-[16/10] lg:aspect-auto lg:min-h-full">
              <Image
                src="/images/equipment/excavator.jpg"
                alt="Yellow excavator on a construction site"
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-navy-950/70 via-navy-950/10 to-transparent"
              />
              <span className="absolute bottom-4 left-4 rounded-lg border border-white/15 bg-navy-950/55 px-3 py-2 text-xs font-medium text-white backdrop-blur-sm">
                Built for equipment owners
              </span>
            </div>

            <div className="flex flex-col justify-center gap-8 p-6 sm:p-8 lg:p-10">
              <motion.ul
                variants={listVariants}
                className="grid gap-5 sm:grid-cols-2"
              >
                {benefits.map((benefit) => {
                  const Icon = benefit.icon

                  return (
                    <motion.li
                      key={benefit.title}
                      variants={itemVariants}
                      className="flex gap-3"
                    >
                      <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-emerald-soft text-emerald-strong">
                        <Icon aria-hidden="true" className="size-5" />
                      </span>
                      <div>
                        <H3 className="text-base lg:text-base">{benefit.title}</H3>
                        <Muted className="mt-1 text-sm">
                          {benefit.description}
                        </Muted>
                      </div>
                    </motion.li>
                  )
                })}
              </motion.ul>

              <motion.div
                variants={itemVariants}
                className="flex flex-col items-start gap-2"
              >
                <Button
                  type="button"
                  variant="secondary"
                  size="lg"
                  disabled
                  aria-describedby="owner-registration-note"
                >
                  Become an Equipment Owner
                  <ArrowRight aria-hidden="true" />
                </Button>
                <Muted id="owner-registration-note" className="text-xs">
                  Owner registration coming soon
                </Muted>
              </motion.div>
            </div>
          </Card>
        </motion.div>
      </Section>
    </MotionConfig>
  )
}

export { TrustedOwners }