import { Metadata } from "next"
import { getT } from "@lib/util/i18n"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ countryCode: string }>
}): Promise<Metadata> {
  const { countryCode } = await params
  const t = await getT(countryCode)
  return {
    title: t("pages.privacy.meta_title"),
    description: t("pages.privacy.meta_description"),
  }
}

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ countryCode: string }>
}) {
  const { countryCode } = await params
  const t = await getT(countryCode)

  return (
    <div className="content-container py-16 small:py-24">
      <div className="max-w-3xl mx-auto">
        <span className="text-xs tracking-[0.2em] uppercase text-dll-foreground-secondary">
          {t("pages.privacy.label")}
        </span>
        <h1 className="text-3xl small:text-5xl font-bold text-dll-foreground mt-3 leading-tight">
          {t("pages.privacy.title")}
        </h1>
        <p className="mt-4 text-sm text-dll-foreground-secondary">
          {t("pages.privacy.last_updated")}
        </p>

        <div className="mt-10 space-y-8 text-sm text-dll-foreground-secondary leading-relaxed">
          <section>
            <h2 className="text-base font-semibold text-dll-foreground mb-3">
              {t("pages.privacy.s1_title")}
            </h2>
            <p>{t("pages.privacy.s1_intro")}</p>
            <ul className="mt-2 list-disc list-inside space-y-1">
              <li>{t("pages.privacy.s1_item1")}</li>
              <li>{t("pages.privacy.s1_item2")}</li>
              <li>{t("pages.privacy.s1_item3")}</li>
              <li>{t("pages.privacy.s1_item4")}</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-semibold text-dll-foreground mb-3">
              {t("pages.privacy.s2_title")}
            </h2>
            <ul className="list-disc list-inside space-y-1">
              <li>{t("pages.privacy.s2_item1")}</li>
              <li>{t("pages.privacy.s2_item2")}</li>
              <li>{t("pages.privacy.s2_item3")}</li>
              <li>{t("pages.privacy.s2_item4")}</li>
              <li>{t("pages.privacy.s2_item5")}</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-semibold text-dll-foreground mb-3">
              {t("pages.privacy.s3_title")}
            </h2>
            <p>{t("pages.privacy.s3_intro")}</p>
            <ul className="mt-2 list-disc list-inside space-y-1">
              <li>{t("pages.privacy.s3_item1")}</li>
              <li>{t("pages.privacy.s3_item2")}</li>
              <li>{t("pages.privacy.s3_item3")}</li>
              <li>{t("pages.privacy.s3_item4")}</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-semibold text-dll-foreground mb-3">
              {t("pages.privacy.s4_title")}
            </h2>
            <p>{t("pages.privacy.s4_body")}</p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-dll-foreground mb-3">
              {t("pages.privacy.s5_title")}
            </h2>
            <p>{t("pages.privacy.s5_body")}</p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-dll-foreground mb-3">
              {t("pages.privacy.s6_title")}
            </h2>
            <p>
              {t("pages.privacy.s6_body_prefix")}
              <a
                href="mailto:privacy@dll.com"
                className="text-dll-foreground underline underline-offset-4 hover:text-[#C17A2A] transition-colors"
              >
                {t("pages.privacy.s6_email")}
              </a>
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-dll-foreground mb-3">
              {t("pages.privacy.s7_title")}
            </h2>
            <p>
              {t("pages.privacy.s7_body_prefix")}
              <a
                href="mailto:privacy@dll.com"
                className="text-dll-foreground underline underline-offset-4 hover:text-[#C17A2A] transition-colors"
              >
                {t("pages.privacy.s7_email")}
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
