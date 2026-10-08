import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import EuropeMap from './europe-map'

export default function MapThumb() {
  const t = useTranslations('map')

  return (
    <div className="map-thumb">
      <EuropeMap decorative />
      <Link href="/map" className="return-to-map" aria-label={t('returnToMap')}>
        <span className="sr-only">{t('returnToMap')}</span>
      </Link>
    </div>
  )
}
