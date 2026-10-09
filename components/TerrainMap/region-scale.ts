import type { Region } from '@/constants/regions'

const REFERENCE_HALF_EXTENT_KM = 444

export function regionScale(region: Region): number {
  const halfX = (region.width * region.metresPerPixel) / 2000
  const halfZ = (region.height * region.metresPerPixel) / 2000
  return Math.round((Math.max(halfX, halfZ) / REFERENCE_HALF_EXTENT_KM) * 100) / 100
}
