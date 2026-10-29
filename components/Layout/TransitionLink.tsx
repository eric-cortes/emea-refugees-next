'use client'

import type { ComponentProps, MouseEvent } from 'react'
import { Link, usePathname } from '@/i18n/navigation'
import { useRouteTransition } from '@/components/Layout/RouteTransitionBoundary'
import { normalizePathname } from '@/utils/normalize-pathname'

type TransitionLinkProps = ComponentProps<typeof Link>

function splitHref(href: string): [string, string] {
  const index = href.search(/[?#]/)
  return index === -1 ? [href, ''] : [href.slice(0, index), href.slice(index)]
}

export default function TransitionLink({ href, onClick, replace, ...rest }: TransitionLinkProps) {
  const pathname = usePathname()
  const { startRouteTransition, isTransitioning, hasTransitionProvider } = useRouteTransition()
  const [hrefPath, hrefSuffix] = typeof href === 'string' ? splitHref(href) : ['', '']
  const normalizedHref =
    typeof href === 'string' && hrefPath.startsWith('/') && hrefPath !== '/' && !hrefPath.endsWith('/')
      ? `${hrefPath}/${hrefSuffix}`
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

    if (normalizePathname(pathname) === normalizePathname(typeof normalizedHref === 'string' ? splitHref(normalizedHref)[0] : normalizedHref)) {
      return
    }

    event.preventDefault()
    startRouteTransition(normalizedHref, { mode: replace ? 'replace' : 'push' })
  }

  return <Link href={normalizedHref} onClick={handleClick} replace={replace} {...rest} />
}
