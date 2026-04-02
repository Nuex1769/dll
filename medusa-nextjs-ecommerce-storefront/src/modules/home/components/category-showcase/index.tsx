"use client"

import Image from "next/image"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { ArrowRight } from "lucide-react"
import { useInView } from "@lib/hooks/use-in-view"

type CategoryCard = {
  tag: string
  title: string
  image: string
  learnMore: string
  buyNow: string
  bgClass: string
}

const categories: CategoryCard[] = [
  {
    tag: "Smart Light",
    title: "Next-Gen Bike Lights",
    image:
      "https://www.glow.co.uk/media/catalog/product/cache/1/image/960x/0f396e8a55728e79b48334e699243c07/r/e/rear-bike-light-with-size-lasers-4.jpg",
    learnMore: "#",
    buyNow: "/store",
    bgClass: "bg-black",
  },
  {
    tag: "TORCH Backpack",
    title: "Everyday Toughness",
    image:
      "https://www.madlug.com/cdn/shop/files/14_420825b7-d0d2-46db-ade9-f8995edb384f_large.jpg?v=1736773566",
    learnMore: "#",
    buyNow: "/store",
    bgClass: "bg-gradient-to-br from-gray-400 to-gray-500",
  },
]

export default function CategoryShowcase() {
  const { ref, isInView } = useInView({ threshold: 0.1 })

  return (
    <section className="py-4 bg-white">
      <div className="px-4 sm:px-6 small:px-8">
        <div ref={ref} className="grid md:grid-cols-2 gap-4">
          {categories.map((cat, i) => (
            <div
              key={cat.tag}
              className={`transition-all duration-700 ${
                isInView
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <div
                className={`relative overflow-hidden rounded-xl ${cat.bgClass} min-h-[400px] small:min-h-[500px]`}
              >
                {/* Background image */}
                <div className="absolute inset-0">
                  <Image
                    src={cat.image}
                    alt={cat.title}
                    fill
                    className="object-cover opacity-60 hover:scale-105 transition-transform duration-700"
                  />
                </div>

                {/* Content overlay */}
                <div className="relative z-10 flex flex-col items-center justify-center h-full min-h-[400px] small:min-h-[500px] p-8 text-center">
                  <span className="text-sm font-medium mb-3 text-white">
                    {cat.tag}
                  </span>
                  <h3 className="text-3xl small:text-4xl font-semibold mb-6 text-white">
                    {cat.title}
                  </h3>
                  <div className="flex items-center gap-4">
                    <LocalizedClientLink
                      href={cat.learnMore}
                      className="px-5 py-2.5 bg-white text-black text-sm font-medium rounded-full hover:bg-gray-100 transition-colors"
                    >
                      Learn more
                    </LocalizedClientLink>
                    <LocalizedClientLink
                      href={cat.buyNow}
                      className="flex items-center gap-1 text-sm font-medium text-white hover:opacity-80 transition-opacity"
                    >
                      Buy now
                      <ArrowRight className="w-4 h-4" />
                    </LocalizedClientLink>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
