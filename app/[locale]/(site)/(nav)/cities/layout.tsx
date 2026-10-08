import type { ReactNode } from 'react'
import { setRequestLocale } from 'next-intl/server'
import { MapThumb } from '@/components/Map'

interface Props {
  children: ReactNode
  params: Promise<{ locale: string }>
}

export default async function CitiesLayout({ children, params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)

  return (
    <>
      {children}
      <MapThumb />
    </>
  )
}
