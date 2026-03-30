type FeatureTranslation = {
  title: string
  description: string
}

type FeaturesSectionProps = {
  translations?: {
    sectionTitle: string
    heading: string
    items: FeatureTranslation[]
  }
}

const icons = [
  <svg key="safety" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
  </svg>,
  <svg key="connected" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.288 15.038a5.25 5.25 0 0 1 7.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12.53 18.22l-.53.53-.53-.53a.75.75 0 0 1 1.06 0Z" />
  </svg>,
  <svg key="comfort" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
  </svg>,
  <svg key="battery" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a2.25 2.25 0 0 0-2.25-2.25H15a3 3 0 1 1-6 0H5.25A2.25 2.25 0 0 0 3 12m18 0v6a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 9m18 0V6a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 6v3" />
  </svg>,
]

const defaultItems: FeatureTranslation[] = [
  {
    title: "Advanced Safety",
    description:
      "Integrated LED lighting and impact sensors that automatically alert emergency contacts.",
  },
  {
    title: "Stay Connected",
    description:
      "Bluetooth speakers, hands-free calls, and turn-by-turn navigation built right in.",
  },
  {
    title: "Designed to Wear",
    description:
      "Ultra-lightweight with premium ventilation. Comfort you forget you're wearing.",
  },
  {
    title: "Long Battery Life",
    description:
      "12+ hours of battery life. USB-C fast charging gets you back on the road in minutes.",
  },
]

const FeaturesSection = ({ translations }: FeaturesSectionProps) => {
  const sectionTitle = translations?.sectionTitle ?? "Why DLL"
  const heading = translations?.heading ?? "Built for the Modern Rider"
  const items = translations?.items ?? defaultItems

  return (
    <section id="features" className="bg-dll-bg-secondary py-20 small:py-28">
      <div className="content-container">
        <div className="text-center mb-16">
          <span className="text-xs tracking-[0.2em] uppercase text-dll-foreground-secondary">
            {sectionTitle}
          </span>
          <h2 className="text-3xl small:text-4xl font-semibold text-dll-foreground mt-3">
            {heading}
          </h2>
        </div>

        <div className="grid grid-cols-1 small:grid-cols-2 medium:grid-cols-4 gap-8 small:gap-12">
          {items.map((feature, index) => (
            <div
              key={feature.title}
              className="flex flex-col items-center text-center group"
            >
              <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center text-dll-foreground mb-5 group-hover:bg-dll-foreground group-hover:text-white transition-colors duration-300">
                {icons[index]}
              </div>
              <h3 className="text-base font-semibold text-dll-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-dll-foreground-secondary leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default FeaturesSection
