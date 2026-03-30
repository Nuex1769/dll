import { Metadata } from "next"
import { Suspense } from "react"

import { listProducts } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"
import { getT } from "@lib/util/i18n"
import ProductPreview from "@modules/products/components/product-preview"
import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import JsonLd from "@modules/common/components/json-ld"

export const metadata: Metadata = {
  title: "Smart Helmets — Active Safety for Every Rider | DLL",
  description:
    "Discover DLL smart helmets with integrated LED lighting, crash detection, Bluetooth audio, and MIPS protection. Designed for urban commuters, e-bike riders, and cycling enthusiasts.",
}

// ─── Product Grid (server component) ────────────────────────────────
async function SmartHelmetProducts({ countryCode }: { countryCode: string }) {
  const region = await getRegion(countryCode)

  if (!region) return null

  // Fetch all products — will filter to smart-helmet category when available
  const {
    response: { products },
  } = await listProducts({
    pageParam: 1,
    queryParams: { limit: 8 },
    countryCode,
  })

  if (!products || products.length === 0) return null

  return (
    <ul className="grid grid-cols-1 small:grid-cols-2 medium:grid-cols-3 gap-x-8 gap-y-12">
      {products.slice(0, 6).map((product) => (
        <li key={product.id}>
          <ProductPreview product={product} region={region} />
        </li>
      ))}
    </ul>
  )
}

// ─── Page Component ─────────────────────────────────────────────────
export default async function SmartHelmetPage({
  params,
}: {
  params: Promise<{ countryCode: string }>
}) {
  const { countryCode } = await params
  const t = await getT(countryCode)

  // ─── Technology features ────────────────────────────────────────────
  const features = [
    {
      title: t("smart_helmet.technology.features.0.title"),
      description: t("smart_helmet.technology.features.0.description"),
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
        </svg>
      ),
    },
    {
      title: t("smart_helmet.technology.features.1.title"),
      description: t("smart_helmet.technology.features.1.description"),
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
        </svg>
      ),
    },
    {
      title: t("smart_helmet.technology.features.2.title"),
      description: t("smart_helmet.technology.features.2.description"),
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 0 0-2.455 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
        </svg>
      ),
    },
    {
      title: t("smart_helmet.technology.features.3.title"),
      description: t("smart_helmet.technology.features.3.description"),
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 0 1 0 12.728M16.463 8.288a5.25 5.25 0 0 1 0 7.424M6.75 8.25l4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z" />
        </svg>
      ),
    },
    {
      title: t("smart_helmet.technology.features.4.title"),
      description: t("smart_helmet.technology.features.4.description"),
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="m20.893 13.393-1.135-1.135a2.252 2.252 0 0 1-.421-.585l-1.08-2.16a.414.414 0 0 0-.663-.107.827.827 0 0 1-.812.21l-1.273-.363a.89.89 0 0 0-.738 1.595l.587.39c.59.395.674 1.23.172 1.732l-.2.2c-.212.212-.33.498-.33.796v.41c0 .409-.11.809-.32 1.158l-1.315 2.191a2.11 2.11 0 0 1-1.81 1.025 1.055 1.055 0 0 1-1.055-1.055v-1.172c0-.92-.56-1.747-1.414-2.089l-.655-.261a2.25 2.25 0 0 1-1.383-2.46l.007-.042a2.25 2.25 0 0 1 .29-.787l.09-.15a2.25 2.25 0 0 1 2.37-1.048l1.178.236c.016.003.032.004.048.004h.04" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 12A9.75 9.75 0 1 1 2.25 12a9.75 9.75 0 0 1 19.5 0Z" />
        </svg>
      ),
    },
    {
      title: t("smart_helmet.technology.features.5.title"),
      description: t("smart_helmet.technology.features.5.description"),
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" />
        </svg>
      ),
    },
  ]

  // ─── FAQ data ───────────────────────────────────────────────────────
  const faqs = Array.from({ length: 6 }, (_, i) => ({
    question: t(`smart_helmet.faq.items.${i}.question`),
    answer: t(`smart_helmet.faq.items.${i}.answer`),
  }))

  // ─── Certifications / trust badges ──────────────────────────────────
  const certifications = [
    { label: "CPSC", description: t("smart_helmet.certifications.cpsc") },
    { label: "EN 1078", description: t("smart_helmet.certifications.en1078") },
    { label: "MIPS", description: t("smart_helmet.certifications.mips") },
    { label: "IPX6", description: t("smart_helmet.certifications.ipx6") },
  ]

  // ─── Comparison points ──────────────────────────────────────────────
  const comparisonPoints = Array.from({ length: 5 }, (_, i) =>
    t(`smart_helmet.comparison.points.${i}`)
  )

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
    <div>
      <JsonLd data={faqJsonLd} />
      {/* ── Hero Section ── */}
      <section className="relative bg-dll-foreground overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black" />
        <div className="absolute inset-0 opacity-[0.07] bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.15)_1px,transparent_1px)] bg-[length:20px_20px]" />

        <div className="relative z-10 content-container py-24 small:py-32 medium:py-40">
          <div className="max-w-3xl">
            <span className="inline-block text-xs tracking-[0.25em] uppercase text-white/50 mb-4">
              {t("smart_helmet.hero.label")}
            </span>
            <h1 className="text-4xl small:text-5xl medium:text-6xl font-bold text-white leading-[1.1] tracking-tight">
              {t("smart_helmet.hero.title_line1")}
              <br />
              <span className="text-white/70">{t("smart_helmet.hero.title_line2")}</span>
            </h1>
            <p className="mt-6 text-base small:text-lg text-white/60 leading-relaxed max-w-xl">
              {t("smart_helmet.hero.description")}
            </p>
            <div className="mt-8 flex items-center gap-4">
              <a href="#products" className="dll-btn-outline">
                {t("smart_helmet.hero.shop_helmets")}
              </a>
              <a
                href="#detailed"
                className="text-sm text-white/50 hover:text-white transition-colors underline underline-offset-4"
              >
                {t("smart_helmet.hero.learn_more")}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Product Grid Section ── */}
      <section id="products" className="content-container py-16 small:py-24">
        <div className="mb-12">
          <span className="text-xs tracking-[0.2em] uppercase text-dll-foreground-secondary">
            {t("smart_helmet.products.label")}
          </span>
          <h2 className="text-2xl small:text-3xl font-semibold text-dll-foreground mt-2">
            {t("smart_helmet.products.title")}
          </h2>
          <p className="mt-3 text-sm text-dll-foreground-secondary max-w-xl">
            {t("smart_helmet.products.description")}
          </p>
        </div>

        <Suspense fallback={<SkeletonProductGrid numberOfProducts={6} />}>
          <SmartHelmetProducts countryCode={countryCode} />
        </Suspense>

        <div className="mt-12 text-center">
          <LocalizedClientLink href="/store" className="dll-btn-secondary inline-flex">
            {t("smart_helmet.products.view_all")}
          </LocalizedClientLink>
        </div>
      </section>

      {/* ── Certifications Bar ── */}
      <section className="border-y border-dll-border">
        <div className="content-container py-8">
          <div className="grid grid-cols-2 small:grid-cols-4 gap-6 small:gap-8">
            {certifications.map((cert) => (
              <div key={cert.label} className="text-center">
                <span className="text-lg font-bold text-dll-foreground">
                  {cert.label}
                </span>
                <p className="text-xs text-dll-foreground-secondary mt-1">
                  {cert.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Technology Features (Detailed Section) ── */}
      <section id="detailed" className="content-container py-16 small:py-24">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs tracking-[0.2em] uppercase text-dll-foreground-secondary">
            {t("smart_helmet.technology.label")}
          </span>
          <h2 className="text-2xl small:text-3xl font-semibold text-dll-foreground mt-2">
            {t("smart_helmet.technology.title")}
          </h2>
          <p className="mt-4 text-sm text-dll-foreground-secondary leading-relaxed">
            {t("smart_helmet.technology.description")}
          </p>
        </div>

        <div className="grid grid-cols-1 small:grid-cols-2 medium:grid-cols-3 gap-x-8 gap-y-12">
          {features.map((feature) => (
            <div key={feature.title} className="group">
              <div className="w-12 h-12 rounded-xl bg-dll-bg-secondary flex items-center justify-center text-dll-foreground mb-4 group-hover:bg-dll-foreground group-hover:text-white transition-colors">
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
      </section>

      {/* ── Comparison / Value Prop Banner ── */}
      <section className="bg-dll-bg-secondary">
        <div className="content-container py-16 small:py-24">
          <div className="grid grid-cols-1 small:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-xs tracking-[0.2em] uppercase text-dll-foreground-secondary">
                {t("smart_helmet.comparison.label")}
              </span>
              <h2 className="text-2xl small:text-3xl font-semibold text-dll-foreground mt-2 leading-tight">
                {t("smart_helmet.comparison.title_line1")}<br />{t("smart_helmet.comparison.title_line2")}
              </h2>
              <p className="mt-4 text-sm text-dll-foreground-secondary leading-relaxed">
                {t("smart_helmet.comparison.description")}
              </p>
              <ul className="mt-6 space-y-3">
                {comparisonPoints.map((point) => (
                  <li key={point} className="flex items-start gap-3 text-sm text-dll-foreground">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 shrink-0 text-[#C17A2A] mt-0.5">
                      <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" />
                    </svg>
                    {point}
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative aspect-square rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden flex items-center justify-center">
              {/* Placeholder for comparison image */}
              <div className="text-center p-8">
                <div className="w-20 h-20 rounded-full bg-dll-foreground/10 flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-10 h-10 text-dll-foreground/40">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 0 0-2.455 2.456Z" />
                  </svg>
                </div>
                <p className="text-sm text-dll-foreground-secondary">
                  {t("smart_helmet.comparison.image_alt")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ Section ── */}
      <section className="content-container py-16 small:py-24">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs tracking-[0.2em] uppercase text-dll-foreground-secondary">
              {t("smart_helmet.faq.label")}
            </span>
            <h2 className="text-2xl small:text-3xl font-semibold text-dll-foreground mt-2">
              {t("smart_helmet.faq.title")}
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
            {t("smart_helmet.cta.title")}
          </h2>
          <p className="text-sm text-white/60 mb-8 max-w-md mx-auto">
            {t("smart_helmet.cta.description")}
          </p>
          <LocalizedClientLink href="/store" className="dll-btn-outline inline-flex">
            {t("smart_helmet.cta.button")}
          </LocalizedClientLink>
        </div>
      </section>
    </div>
  )
}
