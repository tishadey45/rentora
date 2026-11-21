"use client"

import { useState } from "react"
import Image from "next/image"
import { ImageOff } from "lucide-react"
import { cn } from "cn"

type EquipmentImageProps = {
  src: string
  alt: string
  className?: string
  sizes?: string
  eager?: boolean
}

function EquipmentImage({
  src,
  alt,
  className,
  sizes = "(min-width: 1024px) 50vw, 100vw",
  eager = false,
}: EquipmentImageProps) {
  const [failed, setFailed] = useState(false)

  if (!src || failed) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-muted text-muted-foreground">
        <div className="flex flex-col items-center gap-2 p-6 text-center">
          <ImageOff aria-hidden="true" className="size-8" />
          <span className="text-xs font-medium">Image unavailable</span>
        </div>
      </div>
    )
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      loading={eager ? "eager" : undefined}
      className={cn("object-cover", className)}
      onError={() => setFailed(true)}
    />
  )
}

export { EquipmentImage }