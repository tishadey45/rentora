import type { ReactNode } from "react"

import { Footer } from "@/components/layout/footer"
import { Navbar } from "@/components/layout/navbar"
import { Toaster } from "react-hot-toast";

type PublicLayoutProps = {
  children: ReactNode
}

export default function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <>
      <Navbar />
      {children}
      <Toaster position="top-center" />
      <Footer />
    </>
  )
}