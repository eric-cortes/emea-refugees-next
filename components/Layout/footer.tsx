import { useTranslations } from 'next-intl'
import { FaEnvelope, FaFacebook, FaTwitter } from 'react-icons/fa'
import TransitionLink from '@/components/Layout/transition-link'

const SOCIAL_LINKS = [
  { name: 'Twitter', href: 'https://twitter.com/', Icon: FaTwitter },
  { name: 'Facebook', href: 'https://facebook.com/', Icon: FaFacebook },
  { name: 'Email', href: 'mailto:test@example.com', Icon: FaEnvelope },
]

export default function Footer() {
  const t = useTranslations('common.footer')

  return (
    <footer className="relative z-10 flex flex-col items-center gap-3 bg-[#1b1f22] px-4 py-8 text-sm text-white/70">
      <ul aria-label={t('social')} className="flex gap-5">
        {SOCIAL_LINKS.map(({ name, href, Icon }) => (
          <li key={name}>
            <a href={href} aria-label={name} className="hover:text-white">
              <Icon size={20} aria-hidden />
            </a>
          </li>
        ))}
      </ul>
      <p>{t('copyright')}</p>
      <TransitionLink href="/impressum" className="text-xs hover:text-white">
        {t('imprint')}
      </TransitionLink>
    </footer>
  )
}
