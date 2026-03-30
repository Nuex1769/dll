import { Metadata } from "next"
import { getT } from "@lib/util/i18n"

export const metadata: Metadata = {
  title: "Warranty | DLL",
  description:
    "DLL offers a 2-year limited warranty on all smart helmets and a 1-year warranty on accessories.",
}

export default async function WarrantyPage({
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
          {t("pages.warranty.label")}
        </span>
        <h1 className="text-3xl small:text-5xl font-bold text-dll-foreground mt-3 leading-tight">
          {t("pages.warranty.title")}
        </h1>

        <div className="mt-10 space-y-10">
          <div>
            <h2 className="text-lg font-semibold text-dll-foreground mb-4">
              Coverage
            </h2>
            <div className="space-y-4 text-sm text-dll-foreground-secondary leading-relaxed">
              <p>
                All DLL products come with a limited warranty from the date of
                original purchase:
              </p>
              <ul className="space-y-2">
                <li className="flex items-start gap-3">
                  <span className="font-semibold text-dll-foreground shrink-0">
                    Smart Helmets:
                  </span>
                  2-year warranty covering manufacturing defects and electronic
                  components
                </li>
                <li className="flex items-start gap-3">
                  <span className="font-semibold text-dll-foreground shrink-0">
                    Accessories:
                  </span>
                  1-year warranty covering manufacturing defects
                </li>
              </ul>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-dll-foreground mb-4">
              What&apos;s Covered
            </h2>
            <ul className="space-y-2 text-sm text-dll-foreground-secondary leading-relaxed">
              <li>- Manufacturing defects in materials and workmanship</li>
              <li>- Electronic component failures under normal use</li>
              <li>- LED lighting system malfunctions</li>
              <li>- Bluetooth connectivity hardware issues</li>
              <li>- Battery defects (capacity below 80% within warranty period)</li>
            </ul>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-dll-foreground mb-4">
              What&apos;s Not Covered
            </h2>
            <ul className="space-y-2 text-sm text-dll-foreground-secondary leading-relaxed">
              <li>- Damage from accidents, impacts, or crashes</li>
              <li>- Normal wear and tear (padding, straps, visor scratches)</li>
              <li>- Unauthorized modifications or repairs</li>
              <li>- Cosmetic damage that does not affect functionality</li>
              <li>- Damage caused by improper use or storage</li>
            </ul>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-dll-foreground mb-4">
              How to Claim
            </h2>
            <ol className="list-decimal list-inside space-y-2 text-sm text-dll-foreground-secondary leading-relaxed">
              <li>Email support@dll.com with your order number and a description of the issue</li>
              <li>Include photos or a short video showing the defect</li>
              <li>Our team will review your claim within 3 business days</li>
              <li>If approved, we&apos;ll send a replacement or arrange a repair</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  )
}
