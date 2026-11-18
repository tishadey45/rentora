import Link from "next/link"
import { cacheLife } from "next/cache"
import { Mail, MapPin, Phone } from "lucide-react"

import { Container } from "@/components/layout/container"
import { Logo } from "@/components/layout/logo"
import { equipmentCategoryItems } from "@/lib/equipment/categories"

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "All Equipment", href: "/equipment" },
  { label: "About Us", href: "/about" },
  { label: "Contact Us", href: "/contact" },
  { label: "How It Works", href: "/how-it-works" },
] as const

const socialLinks = [
  { label: "X", icon: XIcon },
  { label: "Facebook", icon: FacebookIcon },
  { label: "Instagram", icon: InstagramIcon },
  { label: "LinkedIn", icon: LinkedInIcon },
] as const

const footerHeadingClassName =
  "font-heading text-xs font-semibold tracking-[0.14em] text-emerald-300 uppercase"

const footerLinkClassName =
  "inline-block rounded-sm py-1.5 text-sm text-navy-200 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 focus-visible:ring-offset-2 focus-visible:ring-offset-navy-950"

type BrandIconProps = {
  className?: string
}

function XIcon({ className }: BrandIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.451-6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z" />
    </svg>
  )
}

function FacebookIcon({ className }: BrandIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.413c0-3.017 1.792-4.684 4.533-4.684 1.313 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.93-1.956 1.886v2.27h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073Z" />
    </svg>
  )
}

function InstagramIcon({ className }: BrandIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
      className={className}
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
    </svg>
  )
}

function LinkedInIcon({ className }: BrandIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286ZM5.337 7.433a2.062 2.062 0 1 1 0-4.124 2.062 2.062 0 0 1 0 4.124ZM7.119 20.452H3.554V9h3.565v11.452ZM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0Z" />
    </svg>
  )
}

async function getCurrentYear() {
  "use cache"
  cacheLife("days")
  return new Date().getFullYear()
}

async function Footer() {
  const year = await getCurrentYear()

  return (
    <footer className="border-t border-white/10 bg-navy-950 text-navy-100">
      <Container className="py-14 sm:py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_0.7fr_1fr_1.1fr] lg:gap-12">
          <div className="max-w-sm">
            <Logo
              className="focus-visible:ring-emerald-300 focus-visible:ring-offset-2 focus-visible:ring-offset-navy-950"
              wordmarkClassName="text-white"
            />
            <p className="mt-4 text-sm leading-relaxed text-navy-200">
              Rentora makes equipment rental simpler by connecting people with
              the tools and machinery they need for their projects.
            </p>

            <div className="mt-6">
              <p className={footerHeadingClassName}>Follow Rentora</p>
              <div className="mt-3 flex gap-2">
                {socialLinks.map((social) => {
                  const Icon = social.icon

                  return (
                    <span
                      key={social.label}
                      role="img"
                      aria-label={`${social.label} social link coming soon`}
                      title={`${social.label} link coming soon`}
                      className="grid size-9 cursor-default place-items-center rounded-lg border border-white/10 bg-white/5 text-navy-200"
                    >
                      <Icon className="size-4" />
                    </span>
                  )
                })}
              </div>
              <p className="mt-3 text-xs text-navy-300">
                Social links coming soon
              </p>
            </div>
          </div>

          <nav aria-labelledby="footer-quick-links">
            <h2 id="footer-quick-links" className={footerHeadingClassName}>
              Quick Links
            </h2>
            <ul className="mt-4 flex flex-col gap-1">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={footerLinkClassName}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-labelledby="footer-categories">
            <h2 id="footer-categories" className={footerHeadingClassName}>
              Popular Categories
            </h2>
            <ul className="mt-4 flex flex-col gap-1">
              {equipmentCategoryItems.map((category) => (
                <li key={category.value}>
                  <Link
                    href={`/equipment?category=${encodeURIComponent(category.value)}`}
                    className={footerLinkClassName}
                  >
                    {category.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className={footerHeadingClassName}>Contact</h2>
            <address className="mt-4 flex flex-col gap-4 text-sm not-italic text-navy-200">
              <span className="flex items-start gap-2.5">
                <Mail
                  aria-hidden="true"
                  className="mt-0.5 size-4 shrink-0 text-emerald-300"
                />
                <span>Email support coming soon</span>
              </span>
              <span className="flex items-start gap-2.5">
                <Phone
                  aria-hidden="true"
                  className="mt-0.5 size-4 shrink-0 text-emerald-300"
                />
                <span>Phone support coming soon</span>
              </span>
              <span className="flex items-start gap-2.5">
                <MapPin
                  aria-hidden="true"
                  className="mt-0.5 size-4 shrink-0 text-emerald-300"
                />
                <span>Service area details coming soon</span>
              </span>
            </address>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-white/10 pt-6 text-xs text-navy-300 sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} Rentora. All rights reserved.</p>
          <p>Equipment rental, simplified.</p>
        </div>
      </Container>
    </footer>
  )
}

export { Footer }