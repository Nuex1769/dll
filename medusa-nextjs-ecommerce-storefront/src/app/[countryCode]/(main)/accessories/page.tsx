import { Metadata } from "next"
import { Suspense } from "react"

import { listProducts } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"
import { getT } from "@lib/util/i18n"
import ProductPreview from "@modules/products/components/product-preview"
import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

export const metadata: Metadata = {
  title: "Accessories — Complete Your Setup | DLL",
  description:
    "Premium accessories for DLL smart helmets. Replacement visors, inner padding, charging cables, carry bags, and more. Designed for perfect compatibility.",
}

// ─── Product Grid (server component) ────────────────────────────────
async function AccessoriesProducts({
  countryCode,
}: {
  countryCode: string
}) {
  const region = await getRegion(countryCode)

  if (!region) return null

  // Fetch all products — will filter to accessories category when available
  const {
    response: { products },
  } = await listProducts({
    pageParam: 1,
    queryParams: { limit: 8 },
    countryCode,
  })

  if (!products || products.length === 0) return null

  return (
    <ul className="grid grid-cols-1 small:grid-cols-2 medium:grid-cols-4 gap-x-8 gap-y-12">
      {products.slice(0, 8).map((product) => (
        <li key={product.id}>
          <ProductPreview product={product} region={region} />
        </li>
      ))}
    </ul>
  )
}

// ─── Page Component ─────────────────────────────────────────────────
export default async function AccessoriesPage({
  params,
}: {
  params: Promise<{ countryCode: string }>
}) {
  const { countryCode } = await params
  const t = await getT(countryCode)

  // ─── Feature highlights ─────────────────────────────────────────────
  const features = [
    {
      title: t("accessories.features.items.0.title"),
      description: t("accessories.features.items.0.description"),
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 0 0-2.455 2.456Z" />
        </svg>
      ),
    },
    {
      title: t("accessories.features.items.1.title"),
      description: t("accessories.features.items.1.description"),
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 16.875h3.375m0 0h3.375m-3.375 0V13.5m0 3.375v3.375M6 10.5h2.25a2.25 2.25 0 0 0 2.25-2.25V6a2.25 2.25 0 0 0-2.25-2.25H6A2.25 2.25 0 0 0 3.75 6v2.25A2.25 2.25 0 0 0 6 10.5Zm0 9.75h2.25A2.25 2.25 0 0 0 10.5 18v-2.25a2.25 2.25 0 0 0-2.25-2.25H6a2.25 2.25 0 0 0-2.25 2.25V18A2.25 2.25 0 0 0 6 20.25Zm9.75-9.75H18a2.25 2.25 0 0 0 2.25-2.25V6A2.25 2.25 0 0 0 18 3.75h-2.25A2.25 2.25 0 0 0 13.5 6v2.25a2.25 2.25 0 0 0 2.25 2.25Z" />
        </svg>
      ),
    },
    {
      title: t("accessories.features.items.2.title"),
      description: t("accessories.features.items.2.description"),
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 0 0 4.486-6.336l-3.276 3.277a3.004 3.004 0 0 1-2.25-2.25l3.276-3.276a4.5 4.5 0 0 0-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085" />
        </svg>
      ),
    },
    {
      title: t("accessories.features.items.3.title"),
      description: t("accessories.features.items.3.description"),
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0 0 12 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c1.01.143 2.01.317 3 .52m-3-.52 2.62 10.726c.122.499-.106 1.028-.589 1.202a5.988 5.988 0 0 1-2.031.352 5.988 5.988 0 0 1-2.031-.352c-.483-.174-.711-.703-.59-1.202L18.75 4.971Zm-16.5.52c.99-.203 1.99-.377 3-.52m0 0 2.62 10.726c.122.499-.106 1.028-.589 1.202a5.989 5.989 0 0 1-2.031.352 5.989 5.989 0 0 1-2.031-.352c-.483-.174-.711-.703-.59-1.202L5.25 4.971Z" />
        </svg>
      ),
    },
    {
      title: t("accessories.features.items.4.title"),
      description: t("accessories.features.items.4.description"),
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
        </svg>
      ),
    },
    {
      title: t("accessories.features.items.5.title"),
      description: t("accessories.features.items.5.description"),
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 0 1 3 3h-15a3 3 0 0 1 3-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 0 1-.982-3.172M9.497 14.25a7.454 7.454 0 0 0 .981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 0 0 7.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M18.75 4.236c.982.143 1.954.317 2.916.52A6.003 6.003 0 0 1 16.27 9.728M18.75 4.236V4.5c0 2.108-.966 3.99-2.48 5.228m0 0a6.023 6.023 0 0 1-2.27.308 6.023 6.023 0 0 1-2.27-.308" />
        </svg>
      ),
    },
  ]

  // ─── FAQ data ───────────────────────────────────────────────────────
  const faqs = Array.from({ length: 5 }, (_, i) => ({
    question: t(`accessories.faq.items.${i}.question`),
    answer: t(`accessories.faq.items.${i}.answer`),
  }))

  return (
    <div>
      {/* ── Hero Section ── */}
      <section className="relative bg-dll-foreground overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black" />
        <div className="absolute inset-0 opacity-[0.07] bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.15)_1px,transparent_1px)] bg-[length:20px_20px]" />

        <div className="relative z-10 content-container py-24 small:py-32 medium:py-40">
          <div className="max-w-3xl">
            <span className="inline-block text-xs tracking-[0.25em] uppercase text-white/50 mb-4">
              {t("accessories.hero.label")}
            </span>
            <h1 className="text-4xl small:text-5xl medium:text-6xl font-bold text-white leading-[1.1] tracking-tight">
              {t("accessories.hero.title_line1")}
              <br />
              <span className="text-white/70">{t("accessories.hero.title_line2")}</span>
            </h1>
            <p className="mt-6 text-base small:text-lg text-white/60 leading-relaxed max-w-xl">
              {t("accessories.hero.description")}
            </p>
            <div className="mt-8 flex items-center gap-4">
              <a href="#products" className="dll-btn-outline">
                {t("accessories.hero.shop_accessories")}
              </a>
              <a
                href="#features"
                className="text-sm text-white/50 hover:text-white transition-colors underline underline-offset-4"
              >
                {t("accessories.hero.learn_more")}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Product Grid Section ── */}
      <section id="products" className="content-container py-16 small:py-24">
        <div className="mb-12">
          <span className="text-xs tracking-[0.2em] uppercase text-dll-foreground-secondary">
            {t("accessories.products.label")}
          </span>
          <h2 className="text-2xl small:text-3xl font-semibold text-dll-foreground mt-2">
            {t("accessories.products.title")}
          </h2>
          <p className="mt-3 text-sm text-dll-foreground-secondary max-w-xl">
            {t("accessories.products.description")}
          </p>
        </div>

        <Suspense fallback={<SkeletonProductGrid numberOfProducts={8} />}>
          <AccessoriesProducts countryCode={countryCode} />
        </Suspense>

        <div className="mt-12 text-center">
          <LocalizedClientLink
            href="/store"
            className="dll-btn-secondary inline-flex"
          >
            {t("accessories.products.view_all")}
          </LocalizedClientLink>
        </div>
      </section>

      {/* ── Feature Highlights ── */}
      <section id="features" className="bg-dll-bg-secondary">
        <div className="content-container py-16 small:py-24">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs tracking-[0.2em] uppercase text-dll-foreground-secondary">
              {t("accessories.features.label")}
            </span>
            <h2 className="text-2xl small:text-3xl font-semibold text-dll-foreground mt-2">
              {t("accessories.features.title")}
            </h2>
            <p className="mt-4 text-sm text-dll-foreground-secondary leading-relaxed">
              {t("accessories.features.description")}
            </p>
          </div>

          <div className="grid grid-cols-1 small:grid-cols-2 medium:grid-cols-3 gap-x-8 gap-y-12">
            {features.map((feature) => (
              <div key={feature.title} className="group">
                <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-dll-foreground mb-4 group-hover:bg-dll-foreground group-hover:text-white transition-colors">
                  {feature.icon}
                </div>
                <h3 className="text-base font-semibold text-dll-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-dll-foreground-secondary leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ Section ── */}
      <section className="content-container py-16 small:py-24">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs tracking-[0.2em] uppercase text-dll-foreground-secondary">
              {t("accessories.faq.label")}
            </span>
            <h2 className="text-2xl small:text-3xl font-semibold text-dll-foreground mt-2">
              {t("accessories.faq.title")}
            </h2>
          </div>

          <div className="divide-y divide-dll-border">
            {faqs.map((faq) => (
              <div key={faq.question} className="py-6">
                <h3 className="text-sm font-semibold text-dll-foreground mb-2">
                  {faq.question}
                </h3>
                <p className="text-sm text-dll-foreground-secondary leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Bottom CTA ── */}
      <section className="bg-dll-foreground">
        <div className="content-container py-16 small:py-20 text-center">
          <h2 className="text-2xl small:text-3xl font-semibold text-white mb-4">
            {t("accessories.cta.title")}
          </h2>
          <p className="text-sm text-white/60 mb-8 max-w-md mx-auto">
            {t("accessories.cta.description")}
          </p>
          <LocalizedClientLink
            href="/store"
            className="dll-btn-outline inline-flex"
          >
            {t("accessories.cta.button")}
          </LocalizedClientLink>
        </div>
      </section>
    </div>
  )
}
