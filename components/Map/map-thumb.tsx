import { useTranslations } from 'next-intl'
import TransitionLink from '@/components/Layout/transition-link'
import EuropeMap from './europe-map'

export default function MapThumb() {
  const t = useTranslations('map')

  return (
    <div className="fixed bottom-4 left-4 z-30 flex size-[85px] items-center justify-center rounded-full bg-black opacity-90">
      <EuropeMap decorative viewBox="0 0 670 443" className="size-[90%]" />
      <TransitionLink href="/map" className="absolute inset-0 rounded-full" aria-label={t('returnToMap')}>
        <span className="sr-only">{t('returnToMap')}</span>
      </TransitionLink>
    </div>
  )
}
