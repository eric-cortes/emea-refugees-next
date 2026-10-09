'use client'

import { useTranslations } from 'next-intl'
import { RxArrowUp } from 'react-icons/rx'

interface Props {
  azimuth: number
}

export default function TerrainCompass({ azimuth }: Props) {
  const t = useTranslations('mapTest.compass')

  return (
    <div
      role="img"
      aria-label={t('label')}
      className="pointer-events-none flex h-12 w-12 items-center justify-center rounded-full bg-black/70 text-white/80"
    >
      <div className="flex flex-col items-center" style={{ transform: `rotate(${azimuth}rad)` }}>
        <span aria-hidden className="text-xs leading-3 text-white">
          {t('north')}
        </span>
        <RxArrowUp aria-hidden />
      </div>
    </div>
  )
}
