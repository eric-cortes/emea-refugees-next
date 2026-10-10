'use client'

import dynamic from 'next/dynamic'
import TerrainStatus from './terrain-status'

const TerrainCanvas = dynamic(() => import('./terrain-canvas'), {
  ssr: false,
  loading: () => <TerrainStatus state="loading" progress={10} />,
})

interface Props {
  regionId: string
  zoom?: boolean
  onPoiSelect?: (id: string) => void
}

export default function TerrainCanvasClient({ regionId, zoom, onPoiSelect }: Props) {
  return <TerrainCanvas regionId={regionId} zoom={zoom} onPoiSelect={onPoiSelect} />
}
