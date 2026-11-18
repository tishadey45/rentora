import Link from "next/link"
import { cn } from "cn"

type LogoProps = {
  className?: string
}

function Logo({ className }: LogoProps) {
  return (
    <Link
      href="/"
      className={cn(
        "group inline-flex items-center gap-2.5 rounded-md focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
        className
      )}
    >
      <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-navy-900 text-white shadow-xs inset-ring-1 inset-ring-white/10 transition-colors duration-200 group-hover:bg-navy-800">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
          className="size-5"
        >
          <path
            d="M5 7.5 12 4l7 3.5v9L12 20l-7-3.5v-9Z"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <path
            d="M5 7.5 12 11l7-3.5M12 11v9"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinejoin="round"
            opacity="0.6"
          />
          <path
            d="M9 5.75 16 9.25"
            className="text-emerald-400"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
      </span>
      <span className="font-heading text-lg font-semibold tracking-tight text-foreground">
        Rentora
      </span>
    </Link>
  )
}

export { Logo }