import { useTranslations } from 'next-intl'
import { Tooltip } from '@/components/UI'
import TransitionLink from '@/components/Layout/TransitionLink'
import EuropeMap from './EuropeMap'

export default function MapThumb() {
  const t = useTranslations('map')

  return (
    <div className="group fixed top-4 left-4 size-11 md:top-auto md:bottom-4 md:size-[85px] z-30 flex items-center justify-center rounded-full bg-black opacity-90">
      <EuropeMap decorative viewBox="0 0 670 443" className="size-[90%]" />
      <TransitionLink href="/map" className="absolute inset-0 rounded-full" aria-label={t('returnToMap')}>
        <span className="sr-only">{t('returnToMap')}</span>
      </TransitionLink>
      <Tooltip label={t('returnToMap')} side="right" />
    </div>
  )
}
