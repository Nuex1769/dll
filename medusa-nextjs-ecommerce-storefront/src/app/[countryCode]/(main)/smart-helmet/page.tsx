import { Metadata } from "next"
import { Suspense } from "react"

import { listProducts } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"
import ProductPreview from "@modules/products/components/product-preview"
import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

export const metadata: Metadata = {
  title: "Smart Helmets — Active Safety for Every Rider | DLL",
  description:
    "Discover DLL smart helmets with integrated LED lighting, crash detection, Bluetooth audio, and MIPS protection. Designed for urban commuters, e-bike riders, and cycling enthusiasts.",
}

// ─── Technology features ────────────────────────────────────────────
const features = [
  {
    title: "Integrated LED Lighting",
    description:
      "360° visibility with front and rear lights, automatic brake lights, and turn signals. Be seen day and night.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
      </svg>
    ),
  },
  {
    title: "Crash Detection & SOS",
    description:
      "Built-in accelerometer detects hard impacts. If you don't respond to the safety check, an SOS text with your location is sent automatically.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
      </svg>
    ),
  },
  {
    title: "MIPS Protection",
    description:
      "Multi-directional Impact Protection System reduces rotational forces during angled impacts, providing superior brain protection.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 0 0-2.455 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
      </svg>
    ),
  },
  {
    title: "Bluetooth Audio",
    description:
      "Built-in speakers and microphone for music, navigation prompts, and hands-free calls. Stay connected without earbuds.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 0 1 0 12.728M16.463 8.288a5.25 5.25 0 0 1 0 7.424M6.75 8.25l4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z" />
      </svg>
    ),
  },
  {
    title: "100% Waterproof",
    description:
      "All electronics are fully sealed against rain and splashes. Ride confidently in any weather condition.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="m20.893 13.393-1.135-1.135a2.252 2.252 0 0 1-.421-.585l-1.08-2.16a.414.414 0 0 0-.663-.107.827.827 0 0 1-.812.21l-1.273-.363a.89.89 0 0 0-.738 1.595l.587.39c.59.395.674 1.23.172 1.732l-.2.2c-.212.212-.33.498-.33.796v.41c0 .409-.11.809-.32 1.158l-1.315 2.191a2.11 2.11 0 0 1-1.81 1.025 1.055 1.055 0 0 1-1.055-1.055v-1.172c0-.92-.56-1.747-1.414-2.089l-.655-.261a2.25 2.25 0 0 1-1.383-2.46l.007-.042a2.25 2.25 0 0 1 .29-.787l.09-.15a2.25 2.25 0 0 1 2.37-1.048l1.178.236c.016.003.032.004.048.004h.04" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 12A9.75 9.75 0 1 1 2.25 12a9.75 9.75 0 0 1 19.5 0Z" />
      </svg>
    ),
  },
  {
    title: "12+ Hour Battery",
    description:
      "All-day battery life with USB-C fast charging. Get from 0 to 80% in just 45 minutes.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" />
      </svg>
    ),
  },
]

// ─── FAQ data ───────────────────────────────────────────────────────
const faqs = [
  {
    question: "What is a smart helmet?",
    answer:
      "A smart helmet is advanced protective headgear that integrates electronic features to enhance rider safety, visibility, and experience. It combines traditional impact protection with modern technology like LED lighting, sensors, Bluetooth connectivity, and crash detection.",
  },
  {
    question: "How does crash detection work?",
    answer:
      "Our helmets have a built-in accelerometer that detects hard impacts. After a detected crash, a safety check timer goes off in the companion app. If you fail to respond, an SOS text message with your GPS location is automatically sent to your emergency contacts.",
  },
  {
    question: "Are DLL smart helmets certified for safety?",
    answer:
      "Yes. All DLL helmets meet or exceed CPSC, EN 1078, and AS/NZS 2063 safety standards. Our MIPS-equipped models provide additional rotational impact protection beyond standard certification requirements.",
  },
  {
    question: "How do I connect the helmet to my phone?",
    answer:
      "Press and hold the power button for 3 seconds to enter pairing mode — the LED will flash blue. Open your phone's Bluetooth settings, find 'DLL Helmet' in the list, and tap to connect. The companion app provides additional customization options.",
  },
  {
    question: "Can I use the helmet in rain?",
    answer:
      "Absolutely. All electronics in DLL smart helmets are 100% waterproof (IPX6 rated). The LED lights, speakers, crash sensors, and charging port are fully sealed against rain, splashes, and even high-pressure water jets.",
  },
  {
    question: "What's the battery life?",
    answer:
      "DLL smart helmets provide 12+ hours of battery life with normal use (lights on medium, Bluetooth connected). USB-C fast charging gets you from 0 to 80% in just 45 minutes. A full charge takes approximately 90 minutes.",
  },
]

// ─── Certifications / trust badges ──────────────────────────────────
const certifications = [
  { label: "CPSC", description: "US Consumer Product Safety" },
  { label: "EN 1078", description: "European Standard" },
  { label: "MIPS", description: "Brain Protection System" },
  { label: "IPX6", description: "Waterproof Rated" },
]

// ─── Product Grid (server component) ────────────────────────────────
async function SmartHelmetProducts({ countryCode }: { countryCode: string }) {
  const region = await getRegion(countryCode)

  if (!region) return null

  // Fetch all products — will filter to smart-helmet category when available
  const {
    response: { products },
  } = await listProducts({
    pageParam: 1,
    queryParams: { limit: 8 },
    countryCode,
  })

  if (!products || products.length === 0) return null

  return (
    <ul className="grid grid-cols-1 small:grid-cols-2 medium:grid-cols-3 gap-x-8 gap-y-12">
      {products.slice(0, 6).map((product) => (
        <li key={product.id}>
          <ProductPreview product={product} region={region} />
        </li>
      ))}
    </ul>
  )
}

// ─── Page Component ─────────────────────────────────────────────────
export default async function SmartHelmetPage({
  params,
}: {
  params: Promise<{ countryCode: string }>
}) {
  const { countryCode } = await params

  return (
    <div>
      {/* ── Hero Section ── */}
      <section className="relative bg-dll-foreground overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black" />
        <div className="absolute inset-0 opacity-[0.07] bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.15)_1px,transparent_1px)] bg-[length:20px_20px]" />

        <div className="relative z-10 content-container py-24 small:py-32 medium:py-40">
          <div className="max-w-3xl">
            <span className="inline-block text-xs tracking-[0.25em] uppercase text-white/50 mb-4">
              Smart Helmet Collection
            </span>
            <h1 className="text-4xl small:text-5xl medium:text-6xl font-bold text-white leading-[1.1] tracking-tight">
              Active Safety
              <br />
              <span className="text-white/70">for Every Rider</span>
            </h1>
            <p className="mt-6 text-base small:text-lg text-white/60 leading-relaxed max-w-xl">
              Integrated lights, crash detection, and MIPS protection — our smart
              helmets combine cutting-edge technology with thoughtful design to keep
              you safe on every ride.
            </p>
            <div className="mt-8 flex items-center gap-4">
              <a href="#products" className="dll-btn-outline">
                Shop Helmets
              </a>
              <a
                href="#detailed"
                className="text-sm text-white/50 hover:text-white transition-colors underline underline-offset-4"
              >
                Learn More
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Product Grid Section ── */}
      <section id="products" className="content-container py-16 small:py-24">
        <div className="mb-12">
          <span className="text-xs tracking-[0.2em] uppercase text-dll-foreground-secondary">
            Our Lineup
          </span>
          <h2 className="text-2xl small:text-3xl font-semibold text-dll-foreground mt-2">
            Smart Helmets
          </h2>
          <p className="mt-3 text-sm text-dll-foreground-secondary max-w-xl">
            From urban commuters to weekend adventurers — find the perfect smart
            helmet for your ride.
          </p>
        </div>

        <Suspense fallback={<SkeletonProductGrid numberOfProducts={6} />}>
          <SmartHelmetProducts countryCode={countryCode} />
        </Suspense>

        <div className="mt-12 text-center">
          <LocalizedClientLink href="/store" className="dll-btn-secondary inline-flex">
            View All Products
          </LocalizedClientLink>
        </div>
      </section>

      {/* ── Certifications Bar ── */}
      <section className="border-y border-dll-border">
        <div className="content-container py-8">
          <div className="grid grid-cols-2 small:grid-cols-4 gap-6 small:gap-8">
            {certifications.map((cert) => (
              <div key={cert.label} className="text-center">
                <span className="text-lg font-bold text-dll-foreground">
                  {cert.label}
                </span>
                <p className="text-xs text-dll-foreground-secondary mt-1">
                  {cert.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Technology Features (Detailed Section) ── */}
      <section id="detailed" className="content-container py-16 small:py-24">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs tracking-[0.2em] uppercase text-dll-foreground-secondary">
            Technology
          </span>
          <h2 className="text-2xl small:text-3xl font-semibold text-dll-foreground mt-2">
            What Makes a DLL Helmet Smart?
          </h2>
          <p className="mt-4 text-sm text-dll-foreground-secondary leading-relaxed">
            We redefine smart helmets with Active Safety and premium design.
            Every feature is engineered to enhance your safety, visibility, and
            riding experience.
          </p>
        </div>

        <div className="grid grid-cols-1 small:grid-cols-2 medium:grid-cols-3 gap-x-8 gap-y-12">
          {features.map((feature) => (
            <div key={feature.title} className="group">
              <div className="w-12 h-12 rounded-xl bg-dll-bg-secondary flex items-center justify-center text-dll-foreground mb-4 group-hover:bg-dll-foreground group-hover:text-white transition-colors">
                {feature.icon}
              </div>
              <h3 className="text-base font-semibold text-dll-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-dll-foreground-secondary leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Comparison / Value Prop Banner ── */}
      <section className="bg-dll-bg-secondary">
        <div className="content-container py-16 small:py-24">
          <div className="grid grid-cols-1 small:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-xs tracking-[0.2em] uppercase text-dll-foreground-secondary">
                Smart vs Regular
              </span>
              <h2 className="text-2xl small:text-3xl font-semibold text-dll-foreground mt-2 leading-tight">
                Why Choose a<br />Smart Helmet?
              </h2>
              <p className="mt-4 text-sm text-dll-foreground-secondary leading-relaxed">
                Traditional helmets only protect on impact. A DLL smart helmet
                actively works to prevent accidents and get you help when you need
                it — before, during, and after a ride.
              </p>
              <ul className="mt-6 space-y-3">
                {[
                  "360° LED visibility reduces accident risk by up to 47%",
                  "Automatic crash detection alerts emergency contacts",
                  "Turn signals communicate your intentions to drivers",
                  "MIPS technology for superior rotational impact protection",
                  "Hands-free calls & navigation keep eyes on the road",
                ].map((point) => (
                  <li key={point} className="flex items-start gap-3 text-sm text-dll-foreground">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 shrink-0 text-[#C17A2A] mt-0.5">
                      <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" />
                    </svg>
                    {point}
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative aspect-square rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden flex items-center justify-center">
              {/* Placeholder for comparison image */}
              <div className="text-center p-8">
                <div className="w-20 h-20 rounded-full bg-dll-foreground/10 flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-10 h-10 text-dll-foreground/40">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 0 0-2.455 2.456Z" />
                  </svg>
                </div>
                <p className="text-sm text-dll-foreground-secondary">
                  Smart Helmet Comparison
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ Section ── */}
      <section className="content-container py-16 small:py-24">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs tracking-[0.2em] uppercase text-dll-foreground-secondary">
              FAQ
            </span>
            <h2 className="text-2xl small:text-3xl font-semibold text-dll-foreground mt-2">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="divide-y divide-dll-border">
            {faqs.map((faq) => (
              <div key={faq.question} className="py-6">
                <h3 className="text-sm font-semibold text-dll-foreground mb-2">
                  {faq.question}
                </h3>
                <p className="text-sm text-dll-foreground-secondary leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Bottom CTA ── */}
      <section className="bg-dll-foreground">
        <div className="content-container py-16 small:py-20 text-center">
          <h2 className="text-2xl small:text-3xl font-semibold text-white mb-4">
            Ready to Ride Smarter?
          </h2>
          <p className="text-sm text-white/60 mb-8 max-w-md mx-auto">
            Join thousands of riders who&apos;ve upgraded to active safety.
            Free shipping on orders over $150.
          </p>
          <LocalizedClientLink href="/store" className="dll-btn-outline inline-flex">
            Shop All Helmets
          </LocalizedClientLink>
        </div>
      </section>
    </div>
  )
}
