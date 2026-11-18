"use client"

import {
  cubicBezier,
  MotionConfig,
  motion,
  type Variants,
} from "framer-motion"
import {
  CalendarCheck,
  CreditCard,
  Search,
  type LucideIcon,
} from "lucide-react"

import { Section } from "@/components/layout/section"
import {
  Card,
  CardDescription,
  CardHeader,
} from "@/components/ui/card"
import { H3 } from "@/components/ui/typography"

type RentalStep = {
  title: string
  description: string
  icon: LucideIcon
}

const steps: RentalStep[] = [
  {
    title: "Find Equipment",
    description: "Browse and search for the equipment you need.",
    icon: Search,
  },
  {
    title: "Book Your Rental",
    description: "Select your rental dates and required quantity.",
    icon: CalendarCheck,
  },
  {
    title: "Pay & Get Started",
    description:
      "Review your rental details and proceed with the payment process.",
    icon: CreditCard,
  },
]

const ease = cubicBezier(0.22, 1, 0.36, 1)

const listVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.06 },
  },
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease },
  },
}

function HowItWorks() {
  return (
    <MotionConfig reducedMotion="user">
      <Section
        tone="muted"
        eyebrow="Simple rental process"
        title="How It Works"
        description="Three straightforward steps from finding equipment to starting your rental."
      >
        <div className="relative">
          <div
            aria-hidden="true"
            data-connector="horizontal"
            className="absolute top-6 right-[calc((100%_-_3rem)/6)] left-[calc((100%_-_3rem)/6)] hidden h-px bg-border lg:block"
          />

          <motion.ol
            variants={listVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="m-0 grid list-none gap-6 p-0 lg:grid-cols-3"
          >
            {steps.map((step, index) => {
              const Icon = step.icon

              return (
                <motion.li
                  key={step.title}
                  variants={itemVariants}
                  className="group/step relative grid h-full grid-cols-[3rem_1fr] gap-4 lg:grid-cols-1 lg:justify-items-center"
                >
                  {index < steps.length - 1 && (
                    <span
                      aria-hidden="true"
                      data-connector="vertical"
                      className="absolute top-12 -bottom-6 left-6 w-px bg-border lg:hidden"
                    />
                  )}

                  <span
                    aria-hidden="true"
                    className="relative z-10 grid size-12 place-items-center rounded-full border border-border bg-card font-heading text-sm font-semibold text-emerald-strong shadow-card transition-colors duration-300 group-hover/step:border-emerald-strong/30"
                  >
                    0{index + 1}
                  </span>

                  <Card className="h-full w-full transition-[transform,border-color,box-shadow] duration-300 hover:-translate-y-1 hover:border-emerald-strong/30 hover:shadow-card-hover lg:mt-4">
                    <CardHeader className="gap-3">
                      <span className="grid size-12 place-items-center rounded-xl bg-emerald-soft text-emerald-strong transition-transform duration-300 group-hover/card:scale-105">
                        <Icon aria-hidden="true" className="size-6" />
                      </span>
                      <H3 className="text-xl">{step.title}</H3>
                      <CardDescription className="min-h-12 leading-relaxed">
                        {step.description}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </motion.li>
              )
            })}
          </motion.ol>
        </div>
      </Section>
    </MotionConfig>
  )
}

export { HowItWorks }