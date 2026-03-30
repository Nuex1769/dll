import { Metadata } from "next"
import { getT } from "@lib/util/i18n"

export const metadata: Metadata = {
  title: "Shipping & Returns | DLL",
  description:
    "Learn about DLL shipping options, delivery times, and return policy. Free shipping on orders over $150.",
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
              Shipping
            </h2>
            <div className="space-y-4 text-sm text-dll-foreground-secondary leading-relaxed">
              <p>
                We offer worldwide shipping on all DLL products. Orders are
                processed within 1–2 business days.
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-dll-border">
                      <th className="py-3 pr-4 font-semibold text-dll-foreground">
                        Method
                      </th>
                      <th className="py-3 pr-4 font-semibold text-dll-foreground">
                        Estimated Delivery
                      </th>
                      <th className="py-3 font-semibold text-dll-foreground">
                        Cost
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-dll-border">
                      <td className="py-3 pr-4">Standard Shipping</td>
                      <td className="py-3 pr-4">5–7 business days</td>
                      <td className="py-3">$10 (free over $150)</td>
                    </tr>
                    <tr className="border-b border-dll-border">
                      <td className="py-3 pr-4">Express Shipping</td>
                      <td className="py-3 pr-4">2–3 business days</td>
                      <td className="py-3">$25</td>
                    </tr>
                    <tr>
                      <td className="py-3 pr-4">International</td>
                      <td className="py-3 pr-4">7–14 business days</td>
                      <td className="py-3">Varies by region</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Returns */}
          <div>
            <h2 className="text-lg font-semibold text-dll-foreground mb-4">
              Returns
            </h2>
            <div className="space-y-4 text-sm text-dll-foreground-secondary leading-relaxed">
              <p>
                We offer a <strong className="text-dll-foreground">30-day return policy</strong> on
                all unused products in their original packaging.
              </p>
              <ol className="list-decimal list-inside space-y-2">
                <li>Contact our support team at support@dll.com</li>
                <li>Receive a prepaid return shipping label</li>
                <li>Ship the item back in its original packaging</li>
                <li>Refund processed within 5–7 business days after receipt</li>
              </ol>
              <p>
                Please note: Helmets that have been involved in an impact or
                show signs of use cannot be returned for safety reasons.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
