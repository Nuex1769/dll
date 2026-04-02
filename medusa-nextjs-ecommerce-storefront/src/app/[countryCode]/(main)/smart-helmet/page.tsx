import { Metadata } from "next"

import { getT } from "@lib/util/i18n"
import JsonLd from "@modules/common/components/json-ld"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import LatestPosts from "@modules/blog/components/latest-posts"
import ComparisonCarousel from "@modules/smart-helmet/components/comparison-carousel"
import ComparisonGrid from "@modules/smart-helmet/components/comparison-grid"
import FaqAccordion from "@modules/smart-helmet/components/faq-accordion"
import VirginiaTechTested from "@modules/smart-helmet/components/virginia-tech-tested"
import { getSmartHelmetDisplayProducts } from "@modules/smart-helmet/lib/get-display-products"

export const metadata: Metadata = {
  title: "Smart Helmets — Active Safety for Every Rider | DLL",
  description:
    "Discover DLL smart helmets with integrated LED lighting, crash detection, Bluetooth audio, and MIPS protection. Designed for urban commuters, e-bike riders, and cycling enthusiasts.",
}

export default async function SmartHelmetPage({
  params,
}: {
  params: Promise<{ countryCode: string }>
}) {
  const { countryCode } = await params
  const t = await getT(countryCode)
  const items = await getSmartHelmetDisplayProducts({ countryCode })

  const faqs = Array.from({ length: 6 }, (_, i) => ({
    question: t(`smart_helmet.faq.items.${i}.question`),
    answer: t(`smart_helmet.faq.items.${i}.answer`),
  }))

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  }

  return (
    <div className="bg-[#f5f5f5]">
      <JsonLd data={faqJsonLd} />

      <section className="border-b border-black/5">
        <div className="content-container py-16 small:py-20">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm uppercase tracking-[0.26em] text-dll-foreground-secondary">
              {t("smart_helmet.hero.label")}
            </p>
            <h1 className="mt-5 text-5xl font-semibold tracking-tight text-dll-foreground small:text-6xl">
              {t("smart_helmet.products.title")}
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-dll-foreground-secondary">
              {t("smart_helmet.products.description")}
            </p>
          </div>
        </div>
      </section>

      <section id="products">
        <div className="content-container py-12 small:py-16 lg:py-20">
          {items.length ? (
            <>
              <ComparisonGrid items={items} />
              <ComparisonCarousel items={items} />
            </>
          ) : (
            <div className="rounded-[28px] border border-gray-200 bg-white px-8 py-12 text-center">
              <p className="text-sm uppercase tracking-[0.24em] text-dll-foreground-secondary">
                Product Lineup
              </p>
              <h2 className="mt-4 text-2xl font-semibold text-dll-foreground">
                {t("smart_helmet.products.title")}
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-dll-foreground-secondary">
                {t("smart_helmet.products.description")}
              </p>
              <div className="mt-8">
                <LocalizedClientLink
                  href="/store"
                  className="dll-btn-secondary inline-flex"
                >
                  {t("smart_helmet.products.view_all")}
                </LocalizedClientLink>
              </div>
            </div>
          )}
        </div>
      </section>

      {items.length ? <VirginiaTechTested items={items} /> : null}

      <section className="bg-white">
        <div className="content-container py-16 small:py-24">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-8 text-sm uppercase tracking-widest text-gray-500">
              {t("smart_helmet.faq.title")}
            </h2>
            <FaqAccordion items={faqs} />
          </div>
        </div>
      </section>

      <LatestPosts
        limit={3}
        tag="safety"
        title={t("blog.related_posts")}
        subtitle={t("blog.subtitle")}
        readMoreLabel={t("blog.read_more")}
        viewAllLabel={t("blog.view_all")}
      />

      <section className="bg-dll-foreground">
        <div className="content-container py-16 text-center small:py-20">
          <h2 className="text-2xl font-semibold text-white small:text-3xl">
            {t("smart_helmet.cta.title")}
          </h2>
          <p className="mx-auto mt-4 max-w-md text-sm text-white/60">
            {t("smart_helmet.cta.description")}
          </p>
          <div className="mt-8">
            <LocalizedClientLink
              href="/store"
              className="dll-btn-outline inline-flex"
            >
              {t("smart_helmet.cta.button")}
            </LocalizedClientLink>
          </div>
        </div>
      </section>
    </div>
  )
}
