'use client'

import { useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

interface Props {
  children: ReactNode
}

interface Size {
  width: number
  height: number
  initial: boolean
}

export default function TerrainLegendBox({ children }: Props) {
  const reduceMotion = useReducedMotion()
  const contentRef = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState<Size | null>(null)

  useLayoutEffect(() => {
    const node = contentRef.current
    if (!node) return
    const measure = (initial: boolean) => {
      const width = node.offsetWidth
      const height = node.offsetHeight
      setSize(prev => (prev && prev.width === width && prev.height === height ? prev : { width, height, initial }))
    }
    measure(true)
    const observer = new ResizeObserver(() => measure(false))
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <motion.div
      className="overflow-hidden rounded-2xl bg-black/70 text-xs text-white/80"
      initial={false}
      animate={size ? { width: size.width, height: size.height } : {}}
      transition={{ duration: reduceMotion || !size || size.initial ? 0 : 0.25, ease: 'easeInOut' }}
    >
      <div ref={contentRef} className="w-max p-3">
        {children}
      </div>
    </motion.div>
  )
}
