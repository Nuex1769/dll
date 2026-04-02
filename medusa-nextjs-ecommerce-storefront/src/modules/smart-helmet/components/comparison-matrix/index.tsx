import {
  Lightbulb,
  RotateCcw,
  ShieldCheck,
  SunMedium,
  Zap,
} from "lucide-react"
import { SmartHelmetDisplayItem, SmartHelmetFeature } from "../../types"

type ComparisonMatrixProps = {
  items: SmartHelmetDisplayItem[]
}

const RatingStars = ({ count }: { count: number | null }) => {
  if (!count) {
    return null
  }

  return (
    <div className="flex items-center">
      {Array.from({ length: count }).map((_, index) => (
        <svg
          key={index}
          className="h-3.5 w-3.5 fill-current text-white"
          viewBox="0 0 20 20"
          aria-hidden="true"
        >
          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
        </svg>
      ))}
    </div>
  )
}

const MipsBadge = ({ muted = false }: { muted?: boolean }) => (
  <div
    className={`flex h-11 w-11 items-center justify-center rounded-full text-xs font-semibold ${
      muted
        ? "border border-dashed border-gray-300 bg-gray-100 text-gray-400"
        : "bg-[#1f1f22] text-white"
    }`}
  >
    Mips
  </div>
)

const TurnIcon = ({ muted = false }: { muted?: boolean }) => (
  <div className={`${muted ? "text-gray-300" : "text-black"}`}>
    <svg className="h-10 w-10" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M9 4 4 12h7l-2 8 11-14h-7l3-6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </div>
)

const AppPlaceholder = ({ muted = false }: { muted?: boolean }) => (
  <div className={`text-lg leading-none ${muted ? "text-gray-300" : "text-black"}`}>
    —
  </div>
)

const renderFeatureIcon = (feature: SmartHelmetFeature) => {
  const muted = feature.muted || feature.lines.every((line) => line === "—")

  switch (feature.icon) {
    case "lights":
      return <Lightbulb className={`h-10 w-10 ${muted ? "text-gray-300" : "text-black"}`} strokeWidth={1.8} />
    case "app":
      return <AppPlaceholder muted={muted} />
    case "fit":
      return <RotateCcw className={`h-10 w-10 ${muted ? "text-gray-300" : "text-black"}`} strokeWidth={1.8} />
    case "certified":
      return <ShieldCheck className={`h-10 w-10 ${muted ? "text-gray-300" : "text-black"}`} strokeWidth={1.8} />
    case "brake":
      return <SunMedium className={`h-10 w-10 ${muted ? "text-gray-300" : "text-black"}`} strokeWidth={1.8} />
    case "turn":
      return <TurnIcon muted={muted} />
    case "mips":
      return <MipsBadge muted={muted} />
    default:
      return <Zap className={`h-10 w-10 ${muted ? "text-gray-300" : "text-black"}`} strokeWidth={1.8} />
  }
}

const RatingBlock = ({ item }: { item: SmartHelmetDisplayItem }) => {
  if (!item.mock.ratingStars) {
    return (
      <div className="flex min-h-[92px] items-center justify-center text-2xl text-gray-600">
        —
      </div>
    )
  }

  return (
    <div className="min-h-[92px] text-center">
      <div className="inline-flex flex-col items-start">
        <p className="text-[10px] font-bold leading-none tracking-tight text-black">
          VIRGINIA TECH
        </p>
        <p className="mt-0.5 text-[11px] font-bold leading-none tracking-tight text-black">
          HELMET RATING
        </p>
        <div className="mt-1 flex items-center">
          <span className="border border-black px-1 text-sm font-bold leading-none text-black">
            {item.mock.ratingValue}
          </span>
          <div className="flex h-[18px] items-center gap-0.5 bg-black px-1.5">
            <RatingStars count={item.mock.ratingStars} />
          </div>
        </div>
      </div>
      <p className="mt-4 text-sm text-gray-700">{item.mock.ratingNote}</p>
    </div>
  )
}

const FeatureBlock = ({ feature }: { feature: SmartHelmetFeature }) => {
  return (
    <div className="flex min-h-[128px] flex-col items-center text-center">
      <div className="flex h-12 items-center justify-center">
        {renderFeatureIcon(feature)}
      </div>
      <div className="mt-4 space-y-1">
        {feature.lines.map((line, index) => (
          <p
            key={`${feature.icon}-${index}-${line}`}
            className={`text-sm leading-6 ${
              line === "—" || feature.muted ? "text-gray-500" : "text-gray-800"
            }`}
          >
            {line}
          </p>
        ))}
      </div>
    </div>
  )
}

export default function ComparisonMatrix({ items }: ComparisonMatrixProps) {
  if (!items.length) {
    return null
  }

  if (items.length === 1) {
    const item = items[0]

    return (
      <div className="mt-10 border-t border-gray-300 pt-8">
        <div className="space-y-8">
          <RatingBlock item={item} />
          {item.mock.features.map((feature, index) => (
            <div
              key={`${item.id}-${feature.icon}-${index}`}
              className="flex flex-col items-center text-center"
            >
              <div className="flex h-12 items-center justify-center">
                {renderFeatureIcon(feature)}
              </div>
              <div className="mt-4 space-y-1">
                {feature.lines.map((line, lineIndex) => (
                  <p
                    key={`${feature.icon}-${index}-${lineIndex}-${line}`}
                    className={`text-sm leading-6 ${
                      line === "—" || feature.muted
                        ? "text-gray-500"
                        : "text-gray-800"
                    }`}
                  >
                    {line}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="mt-14">
      <div
        className={`grid gap-x-8 gap-y-10 ${
          items.length === 1
            ? "grid-cols-1"
            : items.length === 2
            ? "grid-cols-2"
            : "grid-cols-1 lg:grid-cols-4"
        }`}
      >
        {items.map((item) => (
          <div key={`${item.id}-features`} className="border-t border-gray-300 pt-10">
            <div className="space-y-10">
              <RatingBlock item={item} />
              {item.mock.features.map((feature, index) => (
                <FeatureBlock key={`${item.id}-${feature.icon}-${index}`} feature={feature} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
