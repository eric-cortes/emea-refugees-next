'use client'

import dynamic from 'next/dynamic'
import TerrainStatus from './TerrainStatus'

const TerrainCanvas = dynamic(() => import('./TerrainCanvas'), {
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
