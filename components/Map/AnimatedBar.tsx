'use client'

import { useEffect, useRef, useState } from 'react'
import { usePrefersReducedMotion } from '@/utils/use-prefers-reduced-motion'

interface AnimatedBarProps {
  percent: number
  delay?: number
}

export default function AnimatedBar({ percent, delay = 0 }: AnimatedBarProps) {
  const reducedMotion = usePrefersReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)
  const shown = inView || reducedMotion

  useEffect(() => {
    const element = ref.current
    if (!element || shown) {
      return
    }

    const observer = new IntersectionObserver(
      entries => {
        if (entries.some(entry => entry.isIntersecting)) {
          observer.disconnect()
          setInView(true)
        }
      },
      { threshold: 0.2 }
    )
    observer.observe(element)

    return () => {
      observer.disconnect()
    }
  }, [shown])

  return (
    <div ref={ref} aria-hidden className="h-2 w-full rounded-full bg-white/10">
      <div
        className="h-2 rounded-full bg-teal transition-[width] duration-[1200ms] ease-out"
        style={{ width: shown ? `${percent}%` : '0%', transitionDelay: `${delay}ms` }}
      />
    </div>
  )
}
