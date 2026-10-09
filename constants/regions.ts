import { asset } from '@/utils/asset'

export interface Region {
  id: string
  heightmap: string
  width: number
  height: number
  metresPerPixel: number
  minX: number
  minY: number
  maxX: number
  maxY: number
  elevationOffset: number
  elevationScale: number
  exaggeration: number
  slabThickness: number
  marker: string
}

export const REGIONS: Region[] = [
  {
    id: 'germany',
    heightmap: asset('/assets/images/map/heightmap-germany.png'),
    width: 763,
    height: 1024,
    metresPerPixel: 867.2242332131668,
    minX: 4020297.071503613,
    minY: 2674183.631475946,
    maxX: 4681989.161445259,
    maxY: 3562221.2462862288,
    elevationOffset: 100,
    elevationScale: 10,
    exaggeration: 6,
    slabThickness: 4000,
    marker: 'berlin',
  },
  {
    id: 'bosnia',
    heightmap: asset('/assets/images/map/heightmap-bosnia.png'),
    width: 1122,
    height: 1024,
    metresPerPixel: 301.204822115385,
    minX: 4763562.482352949,
    minY: 2190404.2588990596,
    maxX: 5101514.292766411,
    maxY: 2498837.996745214,
    elevationOffset: 100,
    elevationScale: 10,
    exaggeration: 2,
    slabThickness: 4000,
    marker: 'sarajevo',
  },
]

export function getRegion(id: string): Region | undefined {
  return REGIONS.find(region => region.id === id)
}
