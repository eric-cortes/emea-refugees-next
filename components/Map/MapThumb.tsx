'use client'

import { useSyncExternalStore } from 'react'
import { useTranslations } from 'next-intl'
import { Tooltip } from '@/components/UI'
import TransitionLink from '@/components/Layout/TransitionLink'
import { readStoredPeriod } from '@/utils/map-period-storage'
import EuropeMap from './EuropeMap'

const subscribe = () => () => undefined
const getServerSnapshot = () => null

export default function MapThumb() {
  const t = useTranslations('map')
  const period = useSyncExternalStore(subscribe, readStoredPeriod, getServerSnapshot)

  return (
    <div className="group fixed top-4 left-4 size-11 md:top-auto md:bottom-4 md:size-[85px] z-30 flex items-center justify-center rounded-full bg-black opacity-90">
      <EuropeMap decorative viewBox="0 0 670 443" className="size-[90%]" />
      <TransitionLink href={period ? `/map?period=${period}` : '/map'} className="absolute inset-0 rounded-full" aria-label={t('returnToMap')}>
        <span className="sr-only">{t('returnToMap')}</span>
      </TransitionLink>
      <Tooltip label={t('returnToMap')} side="right" />
    </div>
  )
}
