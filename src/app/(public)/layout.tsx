import type { ReactNode } from "react"

import { Navbar } from "@/components/layout/navbar"

type PublicLayoutProps = {
  children: ReactNode
}

export default function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <>
      <Navbar />
      {children}
    </>
  )
}