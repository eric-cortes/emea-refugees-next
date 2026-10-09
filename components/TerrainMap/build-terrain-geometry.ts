import { BufferAttribute, BufferGeometry, Color } from 'three'
import type { Region } from '@/constants/regions'
import { WALL_COLOUR, elevationColour } from './elevation-colours'
import type { HeightmapData } from './load-heightmap'

/** Heightmap pixels per grid step. */
const STRIDE = 2
/** World units are kilometres. */
const UNIT = 1000

export interface TerrainGeometryData {
  geometry: BufferGeometry
  /** Elevation in metres for every vertex (bottom wall vertices are ignored). */
  heights: Float32Array
  /** Number of grid (top surface) vertices; wall vertices follow in groups of four. */
  gridCount: number
  /** Total vertex count. */
  vertexCount: number
  /** Which grid vertices belong to the surface. */
  used: Uint8Array
  bottomY: number
}

export function buildTerrainGeometry(data: HeightmapData, region: Region, exaggeration: number): TerrainGeometryData {
  const { width, height, elevation, mask } = data
  const step = (STRIDE * region.metresPerPixel) / UNIT
  const gridW = Math.ceil((width - 1) / STRIDE) + 1
  const gridH = Math.ceil((height - 1) / STRIDE) + 1
  const gridCount = gridW * gridH
  const halfX = (width * region.metresPerPixel) / UNIT / 2
  const halfZ = (height * region.metresPerPixel) / UNIT / 2
  const bottomY = -region.slabThickness / UNIT

  // Grid vertices: inside when any pixel of the covered block is inside the border.
  const used = new Uint8Array(gridCount)
  const gridHeights = new Float32Array(gridCount)
  for (let gj = 0; gj < gridH; gj++) {
    for (let gi = 0; gi < gridW; gi++) {
      let sum = 0
      let count = 0
      for (let dy = 0; dy < STRIDE; dy++) {
        const py = gj * STRIDE + dy
        if (py >= height) continue
        for (let dx = 0; dx < STRIDE; dx++) {
          const px = gi * STRIDE + dx
          if (px >= width) continue
          const index = py * width + px
          if (mask[index]) {
            sum += elevation[index]
            count++
          }
        }
      }
      if (count > 0) {
        used[gj * gridW + gi] = 1
        gridHeights[gj * gridW + gi] = sum / count
      }
    }
  }

  const cellW = gridW - 1
  const cellH = gridH - 1
  const cells = new Uint8Array(cellW * cellH)
  let cellCount = 0
  for (let cj = 0; cj < cellH; cj++) {
    for (let ci = 0; ci < cellW; ci++) {
      const a = cj * gridW + ci
      if (used[a] && used[a + 1] && used[a + gridW] && used[a + gridW + 1]) {
        cells[cj * cellW + ci] = 1
        cellCount++
      }
    }
  }
  const hasCell = (ci: number, cj: number) => ci >= 0 && cj >= 0 && ci < cellW && cj < cellH && cells[cj * cellW + ci] === 1

  let wallCount = 0
  for (let cj = 0; cj < cellH; cj++) {
    for (let ci = 0; ci < cellW; ci++) {
      if (!cells[cj * cellW + ci]) continue
      if (!hasCell(ci, cj - 1)) wallCount++
      if (!hasCell(ci, cj + 1)) wallCount++
      if (!hasCell(ci - 1, cj)) wallCount++
      if (!hasCell(ci + 1, cj)) wallCount++
    }
  }

  const vertexCount = gridCount + wallCount * 4
  const positions = new Float32Array(vertexCount * 3)
  const heights = new Float32Array(vertexCount)
  const indices = new Uint32Array((cellCount * 2 + wallCount * 2) * 3)

  // Block centre in pixel-edge coordinates is gi * STRIDE + STRIDE / 2.
  for (let gj = 0; gj < gridH; gj++) {
    for (let gi = 0; gi < gridW; gi++) {
      const v = gj * gridW + gi
      positions[v * 3] = gi * step + step / 2 - halfX
      positions[v * 3 + 1] = (gridHeights[v] * exaggeration) / UNIT
      positions[v * 3 + 2] = gj * step + step / 2 - halfZ
      heights[v] = gridHeights[v]
    }
  }

  let tri = 0
  const pushTriangle = (a: number, b: number, c: number) => {
    indices[tri++] = a
    indices[tri++] = b
    indices[tri++] = c
  }

  let wall = gridCount
  const pushWall = (p: number, q: number) => {
    const pb = wall + 2
    const qb = wall + 3
    for (const [slot, source] of [[wall, p], [wall + 1, q]] as const) {
      positions[slot * 3] = positions[source * 3]
      positions[slot * 3 + 1] = positions[source * 3 + 1]
      positions[slot * 3 + 2] = positions[source * 3 + 2]
      heights[slot] = heights[source]
    }
    for (const [slot, source] of [[pb, p], [qb, q]] as const) {
      positions[slot * 3] = positions[source * 3]
      positions[slot * 3 + 1] = bottomY
      positions[slot * 3 + 2] = positions[source * 3 + 2]
    }
    pushTriangle(wall, pb, wall + 1)
    pushTriangle(wall + 1, pb, qb)
    wall += 4
  }

  for (let cj = 0; cj < cellH; cj++) {
    for (let ci = 0; ci < cellW; ci++) {
      if (!cells[cj * cellW + ci]) continue
      const a = cj * gridW + ci
      const b = a + 1
      const c = a + gridW
      const d = c + 1
      pushTriangle(a, c, b)
      pushTriangle(b, c, d)
      if (!hasCell(ci, cj - 1)) pushWall(b, a)
      if (!hasCell(ci, cj + 1)) pushWall(c, d)
      if (!hasCell(ci - 1, cj)) pushWall(a, c)
      if (!hasCell(ci + 1, cj)) pushWall(d, b)
    }
  }

  const geometry = new BufferGeometry()
  geometry.setAttribute('position', new BufferAttribute(positions, 3))
  const colours = new Float32Array(vertexCount * 3)
  const colour = new Color()
  for (let v = 0; v < gridCount; v++) {
    elevationColour(heights[v], colour)
    colours[v * 3] = colour.r
    colours[v * 3 + 1] = colour.g
    colours[v * 3 + 2] = colour.b
  }
  colour.set(WALL_COLOUR)
  for (let v = gridCount; v < vertexCount; v++) {
    colours[v * 3] = colour.r
    colours[v * 3 + 1] = colour.g
    colours[v * 3 + 2] = colour.b
  }
  geometry.setAttribute('color', new BufferAttribute(colours, 3))
  geometry.setIndex(new BufferAttribute(indices, 1))
  geometry.computeVertexNormals()
  geometry.computeBoundingSphere()

  return { geometry, heights, gridCount, vertexCount, used, bottomY }
}

/** Rewrites the surface and wall-top heights for a new vertical exaggeration. */
export function applyExaggeration(terrain: TerrainGeometryData, exaggeration: number): void {
  const { geometry, heights, gridCount, vertexCount, used } = terrain
  const position = geometry.getAttribute('position') as BufferAttribute
  const array = position.array as Float32Array

  for (let v = 0; v < gridCount; v++) {
    if (used[v]) array[v * 3 + 1] = (heights[v] * exaggeration) / UNIT
  }
  for (let v = gridCount; v < vertexCount; v += 4) {
    array[v * 3 + 1] = (heights[v] * exaggeration) / UNIT
    array[(v + 1) * 3 + 1] = (heights[v + 1] * exaggeration) / UNIT
  }

  position.needsUpdate = true
  geometry.computeVertexNormals()
}

export function worldHeight(metres: number, exaggeration: number): number {
  return (metres * exaggeration) / UNIT
}
