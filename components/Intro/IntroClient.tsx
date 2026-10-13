'use client'

import { useTranslations } from 'next-intl'
import TransitionLink from '@/components/Layout/TransitionLink'
import { useRouteTransition } from '@/components/Layout/RouteTransitionBoundary'

export default function IntroClient() {
  const t = useTranslations('common')
  const { startRouteTransition } = useRouteTransition()

  return (
    <main className="fixed inset-0 bg-black">
      <video
        src={'/assets/video/short.mp4'}
        autoPlay
        muted
        playsInline
        aria-label={t('intro.videoLabel')}
        onEnded={() => startRouteTransition('/map/')}
        className="h-full w-full object-cover"
      />
      <div className="absolute inset-x-0 bottom-[8vh] text-center [text-shadow:0_2px_12px_rgba(0,0,0,0.7)]">
        <h1 className="text-[length:clamp(1.5rem,5vw,3.5rem)]">{t('site.title')}</h1>
        <p>{t('site.subtitle')}</p>
        <TransitionLink href="/map" className="mt-6 inline-block border border-white rounded-md bg-black/40 px-[1.8rem] py-[0.6rem] tracking-[0.2em] uppercase hover:bg-white hover:text-black hover:[text-shadow:none]">
          {t('intro.explore')}
        </TransitionLink>
      </div>
    </main>
  )
}
