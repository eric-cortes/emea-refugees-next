import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'

export default function NotFound() {
  const t = useTranslations('common.notFound')

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-bg text-white">
      <h1>{t('title')}</h1>
      <p>{t('text')}</p>
      <Link href="/map">{t('back')}</Link>
    </main>
  )
}
