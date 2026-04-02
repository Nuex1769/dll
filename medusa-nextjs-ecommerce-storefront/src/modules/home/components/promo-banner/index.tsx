import LocalizedClientLink from "@modules/common/components/localized-client-link"

type PromoBannerProps = {
  badge?: string
  title?: string
  subtitle?: string
  ctaText?: string
  ctaLink?: string
  bgGradient?: string
}

const PromoBanner = ({
  badge = "LIMITED TIME",
  title = "Spring Sale — 15% Off All Helmets",
  subtitle = "Use code SPRING15 at checkout. Free shipping on orders over $100.",
  ctaText = "Shop the Sale",
  ctaLink = "/store",
  bgGradient = "from-dll-foreground via-gray-800 to-gray-900",
}: PromoBannerProps) => {
  return (
    <section className="py-4 small:py-6">
      <div className="content-container">
        <div
          className={`relative bg-gradient-to-r ${bgGradient} rounded-2xl overflow-hidden`}
        >
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/4" />

          <div className="relative z-10 flex flex-col small:flex-row items-center justify-between gap-6 px-8 py-10 small:px-12 small:py-12">
            <div className="text-center small:text-left">
              {badge && (
                <span className="inline-block px-3 py-1 text-[9px] tracking-[0.2em] uppercase font-medium text-white/80 bg-white/15 rounded-full mb-3">
                  {badge}
                </span>
              )}
              <h2 className="text-xl small:text-2xl font-bold text-white">
                {title}
              </h2>
              <p className="mt-2 text-sm text-white/60 max-w-md">
                {subtitle}
              </p>
            </div>
            <LocalizedClientLink href={ctaLink} className="shrink-0">
              <button className="inline-flex items-center justify-center px-8 py-3 bg-white text-gray-900 rounded-full font-medium text-sm tracking-wide transition-all duration-300 ease-out hover:bg-gray-100 active:scale-[0.98]">
                {ctaText}
              </button>
            </LocalizedClientLink>
          </div>
        </div>
      </div>
    </section>
  )
}

export default PromoBanner
