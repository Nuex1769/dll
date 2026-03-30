import { Metadata } from "next"
import { getT } from "@lib/util/i18n"

export const metadata: Metadata = {
  title: "Press | DLL",
  description:
    "DLL press resources and media inquiries. Download brand assets and get in touch with our communications team.",
}

export default async function PressPage({
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
          {t("pages.press.label")}
        </span>
        <h1 className="text-3xl small:text-5xl font-bold text-dll-foreground mt-3 leading-tight">
          {t("pages.press.title")}
        </h1>

        <div className="mt-10 space-y-8 text-sm text-dll-foreground-secondary leading-relaxed">
          <div>
            <h2 className="text-lg font-semibold text-dll-foreground mb-4">
              About DLL
            </h2>
            <p>
              DLL designs and manufactures premium smart helmets that integrate
              advanced safety technology with modern aesthetics. Our products
              feature integrated LED lighting, crash detection, Bluetooth
              connectivity, and MIPS protection for cyclists, e-bike riders,
              and urban commuters worldwide.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-dll-foreground mb-4">
              Media Inquiries
            </h2>
            <p>
              For press inquiries, product reviews, or interview requests,
              please contact our communications team:
            </p>
            <p className="mt-3">
              <span className="font-semibold text-dll-foreground">Email:</span>{" "}
              press@dll.com
            </p>
          </div>

          <div className="rounded-2xl bg-dll-bg-secondary p-8 text-center">
            <p className="text-dll-foreground font-semibold mb-2">
              Press Kit Coming Soon
            </p>
            <p className="text-sm">
              Our downloadable press kit with logos, product images, and brand
              guidelines is being prepared. Contact us directly in the meantime.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
