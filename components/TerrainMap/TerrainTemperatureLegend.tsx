'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { useFormatter, useTranslations } from 'next-intl'
import { BAND_COLOURS, BAND_MIN, BAND_SIZE, LAPSE_RATE_PER_METRE, type Season } from './season-temperatures'

interface Props {
  season: Season
  first: number
  last: number
  animateIn?: boolean
}

export default function TerrainTemperatureLegend({ season, first, last, animateIn = false }: Props) {
  const reduceMotion = useReducedMotion()
  const t = useTranslations('mapTest.season')
  const format = useFormatter()
  // Warmest band on top, so the bar reads like the elevation legend
  const bands: number[] = []
  for (let band = last; band >= first; band--) bands.push(band)
  const edges: number[] = []
  for (let band = last + 1; band >= first; band--) edges.push(BAND_MIN + band * BAND_SIZE)
  const count = bands.length
  const perKm = `\u2212${format.number(LAPSE_RATE_PER_METRE * 1000, { maximumFractionDigits: 1 })}`

  return (
    <>
      <motion.div
        key={season}
        className="w-50"
        initial={animateIn && !reduceMotion ? { opacity: 0 } : false}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7, ease: 'easeInOut' }}
      >
        <p className="text-white">
          {t('legendTitle')}
          <br />
          {t(`names.${season}`)}
        </p>
        <div className="mt-2 flex gap-2 py-2">
          <div className="flex h-40 w-3.5 flex-col overflow-hidden rounded-sm">
            {bands.map(band => (
              <div key={band} className="flex-1" style={{ backgroundColor: BAND_COLOURS[band] }} />
            ))}
          </div>
          <div className="relative h-40 flex-1">
            {edges.map((edge, index) => (
              <span
                key={edge}
                className="absolute left-0 -translate-y-1/2 whitespace-nowrap leading-4"
                style={{ top: `${(index / count) * 100}%` }}
              >
                {format.number(edge).replace('-', '−')} °C
              </span>
            ))}
          </div>
        </div>
        <p className="mt-2 text-white/60">{t('lapseNote', { value: perKm })}</p>
      </motion.div>
    </>
  )
}
