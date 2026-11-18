"use client"

import {
  cubicBezier,
  MotionConfig,
  motion,
  type Variants,
} from "framer-motion"
import { Star } from "lucide-react"

import { Section } from "@/components/layout/section"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card"
import { Muted } from "@/components/ui/typography"
import {
  sampleCustomerReviews,
  type ReviewRating,
} from "@/lib/mock/reviews"

const ratingValues = [1, 2, 3, 4, 5] as const

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

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("")
}

function StarRating({ rating }: { rating: ReviewRating }) {
  return (
    <div
      className="flex items-center gap-0.5"
      role="img"
      aria-label={`${rating} out of 5 stars`}
    >
      {ratingValues.map((value) => (
        <Star
          key={value}
          aria-hidden="true"
          className={
            value <= rating
              ? "size-4 fill-warning text-warning"
              : "size-4 fill-transparent text-muted-foreground/30"
          }
        />
      ))}
    </div>
  )
}

function CustomerReviews() {
  return (
    <MotionConfig reducedMotion="user">
      <Section
        eyebrow="Sample testimonials"
        title="Customer Reviews"
        description="Illustrative reviews from fictional renters. These sample testimonials are not verified customer feedback."
      >
        <motion.ul
          variants={listVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          {sampleCustomerReviews.map((review) => (
            <motion.li
              key={review.id}
              variants={itemVariants}
              className="h-full"
            >
              <Card className="h-full transition-[transform,border-color,box-shadow] duration-300 hover:-translate-y-1 hover:border-emerald-strong/30 hover:shadow-card-hover">
                <CardHeader className="gap-4">
                  <div className="flex items-center justify-between gap-3">
                    <StarRating rating={review.rating} />
                    <span className="text-xs font-medium text-muted-foreground">
                      {review.rating}/5
                    </span>
                  </div>

                  <CardDescription className="min-h-24 text-base leading-relaxed text-foreground">
                    “{review.comment}”
                  </CardDescription>
                </CardHeader>

                <CardContent className="mt-auto flex items-center gap-3 border-t border-border pt-4">
                  <span
                    aria-hidden="true"
                    className="grid size-10 shrink-0 place-items-center rounded-full bg-emerald-soft text-sm font-semibold text-emerald-strong"
                  >
                    {getInitials(review.name)}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-foreground">
                      {review.name}
                    </p>
                    <Muted className="text-xs">Sample review</Muted>
                  </div>
                </CardContent>
              </Card>
            </motion.li>
          ))}
        </motion.ul>
      </Section>
    </MotionConfig>
  )
}

export { CustomerReviews }
