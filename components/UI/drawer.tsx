'use client'

import { useEffect, useRef, type KeyboardEvent, type ReactNode } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { RxCross2 } from 'react-icons/rx'
import IconButton from './icon-button'

export interface DrawerProps {
  open: boolean
  title: string
  titleId: string
  closeLabel: string
  onClose: () => void
  onBeforeClose?: () => void
  children: ReactNode
}

const FOCUSABLE = 'button, [href], video[controls], [tabindex]:not([tabindex="-1"])'

export default function Drawer({ open, title, titleId, closeLabel, onClose, onBeforeClose, children }: DrawerProps) {
  const reduceMotion = useReducedMotion()
  const panelRef = useRef<HTMLElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)

  const close = () => {
    onBeforeClose?.()
    onClose()
  }

  useEffect(() => {
    if (!open) return
    closeRef.current?.focus()
    const onKey = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') {
        onBeforeClose?.()
        onClose()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose, onBeforeClose])

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
            className="fixed inset-0 z-[61] bg-black/60"
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
            aria-labelledby={titleId}
            className="fixed top-4 bottom-4 left-4 right-4 z-[62] overflow-y-auto rounded-2xl bg-[#1b1f22] p-6 text-white md:right-auto md:w-2/5"
            initial={{ x: reduceMotion ? 0 : '-120%', opacity: reduceMotion ? 0 : 1 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: reduceMotion ? 0 : '-120%', opacity: reduceMotion ? 0 : 1 }}
            transition={{ duration, ease: 'easeOut' }}
            onKeyDown={trapFocus}
          >
            <div className="mb-6 flex items-center justify-between">
              <h2 id={titleId} className="text-2xl font-semibold">
                {title}
              </h2>
              <IconButton ref={closeRef} variant="ghost" onClick={close} aria-label={closeLabel}>
                <RxCross2 size={24} aria-hidden />
              </IconButton>
            </div>
            {children}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
