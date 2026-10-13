import type { ReactNode } from 'react'
import Footer from '@/components/Layout/Footer'

export interface ContentPageProps {
  children: ReactNode
}

export default function ContentPage({ children }: ContentPageProps) {
  return (
    <>
      <main className="min-h-dvh animate-fade-in bg-bg px-5 py-16 leading-snug text-white/80">
        <article className="mx-auto max-w-176">{children}</article>
      </main>
      <Footer />
    </>
  )
}
