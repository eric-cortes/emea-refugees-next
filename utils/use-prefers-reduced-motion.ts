'use client'

import { useSyncExternalStore } from 'react'

const QUERY = '(prefers-reduced-motion: reduce)'

function subscribe(onChange: () => void) {
  if (!window.matchMedia) {
    return () => undefined
  }

  const mediaQueryList = window.matchMedia(QUERY)
  mediaQueryList.addEventListener('change', onChange)
  return () => {
    mediaQueryList.removeEventListener('change', onChange)
  }
}

function getSnapshot() {
  return window.matchMedia ? window.matchMedia(QUERY).matches : false
}

function getServerSnapshot() {
  return false
}

/**
 * Tracks the user's `prefers-reduced-motion` preference on the client.
 * Always returns `false` during SSR / before hydration, then syncs to the
 * real value and stays in sync if the OS-level preference changes.
 */
export function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
