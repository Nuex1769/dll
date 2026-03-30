import { Suspense } from "react"

import { listRegions } from "@lib/data/regions"
import { listLocales } from "@lib/data/locales"
import { getLocale } from "@lib/data/locale-actions"
import { getT } from "@lib/util/i18n"
import { StoreRegion } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CartButton from "@modules/layout/components/cart-button"
import SideMenu from "@modules/layout/components/side-menu"
import AnnouncementBar from "@modules/layout/components/announcement-bar"
import NavLinks from "@modules/layout/components/nav-links"
import NavRegionButton from "@modules/layout/components/nav-region-button"

export default async function Nav() {
  const [regions, locales, currentLocale, t] = await Promise.all([
    listRegions().then((regions: StoreRegion[]) => regions),
    listLocales(),
    getLocale(),
    getT(),
  ])

  const navLabels = {
    home: t("nav.home"),
    smart_helmet: t("nav.smart_helmet"),
    accessories: t("nav.accessories"),
    business_partnership: t("nav.business_partnership"),
    support: t("nav.support"),
    about: t("nav.about"),
  }

  return (
    <div className="sticky top-0 inset-x-0 z-50 group">
      <AnnouncementBar />
      <header className="relative h-16 mx-auto bg-white/95 backdrop-blur-sm border-b border-dll-border transition-colors duration-300">
        <nav className="content-container flex items-center justify-between w-full h-full">
          {/* Left: Logo */}
          <div className="flex items-center h-full shrink-0">
            <LocalizedClientLink
              href="/"
              className="text-xl font-bold tracking-tight text-dll-foreground hover:opacity-80 transition-opacity"
              data-testid="nav-store-link"
            >
              DLL
            </LocalizedClientLink>
          </div>

          {/* Center: Navigation Links (desktop) */}
          <div className="hidden small:flex items-center gap-x-8 h-full">
            <NavLinks labels={navLabels} />
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-x-5 h-full">
            {/* Region / Language */}
            <NavRegionButton
              regions={regions}
              locales={locales}
              currentLocale={currentLocale}
            />

            {/* Search */}
            <LocalizedClientLink
              href="/store"
              className="hidden small:flex text-dll-foreground-secondary hover:text-dll-foreground transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                />
              </svg>
            </LocalizedClientLink>

            {/* Account */}
            <LocalizedClientLink
              href="/account"
              className="hidden small:flex text-dll-foreground-secondary hover:text-dll-foreground transition-colors"
              data-testid="nav-account-link"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                />
              </svg>
            </LocalizedClientLink>

            {/* Cart */}
            <Suspense
              fallback={
                <LocalizedClientLink
                  className="flex items-center text-dll-foreground-secondary hover:text-dll-foreground transition-colors"
                  href="/cart"
                  data-testid="nav-cart-link"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                    />
                  </svg>
                </LocalizedClientLink>
              }
            >
              <CartButton />
            </Suspense>

            {/* Mobile Menu */}
            <div className="small:hidden h-full flex items-center">
              <SideMenu
                regions={regions}
                locales={locales}
                currentLocale={currentLocale}
              />
            </div>
          </div>
        </nav>
      </header>
    </div>
  )
}
