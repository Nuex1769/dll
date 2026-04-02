import { RefObject, useEffect, useRef, useState } from "react"

export const useIntersection = (
  element: RefObject<HTMLDivElement | null>,
  rootMargin: string
) => {
  const [isVisible, setState] = useState(false)

  useEffect(() => {
    if (!element.current) {
      return
    }

    const el = element.current

    const observer = new IntersectionObserver(
      ([entry]) => {
        setState(entry.isIntersecting)
      },
      { rootMargin }
    )

    observer.observe(el)

    return () => observer.unobserve(el)
  }, [element, rootMargin])

  return isVisible
}

/**
 * Convenience hook: returns a ref and boolean `isInView`.
 * Once the element enters the viewport it stays `true` (one-shot).
 */
export const useInView = ({
  threshold = 0.1,
  once = true,
}: { threshold?: number; once?: boolean } = {}) => {
  const ref = useRef<HTMLDivElement>(null)
  const [isInView, setIsInView] = useState(false)

  useEffect(() => {
    if (!ref.current) return

    const el = ref.current
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          if (once) observer.unobserve(el)
        } else if (!once) {
          setIsInView(false)
        }
      },
      { threshold }
    )

    observer.observe(el)
    return () => observer.unobserve(el)
  }, [threshold, once])

  return { ref, isInView }
}
