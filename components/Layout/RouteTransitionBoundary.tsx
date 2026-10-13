'use client'

import type { ReactNode } from 'react'
import { createContext, useCallback, useContext, useLayoutEffect, useMemo, useRef, useTransition } from 'react'
import { animate } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { usePathname, useRouter } from '@/i18n/navigation'
import { normalizePathname } from '@/utils/normalize-pathname'
import { usePrefersReducedMotion } from '@/utils/use-prefers-reduced-motion'

type TransitionMode = 'push' | 'replace'

type StartTransitionOptions = {
  mode?: TransitionMode
}

type RouteTransitionContextValue = {
  startRouteTransition: (targetPath: string, options?: StartTransitionOptions) => void
  isTransitioning: boolean
  hasTransitionProvider: true
}

const FADE_IN_SECONDS = 0.3

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
  const t = useTranslations('common')
  const [isPending, startTransition] = useTransition()
  const pageRef = useRef<HTMLDivElement>(null)
  const previousPath = useRef(normalizePathname(pathname))
  const fade = useRef<{ stop: () => void } | null>(null)

  const normalizedPathname = normalizePathname(pathname)

  const startRouteTransition = useCallback(
    (nextTargetPath: string, options?: StartTransitionOptions) => {
      if (isPending) {
        return
      }

      if (!nextTargetPath.startsWith('/')) {
        return
      }

      if (normalizePathname(nextTargetPath) === normalizedPathname) {
        return
      }

      startTransition(() => {
        if (options?.mode === 'replace') router.replace(nextTargetPath)
        else router.push(nextTargetPath)
      })
    },
    [isPending, normalizedPathname, router]
  )

  useLayoutEffect(() => {
    if (previousPath.current === normalizedPathname) {
      return
    }
    previousPath.current = normalizedPathname

    const element = pageRef.current
    if (!element || prefersReducedMotion) {
      return
    }

    fade.current?.stop()
    element.style.opacity = '0'
    const controls = animate(element, { opacity: 1 }, { duration: FADE_IN_SECONDS, ease: 'easeOut' })
    fade.current = controls
    controls.then(() => {
      if (fade.current === controls) element.style.opacity = ''
    })
  }, [normalizedPathname, prefersReducedMotion])

  const contextValue = useMemo<RouteTransitionContextValue>(
    () => ({
      startRouteTransition,
      isTransitioning: isPending,
      hasTransitionProvider: true,
    }),
    [isPending, startRouteTransition]
  )

  return (
    <RouteTransitionContext.Provider value={contextValue}>
      <div ref={pageRef}>{children}</div>
      <p role="status" aria-live="polite" className="sr-only">
        {isPending ? t('routeLoading') : ''}
      </p>
    </RouteTransitionContext.Provider>
  )
}
