'use client'

import { useTranslations } from 'next-intl'
import TerrainCanvas from './terrain-canvas'

interface Props {
  regionId: string
}

export default function TerrainView({ regionId }: Props) {
  const t = useTranslations('mapTest')
  const tn = useTranslations('mapTest.countries')
  const country = tn(regionId)

  return (
    <div className="animate-fade-in md:grid md:grid-cols-2 md:items-start">
      <section className="relative h-[80vh] overflow-hidden bg-bg md:sticky md:top-0 md:h-dvh">
        <TerrainCanvas regionId={regionId} />

        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex flex-wrap items-end justify-between gap-4 p-4 text-white/80">
          <div className="max-w-md">
            <h1 className="text-2xl text-white">{t('title', { country })}</h1>
            <p className="mt-1 text-sm">{t('hint')}</p>
          </div>
        </div>
      </section>
      <div className="md:min-h-dvh md:bg-panel" />
    </div>
  )
}
