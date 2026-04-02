"use client"

import Image from "next/image"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { useInView } from "@lib/hooks/use-in-view"

type DualCard = {
  tag: string
  tagItalic?: boolean
  title: string
  image: string
  cta: string
  href: string
  bgClass: string
}

const cards: DualCard[] = [
  {
    tag: "Accessories",
    title: "Supercharge your ride",
    image:
      "https://bikerumor.com/wp-content/uploads/2024/01/Shimano-Technium-lead-image-scaled.jpeg",
    cta: "Shop now",
    href: "/store",
    bgClass: "bg-black",
  },
  {
    tag: "DLL lane",
    tagItalic: true,
    title: "The Ultimate EV Guide",
    image:
      "https://images.unsplash.com/photo-1555421689-491a97ff2040?q=80&w=2070&auto=format&fit=crop",
    cta: "Explore",
    href: "/blog",
    bgClass: "bg-gradient-to-br from-gray-700 to-gray-900",
  },
]

export default function BottomDualCards() {
  const { ref, isInView } = useInView({ threshold: 0.1 })

  return (
    <section className="py-4 bg-white">
      <div className="px-4 sm:px-6 small:px-8">
        <div ref={ref} className="grid md:grid-cols-2 gap-4">
          {cards.map((card, i) => (
            <div
              key={card.tag}
              className={`transition-all duration-700 ${
                isInView
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <div
                className={`relative overflow-hidden rounded-xl ${card.bgClass} min-h-[350px] small:min-h-[400px]`}
              >
                {/* Background image */}
                <div className="absolute inset-0">
                  <Image
                    src={card.image}
                    alt={card.title}
                    fill
                    className="object-cover opacity-50 hover:scale-105 transition-transform duration-700"
                  />
                </div>

                {/* Content */}
                <div className="relative z-10 flex flex-col items-center justify-center h-full min-h-[350px] small:min-h-[400px] p-8 text-center">
                  <span
                    className={`text-sm font-medium mb-3 text-white ${
                      card.tagItalic ? "italic" : ""
                    }`}
                  >
                    {card.tag}
                  </span>
                  <h3 className="text-2xl small:text-3xl font-semibold mb-6 text-white">
                    {card.title}
                  </h3>
                  <LocalizedClientLink
                    href={card.href}
                    className="px-5 py-2.5 bg-white text-black text-sm font-medium rounded-full hover:bg-gray-100 transition-colors"
                  >
                    {card.cta}
                  </LocalizedClientLink>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
