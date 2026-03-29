import { Metadata } from "next"

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about DLL — our mission to make cycling safer and smarter through innovative helmet technology.",
}

export default function AboutPage() {
  return (
    <div className="content-container py-16 small:py-24">
      {/* Hero */}
      <div className="text-center max-w-3xl mx-auto mb-16 small:mb-24">
        <span className="text-xs tracking-[0.2em] uppercase text-dll-foreground-secondary">
          About DLL
        </span>
        <h1 className="text-3xl small:text-5xl font-bold text-dll-foreground mt-3 leading-tight">
          Ride Smarter. Ride Safer.
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
        <div>
          <h3 className="text-lg font-semibold text-dll-foreground mb-3">
            Safety First
          </h3>
          <p className="text-sm text-dll-foreground-secondary leading-relaxed">
            Every product we create starts with rider safety. Our helmets
            feature integrated LED lighting, impact sensors, and automatic
            emergency alerts to protect you when it matters most.
          </p>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-dll-foreground mb-3">
            Smart Technology
          </h3>
          <p className="text-sm text-dll-foreground-secondary leading-relaxed">
            From Bluetooth audio to turn-by-turn navigation, our smart helmets
            keep you connected without distraction. Built-in speakers,
            hands-free calls, and ride tracking — all integrated seamlessly.
          </p>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-dll-foreground mb-3">
            Sustainable Design
          </h3>
          <p className="text-sm text-dll-foreground-secondary leading-relaxed">
            We&apos;re committed to reducing our environmental footprint. Our
            helmets use recycled materials where possible and are designed for
            longevity — not landfills.
          </p>
        </div>
      </div>

      {/* Story */}
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-semibold text-dll-foreground mb-6">
          Our Story
        </h2>
        <div className="space-y-4 text-sm text-dll-foreground-secondary leading-relaxed">
          <p>
            DLL started as a passion project by a group of cycling enthusiasts
            and engineers who were frustrated by the gap between traditional
            helmets and modern technology. We asked ourselves: why can&apos;t a
            helmet be both protective and intelligent?
          </p>
          <p>
            After years of research, prototyping, and real-world testing, we
            launched our first smart helmet — and the response from the cycling
            community was overwhelming. Riders loved the combination of
            safety features, connectivity, and comfort.
          </p>
          <p>
            Today, DLL serves riders across the globe, from daily commuters to
            weekend adventurers. Our mission remains the same: to make every
            ride smarter and safer.
          </p>
        </div>
      </div>
    </div>
  )
}
