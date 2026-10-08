'use client'

import { useEffect } from 'react'
import { BASE_PATH } from '@/utils/asset'

interface ForwardProps {
  to: string
}

export default function Forward({ to }: ForwardProps) {
  const fullUrl = `${BASE_PATH}${to}`

  useEffect(() => {
    window.location.replace(fullUrl)
  }, [fullUrl])

  return (
    <p style={{ fontFamily: 'sans-serif', padding: '2rem' }}>
      <a href={fullUrl}>{fullUrl}</a>
    </p>
  )
}
