"use client"

import { useState } from "react"

const testimonials = [
  {
    name: "Alex Chen",
    role: "Urban Commuter",
    quote:
      "The DLL smart helmet completely changed my daily commute. The LED signals make me feel so much safer in traffic, and the Bluetooth audio is crystal clear.",
    rating: 5,
  },
  {
    name: "Sarah Mitchell",
    role: "Weekend Cyclist",
    quote:
      "I love how lightweight it is. I honestly forget I'm wearing it most of the time. The crash detection feature gives me peace of mind on long solo rides.",
    rating: 5,
  },
  {
    name: "Marcus Johnson",
    role: "Delivery Rider",
    quote:
      "As someone who rides 8+ hours a day, comfort and battery life matter most. DLL delivers on both. Best investment I've made for my work.",
    rating: 5,
  },
]

const Testimonials = () => {
  const [activeIndex, setActiveIndex] = useState(0)

  return (
    <section className="py-20 small:py-28 bg-white">
      <div className="content-container">
        <div className="text-center mb-16">
          <span className="text-xs tracking-[0.2em] uppercase text-dll-foreground-secondary">
            Testimonials
          </span>
          <h2 className="text-3xl small:text-4xl font-semibold text-dll-foreground mt-3">
            What Riders Say
          </h2>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 small:grid-cols-3 gap-6 small:gap-8">
          {testimonials.map((item, index) => (
            <div
              key={item.name}
              className={`p-8 rounded-xl border transition-all duration-300 cursor-pointer ${
                activeIndex === index
                  ? "border-dll-foreground bg-dll-bg-secondary"
                  : "border-dll-border hover:border-dll-foreground-secondary"
              }`}
              onClick={() => setActiveIndex(index)}
            >
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: item.rating }).map((_, i) => (
                  <svg
                    key={i}
                    className="w-4 h-4 text-dll-foreground"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>

              {/* Quote */}
              <p className="text-sm text-dll-foreground leading-relaxed mb-6">
                &ldquo;{item.quote}&rdquo;
              </p>

              {/* Author */}
              <div>
                <div className="text-sm font-semibold text-dll-foreground">
                  {item.name}
                </div>
                <div className="text-xs text-dll-foreground-secondary">
                  {item.role}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Testimonials
