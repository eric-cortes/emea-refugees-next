import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { FaFacebook, FaTwitter } from 'react-icons/fa'
import type { City, CityImage } from '@/constants/cities'
import { PhotoCredit, SectionHeading } from '@/components/UI'

interface CityArticleProps {
  city: City
}

const PARAGRAPH_KEYS = Array.from({ length: 12 }, (_, index) => `p${index + 1}`)

export default function CityArticle({ city }: CityArticleProps) {
  const t = useTranslations(`cities.${city.slug}`)
  const tShare = useTranslations('common.share')
  const [hero, ...rest] = city.images
  const getAlt = (image: CityImage) => t(`images.${image.altKey}`)

  return (
    <article className="mx-auto max-w-176 px-5 py-16 text-[0.9375rem] leading-tight md:m-4 md:h-[calc(100dvh-2rem)] md:max-w-none md:overflow-y-auto md:relative md:z-45 md:rounded-2xl md:bg-panel md:px-12 [&_a]:text-teal">
      <header>
        <div className="flex gap-3">
          <a href="https://twitter.com/" aria-label={tShare('twitter')}>
            <FaTwitter size={18} aria-hidden />
          </a>
          <a href="https://facebook.com/" aria-label={tShare('facebook')}>
            <FaFacebook size={18} aria-hidden />
          </a>
        </div>
        <h1 className="my-2 text-[2.25rem]">{t('title')}</h1>
      </header>
      <div>
        <SectionHeading className="text-[1.3rem]">{t('heading')}</SectionHeading>
        <div className="space-y-4">{PARAGRAPH_KEYS.map(key => t.has(key) && <p key={key}>{t(key)}</p>)}</div>
      </div>
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
    </article>
  )
}
