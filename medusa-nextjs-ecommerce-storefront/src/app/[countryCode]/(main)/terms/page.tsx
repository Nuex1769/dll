import { Metadata } from "next"
import { getT } from "@lib/util/i18n"

export const metadata: Metadata = {
  title: "Terms of Service | DLL",
  description:
    "DLL Terms of Service — the rules and guidelines governing use of our website and products.",
}

export default async function TermsPage({
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
          {t("pages.terms.label")}
        </span>
        <h1 className="text-3xl small:text-5xl font-bold text-dll-foreground mt-3 leading-tight">
          {t("pages.terms.title")}
        </h1>
        <p className="mt-4 text-sm text-dll-foreground-secondary">
          Last updated: March 2026
        </p>

        <div className="mt-10 space-y-8 text-sm text-dll-foreground-secondary leading-relaxed">
          <section>
            <h2 className="text-base font-semibold text-dll-foreground mb-3">
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing or using the DLL website and purchasing our products,
              you agree to be bound by these Terms of Service. If you do not
              agree with any part of these terms, please do not use our services.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-dll-foreground mb-3">
              2. Products and Orders
            </h2>
            <p>
              All product descriptions, images, and specifications are provided
              for informational purposes. We reserve the right to modify product
              details, pricing, and availability without prior notice. Orders are
              subject to acceptance and availability confirmation.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-dll-foreground mb-3">
              3. Pricing and Payment
            </h2>
            <p>
              Prices are displayed in the currency selected for your region and
              include applicable taxes unless otherwise stated. Payment must be
              completed at the time of purchase through our accepted payment
              methods.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-dll-foreground mb-3">
              4. Intellectual Property
            </h2>
            <p>
              All content on the DLL website — including text, graphics, logos,
              images, and software — is the property of DLL and is protected by
              intellectual property laws. You may not reproduce, distribute, or
              create derivative works without our written permission.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-dll-foreground mb-3">
              5. Product Safety Disclaimer
            </h2>
            <p>
              DLL smart helmets are designed to enhance rider safety but cannot
              guarantee prevention of injury in all circumstances. Users must
              follow all local helmet laws and safety regulations. Always ride
              responsibly and within your skill level.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-dll-foreground mb-3">
              6. Limitation of Liability
            </h2>
            <p>
              To the fullest extent permitted by law, DLL shall not be liable
              for any indirect, incidental, special, or consequential damages
              arising from the use of our products or services.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-dll-foreground mb-3">
              7. Contact
            </h2>
            <p>
              For questions about these Terms of Service, please contact us at{" "}
              <a
                href="mailto:legal@dll.com"
                className="text-dll-foreground underline underline-offset-4 hover:text-[#C17A2A] transition-colors"
              >
                legal@dll.com
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
