"use client"

import { ThemeProvider as NextThemesProvider } from "next-themes"

type ThemeProviderProps = {
  children: React.ReactNode
}

function ThemeProvider({ children }: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
      storageKey="rentora-theme"
      disableTransitionOnChange={false}
    >
      {children}
    </NextThemesProvider>
  )
}

export { ThemeProvider }