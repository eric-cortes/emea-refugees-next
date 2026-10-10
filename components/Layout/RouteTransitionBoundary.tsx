'use client'

import type { ReactNode } from 'react'
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { usePathname, useRouter } from '@/i18n/navigation'
import { normalizePathname } from '@/utils/normalize-pathname'
import { usePrefersReducedMotion } from '@/utils/use-prefers-reduced-motion'

type TransitionPhase = 'idle' | 'fadingOut' | 'navigating' | 'fadingIn'
type TransitionMode = 'push' | 'replace'

type StartTransitionOptions = {
  mode?: TransitionMode
}

type RouteTransitionContextValue = {
  startRouteTransition: (targetPath: string, options?: StartTransitionOptions) => void
  isTransitioning: boolean
  hasTransitionProvider: true
}

const FADE_OUT_SECONDS = 0.2
const FADE_IN_SECONDS = 0.3
const NAVIGATION_TIMEOUT_MS = 5000

const RouteTransitionContext = createContext<RouteTransitionContextValue | undefined>(undefined)

export function useRouteTransition() {
  const context = useContext(RouteTransitionContext)

  if (!context) {
    return {
      startRouteTransition: () => undefined,
      isTransitioning: false,
      hasTransitionProvider: false as const,
    }
  }

  return context
}

type RouteTransitionBoundaryProps = {
  children: ReactNode
}

export default function RouteTransitionBoundary({ children }: RouteTransitionBoundaryProps) {
  const router = useRouter()
  const pathname = usePathname()
  const prefersReducedMotion = usePrefersReducedMotion()

  const [phase, setPhase] = useState<TransitionPhase>('idle')
  const [targetPath, setTargetPath] = useState<string | null>(null)
  const [transitionMode, setTransitionMode] = useState<TransitionMode>('push')

  const normalizedPathname = normalizePathname(pathname)
  const isTransitioning = phase !== 'idle'

  const startRouteTransition = useCallback(
    (nextTargetPath: string, options?: StartTransitionOptions) => {
      if (phase !== 'idle') {
        return
      }

      if (!nextTargetPath.startsWith('/')) {
        return
      }

      if (normalizePathname(nextTargetPath) === normalizedPathname) {
        return
      }

      if (prefersReducedMotion) {
        if (options?.mode === 'replace') router.replace(nextTargetPath)
        else router.push(nextTargetPath)
        return
      }

      setTargetPath(nextTargetPath)
      setTransitionMode(options?.mode ?? 'push')
      setPhase('fadingOut')
    },
    [normalizedPathname, phase, prefersReducedMotion, router]
  )

  useEffect(() => {
    if (phase !== 'navigating' || !targetPath) {
      return
    }

    if (normalizedPathname === normalizePathname(targetPath)) {
      setPhase('fadingIn')
    }
  }, [normalizedPathname, phase, targetPath])

  useEffect(() => {
    if (phase !== 'navigating') {
      return
    }

    const timeoutId = window.setTimeout(() => {
      setPhase('fadingIn')
    }, NAVIGATION_TIMEOUT_MS)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [phase])

  // Keep navigation independent from Framer Motion lifecycle callbacks. This
  // also makes reduced-motion transitions deterministic when animations are
  // shortened or skipped by the user's preference.
  useEffect(() => {
    if (phase === 'fadingOut' && targetPath) {
      const delay = prefersReducedMotion ? 0 : FADE_OUT_SECONDS * 1000
      if (delay === 0) {
        setPhase('navigating')
        if (transitionMode === 'replace') router.replace(targetPath)
        else router.push(targetPath)
        return
      }
      const timeoutId = window.setTimeout(() => {
        setPhase('navigating')
        if (transitionMode === 'replace') {
          router.replace(targetPath)
        } else {
          router.push(targetPath)
        }
      }, delay)
      return () => window.clearTimeout(timeoutId)
    }

    if (phase === 'fadingIn') {
      const delay = prefersReducedMotion ? 0 : FADE_IN_SECONDS * 1000
      if (delay === 0) {
        setPhase('idle')
        setTargetPath(null)
        return
      }
      const timeoutId = window.setTimeout(() => {
        setPhase('idle')
        setTargetPath(null)
      }, delay)
      return () => window.clearTimeout(timeoutId)
    }
  }, [phase, prefersReducedMotion, router, targetPath, transitionMode])

  const contextValue = useMemo<RouteTransitionContextValue>(
    () => ({
      startRouteTransition,
      isTransitioning,
      hasTransitionProvider: true,
    }),
    [isTransitioning, startRouteTransition]
  )

  return (
    <RouteTransitionContext.Provider value={contextValue}>
      {children}

      <motion.div
        aria-hidden
        initial={{ opacity: 0 }}
        animate={{
          opacity: phase === 'fadingOut' || phase === 'navigating' ? 1 : 0,
        }}
        transition={{
          duration: prefersReducedMotion
            ? 0
            : phase === 'fadingOut'
              ? FADE_OUT_SECONDS
              : FADE_IN_SECONDS,
          ease: 'easeInOut',
        }}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 9999,
          backgroundColor: '#000',
          pointerEvents: isTransitioning ? 'auto' : 'none',
        }}
      />
    </RouteTransitionContext.Provider>
  )
}
