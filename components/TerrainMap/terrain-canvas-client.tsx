'use client'

import dynamic from 'next/dynamic'
import TerrainStatus from './terrain-status'

const TerrainCanvas = dynamic(() => import('./terrain-canvas'), {
  ssr: false,
  loading: () => <TerrainStatus state="loading" />,
})

interface Props {
  regionId: string
  zoom?: boolean
}

export default function TerrainCanvasClient({ regionId, zoom }: Props) {
  return <TerrainCanvas regionId={regionId} zoom={zoom} />
}
