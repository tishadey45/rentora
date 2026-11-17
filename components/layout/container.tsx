import * as React from "react"
import { cn } from "cn"

const containerSizes = {
  default: "max-w-7xl",
  wide: "max-w-[90rem]",
  narrow: "max-w-3xl",
} as const

type ContainerProps = React.ComponentProps<"div"> & {
  size?: keyof typeof containerSizes
}

function Container({ size = "default", className, ...props }: ContainerProps) {
  return (
    <div
      data-slot="container"
      className={cn(
        "mx-auto w-full px-4 sm:px-6 lg:px-8",
        containerSizes[size],
        className
      )}
      {...props}
    />
  )
}

export { Container }