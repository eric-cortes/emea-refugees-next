'use client'

import Image from 'next/image'
import { useCallback, useRef } from 'react'
import { useTranslations } from 'next-intl'
import type { PoiImage } from '@/constants/regions'
import { Drawer } from '@/components/UI'

interface CityDrawerProps {
  citySlug: string | null
  title: string
  videoSrc?: string
  image?: PoiImage
  imageAlt?: string
  onClose: () => void
}

export default function CityDrawer({ citySlug, title, videoSrc, image, imageAlt, onClose }: CityDrawerProps) {
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
          src={videoSrc}
        />
      )}
      {image && (
        <Image
          src={image.src}
          alt={imageAlt ?? ''}
          width={image.width}
          height={image.height}
          sizes="(min-width: 768px) 40vw, 100vw"
          className="block h-auto w-full rounded-md"
        />
      )}
      {citySlug && t.has(`stories.${citySlug}.text`) && (
        <>
          <p className="mt-6 leading-snug text-white/80">{t(`stories.${citySlug}.text`)}</p>
          <p className="mt-4 text-sm text-white/50">
            {t('source')} {t(`stories.${citySlug}.source`)}
          </p>
        </>
      )}
    </Drawer>
  )
}
