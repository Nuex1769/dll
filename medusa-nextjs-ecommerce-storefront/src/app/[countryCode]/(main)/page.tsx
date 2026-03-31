import { Metadata } from "next"

import FeaturedProducts from "@modules/home/components/featured-products"
import Hero from "@modules/home/components/hero"
import FeaturesSection from "@modules/home/components/features-section"
import CollectionGrid from "@modules/home/components/collection-grid"
import Testimonials from "@modules/home/components/testimonials"
import LatestPosts from "@modules/blog/components/latest-posts"
import { listCollections } from "@lib/data/collections"
import { getRegion } from "@lib/data/regions"
import { getT } from "@lib/util/i18n"

export const metadata: Metadata = {
  title: "DLL - Smart Helmets & Cycling Gear",
  description:
    "Premium smart helmets and cycling gear designed for safety, connectivity, and style. Ride smarter, ride safer.",
}

export default async function Home(props: {
  params: Promise<{ countryCode: string }>
}) {
  const params = await props.params
  const { countryCode } = params
  const [region, { collections }, t] = await Promise.all([
    getRegion(countryCode),
    listCollections({ fields: "id, handle, title" }),
    getT(countryCode),
  ])

  if (!collections || !region) {
    return null
  }

  // Build translation objects for child components
  const heroTranslations = {
    subtitle: t("home.hero.subtitle"),
    titleLine1: t("home.hero.title_line1"),
    titleLine2: t("home.hero.title_line2"),
    description: t("home.hero.description"),
    shopNow: t("home.hero.shop_now"),
    learnMore: t("home.hero.learn_more"),
  }

  const featuresTranslations = {
    sectionTitle: t("home.features.title"),
    heading: t("home.features.title"),
    items: Array.from({ length: 4 }, (_, i) => ({
      title: t(`home.features.items.${i}.title`),
      description: t(`home.features.items.${i}.description`),
    })),
  }

  const collectionTranslations = {
    label: t("home.collections.label"),
    title: t("home.collections.title"),
    shopNow: t("home.collections.shop_now"),
  }

  const testimonialTranslations = {
    label: t("home.testimonials.label"),
    title: t("home.testimonials.title"),
    items: Array.from({ length: 3 }, (_, i) => ({
      name: t(`home.testimonials.items.${i}.name`),
      role: t(`home.testimonials.items.${i}.role`),
      quote: t(`home.testimonials.items.${i}.quote`),
      rating: 5,
    })),
  }

  return (
    <>
      <Hero translations={heroTranslations} />

      {/* Featured Products */}
      <div className="py-4">
        <ul className="flex flex-col">
          <FeaturedProducts collections={collections} region={region} />
        </ul>
      </div>

      {/* Features / USP */}
      <FeaturesSection translations={featuresTranslations} />

      {/* Collection Grid */}
      <CollectionGrid
        collections={collections}
        translations={collectionTranslations}
      />

      {/* Testimonials */}
      <Testimonials translations={testimonialTranslations} />

      {/* Latest Blog Posts */}
      <LatestPosts
        limit={3}
        title={t("blog.related_posts")}
        subtitle={t("blog.subtitle")}
        readMoreLabel={t("blog.read_more")}
        viewAllLabel={t("blog.view_all")}
      />
    </>
  )
}
