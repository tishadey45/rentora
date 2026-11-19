"use client"

import Link from "next/link"

import { GoogleAuthButton } from "@/components/auth/google-auth-button"
import { PasswordInput } from "@/components/auth/password-input"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { H1, Muted } from "@/components/ui/typography"
import { authClient } from "@/lib/auth-client";
import { redirect } from "next/navigation";
import toast from "react-hot-toast";

const passwordRequirements = [
  "At least one uppercase letter",
  "At least one lowercase letter",
  "Minimum 6 characters",
]

function RegisterForm() {
   const onSubmit = async (e: React.SubmitEvent<HTMLElement>) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const user = Object.fromEntries(formData.entries()) as {
      name: string;
      email: string;
      image: string;
      password: string;
    };

    const { data, error } = await authClient.signUp.email({
      ...user,
      callbackURL: "/",
    });

    if (data) {
      toast.success("Registration successful!");
      console.log(data);
      redirect("/");
    }

    if (error) {
      toast.error("Something went wrong!");
      console.log(error);
    }
  };

  return (
    <Card className="gap-6 p-6 sm:p-8">
      <div>
        <H1 className="text-3xl sm:text-4xl">Create your account</H1>
        <Muted className="mt-2">
          Join Rentora to rent equipment or list your own.
        </Muted>
      </div>

      <form
        noValidate
        onSubmit={onSubmit}
        className="space-y-5"
      >
        <div className="space-y-2">
          <Label htmlFor="register-name">Full Name</Label>
          <Input
            id="register-name"
            name="name"
            type="text"
            autoComplete="name"
            placeholder="Alex Morgan"
            className="h-11"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="register-email">Email</Label>
          <Input
            id="register-email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            className="h-11"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="register-photo-url">Profile Photo URL</Label>
          <Input
            id="register-photo-url"
            name="photoUrl"
            type="url"
            autoComplete="url"
            placeholder="https://example.com/photo.jpg"
            className="h-11"
            aria-describedby="register-photo-help"
          />
          <Muted id="register-photo-help" className="text-xs">
            Optional. Paste a direct image URL.
          </Muted>
        </div>

        <PasswordInput
          id="register-password"
          name="password"
          label="Password"
          autoComplete="new-password"
          placeholder="Create a password"
          descriptionId="register-password-requirements"
          description={
            <ul className="space-y-1">
              {passwordRequirements.map((requirement) => (
                <li
                  key={requirement}
                  className="flex items-start gap-1.5"
                >
                  <span
                    aria-hidden="true"
                    className="mt-1.5 size-1 shrink-0 rounded-full bg-emerald-strong"
                  />
                  {requirement}
                </li>
              ))}
            </ul>
          }
        />

        <PasswordInput
          id="register-confirm-password"
          name="confirmPassword"
          label="Confirm Password"
          autoComplete="new-password"
          placeholder="Re-enter your password"
        />

        <Button
          type="submit"
          variant="brand"
          size="lg"
          className="w-full"
        >
          Create account
        </Button>
      </form>

      <div className="flex items-center gap-3" aria-hidden="true">
        <span className="h-px flex-1 bg-border" />
        <span className="text-xs font-medium tracking-[0.14em] text-muted-foreground uppercase">
          Or
        </span>
        <span className="h-px flex-1 bg-border" />
      </div>

      <GoogleAuthButton label="Sign up with Google" />

      <Muted className="text-center">
        Already have an account?{" "}
        <Link
          href="/login"
          className="rounded-sm font-medium text-emerald-strong underline-offset-4 hover:underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        >
          Log in
        </Link>
      </Muted>
    </Card>
  )
}

export { RegisterForm }