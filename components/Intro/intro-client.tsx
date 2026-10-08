'use client'

import { useTranslations } from 'next-intl'
import { Link, useRouter } from '@/i18n/navigation'
import { asset } from '@/utils/asset'

export default function IntroClient() {
  const t = useTranslations('common')
  const router = useRouter()

  return (
    <main className="intro">
      <video
        src={asset('/assets/video/short.mp4')}
        autoPlay
        muted
        playsInline
        aria-label={t('intro.videoLabel')}
        onEnded={() => router.push('/map')}
        className="intro-video"
      />
      <div className="intro-overlay">
        <h1>{t('site.title')}</h1>
        <p>{t('site.subtitle')}</p>
        <Link href="/map" className="intro-link">
          {t('intro.explore')}
        </Link>
      </div>
    </main>
  )
}
