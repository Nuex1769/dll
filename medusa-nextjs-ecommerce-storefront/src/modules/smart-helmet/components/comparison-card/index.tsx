"use client"

import { useMemo, useState } from "react"
import Image from "next/image"
import { ChevronRight } from "lucide-react"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import PlaceholderImage from "@modules/common/icons/placeholder-image"
import { SmartHelmetDisplayItem } from "../../types"

type ComparisonCardProps = {
  item: SmartHelmetDisplayItem
}

export default function ComparisonCard({ item }: ComparisonCardProps) {
  const [activeSwatch, setActiveSwatch] = useState(0)

  const activeImage = useMemo(() => {
    if (item.swatches[activeSwatch]?.image) {
      return item.swatches[activeSwatch].image
    }

    return item.thumbnail ?? item.images[0] ?? null
  }, [activeSwatch, item.images, item.swatches, item.thumbnail])

  return (
    <article className="flex flex-col items-center">
      <div className="relative w-full aspect-square mb-6">
          {activeImage ? (
            <Image
              src={activeImage}
              alt={item.title}
              fill
              className="object-contain transition-transform duration-500"
              sizes="(max-width: 768px) 90vw, (max-width: 1280px) 48vw, 25vw"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <PlaceholderImage size={24} />
            </div>
          )}
      </div>

      {item.swatches.length > 1 ? (
        <div className="mb-6 flex items-center gap-2">
          {item.swatches.map((swatch, index) => (
            <button
              key={`${item.id}-${swatch.name}`}
              type="button"
              aria-label={`Select ${swatch.name} color`}
              onClick={() => setActiveSwatch(index)}
              className={`h-3 w-3 rounded-full border transition-all ${
                activeSwatch === index
                  ? "border-gray-900 ring-2 ring-gray-900 ring-offset-2"
                  : "border-gray-300 hover:border-gray-500"
              }`}
              style={{ backgroundColor: swatch.value }}
            />
          ))}
        </div>
      ) : (
        <div className="mb-6 h-3" />
      )}

      <div className="text-center">
        <h3 className="text-2xl font-semibold tracking-wider text-gray-900">
          {item.title}
        </h3>
        <p className="mb-3 mt-1 text-xs tracking-widest text-gray-500">
          [ {item.mock.eyebrow}
          {item.mock.isNew ? (
            <span className="ml-1 text-orange-500"> NEW</span>
          ) : (
            ""
          )}{" "}
          ]
        </p>
        <p className="mx-auto max-w-[18rem] text-sm text-gray-600">
          {item.shortDescription ?? item.mock.description}
        </p>
      </div>

      <div className="mt-6 flex items-center justify-center gap-4">
        <LocalizedClientLink
          href={item.learnMoreHref}
          className="inline-flex items-center justify-center rounded-full bg-gray-900 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-gray-800"
        >
          Learn more
        </LocalizedClientLink>
        <LocalizedClientLink
          href={item.buyHref}
          className="inline-flex items-center gap-1 text-sm text-gray-600 transition-colors hover:text-gray-900"
        >
          Buy
          <ChevronRight className="h-4 w-4" />
        </LocalizedClientLink>
      </div>
    </article>
  )
}
