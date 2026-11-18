"use client"

import Link from "next/link"
import {
  cubicBezier,
  MotionConfig,
  motion,
  type Variants,
} from "framer-motion"
import { ArrowUpRight } from "lucide-react"

import { Section } from "@/components/layout/section"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { equipmentCategoryItems } from "@/lib/equipment/categories"

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

function EquipmentCategories() {
  return (
    <MotionConfig reducedMotion="user">
      <Section
        eyebrow="Browse by category"
        title="Equipment Categories"
        description="Find the right gear for the job, from heavy machinery to event production."
      >
        <motion.ul
          variants={listVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {equipmentCategoryItems.map((category) => {
            const Icon = category.icon
            const href = `/equipment?category=${encodeURIComponent(category.value)}`

            return (
              <motion.li
                key={category.value}
                variants={itemVariants}
                className="h-full"
              >
                <Link
                  href={href}
                  className="group block h-full rounded-xl focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none"
                >
                  <Card className="h-full transition-[transform,border-color,box-shadow] duration-300 group-hover:-translate-y-1 group-hover:border-emerald-strong/30 group-hover:shadow-card-hover">
                    <CardHeader className="gap-3">
                      <span className="grid size-12 place-items-center rounded-xl bg-emerald-soft text-emerald-strong transition-transform duration-300 group-hover:scale-105">
                        <Icon aria-hidden="true" className="size-6" />
                      </span>
                      <CardTitle className="text-lg">{category.title}</CardTitle>
                      <CardDescription className="line-clamp-2 min-h-10 leading-relaxed">
                        {category.description}
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="mt-auto flex items-center justify-between pt-0">
                      <span className="text-sm font-medium text-emerald-strong">
                        Browse category
                      </span>
                      <ArrowUpRight
                        aria-hidden="true"
                        className="size-4 text-muted-foreground transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                      />
                    </CardContent>
                  </Card>
                </Link>
              </motion.li>
            )
          })}
        </motion.ul>
      </Section>
    </MotionConfig>
  )
}

export { EquipmentCategories }