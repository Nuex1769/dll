import { getBaseURL } from "@lib/util/env"
import localFont from "next/font/local"
import { Metadata } from "next"
import JsonLd from "@modules/common/components/json-ld"
import "styles/globals.css"

const inter = localFont({
  src: "../../public/fonts/inter-latin.woff2",
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

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "DLL",
  url: getBaseURL(),
  description:
    "Premium smart helmets and cycling gear designed for safety, connectivity, and style.",
  contactPoint: {
    "@type": "ContactPoint",
    email: "support@dll.com",
    contactType: "customer service",
  },
}

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en" data-mode="light" className={inter.variable}>
      <body className={inter.className}>
        <JsonLd data={organizationJsonLd} />
        <main className="relative">{props.children}</main>
      </body>
    </html>
  )
}
