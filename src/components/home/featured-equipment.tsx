"use client"

import Link from "next/link"
import {
  cubicBezier,
  MotionConfig,
  motion,
  type Variants,
} from "framer-motion"
import { AlertTriangle, ArrowRight, PackageOpen, RefreshCw } from "lucide-react"
import { cn } from "cn"

import { EquipmentCard } from "@/components/equipment/equipment-card"
import { Section } from "@/components/layout/section"
import { Button, buttonVariants } from "@/components/ui/button"
import { H3, Muted } from "@/components/ui/typography"
import { featuredEquipmentCopy } from "@/lib/equipment/featured-copy"
import type { Equipment } from "@/types/equipment"

const ease = cubicBezier(0.22, 1, 0.36, 1)

const gridVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.06 },
  },
}

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease },
  },
}

type FeaturedEquipmentProps = {
  equipment: Equipment[]
  error?: string | null
  isAuthenticated?: boolean
  onRetry: () => void
}

function FeaturedEquipment({
  equipment,
  error,
  isAuthenticated = false,
  onRetry,
}: FeaturedEquipmentProps) {
  return (
    <MotionConfig reducedMotion="user">
      <Section
        tone="muted"
        eyebrow={featuredEquipmentCopy.eyebrow}
        title={featuredEquipmentCopy.title}
        description={featuredEquipmentCopy.description}
      >
        {error ? (
          <FeaturedEquipmentError message={error} onRetry={onRetry} />
        ) : equipment.length === 0 ? (
          <FeaturedEquipmentEmpty />
        ) : (
          <>
            <motion.ul
              variants={gridVariants}
              initial="hidden"
              animate="visible"
              className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
            >
              {equipment.map((item) => (
                <motion.li
                  key={item.id}
                  variants={cardVariants}
                  className="h-full"
                >
                  <EquipmentCard
                    equipment={item}
                    isAuthenticated={isAuthenticated}
                  />
                </motion.li>
              ))}
            </motion.ul>

            <div className="mt-10 flex justify-center">
              <Link
                href="/equipment"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "group"
                )}
              >
                Browse all equipment
                <ArrowRight
                  aria-hidden="true"
                  className="transition-transform duration-200 group-hover:translate-x-0.5"
                />
              </Link>
            </div>
          </>
        )}
      </Section>
    </MotionConfig>
  )
}

function FeaturedEquipmentEmpty() {
  return (
    <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-border bg-card px-6 py-14 text-center shadow-card">
      <span className="grid size-12 place-items-center rounded-full bg-muted text-muted-foreground">
        <PackageOpen aria-hidden="true" className="size-6" />
      </span>
      <H3>No featured equipment yet</H3>
      <Muted className="max-w-md">
        New listings are reviewed before they appear here. Check back soon or
        browse the full marketplace.
      </Muted>
      <Link
        href="/equipment"
        className={cn(buttonVariants({ variant: "outline" }), "mt-2")}
      >
        Browse marketplace
        <ArrowRight aria-hidden="true" />
      </Link>
    </div>
  )
}

function FeaturedEquipmentError({
  message,
  onRetry,
}: {
  message: string
  onRetry: () => void
}) {
  return (
    <div
      role="alert"
      className="flex flex-col items-center gap-3 rounded-xl border border-border bg-card px-6 py-14 text-center shadow-card"
    >
      <span className="grid size-12 place-items-center rounded-full bg-warning-soft text-warning">
        <AlertTriangle aria-hidden="true" className="size-6" />
      </span>
      <H3>Unable to load featured equipment</H3>
      <Muted className="max-w-md">{message}</Muted>
      <Button variant="outline" onClick={onRetry} className="mt-2">
        <RefreshCw aria-hidden="true" />
        Try again
      </Button>
    </div>
  )
}

export { FeaturedEquipment }