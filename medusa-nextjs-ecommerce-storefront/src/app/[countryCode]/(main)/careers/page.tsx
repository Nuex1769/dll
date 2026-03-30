import { Metadata } from "next"
import { getT } from "@lib/util/i18n"

export const metadata: Metadata = {
  title: "Careers | DLL",
  description:
    "Join the DLL team. We're building the future of smart cycling safety.",
}

export default async function CareersPage({
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
          {t("pages.careers.label")}
        </span>
        <h1 className="text-3xl small:text-5xl font-bold text-dll-foreground mt-3 leading-tight">
          {t("pages.careers.title")}
        </h1>

        <div className="mt-10 space-y-8 text-sm text-dll-foreground-secondary leading-relaxed">
          <p>
            At DLL, we&apos;re passionate about making cycling safer through
            technology and design. We&apos;re a growing team of engineers,
            designers, and cycling enthusiasts working together to create
            products that save lives.
          </p>

          <div>
            <h2 className="text-lg font-semibold text-dll-foreground mb-4">
              Our Culture
            </h2>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="text-[#C17A2A] font-bold shrink-0">01</span>
                <div>
                  <strong className="text-dll-foreground">Safety-Driven</strong>
                  <span> — Everything we build is measured by its ability to protect riders</span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#C17A2A] font-bold shrink-0">02</span>
                <div>
                  <strong className="text-dll-foreground">Innovation First</strong>
                  <span> — We challenge conventions and push technical boundaries</span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#C17A2A] font-bold shrink-0">03</span>
                <div>
                  <strong className="text-dll-foreground">Ride Together</strong>
                  <span> — We test what we build — weekly team rides are a tradition</span>
                </div>
              </li>
            </ul>
          </div>

          <div className="rounded-2xl bg-dll-bg-secondary p-8 text-center">
            <p className="text-dll-foreground font-semibold mb-2">
              No Open Positions Right Now
            </p>
            <p className="text-sm">
              We don&apos;t have any openings at the moment, but we&apos;re
              always interested in hearing from talented people. Send your
              resume to{" "}
              <a
                href="mailto:careers@dll.com"
                className="text-dll-foreground underline underline-offset-4 hover:text-[#C17A2A] transition-colors"
              >
                careers@dll.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
