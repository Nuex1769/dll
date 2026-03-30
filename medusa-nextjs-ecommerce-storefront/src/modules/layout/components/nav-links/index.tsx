"use client"

import Link from "next/link"
import { useParams, usePathname } from "next/navigation"

type NavItem = {
  label: string
  href: string
}

const DEFAULT_NAV_ITEMS: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Smart Helmet", href: "/smart-helmet" },
  { label: "Accessories", href: "/accessories" },
  { label: "Business Partnership", href: "/business-partnership" },
  { label: "Support", href: "/support" },
  { label: "About Us", href: "/about" },
]

const NavLinks = ({ labels }: { labels?: Record<string, string> }) => {
  const { countryCode } = useParams()
  const pathname = usePathname()

  const navItems: NavItem[] = labels
    ? [
        { label: labels.home ?? "Home", href: "/" },
        { label: labels.smart_helmet ?? "Smart Helmet", href: "/smart-helmet" },
        { label: labels.accessories ?? "Accessories", href: "/accessories" },
        {
          label: labels.business_partnership ?? "Business Partnership",
          href: "/business-partnership",
        },
        { label: labels.support ?? "Support", href: "/support" },
        { label: labels.about ?? "About Us", href: "/about" },
      ]
    : DEFAULT_NAV_ITEMS

  const isActive = (href: string) => {
    const fullHref = `/${countryCode}${href}`
    if (href === "/") {
      return pathname === `/${countryCode}` || pathname === `/${countryCode}/`
    }
    return pathname.startsWith(fullHref)
  }

  return (
    <>
      {navItems.map((item) => {
        const active = isActive(item.href)
        return (
          <Link
            key={item.href}
            href={`/${countryCode}${item.href}`}
            className={`relative text-sm font-medium transition-colors pb-1 ${
              active
                ? "text-[#C17A2A]"
                : "text-dll-foreground hover:text-dll-foreground-secondary"
            }`}
          >
            {item.label}
            {active && (
              <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#C17A2A] rounded-full" />
            )}
          </Link>
        )
      })}
    </>
  )
}

export { DEFAULT_NAV_ITEMS as NAV_ITEMS }
export default NavLinks
