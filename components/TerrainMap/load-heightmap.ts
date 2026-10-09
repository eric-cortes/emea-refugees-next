import type { Region } from '@/constants/regions'

export interface HeightmapData {
  width: number
  height: number
  /** Elevation in metres per pixel (row 0 is north). */
  elevation: Float32Array
  /** 1 where the pixel lies inside the country border, else 0. */
  mask: Uint8Array
}

async function readBlob(response: Response, onProgress?: (fraction: number) => void): Promise<Blob> {
  const total = Number(response.headers.get('Content-Length'))
  if (!response.body || !Number.isFinite(total) || total <= 0) {
    const blob = await response.blob()
    onProgress?.(1)
    return blob
  }

  const reader = response.body.getReader()
  const chunks: Uint8Array<ArrayBuffer>[] = []
  let received = 0
  for (;;) {
    const { done, value } = await reader.read()
    if (done) break
    chunks.push(value as Uint8Array<ArrayBuffer>)
    received += value.byteLength
    onProgress?.(Math.min(received / total, 1))
  }
  return new Blob(chunks, { type: response.headers.get('Content-Type') ?? '' })
}

export async function loadHeightmap(region: Region, onProgress?: (fraction: number) => void): Promise<HeightmapData> {
  const response = await fetch(region.heightmap)
  if (!response.ok) throw new Error(`Heightmap request failed: ${response.status}`)

  const blob = await readBlob(response, onProgress)
  const bitmap = await createImageBitmap(blob, { colorSpaceConversion: 'none', premultiplyAlpha: 'none' })
  const { width, height } = bitmap
  if (width !== region.width || height !== region.height) {
    bitmap.close()
    throw new Error('Heightmap size does not match the region definition')
  }

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const context = canvas.getContext('2d', { willReadFrequently: true })
  if (!context) {
    bitmap.close()
    throw new Error('2D canvas is not available')
  }
  context.drawImage(bitmap, 0, 0)
  bitmap.close()

  const pixels = context.getImageData(0, 0, width, height).data
  const elevation = new Float32Array(width * height)
  const mask = new Uint8Array(width * height)
  for (let i = 0; i < width * height; i++) {
    const value = (pixels[i * 4] << 8) | pixels[i * 4 + 1]
    elevation[i] = value / region.elevationScale - region.elevationOffset
    mask[i] = pixels[i * 4 + 2] > 127 ? 1 : 0
  }

  return { width, height, elevation, mask }
}

/** Bilinear elevation lookup. `px` / `py` are pixel-centre indices (0 = centre of the first pixel). */
export function sampleElevation(data: HeightmapData, px: number, py: number): number {
  const x = Math.min(Math.max(px, 0), data.width - 1)
  const y = Math.min(Math.max(py, 0), data.height - 1)
  const x0 = Math.floor(x)
  const y0 = Math.floor(y)
  const x1 = Math.min(x0 + 1, data.width - 1)
  const y1 = Math.min(y0 + 1, data.height - 1)
  const fx = x - x0
  const fy = y - y0
  const at = (ix: number, iy: number) => data.elevation[iy * data.width + ix]
  const top = at(x0, y0) * (1 - fx) + at(x1, y0) * fx
  const bottom = at(x0, y1) * (1 - fx) + at(x1, y1) * fx
  return top * (1 - fy) + bottom * fy
}
