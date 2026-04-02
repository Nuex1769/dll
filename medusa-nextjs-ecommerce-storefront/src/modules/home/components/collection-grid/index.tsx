import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

type CollectionGridProps = {
  collections: HttpTypes.StoreCollection[]
  translations?: {
    label: string
    title: string
    shopNow: string
  }
}

// Distinct gradient backgrounds for each collection card
const cardGradients = [
  "from-gray-800 via-gray-900 to-black",
  "from-zinc-700 via-zinc-800 to-zinc-900",
  "from-slate-700 via-slate-800 to-slate-900",
  "from-neutral-700 via-neutral-800 to-neutral-900",
]

const CollectionGrid = ({ collections, translations }: CollectionGridProps) => {
  if (!collections?.length) return null

  const t = translations ?? {
    label: "Collections",
    title: "Shop by Category",
    shopNow: "Shop now",
  }

  // Take up to 3 collections for the main grid
  const gridCollections = collections.slice(0, 3)
  // First item is large (featured), rest are normal
  const featured = gridCollections[0]
  const others = gridCollections.slice(1)

  return (
    <section className="bg-dll-bg-secondary py-16 small:py-24">
      <div className="content-container">
        <div className="text-center mb-12">
          <span className="text-[10px] tracking-[0.3em] uppercase text-dll-foreground-secondary font-medium">
            {t.label}
          </span>
          <h2 className="text-2xl small:text-4xl font-bold text-dll-foreground mt-3">
            {t.title}
          </h2>
        </div>

        {/* Asymmetric grid: 1 large + 2 stacked */}
        <div className="grid grid-cols-1 small:grid-cols-2 gap-4 small:gap-6">
          {/* Featured large card */}
          {featured && (
            <LocalizedClientLink
              href={`/collections/${featured.handle}`}
              className="group relative overflow-hidden rounded-2xl bg-black aspect-[4/3] small:aspect-auto small:row-span-2 flex items-end"
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${cardGradients[0]} group-hover:scale-105 transition-transform duration-700`}
              />
              {/* Subtle pattern */}
              <div className="absolute inset-0 opacity-5 bg-[radial-gradient(circle_at_30%_40%,rgba(255,255,255,0.15)_1px,transparent_1px)] bg-[length:20px_20px]" />
              {/* Gradient overlay for text */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent z-10" />
              <div className="relative z-20 p-8 small:p-10">
                <span className="inline-block px-3 py-1 text-[9px] tracking-[0.2em] uppercase font-medium text-white/70 bg-white/10 rounded-full mb-3">
                  Featured
                </span>
                <h3 className="text-2xl small:text-3xl font-bold text-white">
                  {featured.title}
                </h3>
                <span className="mt-3 text-sm text-white/60 inline-flex items-center gap-1.5 group-hover:text-white transition-colors">
                  {t.shopNow}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                  </svg>
                </span>
              </div>
            </LocalizedClientLink>
          )}

          {/* Other collection cards stacked */}
          {others.map((collection, i) => (
            <LocalizedClientLink
              key={collection.id}
              href={`/collections/${collection.handle}`}
              className="group relative overflow-hidden rounded-2xl bg-black aspect-[16/9] small:aspect-auto flex items-end"
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${cardGradients[i + 1]} group-hover:scale-105 transition-transform duration-700`}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10" />
              <div className="relative z-20 p-6 small:p-8">
                <h3 className="text-xl small:text-2xl font-bold text-white">
                  {collection.title}
                </h3>
                <span className="mt-2 text-sm text-white/60 inline-flex items-center gap-1.5 group-hover:text-white transition-colors">
                  {t.shopNow}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                  </svg>
                </span>
              </div>
            </LocalizedClientLink>
          ))}
        </div>

        {/* Extra quick-access links for remaining collections */}
        {collections.length > 3 && (
          <div className="grid grid-cols-2 small:grid-cols-4 gap-3 mt-4 small:mt-6">
            {collections.slice(3, 7).map((collection) => (
              <LocalizedClientLink
                key={collection.id}
                href={`/collections/${collection.handle}`}
                className="group flex items-center justify-between p-4 rounded-xl bg-white border border-dll-border hover:border-dll-foreground/20 transition-all"
              >
                <span className="text-sm font-medium text-dll-foreground">
                  {collection.title}
                </span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-4 h-4 text-dll-foreground-secondary group-hover:translate-x-0.5 transition-transform"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                </svg>
              </LocalizedClientLink>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default CollectionGrid
