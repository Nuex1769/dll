"use client"

import { useEffect, useState } from "react"

const announcements = [
  "Free shipping on orders over $150",
  "New: Smart Helmet Pro — Now Available",
  "30-Day Returns on All Products",
]

const AnnouncementBar = () => {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % announcements.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="bg-dll-foreground text-dll-btn-primary-text text-xs tracking-wide py-2.5 text-center relative overflow-hidden">
      <div
        key={currentIndex}
        className="animate-fade-in"
      >
        {announcements[currentIndex]}
      </div>
    </div>
  )
}

export default AnnouncementBar
