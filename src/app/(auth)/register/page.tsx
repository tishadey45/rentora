import type { Metadata } from "next"

import { RegisterForm } from "@/components/auth/register-form"

export const metadata: Metadata = {
  title: "Create Account",
  description: "Create your Rentora account to rent or list equipment.",
}

export default function RegisterPage() {
  return <RegisterForm />
}