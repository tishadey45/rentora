"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  LogIn,
  LogOut,
  Menu,
  UserPlus,
  X,
} from "lucide-react"
import { cn } from "cn"

import { Container } from "@/components/layout/container"
import { Logo } from "@/components/layout/logo"
import { ThemeToggle } from "@/components/layout/theme-toggle"
import { buttonVariants } from "@/components/ui/button"

export type NavbarRole = "customer" | "owner" | "admin"

export type NavbarUser = {
  name: string
  role: NavbarRole
}

type NavbarProps = {
  user?: NavbarUser | null
  onLogout?: () => void
}

const navLinks = [
  { label: "Home", href: "/" },
  { label: "All Equipment", href: "/equipment" },
  { label: "About Us", href: "/about" },
  { label: "Contact Us", href: "/contact" },
  { label: "How It Works", href: "/how-it-works" },
] as const

function isActiveRoute(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/"
  }

  return pathname === href || pathname.startsWith(`${href}/`)
}

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("")
}

function Navbar({ user = null, onLogout }: NavbarProps) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) {
      return
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false)
      }
    }

    window.addEventListener("keydown", handleKeyDown)

    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [open])

  const closeMenu = () => setOpen(false)

  return (
    <header className="sticky top-0 z-50 border-b border-border/80 bg-background/85 backdrop-blur-md">
      <Container className="flex h-16 items-center justify-between gap-6 lg:h-[4.5rem]">
        <Logo />

        <nav
          aria-label="Primary"
          className="hidden items-center gap-1 lg:flex"
        >
          {navLinks.map((link) => {
            const active = isActiveRoute(pathname, link.href)

            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative rounded-md px-3 py-2 text-sm font-medium transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
                  "after:absolute after:inset-x-3 after:-bottom-px after:h-0.5 after:origin-left after:scale-x-0 after:rounded-full after:bg-emerald-strong after:transition-transform after:duration-200 hover:after:scale-x-100",
                  active
                    ? "text-foreground after:scale-x-100"
                    : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                )}
              >
                {link.label}
              </Link>
            )
          })}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />

          <div className="hidden items-center gap-2 lg:flex">
            {user ? (
              <>
                <span className="mr-1 flex items-center gap-2">
                  <span
                    aria-hidden="true"
                    className="grid size-8 place-items-center rounded-full bg-navy-100 font-heading text-xs font-semibold text-navy-900"
                  >
                    {getInitials(user.name)}
                  </span>
                  <span className="text-sm font-medium text-foreground">
                    {user.name}
                  </span>
                </span>
                <Link
                  href="/dashboard"
                  className={cn(
                    buttonVariants({ variant: "outline", size: "sm" })
                  )}
                >
                  <LayoutDashboard aria-hidden="true" />
                  Dashboard
                </Link>
                <button
                  type="button"
                  onClick={onLogout}
                  className={cn(
                    buttonVariants({ variant: "ghost", size: "sm" })
                  )}
                >
                  <LogOut aria-hidden="true" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className={cn(
                    buttonVariants({ variant: "ghost", size: "sm" })
                  )}
                >
                  <LogIn aria-hidden="true" />
                  Login
                </Link>
                <Link
                  href="/register"
                  className={cn(buttonVariants({ size: "sm" }))}
                >
                  <UserPlus aria-hidden="true" />
                  Register
                </Link>
              </>
            )}
          </div>

          <button
            type="button"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close navigation menu" : "Open navigation menu"}
            onClick={() => setOpen((current) => !current)}
            className="inline-flex size-10 items-center justify-center rounded-md border border-border text-foreground transition-colors duration-200 hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none lg:hidden"
          >
            {open ? (
              <X aria-hidden="true" className="size-5" />
            ) : (
              <Menu aria-hidden="true" className="size-5" />
            )}
          </button>
        </div>
      </Container>

      {open && (
        <div
          id="mobile-menu"
          className="animate-in fade-in-0 slide-in-from-top-1 border-t border-border bg-background duration-200 lg:hidden"
        >
          <Container>
            <nav aria-label="Mobile" className="flex flex-col py-4">
              {navLinks.map((link) => {
                const active = isActiveRoute(pathname, link.href)

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={closeMenu}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "border-l-2 py-2.5 pl-3 text-sm font-medium transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
                      active
                        ? "border-emerald-strong bg-muted/60 text-foreground"
                        : "border-transparent text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                    )}
                  >
                    {link.label}
                  </Link>
                )
              })}

              <div className="mt-4 flex flex-col gap-2 border-t border-border pt-4">
                {user ? (
                  <>
                    <Link
                      href="/dashboard"
                      onClick={closeMenu}
                      className={cn(
                        buttonVariants({ variant: "outline", size: "default" }),
                        "w-full"
                      )}
                    >
                      <LayoutDashboard aria-hidden="true" />
                      Dashboard
                    </Link>
                    <button
                      type="button"
                      onClick={() => {
                        closeMenu()
                        onLogout?.()
                      }}
                      className={cn(
                        buttonVariants({ variant: "ghost", size: "default" }),
                        "w-full"
                      )}
                    >
                      <LogOut aria-hidden="true" />
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      onClick={closeMenu}
                      className={cn(
                        buttonVariants({ variant: "ghost", size: "default" }),
                        "w-full"
                      )}
                    >
                      <LogIn aria-hidden="true" />
                      Login
                    </Link>
                    <Link
                      href="/register"
                      onClick={closeMenu}
                      className={cn(
                        buttonVariants({ size: "default" }),
                        "w-full"
                      )}
                    >
                      <UserPlus aria-hidden="true" />
                      Register
                    </Link>
                  </>
                )}
              </div>
            </nav>
          </Container>
        </div>
      )}
    </header>
  )
}

export { Navbar }