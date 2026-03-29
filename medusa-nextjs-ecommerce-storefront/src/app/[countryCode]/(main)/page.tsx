import { Metadata } from "next"

import FeaturedProducts from "@modules/home/components/featured-products"
import Hero from "@modules/home/components/hero"
import FeaturesSection from "@modules/home/components/features-section"
import CollectionGrid from "@modules/home/components/collection-grid"
import Testimonials from "@modules/home/components/testimonials"
import { listCollections } from "@lib/data/collections"
import { getRegion } from "@lib/data/regions"

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
  const region = await getRegion(countryCode)

  const { collections } = await listCollections({
    fields: "id, handle, title",
  })

  if (!collections || !region) {
    return null
  }

  return (
    <>
      <Hero />

      {/* Featured Products */}
      <div className="py-4">
        <ul className="flex flex-col">
          <FeaturedProducts collections={collections} region={region} />
        </ul>
      </div>

      {/* Features / USP */}
      <FeaturesSection />

      {/* Collection Grid */}
      <CollectionGrid collections={collections} />

      {/* Testimonials */}
      <Testimonials />
    </>
  )
}
