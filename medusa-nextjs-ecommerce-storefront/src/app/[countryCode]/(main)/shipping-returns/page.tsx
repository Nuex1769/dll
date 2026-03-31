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
    title: t("pages.shipping_returns.meta_title"),
    description: t("pages.shipping_returns.meta_description"),
  }
}

export default async function ShippingReturnsPage({
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
          {t("pages.shipping_returns.label")}
        </span>
        <h1 className="text-3xl small:text-5xl font-bold text-dll-foreground mt-3 leading-tight">
          {t("pages.shipping_returns.title")}
        </h1>

        <div className="mt-10 space-y-10">
          {/* Shipping */}
          <div>
            <h2 className="text-lg font-semibold text-dll-foreground mb-4">
              {t("pages.shipping_returns.shipping_heading")}
            </h2>
            <div className="space-y-4 text-sm text-dll-foreground-secondary leading-relaxed">
              <p>{t("pages.shipping_returns.shipping_intro")}</p>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-dll-border">
                      <th className="py-3 pr-4 font-semibold text-dll-foreground">
                        {t("pages.shipping_returns.table_method")}
                      </th>
                      <th className="py-3 pr-4 font-semibold text-dll-foreground">
                        {t("pages.shipping_returns.table_delivery")}
                      </th>
                      <th className="py-3 font-semibold text-dll-foreground">
                        {t("pages.shipping_returns.table_cost")}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-dll-border">
                      <td className="py-3 pr-4">{t("pages.shipping_returns.row1_method")}</td>
                      <td className="py-3 pr-4">{t("pages.shipping_returns.row1_delivery")}</td>
                      <td className="py-3">{t("pages.shipping_returns.row1_cost")}</td>
                    </tr>
                    <tr className="border-b border-dll-border">
                      <td className="py-3 pr-4">{t("pages.shipping_returns.row2_method")}</td>
                      <td className="py-3 pr-4">{t("pages.shipping_returns.row2_delivery")}</td>
                      <td className="py-3">{t("pages.shipping_returns.row2_cost")}</td>
                    </tr>
                    <tr>
                      <td className="py-3 pr-4">{t("pages.shipping_returns.row3_method")}</td>
                      <td className="py-3 pr-4">{t("pages.shipping_returns.row3_delivery")}</td>
                      <td className="py-3">{t("pages.shipping_returns.row3_cost")}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Returns */}
          <div>
            <h2 className="text-lg font-semibold text-dll-foreground mb-4">
              {t("pages.shipping_returns.returns_heading")}
            </h2>
            <div className="space-y-4 text-sm text-dll-foreground-secondary leading-relaxed">
              <p>
                {t("pages.shipping_returns.returns_intro_prefix")}
                <strong className="text-dll-foreground">
                  {t("pages.shipping_returns.returns_intro_bold")}
                </strong>
                {t("pages.shipping_returns.returns_intro_suffix")}
              </p>
              <ol className="list-decimal list-inside space-y-2">
                <li>{t("pages.shipping_returns.returns_step1")}</li>
                <li>{t("pages.shipping_returns.returns_step2")}</li>
                <li>{t("pages.shipping_returns.returns_step3")}</li>
                <li>{t("pages.shipping_returns.returns_step4")}</li>
              </ol>
              <p>{t("pages.shipping_returns.returns_note")}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
