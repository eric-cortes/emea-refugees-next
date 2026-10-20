'use client'

import { useFormatter, useTranslations } from 'next-intl'
import { Tooltip } from '@/components/UI'

interface Props {
  kmPerPixel: number
}

const MAX_PIXELS = 150
const SEGMENTS = 4

/** Largest 1, 2 or 5 × 10^n km length that fits within MAX_PIXELS. */
function niceLength(kmPerPixel: number): number {
  const raw = MAX_PIXELS * kmPerPixel
  const exponent = Math.floor(Math.log10(raw))
  for (const factor of [5, 2, 1]) {
    const length = factor * Math.pow(10, exponent)
    if (length <= raw * 1.0000001) return length
  }
  return Math.pow(10, exponent)
}

export default function TerrainScaleBar({ kmPerPixel }: Props) {
  const t = useTranslations('mapTest.scale')
  const format = useFormatter()
  const valid = kmPerPixel > 0 && Number.isFinite(kmPerPixel)
  const length = valid ? niceLength(kmPerPixel) : 0
  const width = valid ? length / kmPerPixel : 0
  const number = (value: number) => format.number(value, { maximumFractionDigits: 3 })

  return (
    <div
      aria-label={t('label')}
      role="img"
      className="group pointer-events-auto relative w-44 rounded-2xl bg-black/70 p-3 text-xs text-white/80"
    >
      <div className="relative h-8 transition-opacity" style={{ width, opacity: valid ? 1 : 0 }}>
        <div className="flex h-2 border border-white">
          {Array.from({ length: SEGMENTS }, (_, index) => (
            <div key={index} className={index % 2 === 0 ? 'flex-1 bg-white' : 'flex-1'} />
          ))}
        </div>
        {[0, 0.5, 1].map(fraction => (
          <span
            key={fraction}
            className="absolute top-3 -translate-x-1/2 whitespace-nowrap leading-4"
            style={{ left: `${fraction * 100}%` }}
          >
            {number(length * fraction)}
            {fraction === 1 ? ' km' : ''}
          </span>
        ))}
      </div>
      <Tooltip label={t('label')} />
    </div>
  )
}
