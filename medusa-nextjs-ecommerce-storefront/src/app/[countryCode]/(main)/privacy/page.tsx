import { Metadata } from "next"
import { getT } from "@lib/util/i18n"

export const metadata: Metadata = {
  title: "Privacy Policy | DLL",
  description:
    "DLL Privacy Policy — how we collect, use, and protect your personal information.",
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
          Last updated: March 2026
        </p>

        <div className="mt-10 space-y-8 text-sm text-dll-foreground-secondary leading-relaxed">
          <section>
            <h2 className="text-base font-semibold text-dll-foreground mb-3">
              1. Information We Collect
            </h2>
            <p>We collect information you provide directly:</p>
            <ul className="mt-2 list-disc list-inside space-y-1">
              <li>Name, email address, and shipping address when placing an order</li>
              <li>Payment information (processed securely by our payment providers)</li>
              <li>Account information if you create an account</li>
              <li>Communications when you contact our support team</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-semibold text-dll-foreground mb-3">
              2. How We Use Your Information
            </h2>
            <ul className="list-disc list-inside space-y-1">
              <li>Process and fulfill your orders</li>
              <li>Communicate about your orders and provide customer support</li>
              <li>Send product updates and marketing communications (with your consent)</li>
              <li>Improve our products and services</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-semibold text-dll-foreground mb-3">
              3. Information Sharing
            </h2>
            <p>
              We do not sell your personal information. We share data only with:
            </p>
            <ul className="mt-2 list-disc list-inside space-y-1">
              <li>Payment processors (to complete transactions)</li>
              <li>Shipping carriers (to deliver your orders)</li>
              <li>Service providers (to operate our website and services)</li>
              <li>Law enforcement (when required by law)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-semibold text-dll-foreground mb-3">
              4. Cookies
            </h2>
            <p>
              We use essential cookies to operate our website (shopping cart,
              session management, region preferences). We use analytics cookies
              to understand how visitors interact with our site. You can
              control cookie preferences through your browser settings.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-dll-foreground mb-3">
              5. Data Security
            </h2>
            <p>
              We implement industry-standard security measures to protect your
              personal information, including SSL encryption, secure payment
              processing, and regular security audits. However, no method of
              transmission over the internet is 100% secure.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-dll-foreground mb-3">
              6. Your Rights
            </h2>
            <p>
              Depending on your location, you may have the right to access,
              correct, delete, or port your personal data. To exercise these
              rights, contact us at{" "}
              <a
                href="mailto:privacy@dll.com"
                className="text-dll-foreground underline underline-offset-4 hover:text-[#C17A2A] transition-colors"
              >
                privacy@dll.com
              </a>
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-dll-foreground mb-3">
              7. Contact
            </h2>
            <p>
              For questions about this Privacy Policy, please contact us at{" "}
              <a
                href="mailto:privacy@dll.com"
                className="text-dll-foreground underline underline-offset-4 hover:text-[#C17A2A] transition-colors"
              >
                privacy@dll.com
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
