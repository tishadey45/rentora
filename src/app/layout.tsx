import type { Metadata } from "next";
import { Inter, Sora } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/providers/theme-provider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Rentora — Equipment rental, simplified",
    template: "%s | Rentora",
  },
  description:
    "Rent construction, photography, agricultural, and event equipment from verified owners, with flexible rental periods and secure online payments.",
  applicationName: "Rentora",
  openGraph: {
    type: "website",
    siteName: "Rentora",
    title: "Rentora — Equipment rental, simplified",
    description:
      "Browse verified equipment, book by the day, week, or month, and pay securely online.",
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: "Rentora — Equipment rental, simplified",
    description:
      "Browse verified equipment, book by the day, week, or month, and pay securely online.",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      data-scroll-behavior="smooth"
      className={`${inter.variable} ${sora.variable} h-full`}
    >
      <body className="flex min-h-full flex-col">
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}