import { Metadata } from "next"
import JsonLd from "@modules/common/components/json-ld"
import { getT } from "@lib/util/i18n"
import LatestPosts from "@modules/blog/components/latest-posts"

export const metadata: Metadata = {
  title: "Support",
  description:
    "Get help with your DLL products. Find answers to FAQs, shipping info, warranty details, and contact our support team.",
}

export default async function SupportPage({
  params,
}: {
  params: Promise<{ countryCode: string }>
}) {
  const { countryCode } = await params
  const t = await getT(countryCode)

  const faqs = Array.from({ length: 6 }, (_, i) => ({
    question: t(`support_page.faqs.${i}.question`),
    answer: t(`support_page.faqs.${i}.answer`),
  }))

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  }

  return (
    <div className="content-container py-16 small:py-24">
      <JsonLd data={faqJsonLd} />
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="text-xs tracking-[0.2em] uppercase text-dll-foreground-secondary">
          {t("support_page.label")}
        </span>
        <h1 className="text-3xl small:text-5xl font-bold text-dll-foreground mt-3">
          {t("support_page.title")}
        </h1>
        <p className="mt-4 text-base text-dll-foreground-secondary">
          {t("support_page.subtitle")}
        </p>
      </div>

      {/* FAQ */}
      <div className="max-w-3xl mx-auto mb-16 small:mb-24">
        <h2 className="text-xl font-semibold text-dll-foreground mb-8">
          {t("support_page.faq_title")}
        </h2>
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

      {/* Contact */}
      <div className="max-w-3xl mx-auto">
        <h2 className="text-xl font-semibold text-dll-foreground mb-8">
          {t("support_page.contact_title")}
        </h2>
        <div className="grid grid-cols-1 small:grid-cols-3 gap-8">
          <div className="p-6 rounded-xl border border-dll-border">
            <h3 className="text-sm font-semibold text-dll-foreground mb-2">
              {t("support_page.email_label")}
            </h3>
            <p className="text-sm text-dll-foreground-secondary">
              {t("support_page.email")}
            </p>
          </div>
          <div className="p-6 rounded-xl border border-dll-border">
            <h3 className="text-sm font-semibold text-dll-foreground mb-2">
              {t("support_page.phone_label")}
            </h3>
            <p className="text-sm text-dll-foreground-secondary">
              {t("support_page.phone")}
            </p>
          </div>
          <div className="p-6 rounded-xl border border-dll-border">
            <h3 className="text-sm font-semibold text-dll-foreground mb-2">
              {t("support_page.hours_label")}
            </h3>
            <p className="text-sm text-dll-foreground-secondary">
              {t("support_page.hours")}
            </p>
          </div>
        </div>
      </div>

      {/* Related Articles */}
      <LatestPosts
        limit={3}
        tag="tips"
        title={t("blog.related_posts")}
        subtitle={t("blog.subtitle")}
        readMoreLabel={t("blog.read_more")}
        viewAllLabel={t("blog.view_all")}
      />
    </div>
  )
}
