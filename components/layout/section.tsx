import * as React from "react"
import { cn } from "cn"

import { Container } from "@/components/layout/container"
import { Eyebrow, H2, Paragraph } from "@/components/ui/typography"

const toneStyles = {
  default: "bg-background text-foreground",
  muted: "bg-muted/60 text-foreground",
  navy: "bg-navy-950 text-navy-50",
} as const

type SectionProps = React.ComponentProps<"section"> & {
  tone?: keyof typeof toneStyles
  containerSize?: "default" | "wide" | "narrow"
  eyebrow?: string
  title?: React.ReactNode
  description?: React.ReactNode
  align?: "start" | "center"
}

function Section({
  tone = "default",
  containerSize = "default",
  eyebrow,
  title,
  description,
  align = "start",
  className,
  children,
  ...props
}: SectionProps) {
  const onNavy = tone === "navy"

  return (
    <section
      data-slot="section"
      data-tone={tone}
      className={cn("py-14 sm:py-20 lg:py-28", toneStyles[tone], className)}
      {...props}
    >
      <Container size={containerSize}>
        {(eyebrow || title || description) && (
          <div
            className={cn(
              "mb-10 flex max-w-3xl flex-col gap-3 sm:mb-14",
              align === "center" && "mx-auto items-center text-center"
            )}
          >
            {eyebrow && (
              <Eyebrow className={onNavy ? "text-emerald-300" : undefined}>
                {eyebrow}
              </Eyebrow>
            )}
            {title && (
              <H2 className={onNavy ? "text-white" : undefined}>{title}</H2>
            )}
            {description && (
              <Paragraph
                className={cn("max-w-2xl", onNavy && "text-navy-200")}
              >
                {description}
              </Paragraph>
            )}
          </div>
        )}
        {children}
      </Container>
    </section>
  )
}

export { Section }