'use client'

import { useEffect, useRef, useState } from 'react'
import { useFormatter } from 'next-intl'
import { usePrefersReducedMotion } from '@/utils/use-prefers-reduced-motion'

const DURATION = 1200

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3)
}

interface CountUpProps {
  value: number
  delay?: number
}

export default function CountUp({ value, delay = 0 }: CountUpProps) {
  const format = useFormatter()
  const reducedMotion = usePrefersReducedMotion()
  const ref = useRef<HTMLSpanElement>(null)
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    if (reducedMotion) {
      return
    }
    const element = ref.current
    if (!element) {
      return
    }

    let timeout: ReturnType<typeof setTimeout> | undefined
    let frame = 0

    const run = () => {
      const start = performance.now()
      const tick = (now: number) => {
        const progress = Math.min((now - start) / DURATION, 1)
        setCurrent(Math.round(value * easeOutCubic(progress)))
        if (progress < 1) {
          frame = requestAnimationFrame(tick)
        }
      }
      frame = requestAnimationFrame(tick)
    }

    const observer = new IntersectionObserver(
      entries => {
        if (entries.some(entry => entry.isIntersecting)) {
          observer.disconnect()
          timeout = setTimeout(run, delay)
        }
      },
      { threshold: 0.2 }
    )
    observer.observe(element)

    return () => {
      observer.disconnect()
      if (timeout !== undefined) {
        clearTimeout(timeout)
      }
      cancelAnimationFrame(frame)
    }
  }, [reducedMotion, value, delay])

  return (
    <span ref={ref} className="tabular-nums">
      <span className="sr-only">{format.number(value)}</span>
      <span aria-hidden="true">{format.number(reducedMotion ? value : current)}</span>
    </span>
  )
}
