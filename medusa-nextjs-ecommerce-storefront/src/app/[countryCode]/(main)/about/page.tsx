import { Metadata } from "next"
import { getT } from "@lib/util/i18n"

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about DLL — our mission to make cycling safer and smarter through innovative helmet technology.",
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ countryCode: string }>
}) {
  const { countryCode } = await params
  const t = await getT(countryCode)

  return (
    <div className="content-container py-16 small:py-24">
      {/* Hero */}
      <div className="text-center max-w-3xl mx-auto mb-16 small:mb-24">
        <span className="text-xs tracking-[0.2em] uppercase text-dll-foreground-secondary">
          {t("about.label")}
        </span>
        <h1 className="text-3xl small:text-5xl font-bold text-dll-foreground mt-3 leading-tight">
          {t("about.title")}
        </h1>
        <p className="mt-6 text-base small:text-lg text-dll-foreground-secondary leading-relaxed">
          DLL was founded with a simple belief: every rider deserves the best
          protection and connectivity on the road. We combine cutting-edge
          technology with thoughtful design to create helmets that keep you
          safe, connected, and in style.
        </p>
      </div>

      {/* Values */}
      <div className="grid grid-cols-1 small:grid-cols-3 gap-12 small:gap-16 mb-16 small:mb-24">
        {[0, 1, 2].map((i) => (
          <div key={i}>
            <h3 className="text-lg font-semibold text-dll-foreground mb-3">
              {t(`about.values.${i}.title`)}
            </h3>
            <p className="text-sm text-dll-foreground-secondary leading-relaxed">
              {t(`about.values.${i}.description`)}
            </p>
          </div>
        ))}
      </div>

      {/* Story */}
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-semibold text-dll-foreground mb-6">
          {t("about.story_title")}
        </h2>
        <div className="space-y-4 text-sm text-dll-foreground-secondary leading-relaxed">
          <p>{t("about.story_paragraphs.0")}</p>
          <p>{t("about.story_paragraphs.1")}</p>
          <p>{t("about.story_paragraphs.2")}</p>
        </div>
      </div>
    </div>
  )
}
