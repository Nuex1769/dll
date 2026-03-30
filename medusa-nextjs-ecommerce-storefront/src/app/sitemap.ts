import { MetadataRoute } from "next"
import { getBaseURL } from "@lib/util/env"
import { listProducts } from "@lib/data/products"
import { listCollections } from "@lib/data/collections"
import { listCategories } from "@lib/data/categories"
import { listRegions } from "@lib/data/regions"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getBaseURL()
  const now = new Date()

  // Get all country codes from regions
  let countryCodes: string[] = ["us"]
  try {
    const regions = await listRegions()
    countryCodes =
      regions
        ?.flatMap((r) => r.countries?.map((c) => c.iso_2) || [])
        .filter(Boolean) || ["us"]
  } catch {
    // fallback to default
  }

  const entries: MetadataRoute.Sitemap = []

  // Static pages
  const staticPages = [
    { path: "", priority: 1.0, changeFrequency: "daily" as const },
    { path: "/store", priority: 0.9, changeFrequency: "daily" as const },
    { path: "/smart-helmet", priority: 0.9, changeFrequency: "weekly" as const },
    { path: "/accessories", priority: 0.9, changeFrequency: "weekly" as const },
    { path: "/about", priority: 0.6, changeFrequency: "monthly" as const },
    { path: "/support", priority: 0.6, changeFrequency: "monthly" as const },
    {
      path: "/business-partnership",
      priority: 0.5,
      changeFrequency: "monthly" as const,
    },
    {
      path: "/shipping-returns",
      priority: 0.4,
      changeFrequency: "monthly" as const,
    },
    { path: "/warranty", priority: 0.4, changeFrequency: "monthly" as const },
    { path: "/terms", priority: 0.3, changeFrequency: "yearly" as const },
    { path: "/privacy", priority: 0.3, changeFrequency: "yearly" as const },
  ]

  for (const countryCode of countryCodes) {
    for (const page of staticPages) {
      entries.push({
        url: `${baseUrl}/${countryCode}${page.path}`,
        lastModified: now,
        changeFrequency: page.changeFrequency,
        priority: page.priority,
      })
    }
  }

  // Dynamic product pages
  try {
    for (const countryCode of countryCodes.slice(0, 1)) {
      const { response } = await listProducts({
        countryCode,
        queryParams: { limit: 100, fields: "handle,updated_at" },
      })

      for (const product of response.products) {
        if (!product.handle) continue
        for (const cc of countryCodes) {
          entries.push({
            url: `${baseUrl}/${cc}/products/${product.handle}`,
            lastModified: product.updated_at
              ? new Date(product.updated_at)
              : now,
            changeFrequency: "weekly",
            priority: 0.8,
          })
        }
      }
    }
  } catch {
    // skip product URLs on error
  }

  // Dynamic collection pages
  try {
    const { collections } = await listCollections({ limit: 50 })
    for (const collection of collections || []) {
      if (!collection.handle) continue
      for (const cc of countryCodes) {
        entries.push({
          url: `${baseUrl}/${cc}/collections/${collection.handle}`,
          lastModified: now,
          changeFrequency: "weekly",
          priority: 0.7,
        })
      }
    }
  } catch {
    // skip collection URLs on error
  }

  // Dynamic category pages
  try {
    const categories = await listCategories()
    for (const category of categories || []) {
      if (!category.handle) continue
      for (const cc of countryCodes) {
        entries.push({
          url: `${baseUrl}/${cc}/categories/${category.handle}`,
          lastModified: now,
          changeFrequency: "weekly",
          priority: 0.7,
        })
      }
    }
  } catch {
    // skip category URLs on error
  }

  return entries
}
