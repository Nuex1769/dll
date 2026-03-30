import { Metadata } from "next"
import { getT } from "@lib/util/i18n"

export const metadata: Metadata = {
  title: "Business Partnership",
  description:
    "Partner with DLL — explore wholesale, distribution, and co-branding opportunities for smart helmets and cycling gear.",
}

const partnerIcons = [
  <svg key="retail" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349m0 0a3.001 3.001 0 0 0 3.75-.615A2.993 2.993 0 0 0 9.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 0 0 2.25 1.016c.896 0 1.7-.393 2.25-1.015a3.001 3.001 0 0 0 3.75.614m-16.5 0a3.004 3.004 0 0 1-.621-4.72l1.189-1.19A1.5 1.5 0 0 1 5.378 3h13.243a1.5 1.5 0 0 1 1.06.44l1.19 1.189a3 3 0 0 1-.621 4.72M6.75 18h3.75a.75.75 0 0 0 .75-.75V13.5a.75.75 0 0 0-.75-.75H6.75a.75.75 0 0 0-.75.75v3.75c0 .414.336.75.75.75Z" />
  </svg>,
  <svg key="distribution" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418" />
  </svg>,
  <svg key="cobranding" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 0 0-5.78 1.128 2.25 2.25 0 0 1-2.4 2.245 4.5 4.5 0 0 0 8.4-2.245c0-.399-.078-.78-.22-1.128Zm0 0a15.998 15.998 0 0 0 3.388-1.62m-5.043-.025a15.994 15.994 0 0 1 1.622-3.395m3.42 3.42a15.995 15.995 0 0 0 4.764-4.648l3.876-5.814a1.151 1.151 0 0 0-1.597-1.597L14.146 6.32a15.996 15.996 0 0 0-4.649 4.763m3.42 3.42a6.776 6.776 0 0 0-3.42-3.42" />
  </svg>,
]

export default async function BusinessPartnershipPage({
  params,
}: {
  params: Promise<{ countryCode: string }>
}) {
  const { countryCode } = await params
  const t = await getT(countryCode)

  const partnerTypes = [0, 1, 2].map((i) => ({
    title: t(`business_partnership.partners.${i}.title`),
    description: t(`business_partnership.partners.${i}.description`),
    icon: partnerIcons[i],
  }))

  return (
    <div className="content-container py-16 small:py-24">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16 small:mb-24">
        <span className="text-xs tracking-[0.2em] uppercase text-dll-foreground-secondary">
          {t("business_partnership.label")}
        </span>
        <h1 className="text-3xl small:text-5xl font-bold text-dll-foreground mt-3 leading-tight">
          {t("business_partnership.title")}
        </h1>
        <p className="mt-6 text-base small:text-lg text-dll-foreground-secondary leading-relaxed">
          {t("business_partnership.description")}
        </p>
      </div>

      {/* Partner Types */}
      <div className="grid grid-cols-1 small:grid-cols-3 gap-8 mb-16 small:mb-24">
        {partnerTypes.map((type) => (
          <div
            key={type.title}
            className="p-8 rounded-xl border border-dll-border hover:border-dll-foreground-secondary transition-colors"
          >
            <div className="w-14 h-14 rounded-full bg-dll-bg-secondary flex items-center justify-center text-dll-foreground mb-5">
              {type.icon}
            </div>
            <h3 className="text-lg font-semibold text-dll-foreground mb-3">
              {type.title}
            </h3>
            <p className="text-sm text-dll-foreground-secondary leading-relaxed">
              {type.description}
            </p>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="text-center bg-dll-bg-secondary rounded-2xl p-12 small:p-16 max-w-3xl mx-auto">
        <h2 className="text-2xl font-semibold text-dll-foreground mb-4">
          {t("business_partnership.cta_title")}
        </h2>
        <p className="text-sm text-dll-foreground-secondary mb-8 max-w-lg mx-auto">
          {t("business_partnership.cta_description")}
        </p>
        <a
          href={`mailto:${t("business_partnership.cta_email")}`}
          className="dll-btn-primary inline-flex"
        >
          {t("business_partnership.cta_button")}
        </a>
      </div>
    </div>
  )
}
