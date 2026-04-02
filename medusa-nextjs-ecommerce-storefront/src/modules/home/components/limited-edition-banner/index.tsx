"use client"

import Image from "next/image"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { useInView } from "@lib/hooks/use-in-view"

export default function LimitedEditionBanner() {
  const { ref, isInView } = useInView({ threshold: 0.15 })

  return (
    <section className="py-4 bg-white">
      <div className="px-4 sm:px-6 small:px-8">
        <div
          ref={ref}
          className={`transition-all duration-700 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="relative overflow-hidden rounded-xl min-h-[350px] small:min-h-[400px]">
            {/* Background image */}
            <div className="absolute inset-0">
              <Image
                src="https://images.pexels.com/photos/13344226/pexels-photo-13344226.jpeg"
                alt="Man riding electric bike"
                fill
                className="object-cover hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
            </div>

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center justify-center h-full min-h-[350px] small:min-h-[400px] p-8 text-center">
              <h2
                className={`text-4xl small:text-5xl font-semibold text-white mb-3 transition-all duration-700 delay-100 ${
                  isInView
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
                }`}
              >
                Limited Editions
              </h2>
              <p
                className={`text-white/80 text-base mb-6 transition-all duration-700 delay-200 ${
                  isInView
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
                }`}
              >
                Unique collaborations with Global Brands
              </p>
              <div
                className={`transition-all duration-700 delay-300 ${
                  isInView
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
                }`}
              >
                <LocalizedClientLink
                  href="/store"
                  className="px-6 py-3 bg-white text-black text-sm font-medium rounded-full hover:bg-gray-100 transition-colors"
                >
                  Learn more
                </LocalizedClientLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
