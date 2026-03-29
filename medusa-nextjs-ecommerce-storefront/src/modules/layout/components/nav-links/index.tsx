"use client"

import Link from "next/link"
import { useParams, usePathname } from "next/navigation"

const NAV_ITEMS = [
  { label: "Home", href: "/" },
  { label: "Smart Helmet", href: "/smart-helmet" },
  { label: "Accessories", href: "/categories/accessories" },
  { label: "Business Partnership", href: "/business-partnership" },
  { label: "Support", href: "/support" },
  { label: "About Us", href: "/about" },
]

const NavLinks = () => {
  const { countryCode } = useParams()
  const pathname = usePathname()

  const isActive = (href: string) => {
    const fullHref = `/${countryCode}${href}`
    if (href === "/") {
      return pathname === `/${countryCode}` || pathname === `/${countryCode}/`
    }
    return pathname.startsWith(fullHref)
  }

  return (
    <>
      {NAV_ITEMS.map((item) => {
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

export { NAV_ITEMS }
export default NavLinks
