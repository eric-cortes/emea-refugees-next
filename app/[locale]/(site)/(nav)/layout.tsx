import type { ReactNode } from 'react'
import { setRequestLocale } from 'next-intl/server'
import { Footer, Sidebar } from '@/components/Layout'

interface Props {
  children: ReactNode
  params: Promise<{ locale: string }>
}

export default async function NavLayout({ children, params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)

  return (
    <>
      <Sidebar />
      <div className="site-main">{children}</div>
      <Footer />
    </>
  )
}
