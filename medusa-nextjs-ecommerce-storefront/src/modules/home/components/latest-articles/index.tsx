"use client"

import Image from "next/image"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { ArrowRight } from "lucide-react"
import { useInView } from "@lib/hooks/use-in-view"

type ArticleItem = {
  id: number
  date: string
  title: string
  image: string
  href: string
}

const defaultArticles: ArticleItem[] = [
  {
    id: 1,
    date: "MAR 30, 2026",
    title: "Best Helmet for Onewheel Riding: What to Look For",
    image:
      "https://c8.alamy.com/comp/2J43XF6/young-man-in-a-helmet-rides-an-electric-skateboard-onewheel-rider-in-an-urban-background-2J43XF6.jpg",
    href: "/blog",
  },
  {
    id: 2,
    date: "FEB 18, 2026",
    title: "Best Helmet Visor Setup for Outdoor Riders",
    image:
      "https://bikerumor.com/wp-content/uploads/2023/07/Cycling-sunglasses-scaled.jpeg",
    href: "/blog",
  },
  {
    id: 3,
    date: "FEB 11, 2026",
    title: "Smart Helmet vs Regular Bike Helmet",
    image:
      "https://images.peopleimages.com/picture/202407/2485168-one-athletic-young-man-cycling-outside-sporty-fit-male-wearing-helmet-and-glasses-while-riding-a-bike-on-a-road-along-the-mountain-for-exercise-endurance-and-cardio-during-a-workout-and-training-fit_400_400.jpg",
    href: "/blog",
  },
]

export default function LatestArticles() {
  const { ref: headerRef, isInView: headerInView } = useInView({
    threshold: 0.1,
  })

  return (
    <section className="py-16 small:py-24 bg-white">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 small:px-8">
        {/* Header */}
        <div
          ref={headerRef}
          className={`flex items-center justify-between mb-10 transition-all duration-700 ${
            headerInView
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-8"
          }`}
        >
          <h2 className="text-2xl small:text-3xl font-semibold text-gray-900">
            Latest Articles
          </h2>
          <LocalizedClientLink
            href="/blog"
            className="flex items-center gap-1 text-sm font-medium text-gray-900 hover:text-gray-600 transition-colors group"
          >
            View all
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </LocalizedClientLink>
        </div>

        {/* Articles grid */}
        <div className="grid md:grid-cols-2 small:grid-cols-3 gap-6">
          {defaultArticles.map((article, i) => (
            <ArticleCard key={article.id} article={article} delay={i * 100} />
          ))}
        </div>
      </div>
    </section>
  )
}

function ArticleCard({
  article,
  delay,
}: {
  article: ArticleItem
  delay: number
}) {
  const { ref, isInView } = useInView({ threshold: 0.1 })

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${
        isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <LocalizedClientLink href={article.href} className="group block">
        <div className="relative aspect-[4/3] overflow-hidden rounded-xl mb-4">
          <Image
            src={article.image}
            alt={article.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
        <span className="text-xs text-gray-500 tracking-wider">
          {article.date}
        </span>
        <h3 className="text-lg font-medium text-gray-900 mt-1 group-hover:text-gray-600 transition-colors line-clamp-2">
          {article.title}
        </h3>
      </LocalizedClientLink>
    </div>
  )
}
