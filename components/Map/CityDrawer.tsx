'use client'

import Image from 'next/image'
import { useCallback, useRef } from 'react'
import { useTranslations } from 'next-intl'
import { Drawer } from '@/components/UI'
import { asset } from '@/utils/asset'

interface CityDrawerProps {
  citySlug: string | null
  title: string
  videoSrc?: string
  imageSrc?: string
  imageAlt?: string
  onClose: () => void
}

export default function CityDrawer({ citySlug, title, videoSrc, imageSrc, imageAlt, onClose }: CityDrawerProps) {
  const t = useTranslations('map.drawer')
  const videoRef = useRef<HTMLVideoElement>(null)

  const pauseVideo = useCallback(() => {
    videoRef.current?.pause()
  }, [])

  return (
    <Drawer
      open={citySlug !== null}
      title={title}
      titleId="city-drawer-title"
      closeLabel={t('close')}
      onClose={onClose}
      onBeforeClose={pauseVideo}
    >
      {videoSrc && (
        <video
          ref={videoRef}
          controls
          playsInline
          preload="none"
          className="w-full bg-black"
          src={asset(videoSrc)}
        />
      )}
      {imageSrc && (
        <Image
          src={asset(imageSrc)}
          alt={imageAlt ?? ''}
          width={0}
          height={0}
          sizes="(min-width: 768px) 40vw, 100vw"
          className="block h-auto w-full rounded-md"
        />
      )}
      {citySlug && t.has(`stories.${citySlug}.text`) && (
        <>
          <p className="mt-6 leading-normal text-white/80">{t(`stories.${citySlug}.text`)}</p>
          <p className="mt-4 text-sm text-white/50">
            {t('source')} {t(`stories.${citySlug}.source`)}
          </p>
        </>
      )}
    </Drawer>
  )
}
