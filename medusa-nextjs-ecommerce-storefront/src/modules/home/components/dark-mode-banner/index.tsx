"use client"

import Image from "next/image"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { useInView } from "@lib/hooks/use-in-view"

export default function DarkModeBanner() {
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
          <div className="relative overflow-hidden rounded-xl bg-black min-h-[400px] small:min-h-[500px]">
            {/* Background image */}
            <div className="absolute inset-0">
              <Image
                src="https://static.vecteezy.com/system/resources/previews/055/313/569/non_2x/glowing-bicycle-tail-light-in-twilight-red-stop-light-for-cyclist-visibility-and-safety-during-night-cycling-rear-led-light-on-bike-photo.jpg"
                alt="Bike tail light glowing in the dark"
                fill
                className="object-cover opacity-70"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/60" />
            </div>

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center justify-center h-full min-h-[400px] small:min-h-[500px] p-8 text-center">
              <span
                className={`text-white/60 text-sm font-medium tracking-wider uppercase mb-4 transition-all duration-700 delay-100 ${
                  isInView
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
                }`}
              >
                DARK MONTHS
              </span>
              <h2
                className={`text-4xl small:text-6xl font-semibold mb-2 transition-all duration-700 delay-200 ${
                  isInView
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
                }`}
              >
                <span className="text-gray-500">Dark Mode.</span>
              </h2>
              <h2
                className={`text-4xl small:text-6xl font-semibold text-white mb-8 transition-all duration-700 delay-300 ${
                  isInView
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
                }`}
              >
                Ride Mode.
              </h2>
              <div
                className={`transition-all duration-700 delay-[400ms] ${
                  isInView
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
                }`}
              >
                <LocalizedClientLink
                  href="/store"
                  className="px-6 py-3 bg-white text-black text-sm font-medium rounded-full hover:bg-gray-100 transition-colors"
                >
                  Stay Visible
                </LocalizedClientLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
