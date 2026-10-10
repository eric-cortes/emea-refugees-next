import type { ReactNode } from 'react'
import Footer from '@/components/Layout/footer'

export interface ContentPageProps {
  children: ReactNode
}

export default function ContentPage({ children }: ContentPageProps) {
  return (
    <>
      <main className="min-h-dvh animate-fade-in bg-bg px-5 py-16 leading-normal text-white/80">
        <article className="mx-auto max-w-[44rem]">{children}</article>
      </main>
      <Footer />
    </>
  )
}
