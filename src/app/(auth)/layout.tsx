import type { ReactNode } from "react"
import Image from "next/image"
import { Check } from "lucide-react"

import { Logo } from "@/components/layout/logo"
import { ThemeToggle } from "@/components/layout/theme-toggle"
import { H2 } from "@/components/ui/typography"

const trustPoints = [
  "Verified owners",
  "Flexible rental terms",
  "Secure payments",
]

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="grid min-h-svh bg-background lg:grid-cols-[1.05fr_1fr]">
      <aside className="relative hidden overflow-hidden bg-navy-950 lg:flex lg:flex-col">
        <Image
          src="/images/hero-equipment.jpg"
          alt=""
          fill
          preload
          sizes="(min-width: 1024px) 52vw, 100vw"
          className="object-cover opacity-45"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-b from-navy-950/55 via-navy-950/70 to-navy-950/95"
        />

        <div className="relative z-10 flex h-full flex-col justify-between p-10 xl:p-12">
          <Logo
            className="focus-visible:ring-emerald-300 focus-visible:ring-offset-2 focus-visible:ring-offset-navy-950"
            wordmarkClassName="text-white"
          />

          <div className="max-w-md">
            <p className="text-xs font-semibold tracking-[0.14em] text-emerald-300 uppercase">
              Rentora marketplace
            </p>
            <H2 className="mt-4 text-white">
              The right equipment, ready for the work ahead.
            </H2>
            <p className="mt-4 text-sm leading-relaxed text-navy-200">
              Rent reliable machinery for your next project or turn your own
              equipment into a rental business.
            </p>
            <ul className="mt-6 space-y-3 text-sm text-navy-100">
              {trustPoints.map((point) => (
                <li key={point} className="flex items-center gap-2">
                  <Check
                    aria-hidden="true"
                    className="size-4 shrink-0 text-emerald-300"
                  />
                  {point}
                </li>
              ))}
            </ul>
          </div>

          <p className="text-xs text-navy-300">Equipment rental, simplified.</p>
        </div>
      </aside>

      <section className="flex min-h-svh flex-col bg-background">
        <header className="flex items-center justify-between px-4 py-4 sm:px-6 lg:justify-end lg:px-8">
          <Logo className="lg:hidden" />
          <ThemeToggle />
        </header>

        <main className="flex flex-1 items-center justify-center px-4 pt-2 pb-10 sm:px-6 lg:px-10">
          <div className="w-full max-w-md">{children}</div>
        </main>
      </section>
    </div>
  )
}