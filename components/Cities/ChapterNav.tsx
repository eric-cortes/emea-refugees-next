import { useTranslations } from 'next-intl'
import { RxArrowLeft, RxArrowRight } from 'react-icons/rx'
import TransitionLink from '@/components/Layout/TransitionLink'
import { CHAPTER_ORDER } from '@/constants/cities'

interface ChapterNavProps {
  slug: string
}

const LINK_CLASS = 'flex items-center gap-2 rounded-sm transition-opacity hover:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal'

export default function ChapterNav({ slug }: ChapterNavProps) {
  const t = useTranslations('cities')
  const index = CHAPTER_ORDER.indexOf(slug)
  if (index === -1) return null

  const previous = index > 0 ? CHAPTER_ORDER[index - 1] : undefined
  const next = index < CHAPTER_ORDER.length - 1 ? CHAPTER_ORDER[index + 1] : undefined

  return (
    <nav aria-label={t('chapterNav.label')} className="mt-8 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
      <div className="min-w-0 justify-self-start">
        {previous && (
          <TransitionLink href={`/cities/${previous}`} aria-label={t('chapterNav.previous', { city: t(`names.${previous}`) })} className={LINK_CLASS}>
            <RxArrowLeft size={18} aria-hidden className="shrink-0" />
            <span>{t(`names.${previous}`)}</span>
          </TransitionLink>
        )}
      </div>
      <p className="text-white/50">
        {index + 1} / {CHAPTER_ORDER.length}
      </p>
      <div className="flex min-w-0 justify-self-end">
        {next && (
          <TransitionLink href={`/cities/${next}`} aria-label={t('chapterNav.next', { city: t(`names.${next}`) })} className={LINK_CLASS}>
            <span>{t(`names.${next}`)}</span>
            <RxArrowRight size={18} aria-hidden className="shrink-0" />
          </TransitionLink>
        )}
      </div>
    </nav>
  )
}
