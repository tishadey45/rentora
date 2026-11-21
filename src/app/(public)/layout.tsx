import type { ReactNode } from "react"

import { Footer } from "@/components/layout/footer"
import { NavbarAuth } from "@/components/layout/navbar-auth"

type PublicLayoutProps = {
  children: ReactNode
}

export default function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <>
      <NavbarAuth />
      {children}
      <Footer />
    </>
  )
}