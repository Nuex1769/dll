import { getBaseURL } from "@lib/util/env"
import { Inter } from "next/font/google"
import { Metadata } from "next"
import "styles/globals.css"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
})

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
  title: {
    default: "DLL - Smart Helmets & Cycling Gear",
    template: "%s | DLL",
  },
  description:
    "DLL offers premium smart helmets and cycling gear designed for safety, connectivity, and style. Ride smarter, ride safer.",
  keywords: [
    "smart helmet",
    "cycling gear",
    "bike helmet",
    "LED helmet",
    "cycling accessories",
    "DLL",
  ],
  openGraph: {
    title: "DLL - Smart Helmets & Cycling Gear",
    description:
      "Premium smart helmets and cycling gear designed for safety, connectivity, and style.",
    siteName: "DLL",
    type: "website",
  },
}

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en" data-mode="light" className={inter.variable}>
      <body className={inter.className}>
        <main className="relative">{props.children}</main>
      </body>
    </html>
  )
}
