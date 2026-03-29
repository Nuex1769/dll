import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

const CollectionGrid = ({
  collections,
}: {
  collections: HttpTypes.StoreCollection[]
}) => {
  if (!collections?.length) return null

  // Take up to 3 collections for the grid
  const gridCollections = collections.slice(0, 3)

  return (
    <section className="content-container py-16 small:py-24">
      <div className="text-center mb-12">
        <span className="text-xs tracking-[0.2em] uppercase text-dll-foreground-secondary">
          Collections
        </span>
        <h2 className="text-3xl small:text-4xl font-semibold text-dll-foreground mt-3">
          Shop by Category
        </h2>
      </div>

      <div className="grid grid-cols-1 small:grid-cols-3 gap-4 small:gap-6">
        {gridCollections.map((collection) => (
          <LocalizedClientLink
            key={collection.id}
            href={`/collections/${collection.handle}`}
            className="group relative overflow-hidden rounded-lg bg-dll-bg-secondary aspect-[4/3] flex items-end"
          >
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent z-10" />

            {/* Placeholder background pattern */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 group-hover:scale-105 transition-transform duration-500" />

            {/* Text */}
            <div className="relative z-20 p-6 small:p-8">
              <h3 className="text-xl small:text-2xl font-semibold text-white">
                {collection.title}
              </h3>
              <span className="text-sm text-white/70 mt-1 inline-flex items-center gap-1 group-hover:text-white transition-colors">
                Shop now
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                  />
                </svg>
              </span>
            </div>
          </LocalizedClientLink>
        ))}
      </div>
    </section>
  )
}

export default CollectionGrid
