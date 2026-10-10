import { useTranslations } from 'next-intl'

export default function FloatingTitle() {
  const t = useTranslations('common')

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed hidden md:block top-1/2 -translate-y-1/2 left-4 z-[40] text-xs font-semibold uppercase tracking-[0.4em] text-white/70 [writing-mode:vertical-rl] rotate-180 md:left-8 md:text-sm"
    >
      {t('floatingTitle')}
    </div>
  )
}
