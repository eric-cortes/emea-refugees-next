'use client'

import type { ComponentProps, MouseEvent } from 'react'
import { Link, usePathname } from '@/i18n/navigation'
import { useRouteTransition } from '@/components/Layout/RouteTransitionBoundary'
import { normalizePathname } from '@/utils/normalize-pathname'

type TransitionLinkProps = ComponentProps<typeof Link>

export default function TransitionLink({ href, onClick, replace, ...rest }: TransitionLinkProps) {
  const pathname = usePathname()
  const { startRouteTransition, isTransitioning, hasTransitionProvider } = useRouteTransition()
  const normalizedHref =
    typeof href === 'string' && href.startsWith('/') && href !== '/' && !href.endsWith('/')
      ? `${href}/`
      : href

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event)

    if (event.defaultPrevented) {
      return
    }

    const isInternalHref = typeof normalizedHref === 'string' && normalizedHref.startsWith('/')
    if (!hasTransitionProvider || !isInternalHref) {
      return
    }

    if (isTransitioning) {
      event.preventDefault()
      return
    }

    const isPrimaryClick = event.button === 0
    const hasModifier = event.metaKey || event.ctrlKey || event.altKey || event.shiftKey

    if (!isPrimaryClick || hasModifier) {
      return
    }

    const target = event.currentTarget.getAttribute('target')
    const isBlankTarget = target && target !== '_self'
    if (isBlankTarget || event.currentTarget.hasAttribute('download')) {
      return
    }

    if (normalizePathname(pathname) === normalizePathname(normalizedHref)) {
      return
    }

    event.preventDefault()
    startRouteTransition(normalizedHref, { mode: replace ? 'replace' : 'push' })
  }

  return <Link href={normalizedHref} onClick={handleClick} replace={replace} {...rest} />
}
