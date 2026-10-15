import { useTranslations } from 'next-intl'
import type { PhotoCredit as PhotoCreditData } from '@/constants/cities'
import ExternalLink from './ExternalLink'

export interface PhotoCreditProps {
  credit: PhotoCreditData
  className?: string
}

export default function PhotoCredit({ credit, className }: PhotoCreditProps) {
  const t = useTranslations('common')
  const newTabLabel = t('opensInNewTab')
  const { author, license, licenseUrl, source } = credit

  return (
    <p className={className ? `mt-1 text-xs text-white/50 ${className}` : 'mt-1 text-xs text-white/50'}>
      {t('photoCredit.label')}{' '}
      <ExternalLink href={source} newTabLabel={newTabLabel}>
        {author}
      </ExternalLink>
      {' · '}
      {!license && t('photoCredit.publicDomain')}
      {license && licenseUrl && (
        <ExternalLink href={licenseUrl} newTabLabel={newTabLabel}>
          {license}
        </ExternalLink>
      )}
      {license && !licenseUrl && license}
    </p>
  )
}
