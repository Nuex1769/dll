import { listCategories } from "@lib/data/categories"
import { listCollections } from "@lib/data/collections"
import { listRegions } from "@lib/data/regions"
import { listLocales } from "@lib/data/locales"
import { getLocale } from "@lib/data/locale-actions"
import { getT } from "@lib/util/i18n"
import { StoreRegion } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import RegionSwitcher from "@modules/layout/components/region-switcher"

export default async function Footer() {
  const [{ collections }, productCategories, regions, locales, currentLocale, t] =
    await Promise.all([
      listCollections({ fields: "*products" }),
      listCategories(),
      listRegions().then((regions: StoreRegion[]) => regions),
      listLocales(),
      getLocale(),
      getT(),
    ])

  return (
    <footer className="bg-white border-t border-dll-border">
      <div className="content-container py-16 small:py-20">
        {/* Top Section */}
        <div className="flex flex-col small:flex-row justify-between gap-12 small:gap-8">
          {/* Brand */}
          <div className="flex flex-col gap-4 small:max-w-[280px]">
            <LocalizedClientLink
              href="/"
              className="text-2xl font-bold tracking-tight text-dll-foreground"
            >
              DLL
            </LocalizedClientLink>
            <p className="text-sm text-dll-foreground-secondary leading-relaxed">
              {t("footer.brand_description")}
            </p>
            {/* Social Icons */}
            <div className="flex items-center gap-4 mt-2">
              <a
                href="#"
                className="text-dll-foreground-secondary hover:text-dll-foreground transition-colors"
                aria-label="Instagram"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
              </a>
              <a
                href="#"
                className="text-dll-foreground-secondary hover:text-dll-foreground transition-colors"
                aria-label="YouTube"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
              <a
                href="#"
                className="text-dll-foreground-secondary hover:text-dll-foreground transition-colors"
                aria-label="X / Twitter"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Footer Links */}
          <div className="grid grid-cols-2 small:grid-cols-3 gap-8 small:gap-16">
            {/* Products */}
            <div className="flex flex-col gap-3">
              <span className="text-sm font-semibold text-dll-foreground">
                {t("footer.products_label")}
              </span>
              <ul className="flex flex-col gap-2.5">
                {productCategories
                  ?.filter((c) => !c.parent_category)
                  .slice(0, 5)
                  .map((c) => (
                    <li key={c.id}>
                      <LocalizedClientLink
                        href={`/categories/${c.handle}`}
                        className="text-sm text-dll-foreground-secondary hover:text-dll-foreground transition-colors"
                        data-testid="category-link"
                      >
                        {c.name}
                      </LocalizedClientLink>
                    </li>
                  ))}
                {collections?.slice(0, 3).map((c) => (
                  <li key={c.id}>
                    <LocalizedClientLink
                      href={`/collections/${c.handle}`}
                      className="text-sm text-dll-foreground-secondary hover:text-dll-foreground transition-colors"
                    >
                      {c.title}
                    </LocalizedClientLink>
                  </li>
                ))}
                <li>
                  <LocalizedClientLink
                    href="/store"
                    className="text-sm text-dll-foreground-secondary hover:text-dll-foreground transition-colors"
                  >
                    {t("footer.all_products")}
                  </LocalizedClientLink>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div className="flex flex-col gap-3">
              <span className="text-sm font-semibold text-dll-foreground">
                {t("footer.support_label")}
              </span>
              <ul className="flex flex-col gap-2.5">
                <li>
                  <LocalizedClientLink
                    href="/support"
                    className="text-sm text-dll-foreground-secondary hover:text-dll-foreground transition-colors"
                  >
                    {t("footer.faq")}
                  </LocalizedClientLink>
                </li>
                <li>
                  <LocalizedClientLink
                    href="/shipping-returns"
                    className="text-sm text-dll-foreground-secondary hover:text-dll-foreground transition-colors"
                  >
                    {t("footer.shipping_returns")}
                  </LocalizedClientLink>
                </li>
                <li>
                  <LocalizedClientLink
                    href="/warranty"
                    className="text-sm text-dll-foreground-secondary hover:text-dll-foreground transition-colors"
                  >
                    {t("footer.warranty")}
                  </LocalizedClientLink>
                </li>
                <li>
                  <LocalizedClientLink
                    href="/support"
                    className="text-sm text-dll-foreground-secondary hover:text-dll-foreground transition-colors"
                  >
                    {t("footer.contact_us")}
                  </LocalizedClientLink>
                </li>
              </ul>
            </div>

            {/* Company */}
            <div className="flex flex-col gap-3">
              <span className="text-sm font-semibold text-dll-foreground">
                {t("footer.company_label")}
              </span>
              <ul className="flex flex-col gap-2.5">
                <li>
                  <LocalizedClientLink
                    href="/about"
                    className="text-sm text-dll-foreground-secondary hover:text-dll-foreground transition-colors"
                  >
                    {t("footer.about_us")}
                  </LocalizedClientLink>
                </li>
                <li>
                  <LocalizedClientLink
                    href="/press"
                    className="text-sm text-dll-foreground-secondary hover:text-dll-foreground transition-colors"
                  >
                    {t("footer.press")}
                  </LocalizedClientLink>
                </li>
                <li>
                  <LocalizedClientLink
                    href="/careers"
                    className="text-sm text-dll-foreground-secondary hover:text-dll-foreground transition-colors"
                  >
                    {t("footer.careers")}
                  </LocalizedClientLink>
                </li>
                <li>
                  <LocalizedClientLink
                    href="/blog"
                    className="text-sm text-dll-foreground-secondary hover:text-dll-foreground transition-colors"
                  >
                    {t("footer.blog")}
                  </LocalizedClientLink>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col gap-6 mt-16 pt-8 border-t border-dll-border">
          {/* Region & Language Switcher */}
          <RegionSwitcher
            regions={regions}
            locales={locales}
            currentLocale={currentLocale}
          />

          {/* Copyright & Legal */}
          <div className="flex flex-col small:flex-row items-center justify-between gap-4">
            <span className="text-xs text-dll-foreground-secondary">
              &copy; {new Date().getFullYear()} {t("footer.copyright")}
            </span>
            <div className="flex items-center gap-6">
              <LocalizedClientLink
                href="/terms"
                className="text-xs text-dll-foreground-secondary hover:text-dll-foreground transition-colors"
              >
                {t("footer.terms")}
              </LocalizedClientLink>
              <LocalizedClientLink
                href="/privacy"
                className="text-xs text-dll-foreground-secondary hover:text-dll-foreground transition-colors"
              >
                {t("footer.privacy")}
              </LocalizedClientLink>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
