import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { FaFacebook, FaTwitter } from 'react-icons/fa'
import type { City } from '@/constants/cities'
import { SectionHeading } from '@/components/UI'

interface CityArticleProps {
  city: City
}

const PARAGRAPH_KEYS = Array.from({ length: 12 }, (_, index) => `p${index + 1}`)
const GRID_ORDER = [0, 1, 5, 3, 4, 5, 6, 3, 7, 3]

export default function CityArticle({ city }: CityArticleProps) {
  const t = useTranslations(`cities.${city.slug}`)
  const tShare = useTranslations('common.share')
  const alt = t('imageAlt')
  const [hero, ...rest] = GRID_ORDER.map(index => city.images[index % city.images.length])
  const floatLeft = city.images[2]
  const floatRight = city.images[1]

  return (
    <article className="mx-auto max-w-176 px-5 py-16 leading-snug md:m-4 md:h-[calc(100dvh-2rem)] md:max-w-none md:overflow-y-auto md:relative md:z-45 md:rounded-2xl md:bg-panel md:px-12 [&_a]:text-teal">
      <header>
        <div className="flex gap-4">
          <a href="https://twitter.com/" aria-label={tShare('twitter')}>
            <FaTwitter size={22} aria-hidden />
          </a>
          <a href="https://facebook.com/" aria-label={tShare('facebook')}>
            <FaFacebook size={22} aria-hidden />
          </a>
        </div>
        <h1 className="my-2 text-[3rem]">{t('title')}</h1>
        <p>
          {t('byLabel')} <span className="text-teal">{t('author')}</span> | {t('date')}
        </p>
      </header>
      <div>
        <SectionHeading>{t('heading')}</SectionHeading>
        <div className="space-y-4">{PARAGRAPH_KEYS.map(key => t.has(key) && <p key={key}>{t(key)}</p>)}</div>
      </div>
      <div className="my-8 grid grid-cols-3 gap-x-3 gap-y-11">
        <div className="col-span-3">
          <Image src={hero.src} alt={alt} width={hero.width} height={hero.height} loading="eager" sizes="(min-width: 768px) 50vw, 100vw" className="block h-auto w-full rounded-md" />
        </div>
        {rest.map((image, index) => (
          <div key={index}>
            <Image src={image.src} alt={alt} width={image.width} height={image.height} sizes="(min-width: 768px) 17vw, 33vw" className="block h-auto w-full rounded-md" />
          </div>
        ))}
      </div>
      <div className="mb-8 grid grid-cols-2 gap-x-3">
        <Image src={floatLeft.src} alt={alt} width={floatLeft.width} height={floatLeft.height} sizes="(min-width: 768px) 25vw, 50vw" className="block h-auto w-full rounded-md" />
        <Image src={floatRight.src} alt={alt} width={floatRight.width} height={floatRight.height} sizes="(min-width: 768px) 25vw, 50vw" className="block h-auto w-full rounded-md" />
      </div>
    </article>
  )
}
