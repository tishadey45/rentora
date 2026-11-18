import * as React from "react"
import { cn } from "cn"

const displayStyles =
  "font-heading text-[clamp(2.75rem,2rem+3vw,4.5rem)] leading-[1.02] font-semibold tracking-[-0.035em] text-balance"

const h1Styles =
  "font-heading text-[clamp(2.25rem,1.6rem+2.6vw,3.75rem)] leading-[1.05] font-semibold tracking-[-0.03em] text-balance"

const h2Styles =
  "font-heading text-[clamp(1.875rem,1.4rem+1.6vw,2.75rem)] leading-[1.1] font-semibold tracking-[-0.025em] text-balance"

const h3Styles =
  "font-heading text-2xl leading-snug font-semibold tracking-[-0.015em] text-balance lg:text-[1.75rem]"

const h4Styles =
  "font-heading text-lg leading-snug font-semibold tracking-[-0.01em]"

function Display({ className, ...props }: React.ComponentProps<"h1">) {
  return <h1 className={cn(displayStyles, className)} {...props} />
}

function H1({ className, ...props }: React.ComponentProps<"h1">) {
  return <h1 className={cn(h1Styles, className)} {...props} />
}

function H2({ className, ...props }: React.ComponentProps<"h2">) {
  return <h2 className={cn(h2Styles, className)} {...props} />
}

function H3({ className, ...props }: React.ComponentProps<"h3">) {
  return <h3 className={cn(h3Styles, className)} {...props} />
}

function H4({ className, ...props }: React.ComponentProps<"h4">) {
  return <h4 className={cn(h4Styles, className)} {...props} />
}

function Lead({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      className={cn(
        "text-lg leading-relaxed text-pretty text-muted-foreground sm:text-xl",
        className
      )}
      {...props}
    />
  )
}

function Paragraph({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      className={cn(
        "text-base leading-relaxed text-pretty text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}

function Muted({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      className={cn("text-sm leading-relaxed text-muted-foreground", className)}
      {...props}
    />
  )
}

function Eyebrow({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      className={cn(
        "text-xs font-semibold tracking-[0.14em] uppercase text-emerald-strong",
        className
      )}
      {...props}
    />
  )
}

export { Display, Eyebrow, H1, H2, H3, H4, Lead, Muted, Paragraph }