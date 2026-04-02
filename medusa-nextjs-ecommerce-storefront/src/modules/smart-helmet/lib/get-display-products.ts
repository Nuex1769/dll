"use server"

import { listProducts } from "@lib/data/products"
import { getProductPrice } from "@lib/util/get-product-price"
import { HttpTypes } from "@medusajs/types"
import { SMART_HELMET_COMPARISON_MOCKS } from "../data/mock-comparison"
import { SmartHelmetDisplayItem, SmartHelmetSwatch } from "../types"

const PRODUCT_LIMIT = 24
const DISPLAY_LIMIT = 4

const productFields =
  "*variants.calculated_price,+variants.inventory_quantity,*variants.images,*variants.options,+metadata,+tags,*images,*options,*collection,*categories,*type,thumbnail,title,handle,subtitle,description,id"

const trimDescription = (value?: string | null) => {
  if (!value) {
    return null
  }

  const normalized = value.replace(/\s+/g, " ").trim()

  if (normalized.length <= 92) {
    return normalized
  }

  return `${normalized.slice(0, 89).trimEnd()}...`
}

const normalizeHex = (colorName: string) => {
  const map: Record<string, string> = {
    black: "#1a1a1a",
    white: "#e8e8e8",
    gray: "#6a6a6a",
    grey: "#6a6a6a",
    silver: "#9ca3af",
    navy: "#274c77",
    blue: "#4a7c9b",
    red: "#b91c1c",
    green: "#567d46",
    olive: "#7a7a5a",
    pink: "#f5a5a5",
    carbon: "#4b5563",
    matte: "#111827",
    gloss: "#f3f4f6",
  }

  const lowered = colorName.toLowerCase()

  for (const [key, value] of Object.entries(map)) {
    if (lowered.includes(key)) {
      return value
    }
  }

  let hash = 0

  for (let i = 0; i < lowered.length; i += 1) {
    hash = lowered.charCodeAt(i) + ((hash << 5) - hash)
  }

  return `hsl(${Math.abs(hash) % 360} 35% 52%)`
}

const getImagePool = (product: HttpTypes.StoreProduct) => {
  const urls = [
    product.thumbnail,
    ...(product.images?.map((image) => image.url) ?? []),
  ].filter((value): value is string => Boolean(value))

  return Array.from(new Set(urls))
}

const getSwatches = (product: HttpTypes.StoreProduct): SmartHelmetSwatch[] => {
  const colorOption = product.options?.find((option) =>
    option.title?.toLowerCase().includes("color")
  )

  if (!colorOption?.values?.length) {
    return []
  }

  const imagePool = getImagePool(product)

  return colorOption.values.map((optionValue, index) => {
    const colorName = optionValue.value

    const matchingVariant = product.variants?.find((variant) =>
      variant.options?.some(
        (variantOption) =>
          variantOption.value?.toLowerCase() === colorName.toLowerCase()
      )
    )

    const image =
      matchingVariant?.images?.[0]?.url ??
      imagePool[index] ??
      imagePool[0] ??
      null

    return {
      name: colorName,
      value: normalizeHex(colorName),
      image,
    }
  })
}

const isSmartHelmetProduct = (product: HttpTypes.StoreProduct) => {
  const categories = ((product as any).categories ?? [])
    .map((category: any) => category?.name)
    .filter(Boolean)
    .join(" ")

  const tags = ((product as any).tags ?? [])
    .map((tag: any) => tag?.value)
    .filter(Boolean)
    .join(" ")

  const haystack = [
    product.title,
    product.handle,
    product.subtitle,
    product.description,
    (product.collection as any)?.title,
    (product.type as any)?.value,
    categories,
    tags,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase()

  return haystack.includes("helmet")
}

const toDisplayItem = (
  product: HttpTypes.StoreProduct,
  slotIndex: number
): SmartHelmetDisplayItem | null => {
  if (!product.handle) {
    return null
  }

  const swatches = getSwatches(product)
  const imagePool = getImagePool(product)
  const { cheapestPrice } = getProductPrice({ product })

  return {
    id: product.id,
    title: product.title,
    handle: product.handle,
    thumbnail: product.thumbnail ?? imagePool[0] ?? null,
    images: imagePool,
    shortDescription: trimDescription(product.subtitle || product.description),
    cheapestPrice: cheapestPrice?.calculated_price ?? null,
    learnMoreHref: `/products/${product.handle}`,
    buyHref: `/products/${product.handle}#buy`,
    swatches,
    mock: SMART_HELMET_COMPARISON_MOCKS[slotIndex],
  }
}

export const getSmartHelmetDisplayProducts = async ({
  countryCode,
}: {
  countryCode: string
}) => {
  const {
    response: { products },
  } = await listProducts({
    pageParam: 1,
    countryCode,
    queryParams: {
      limit: PRODUCT_LIMIT,
      fields: productFields,
    },
  })

  if (!products?.length) {
    return []
  }

  const preferred = products.filter(isSmartHelmetProduct)
  const fallback = products.filter(
    (product) => !preferred.some((preferredProduct) => preferredProduct.id === product.id)
  )

  const selected = [...preferred, ...fallback].slice(0, DISPLAY_LIMIT)

  return selected
    .map((product, index) => toDisplayItem(product, index))
    .filter((item): item is SmartHelmetDisplayItem => Boolean(item))
}
