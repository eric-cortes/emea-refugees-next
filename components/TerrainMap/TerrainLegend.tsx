'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { useFormatter, useTranslations } from 'next-intl'
import { ELEVATION_COLOURS } from './elevation-colours'

interface Props {
  animateIn?: boolean
}

export default function TerrainLegend({ animateIn = false }: Props) {
  const reduceMotion = useReducedMotion()
  const t = useTranslations('mapTest.legend')
  const format = useFormatter()
  const max = ELEVATION_COLOURS[ELEVATION_COLOURS.length - 1].metres
  const percent = (metres: number) => (metres / max) * 100
  const gradient = `linear-gradient(to top, ${ELEVATION_COLOURS.map(stop => `${stop.colour} ${percent(stop.metres)}%`).join(', ')})`

  return (
    <>
      <motion.div
        initial={animateIn && !reduceMotion ? { opacity: 0 } : false}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7, ease: 'easeInOut' }}
      >
        <p className="text-white">{t('title')}</p>
        <div className="mt-2 flex gap-2 py-2">
          <div className="h-32 w-3.5 rounded-sm" style={{ backgroundImage: gradient }} />
          <div className="relative h-32 w-16">
            {ELEVATION_COLOURS.map((stop, index) => (
              <span
                key={stop.metres}
                className="absolute left-0 -translate-y-1/2 whitespace-nowrap leading-4"
                style={{ top: `${100 - percent(stop.metres)}%` }}
              >
                {format.number(stop.metres)}
                {index === ELEVATION_COLOURS.length - 1 ? '+' : ''} m
              </span>
            ))}
          </div>
        </div>
      </motion.div>
    </>
  )
}
