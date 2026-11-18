"use client"

import Image from "next/image"
import Link from "next/link"
import {
  cubicBezier,
  MotionConfig,
  motion,
  type Variants,
} from "framer-motion"
import { ArrowRight, Check, PlayCircle, ShieldCheck } from "lucide-react"
import { cn } from "cn"

import { Container } from "@/components/layout/container"
import { buttonVariants } from "@/components/ui/button"
import { Display, Lead } from "@/components/ui/typography"

const ease = cubicBezier(0.22, 1, 0.36, 1)

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.04 },
  },
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease },
  },
}

const mediaVariants: Variants = {
  hidden: { opacity: 0, y: 22, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.65, ease },
  },
}

const trustPoints = [
  "Verified owners",
  "Flexible rental terms",
  "Secure payments",
]

function Hero() {
  return (
    <MotionConfig reducedMotion="user">
      <section className="relative overflow-hidden border-b border-border bg-background">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 opacity-40"
        style={{
          backgroundImage:
            "linear-gradient(to right, var(--border) 1px, transparent 1px), linear-gradient(to bottom, var(--border) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
          maskImage:
            "radial-gradient(ellipse 75% 65% at 50% 0%, black, transparent 78%)",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 right-0 -z-10 size-[32rem] rounded-full bg-emerald-soft opacity-70 blur-3xl dark:opacity-30"
      />

      <Container className="relative py-14 sm:py-20 lg:py-24">
        <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div
              variants={itemVariants}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground shadow-xs"
            >
              <span
                aria-hidden="true"
                className="size-1.5 rounded-full bg-emerald-strong"
              />
              Premium equipment marketplace
            </motion.div>

            <motion.div variants={itemVariants}>
              <Display className="mt-6 text-[clamp(2.5rem,1.4rem+3.6vw,4.5rem)] leading-[1.02]">
                The Right Equipment.
                <span className="block text-emerald-strong">
                  The Right Time.
                </span>
              </Display>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Lead className="mt-6 max-w-xl">
                Rent reliable equipment for your next project. Discover quality
                machinery, flexible rental plans, and trusted equipment owners
                in one place.
              </Lead>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center"
            >
              <Link
                href="/equipment"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "group transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
                )}
              >
                Explore Equipment
                <ArrowRight
                  aria-hidden="true"
                  className="transition-transform duration-200 group-hover:translate-x-0.5"
                />
              </Link>
              <Link
                href="/how-it-works"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "transition-all duration-200 hover:-translate-y-0.5 hover:bg-muted"
                )}
              >
                <PlayCircle aria-hidden="true" />
                How It Works
              </Link>
            </motion.div>

            <motion.ul
              variants={itemVariants}
              className="mt-9 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground"
            >
              {trustPoints.map((point) => (
                <li key={point} className="inline-flex items-center gap-1.5">
                  <Check aria-hidden="true" className="size-4 text-emerald-strong" />
                  {point}
                </li>
              ))}
            </motion.ul>
          </motion.div>

          <motion.div
            variants={mediaVariants}
            initial="hidden"
            animate="visible"
            className="relative mb-6 lg:mb-0"
          >
            <div
              aria-hidden="true"
              className="absolute -top-3 -right-3 -z-10 hidden size-28 rounded-2xl border border-emerald-strong/25 sm:block"
            />

            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-border bg-muted shadow-card-hover">
              <Image
                src="/images/hero-equipment.jpg"
                alt="Excavators and haul trucks moving earth at a large industrial site"
                fill
                preload
                sizes="(min-width: 1024px) 46vw, 100vw"
                className="object-cover"
              />
            </div>

            <div className="absolute -bottom-5 left-4 flex max-w-[calc(100%-2rem)] items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 shadow-card sm:left-6">
              <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-emerald-soft text-emerald-strong">
                <ShieldCheck aria-hidden="true" className="size-5" />
              </span>
              <div>
                <p className="text-sm font-semibold text-foreground">
                  Verified equipment owners
                </p>
                <p className="text-xs text-muted-foreground">
                  Every listing is reviewed before it goes live
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
    </MotionConfig>
  )
}

export { Hero }