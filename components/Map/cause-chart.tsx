import { getFormatter, getTranslations } from 'next-intl/server'
import { SectionHeading } from '@/components/UI'
import { ROUTE_CAUSES } from '@/constants/causes'

export default async function CauseChart() {
  const t = await getTranslations('map.causes')
  const format = await getFormatter()

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
              {route.causes.map(cause => (
                <li key={cause.key}>
                  <div className="flex justify-between gap-4">
                    <span className="text-sm">{t(`labels.${cause.key}`)}</span>
                    <span className="text-sm tabular-nums">{format.number(cause.value)}</span>
                  </div>
                  <div aria-hidden className="h-2 w-full rounded-full bg-white/10">
                    <div className="h-2 rounded-full bg-teal" style={{ width: `${(cause.value / max) * 100}%` }} />
                  </div>
                </li>
              ))}
            </ul>
            <p className="text-sm opacity-70">
              {t('total')} {format.number(route.total)}
            </p>
          </div>
        )
      })}
      <p className="text-xs opacity-60">{t('source')}</p>
    </section>
  )
}
