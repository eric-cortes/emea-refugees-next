import type { AnchorHTMLAttributes } from 'react'

export interface ExternalLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  newTabLabel: string
}

export default function ExternalLink({ newTabLabel, children, ...props }: ExternalLinkProps) {
  return (
    <a {...props} target="_blank" rel="noopener noreferrer">
      {children}
      <span className="sr-only"> {newTabLabel}</span>
      <span aria-hidden="true"> ↗</span>
    </a>
  )
}
