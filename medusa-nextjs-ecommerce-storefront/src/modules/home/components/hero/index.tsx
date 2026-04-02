"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { motion, AnimatePresence } from "framer-motion"

type HeroSlide = {
  bgImage?: string
  bgGradient?: string
  badge?: string
  title: string
  subtitle: string
  ctaText: string
  ctaLink: string
}

type HeroProps = {
  slides?: HeroSlide[]
  interval?: number
  translations?: {
    subtitle: string
    titleLine1: string
    titleLine2: string
    description: string
    shopNow: string
    learnMore: string
  }
}

const defaultSlides: HeroSlide[] = [
  {
    bgImage:
      "https://images.unsplash.com/photo-1544191696-102a3c32f7a6?q=80&w=2070&auto=format&fit=crop",
    badge: "SPRING SALE",
    title: "Ride Into Spring with 15%+ Savings",
    subtitle:
      "Save on AURA Neon, FARO, and more. Limited-time Spring deals",
    ctaText: "Shop 15% off",
    ctaLink: "/store",
  },
  {
    bgImage:
      "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?q=80&w=2070&auto=format&fit=crop",
    badge: "NEW ARRIVAL",
    title: "Smart Helmets for Every Ride",
    subtitle:
      "Integrated LED lighting, crash detection, and hands-free calling.",
    ctaText: "Explore Collection",
    ctaLink: "/store",
  },
  {
    bgImage:
      "https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?q=80&w=2070&auto=format&fit=crop",
    badge: "BEST SELLER",
    title: "Safety Meets Style",
    subtitle:
      "The AURA smart helmet — performance meets style for the modern rider.",
    ctaText: "Shop Now",
    ctaLink: "/store",
  },
]

const Hero = ({ slides, interval = 5000, translations }: HeroProps) => {
  const heroSlides: HeroSlide[] =
    slides ??
    (translations
      ? [
          {
            ...defaultSlides[0],
            badge: translations.subtitle,
            title: `${translations.titleLine1} ${translations.titleLine2}`,
            subtitle: translations.description,
            ctaText: translations.shopNow,
          },
          ...defaultSlides.slice(1),
        ]
      : defaultSlides)

  const [current, setCurrent] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)

  const goTo = useCallback(
    (index: number) => {
      if (isTransitioning) return
      setIsTransitioning(true)
      setCurrent(index)
      setTimeout(() => setIsTransitioning(false), 700)
    },
    [isTransitioning]
  )

  const next = useCallback(() => {
    goTo((current + 1) % heroSlides.length)
  }, [current, heroSlides.length, goTo])

  useEffect(() => {
    const timer = setInterval(next, interval)
    return () => clearInterval(timer)
  }, [next, interval])

  const slide = heroSlides[current]

  return (
    <section className="relative h-[70vh] min-h-[500px] overflow-hidden">
      {/* Background layers */}
      {heroSlides.map((s, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
            i === current ? "opacity-100" : "opacity-0"
          }`}
        >
          {s.bgImage ? (
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: `url('${s.bgImage}')` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
            </div>
          ) : (
            <div
              className={`absolute inset-0 bg-gradient-to-br ${s.bgGradient || "from-gray-900 to-black"}`}
            />
          )}
        </div>
      ))}

      {/* Content — left-aligned */}
      <div className="relative h-full px-4 sm:px-6 small:px-8 xl:px-12 flex items-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            className="max-w-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            {slide.badge && (
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="inline-block text-white/80 text-sm font-medium tracking-wider uppercase mb-4"
              >
                {slide.badge}
              </motion.span>
            )}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-4xl sm:text-5xl small:text-6xl font-semibold text-white leading-[1.1] tracking-tight mb-6"
            >
              {slide.title}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-white/80 text-base sm:text-lg mb-8"
            >
              {slide.subtitle}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <LocalizedClientLink
                href={slide.ctaLink}
                className="inline-flex items-center justify-center px-6 py-3 bg-white text-black text-sm font-medium rounded-full hover:bg-gray-100 transition-colors"
              >
                {slide.ctaText}
              </LocalizedClientLink>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Slide indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
        {heroSlides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`transition-all duration-300 rounded-full ${
              i === current
                ? "w-8 h-2 bg-white"
                : "w-2 h-2 bg-white/40 hover:bg-white/60"
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  )
}

export default Hero
