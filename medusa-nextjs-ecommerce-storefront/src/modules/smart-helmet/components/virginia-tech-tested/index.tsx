import { SmartHelmetDisplayItem } from "../../types"

type VirginiaTechTestedProps = {
  items: SmartHelmetDisplayItem[]
}

const rankingRows = [
  { rank: "#22", name: "DLL AURA", stars: 5, category: "Hybrid" },
  { rank: "#33", name: "DLL NEON", stars: 5, category: "Urban" },
  { rank: "#81", name: "Abus Pedelec", stars: 4, category: "Urban" },
  { rank: "#147", name: "Thousand Chapter", stars: 4, category: "Urban" },
  { rank: "#232", name: "Lumos Ultra", stars: 3, category: "Urban" },
  { rank: "#280", name: "Thousand Heritage", stars: 2, category: "Urban" },
]

const Stars = ({ count }: { count: number }) => (
  <div className="flex gap-0.5">
    {Array.from({ length: 5 }).map((_, index) => (
      <svg
        key={index}
        className={`h-4 w-4 ${
          index < count ? "fill-orange-400" : "fill-gray-200"
        }`}
        viewBox="0 0 20 20"
        aria-hidden="true"
      >
        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
      </svg>
    ))}
  </div>
)

export default function VirginiaTechTested({
  items,
}: VirginiaTechTestedProps) {
  const featured = items.slice(0, 2)

  return (
    <section className="bg-[#f5f5f5] py-16 lg:py-24">
      <div className="content-container max-w-5xl">
        <div className="mb-12 text-center">
          <p className="mb-4 text-sm uppercase tracking-widest text-gray-500">
            Virginia Tech Tested
          </p>
          <h2 className="mb-6 text-4xl font-semibold text-gray-900 lg:text-5xl">
            Two Helmets. Maximum Safety.
          </h2>
          <p className="mx-auto max-w-2xl text-gray-600">
            Virginia Tech&apos;s Helmet Lab has tested over 280 helmets for
            impact protection. This section mirrors the `v3` benchmark story so
            the smart helmet page keeps the same editorial rhythm.
          </p>
        </div>

        <div className="relative mb-12 aspect-[2/1] overflow-hidden rounded-2xl bg-white">
          <div className="absolute left-4 top-1/2 z-10 -translate-y-1/2">
            <p className="text-xs font-bold tracking-wider">VIRGINIA TECH</p>
            <p className="text-xs font-bold tracking-wider">HELMET RATING</p>
            <div className="mt-1 flex items-center gap-2">
              <span className="border border-black px-1 text-2xl font-bold">
                5
              </span>
              <Stars count={5} />
            </div>
          </div>

          <div className="absolute inset-0 flex items-center justify-center gap-6 px-10">
            {featured.map((item, index) => (
              <div
                key={item.id}
                className={`relative h-[72%] w-[32%] ${
                  index === 0 ? "-rotate-6" : "rotate-6"
                }`}
              >
                {item.thumbnail ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    className="h-full w-full object-contain"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center rounded-2xl bg-gray-100 text-sm text-gray-400">
                    {item.title}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="overflow-hidden rounded-xl bg-white">
          <div className="grid grid-cols-4 gap-4 border-b border-gray-200 px-6 py-4 text-sm text-gray-500">
            <div>RANK</div>
            <div>NAME</div>
            <div>STAR RATE</div>
            <div>CATEGORY</div>
          </div>
          {rankingRows.map((row, index) => (
            <div
              key={row.rank}
              className={`grid grid-cols-4 gap-4 px-6 py-4 text-sm ${
                index !== rankingRows.length - 1 ? "border-b border-gray-100" : ""
              }`}
            >
              <div className="text-gray-500">{row.rank}</div>
              <div className="font-medium text-gray-900">{row.name}</div>
              <div>
                <Stars count={row.stars} />
              </div>
              <div className="text-gray-500">{row.category}</div>
            </div>
          ))}
          <div className="py-4 text-center text-sm text-gray-400">
            Out of 282 Helmets
          </div>
        </div>
      </div>
    </section>
  )
}
