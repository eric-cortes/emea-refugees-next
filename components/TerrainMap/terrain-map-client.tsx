'use client'

import dynamic from 'next/dynamic'
import TerrainStatus from './terrain-status'

const TerrainView = dynamic(() => import('./terrain-view'), {
  ssr: false,
  loading: () => (
    <div className="md:grid md:grid-cols-2 md:items-start">
      <section className="relative h-[80vh] overflow-hidden bg-bg md:sticky md:top-0 md:h-dvh">
        <TerrainStatus state="loading" />
      </section>
      <div className="md:min-h-dvh md:bg-panel" />
    </div>
  ),
})

interface Props {
  regionId: string
}

export default function TerrainMapClient({ regionId }: Props) {
  return <TerrainView regionId={regionId} />
}
