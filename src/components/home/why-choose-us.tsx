"use client"

import {
  cubicBezier,
  MotionConfig,
  motion,
  type Variants,
} from "framer-motion"
import {
  CalendarDays,
  CreditCard,
  ShieldCheck,
  Wallet,
  type LucideIcon,
} from "lucide-react"

import { Section } from "@/components/layout/section"
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

type WhyChooseUsBenefit = {
  title: string
  description: string
  icon: LucideIcon
}

const benefits: WhyChooseUsBenefit[] = [
  {
    title: "Affordable Rental Prices",
    description:
      "Compare daily, weekly, and monthly rates to find equipment that fits your budget.",
    icon: Wallet,
  },
  {
    title: "Verified Equipment Owners",
    description:
      "Owner verification is part of Rentora's trust-first approach to responsible equipment rental.",
    icon: ShieldCheck,
  },
  {
    title: "Flexible Rental Periods",
    description:
      "Choose daily, weekly, or monthly terms based on your project timeline.",
    icon: CalendarDays,
  },
  {
    title: "Transparent Rental Pricing",
    description:
      "Clear rental pricing helps customers understand equipment costs before making a booking.",
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

function WhyChooseUs() {
  return (
    <MotionConfig reducedMotion="user">
      <Section
        tone="muted"
        eyebrow="Why Rentora"
        title="Why Choose Us"
        description="A simpler, more transparent way to rent the equipment your project needs."
      >
        <motion.ul
          variants={listVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          {benefits.map((benefit) => {
            const Icon = benefit.icon

            return (
              <motion.li
                key={benefit.title}
                variants={itemVariants}
                className="h-full"
              >
                <Card className="h-full transition-[transform,border-color,box-shadow] duration-300 hover:-translate-y-1 hover:border-emerald-strong/30 hover:shadow-card-hover">
                  <CardHeader className="gap-3">
                    <span className="grid size-12 place-items-center rounded-xl bg-emerald-soft text-emerald-strong transition-transform duration-300 group-hover/card:scale-105">
                      <Icon aria-hidden="true" className="size-6" />
                    </span>
                    <CardTitle className="text-lg">{benefit.title}</CardTitle>
                    <CardDescription className="min-h-12 leading-relaxed">
                      {benefit.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </motion.li>
            )
          })}
        </motion.ul>
      </Section>
    </MotionConfig>
  )
}

export { WhyChooseUs }