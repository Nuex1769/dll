"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import useEmblaCarousel from "embla-carousel-react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import ComparisonCard from "../comparison-card"
import ComparisonMatrix from "../comparison-matrix"
import { SmartHelmetDisplayItem } from "../../types"

type ComparisonCarouselProps = {
  items: SmartHelmetDisplayItem[]
}

export default function ComparisonCarousel({
  items,
}: ComparisonCarouselProps) {
  const [isTabletViewport, setIsTabletViewport] = useState(false)
  const [mobileEmblaRef, mobileEmblaApi] = useEmblaCarousel({
    align: "start",
    loop: false,
    containScroll: "trimSnaps",
  })
  const [tabletEmblaRef, tabletEmblaApi] = useEmblaCarousel({
    align: "start",
    loop: false,
    containScroll: "trimSnaps",
  })
  const [mobileCanScrollPrev, setMobileCanScrollPrev] = useState(false)
  const [mobileCanScrollNext, setMobileCanScrollNext] = useState(false)
  const [tabletCanScrollPrev, setTabletCanScrollPrev] = useState(false)
  const [tabletCanScrollNext, setTabletCanScrollNext] = useState(false)

  useEffect(() => {
    if (typeof window === "undefined") {
      return
    }

    const mediaQuery = window.matchMedia(
      "(min-width: 768px) and (max-width: 1023px)"
    )

    const syncViewport = () => {
      setIsTabletViewport(mediaQuery.matches)
    }

    syncViewport()
    mediaQuery.addEventListener("change", syncViewport)

    return () => {
      mediaQuery.removeEventListener("change", syncViewport)
    }
  }, [])

  const onMobileSelect = useCallback(() => {
    if (!mobileEmblaApi) {
      return
    }

    setMobileCanScrollPrev(mobileEmblaApi.canScrollPrev())
    setMobileCanScrollNext(mobileEmblaApi.canScrollNext())
  }, [mobileEmblaApi])

  useEffect(() => {
    if (!mobileEmblaApi) {
      return
    }

    onMobileSelect()
    mobileEmblaApi.on("select", onMobileSelect)
    mobileEmblaApi.on("reInit", onMobileSelect)

    return () => {
      mobileEmblaApi.off("select", onMobileSelect)
      mobileEmblaApi.off("reInit", onMobileSelect)
    }
  }, [mobileEmblaApi, onMobileSelect])

  const onTabletSelect = useCallback(() => {
    if (!tabletEmblaApi) {
      return
    }

    setTabletCanScrollPrev(tabletEmblaApi.canScrollPrev())
    setTabletCanScrollNext(tabletEmblaApi.canScrollNext())
  }, [tabletEmblaApi])

  useEffect(() => {
    if (!tabletEmblaApi) {
      return
    }

    onTabletSelect()
    tabletEmblaApi.on("select", onTabletSelect)
    tabletEmblaApi.on("reInit", onTabletSelect)

    return () => {
      tabletEmblaApi.off("select", onTabletSelect)
      tabletEmblaApi.off("reInit", onTabletSelect)
    }
  }, [tabletEmblaApi, onTabletSelect])

  if (!items.length) {
    return null
  }

  const tabletSlides = useMemo(
    () =>
      Array.from({ length: Math.ceil(items.length / 2) }, (_, index) =>
        items.slice(index * 2, index * 2 + 2)
      ),
    [items]
  )

  return (
    <div className="lg:hidden">
      {isTabletViewport ? (
        <div className="overflow-hidden" ref={tabletEmblaRef}>
          <div className="flex">
            {tabletSlides.map((slide, index) => (
              <div key={index} className="min-w-0 shrink-0 grow-0 basis-full">
                <div className="grid grid-cols-2 gap-8">
                  {slide.map((item) => (
                    <ComparisonCard key={item.id} item={item} />
                  ))}
                </div>
                <ComparisonMatrix items={slide} />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="overflow-hidden" ref={mobileEmblaRef}>
          <div className="flex">
            {items.map((item) => (
              <div key={item.id} className="min-w-0 shrink-0 grow-0 basis-full">
                <ComparisonCard item={item} />
                <ComparisonMatrix items={[item]} />
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-8 flex items-center justify-center gap-2">
        <button
          type="button"
          onClick={() =>
            isTabletViewport
              ? tabletEmblaApi?.scrollPrev()
              : mobileEmblaApi?.scrollPrev()
          }
          disabled={isTabletViewport ? !tabletCanScrollPrev : !mobileCanScrollPrev}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-gray-900 transition-colors active:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronLeft className="h-5 w-5" />
          <span className="sr-only">Previous products</span>
        </button>
        <button
          type="button"
          onClick={() =>
            isTabletViewport
              ? tabletEmblaApi?.scrollNext()
              : mobileEmblaApi?.scrollNext()
          }
          disabled={isTabletViewport ? !tabletCanScrollNext : !mobileCanScrollNext}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-gray-900 transition-colors active:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronRight className="h-5 w-5" />
          <span className="sr-only">Next products</span>
        </button>
      </div>
    </div>
  )
}
