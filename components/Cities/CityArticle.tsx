import type { ReactNode } from 'react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import type { City, CityImage } from '@/constants/cities'
import { ExternalLink, PhotoCredit, SectionHeading } from '@/components/UI'
import { getSource } from '@/constants/sources'
import ChapterNav from './ChapterNav'
import ShareLinks from './ShareLinks'

interface CityArticleProps {
  city: City
}

const PARAGRAPH_KEYS = Array.from({ length: 12 }, (_, index) => `p${index + 1}`)
const ACTOR_KEYS = Array.from({ length: 12 }, (_, index) => `a${index + 1}`)

const FOOTNOTE_PATTERN = /<fn>([^<]+)<\/fn>/g

function collectSourceIds(texts: string[]): string[] {
  const ids: string[] = []
  texts.forEach(text => {
    for (const match of text.matchAll(FOOTNOTE_PATTERN)) {
      if (!ids.includes(match[1])) ids.push(match[1])
    }
  })
  return ids
}

export default function CityArticle({ city }: CityArticleProps) {
  const t = useTranslations(`cities.${city.slug}`)
  const tCities = useTranslations('cities')
  const tShare = useTranslations('common.share')
  const tCommon = useTranslations('common')
  const [hero, ...rest] = city.images
  const paragraphKeys = PARAGRAPH_KEYS.filter(key => t.has(key))
  const actorKeys = ACTOR_KEYS.filter(key => t.has(`actors.${key}.name`))
  const sources = collectSourceIds([
    ...paragraphKeys.map(key => t.raw(key) as string),
    ...actorKeys.map(key => t.raw(`actors.${key}.role`) as string),
  ]).flatMap(id => getSource(id) ?? [])
  const numberOf = (id: string) => sources.findIndex(source => source.id === id) + 1
  const renderFootnote = (chunks: ReactNode) => {
    const number = numberOf(String(chunks))
    if (!number) return null
    return (
      <sup className="[&+sup]:before:content-[',']">
        <a href={`#fn-${number}`} aria-label={tCities('footnoteLabel', { number })}>
          {number}
        </a>
      </sup>
    )
  }
  const getAlt = (image: CityImage) => t(`images.${image.altKey}`)

  return (
    <article className="animate-fade-in mx-auto max-w-176 px-5 py-16 text-[0.9375rem] leading-tight md:m-4 md:h-[calc(100dvh-2rem)] md:max-w-none md:overflow-y-auto md:relative md:z-45 md:rounded-2xl md:bg-panel md:px-12 [&_a]:text-teal">
      <header>
        <h1 className="my-2 text-[2.25rem]">{t('title')}</h1>
        <p className="mb-3 text-white/50">
          {[t('country'), city.years].filter(Boolean).join(' · ')}
        </p>
        <ShareLinks text={t('title')} twitterLabel={tShare('twitter')} facebookLabel={tShare('facebook')} />
      </header>
      <div>
        <SectionHeading className="text-[1.3rem]">{t('heading')}</SectionHeading>
        <div className="space-y-4">
          {paragraphKeys.map(key => (
            <p key={key}>
              {t.rich(key, { fn: renderFootnote })}
            </p>
          ))}
        </div>
      </div>
      {actorKeys.length > 0 && (
        <section className="mt-8 rounded-2xl bg-black/50 px-4 py-3">
          <SectionHeading className="mt-0 text-[1.3rem]">{tCities('actorsTitle')}</SectionHeading>
          <dl className="space-y-3">
            {actorKeys.map(key => (
              <div key={key}>
                <dt className="font-semibold">{t(`actors.${key}.name`)}</dt>
                <dd className="m-0">{t.rich(`actors.${key}.role`, { fn: renderFootnote })}</dd>
              </div>
            ))}
          </dl>
        </section>
      )}
      {hero && (
        <div className="my-8">
          <figure>
            <Image src={hero.src} alt={getAlt(hero)} width={hero.width} height={hero.height} loading="eager" sizes="(min-width: 768px) 50vw, 100vw" className="block aspect-[3/2] h-auto w-full rounded-md object-cover" />
            {hero.credit && (
              <figcaption>
                <PhotoCredit credit={hero.credit} />
              </figcaption>
            )}
          </figure>
        </div>
      )}
      {rest.length > 0 && (
        <div className="mb-8 grid grid-cols-2 gap-x-3 gap-y-6">
          {rest.map(image => (
            <figure key={image.src}>
              <Image src={image.src} alt={getAlt(image)} width={image.width} height={image.height} sizes="(min-width: 768px) 25vw, 50vw" className="block aspect-[3/2] h-auto w-full rounded-md object-cover" />
              {image.credit && (
                <figcaption>
                  <PhotoCredit credit={image.credit} />
                </figcaption>
              )}
            </figure>
          ))}
        </div>
      )}
      {sources.length > 0 && (
        <section>
          <SectionHeading className="text-[1.3rem]">{tCities('footnotesTitle')}</SectionHeading>
          <ol className="list-decimal space-y-2 pl-5">
            {sources.map((source, index) => (
              <li key={source.id} id={`fn-${index + 1}`}>
                <ExternalLink href={source.url} newTabLabel={tCommon('opensInNewTab')}>
                  {source.title}
                </ExternalLink>
              </li>
            ))}
          </ol>
        </section>
      )}
      <ChapterNav slug={city.slug} />
    </article>
  )
}
