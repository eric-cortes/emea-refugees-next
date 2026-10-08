import type { ReactNode } from 'react'
import RouteTransitionBoundary from '@/components/Layout/route-transition-boundary'

interface Props {
  children: ReactNode
}

export default function SiteLayout({ children }: Props) {
  return <RouteTransitionBoundary>{children}</RouteTransitionBoundary>
}
