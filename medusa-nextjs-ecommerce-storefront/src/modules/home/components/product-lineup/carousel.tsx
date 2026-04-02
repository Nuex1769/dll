"use client"

import { useCallback, useEffect, useState } from "react"
import Image from "next/image"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import useEmblaCarousel from "embla-carousel-react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import PlaceholderImage from "@modules/common/icons/placeholder-image"

export type ProductLineupItem = {
  id: string
  handle: string
  title: string
  subtitle: string | null
  thumbnail: string | null
  tag: string | null
  cheapestPrice: string | null
}

type ProductLineupCarouselProps = {
  products: ProductLineupItem[]
}

export default function ProductLineupCarousel({
  products,
}: ProductLineupCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "center",
    loop: true,
  })
  const [canScrollPrev, setCanScrollPrev] = useState(false)
  const [canScrollNext, setCanScrollNext] = useState(false)

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setCanScrollPrev(emblaApi.canScrollPrev())
    setCanScrollNext(emblaApi.canScrollNext())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    onSelect()
    emblaApi.on("select", onSelect)
    emblaApi.on("reInit", onSelect)
    return () => {
      emblaApi.off("select", onSelect)
    }
  }, [emblaApi, onSelect])

  if (!products.length) return null

  return (
    <section className="py-16 small:py-24 bg-white overflow-hidden">
      <div className="relative w-full">
        {/* Carousel viewport */}
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex -ml-4">
            {products.map((product) => (
              <div
                key={product.id}
                className="min-w-0 shrink-0 grow-0 pl-4 basis-[85%] sm:basis-[70%] md:basis-[55%] small:basis-[45%] xl:basis-[40%]"
              >
                <div className="border border-gray-200 rounded-xl p-6 small:p-8 h-full bg-white hover:shadow-lg transition-shadow duration-300">
                  {/* Tag */}
                  {product.tag && (
                    <span className="text-xs text-gray-500 tracking-wider">
                      [ {product.tag.toUpperCase()} ]
                    </span>
                  )}

                  {/* Product Image */}
                  <div className="relative aspect-square my-6 overflow-hidden rounded-lg bg-gray-50">
                    {product.thumbnail ? (
                      <Image
                        src={product.thumbnail}
                        alt={product.title}
                        fill
                        className="object-contain hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 640px) 85vw, (max-width: 1024px) 55vw, 40vw"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <PlaceholderImage size={24} />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex items-end justify-between">
                    <div>
                      <h3 className="text-2xl font-semibold text-gray-900 mb-1">
                        {product.title}
                      </h3>
                      {product.subtitle && (
                        <p className="text-gray-600 text-sm">
                          {product.subtitle}
                        </p>
                      )}
                      {product.cheapestPrice && (
                        <p className="text-gray-900 text-sm font-medium mt-1">
                          From {product.cheapestPrice}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <LocalizedClientLink
                        href={`/products/${product.handle}`}
                        className="px-4 py-2 bg-black text-white text-sm font-medium rounded-full hover:bg-gray-800 transition-colors"
                      >
                        Learn more
                      </LocalizedClientLink>
                      <LocalizedClientLink
                        href={`/products/${product.handle}`}
                        className="px-4 py-2 border border-gray-200 text-gray-900 text-sm font-medium rounded-full hover:bg-gray-50 transition-colors"
                      >
                        Buy
                      </LocalizedClientLink>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation buttons */}
        <div className="flex items-center justify-center gap-2 mt-8">
          <button
            onClick={() => emblaApi?.scrollPrev()}
            disabled={!canScrollPrev}
            className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors disabled:opacity-50 disabled:pointer-events-none"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="sr-only">Previous slide</span>
          </button>
          <button
            onClick={() => emblaApi?.scrollNext()}
            disabled={!canScrollNext}
            className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors disabled:opacity-50 disabled:pointer-events-none"
          >
            <ChevronRight className="w-5 h-5" />
            <span className="sr-only">Next slide</span>
          </button>
        </div>
      </div>
    </section>
  )
}
