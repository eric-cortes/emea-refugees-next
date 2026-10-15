import { getTranslations } from 'next-intl/server'
import { ExternalLink, SectionHeading } from '@/components/UI'
import { ROUTE_CAUSES } from '@/constants/causes'
import AnimatedBar from './AnimatedBar'
import CountUp from './CountUp'

export default async function CauseChart() {
  const t = await getTranslations('map.causes')
  const tc = await getTranslations('common')

  return (
    <section>
      <SectionHeading>{t('heading')}</SectionHeading>
      <p>{t('intro')}</p>
      {ROUTE_CAUSES.map(route => {
        const max = Math.max(...route.causes.map(cause => cause.value))
        return (
          <div key={route.key}>
            <h3 className="mt-6 mb-2 text-base font-semibold">{t(`routes.${route.key}`)}</h3>
            <ul className="m-0 list-none space-y-2 p-0">
              {route.causes.map((cause, index) => (
                <li key={cause.key}>
                  <div className="flex justify-between gap-4">
                    <span className="text-sm">{t(`labels.${cause.key}`)}</span>
                    <span className="text-sm">
                      <CountUp value={cause.value} delay={index * 80} />
                    </span>
                  </div>
                  <AnimatedBar percent={(cause.value / max) * 100} delay={index * 80} />
                </li>
              ))}
            </ul>
            <p className="mt-3 text-sm opacity-70">
              {t('total')} <CountUp value={route.total} />
            </p>
          </div>
        )
      })}
      <p className="mt-6 text-xs opacity-60">{t('source')}</p>
      <p className="mt-1 text-xs">
        <ExternalLink href="https://missingmigrants.iom.int/" newTabLabel={tc('opensInNewTab')}>
          {t('sourceLink')}
        </ExternalLink>
      </p>
    </section>
  )
}
