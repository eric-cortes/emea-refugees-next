'use client'

import { useEffect, useRef, type KeyboardEvent } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { RxCross2 } from 'react-icons/rx'
import { asset } from '@/utils/asset'

interface CityDrawerProps {
  citySlug: string | null
  title: string
  videoSrc?: string
  onClose: () => void
}

const FOCUSABLE = 'button, [href], video[controls], [tabindex]:not([tabindex="-1"])'

export default function CityDrawer({ citySlug, title, videoSrc, onClose }: CityDrawerProps) {
  const t = useTranslations('map.drawer')
  const reduceMotion = useReducedMotion()
  const panelRef = useRef<HTMLElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const open = citySlug !== null

  const close = () => {
    videoRef.current?.pause()
    onClose()
  }

  useEffect(() => {
    if (!open) return
    closeRef.current?.focus()
    const onKey = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') {
        videoRef.current?.pause()
        onClose()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  const trapFocus = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key !== 'Tab' || !panelRef.current) return
    const items = Array.from(panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE))
    if (items.length === 0) return
    const first = items[0]
    const last = items[items.length - 1]
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault()
      last.focus()
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault()
      first.focus()
    }
  }

  const duration = reduceMotion ? 0 : 0.35

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="overlay"
            aria-hidden
            className="fixed inset-0 z-[50] bg-black/60"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration }}
            onClick={close}
          />
          <motion.aside
            key="panel"
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="city-drawer-title"
            className="fixed top-4 bottom-4 left-4 right-4 z-[55] overflow-y-auto rounded-2xl bg-[#1b1f22] p-6 text-white md:right-auto md:w-2/5"
            initial={{ x: reduceMotion ? 0 : '-120%', opacity: reduceMotion ? 0 : 1 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: reduceMotion ? 0 : '-120%', opacity: reduceMotion ? 0 : 1 }}
            transition={{ duration, ease: 'easeOut' }}
            onKeyDown={trapFocus}
          >
            <div className="mb-6 flex items-center justify-between">
              <h2 id="city-drawer-title" className="text-2xl font-semibold">
                {title}
              </h2>
              <button
                ref={closeRef}
                type="button"
                onClick={close}
                aria-label={t('close')}
                className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full hover:bg-white/10"
              >
                <RxCross2 size={24} aria-hidden />
              </button>
            </div>
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
            {citySlug && t.has(`stories.${citySlug}.text`) && (
              <>
                <p className="mt-6 leading-normal text-white/80">{t(`stories.${citySlug}.text`)}</p>
                <p className="mt-4 text-sm text-white/50">
                  {t('source')} {t(`stories.${citySlug}.source`)}
                </p>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
