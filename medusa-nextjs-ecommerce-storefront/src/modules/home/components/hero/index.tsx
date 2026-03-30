import Image from "next/image"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

type HeroProps = {
  /** Optional background image URL */
  backgroundImage?: string
  /** Optional background video URL (mp4) */
  backgroundVideo?: string
  /** Dark overlay opacity when using image/video (0-1, default 0.6) */
  overlayOpacity?: number
  /** Alt text for background image */
  alt?: string
  /** i18n translations */
  translations?: {
    subtitle: string
    titleLine1: string
    titleLine2: string
    description: string
    shopNow: string
    learnMore: string
  }
}

const Hero = ({
  backgroundImage,
  backgroundVideo,
  overlayOpacity = 0.6,
  alt = "DLL Smart Helmets",
  translations,
}: HeroProps) => {
  const t = translations ?? {
    subtitle: "Smart Helmets & Cycling Gear",
    titleLine1: "Ride Smarter.",
    titleLine2: "Ride Safer.",
    description:
      "Premium smart helmets designed for safety, connectivity, and style. Built for the modern rider.",
    shopNow: "Shop Now",
    learnMore: "Learn More",
  }

  return (
    <div className="relative h-[90vh] small:h-screen w-full bg-dll-foreground overflow-hidden">
      {/* Background layer: video > image > gradient (fallback) */}
      {backgroundVideo ? (
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src={backgroundVideo} type="video/mp4" />
        </video>
      ) : backgroundImage ? (
        <Image
          src={backgroundImage}
          alt={alt}
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900" />
      )}

      {/* Dark overlay for text readability (only with image/video) */}
      {(backgroundImage || backgroundVideo) && (
        <div
          className="absolute inset-0 bg-black"
          style={{ opacity: overlayOpacity }}
        />
      )}

      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[length:24px_24px]" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6">
        <span className="text-xs tracking-[0.3em] uppercase text-white/60 mb-6 animate-fade-in">
          {t.subtitle}
        </span>
        <h1 className="text-4xl small:text-6xl medium:text-7xl font-bold text-white leading-tight tracking-tight max-w-4xl animate-fade-in-up">
          {t.titleLine1}
          <br />
          {t.titleLine2}
        </h1>
        <p className="mt-6 text-base small:text-lg text-white/70 max-w-xl leading-relaxed animate-fade-in-up [animation-delay:200ms]">
          {t.description}
        </p>
        <div className="mt-10 flex items-center gap-4 animate-fade-in-up [animation-delay:400ms]">
          <LocalizedClientLink href="/store">
            <button className="dll-btn-outline">
              {t.shopNow}
            </button>
          </LocalizedClientLink>
          <a
            href="#features"
            className="text-sm text-white/60 hover:text-white transition-colors underline underline-offset-4"
          >
            {t.learnMore}
          </a>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-5 h-5 text-white/40"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m19.5 8.25-7.5 7.5-7.5-7.5"
            />
          </svg>
        </div>
      </div>
    </div>
  )
}

export default Hero
