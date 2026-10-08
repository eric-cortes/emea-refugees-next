import { setRequestLocale } from 'next-intl/server'
import { IntroClient } from '@/components/Intro'

export default async function IntroPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  return <IntroClient />
}
