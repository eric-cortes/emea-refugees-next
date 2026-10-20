'use client'

import type { MouseEvent } from 'react'
import { FaFacebook, FaTwitter } from 'react-icons/fa'

interface ShareLinksProps {
  text: string
  twitterLabel: string
  facebookLabel: string
}

const LINK_CLASS = 'rounded-sm transition-opacity hover:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal'

export default function ShareLinks({ text, twitterLabel, facebookLabel }: ShareLinksProps) {
  const encodedText = encodeURIComponent(text)

  const handleTwitterClick = (event: MouseEvent<HTMLAnchorElement>) => {
    event.currentTarget.href = `https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodedText}`
  }

  const handleFacebookClick = (event: MouseEvent<HTMLAnchorElement>) => {
    event.currentTarget.href = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`
  }

  return (
    <div className="mb-6 flex gap-3">
      <a href={`https://twitter.com/intent/tweet?text=${encodedText}`} target="_blank" rel="noopener noreferrer" aria-label={twitterLabel} onClick={handleTwitterClick} className={LINK_CLASS}>
        <FaTwitter size={18} aria-hidden />
      </a>
      <a href="https://www.facebook.com/sharer/sharer.php" target="_blank" rel="noopener noreferrer" aria-label={facebookLabel} onClick={handleFacebookClick} className={LINK_CLASS}>
        <FaFacebook size={18} aria-hidden />
      </a>
    </div>
  )
}
