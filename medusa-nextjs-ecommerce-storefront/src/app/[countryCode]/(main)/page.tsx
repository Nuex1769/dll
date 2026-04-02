import { Metadata } from "next"

import Hero from "@modules/home/components/hero"
import ProductLineup from "@modules/home/components/product-lineup"
import CategoryShowcase from "@modules/home/components/category-showcase"
import DarkModeBanner from "@modules/home/components/dark-mode-banner"
import LimitedEditionBanner from "@modules/home/components/limited-edition-banner"
import BottomDualCards from "@modules/home/components/bottom-dual-cards"
import LatestArticles from "@modules/home/components/latest-articles"
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
  const [region, t] = await Promise.all([
    getRegion(countryCode),
    getT(countryCode),
  ])

  if (!region) {
    return null
  }

  // Build translation objects for Hero
  const heroTranslations = {
    subtitle: t("home.hero.subtitle"),
    titleLine1: t("home.hero.title_line1"),
    titleLine2: t("home.hero.title_line2"),
    description: t("home.hero.description"),
    shopNow: t("home.hero.shop_now"),
    learnMore: t("home.hero.learn_more"),
  }

  return (
    <>
      {/* 1. Hero — 全屏背景图轮播，左对齐文案 */}
      <Hero translations={heroTranslations} />

      {/* 2. Product Lineup — 白底产品卡片轮播（后端真实数据） */}
      <ProductLineup region={region} />

      {/* 3. Category Showcase — 双列大图卡片 (Smart Light + Backpack) */}
      <CategoryShowcase />

      {/* 4. Dark Mode Banner — 全宽暗色骑行安全横幅 */}
      <DarkModeBanner />

      {/* 5. Limited Editions — 限定版合作横幅 */}
      <LimitedEditionBanner />

      {/* 6. Bottom Dual Cards — Accessories + EV Guide */}
      <BottomDualCards />

      {/* 7. Latest Articles — 最新博客文章 */}
      <LatestArticles />
    </>
  )
}
