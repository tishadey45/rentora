"use client"

import Link from "next/link"

import { GoogleAuthButton } from "@/components/auth/google-auth-button"
import { PasswordInput } from "@/components/auth/password-input"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { H1, Muted } from "@/components/ui/typography"

function LoginForm() {
  return (
    <Card className="gap-6 p-6 sm:p-8">
      <div>
        <H1 className="text-3xl sm:text-4xl">Welcome back</H1>
        <Muted className="mt-2">
          Log in to manage your rentals and equipment listings.
        </Muted>
      </div>

      <form
        noValidate
        onSubmit={(event) => event.preventDefault()}
        className="space-y-5"
      >
        <div className="space-y-2">
          <Label htmlFor="login-email">Email</Label>
          <Input
            id="login-email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            className="h-11"
          />
        </div>

        <PasswordInput
          id="login-password"
          name="password"
          label="Password"
          autoComplete="current-password"
          placeholder="Enter your password"
        />

        <Button
          type="submit"
          variant="brand"
          size="lg"
          className="w-full"
        >
          Log in
        </Button>
      </form>

      <div className="flex items-center gap-3" aria-hidden="true">
        <span className="h-px flex-1 bg-border" />
        <span className="text-xs font-medium tracking-[0.14em] text-muted-foreground uppercase">
          Or
        </span>
        <span className="h-px flex-1 bg-border" />
      </div>

      <GoogleAuthButton label="Continue with Google" />

      <Muted className="text-center">
        New to Rentora?{" "}
        <Link
          href="/register"
          className="rounded-sm font-medium text-emerald-strong underline-offset-4 hover:underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        >
          Create an account
        </Link>
      </Muted>
    </Card>
  )
}

export { LoginForm }