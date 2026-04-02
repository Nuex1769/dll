export type SmartHelmetSwatch = {
  name: string
  value: string
  image: string | null
}

export type SmartHelmetFeatureIcon =
  | "lights"
  | "app"
  | "fit"
  | "certified"
  | "brake"
  | "turn"
  | "mips"

export type SmartHelmetFeature = {
  icon: SmartHelmetFeatureIcon
  lines: string[]
  muted?: boolean
}

export type SmartHelmetMockConfig = {
  eyebrow: string
  isNew?: boolean
  description: string
  ratingValue: string
  ratingStars: number | null
  ratingNote: string
  virginiaRank: string
  category: string
  features: SmartHelmetFeature[]
}

export type SmartHelmetDisplayItem = {
  id: string
  title: string
  handle: string
  thumbnail: string | null
  images: string[]
  shortDescription: string | null
  cheapestPrice: string | null
  learnMoreHref: string
  buyHref: string
  swatches: SmartHelmetSwatch[]
  mock: SmartHelmetMockConfig
}
