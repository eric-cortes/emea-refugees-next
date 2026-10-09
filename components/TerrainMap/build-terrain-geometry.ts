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
  /** Elevation in metres for every top vertex (bottom wall vertices are ignored). */
  heights: Float32Array
  /** Number of grid vertices; border crossing vertices follow, then wall vertices. */
  gridCount: number
  /** Grid plus border crossing vertices (all of them sit on the top surface). */
  surfaceCount: number
  /** Total vertex count; wall vertices follow surfaceCount in groups of four (two top, two bottom). */
  vertexCount: number
  /** Which grid vertices are inside the border. */
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

  // Soft coverage field: share of mask pixels in a window around each block, so the border is smooth.
  const coverage = new Float32Array(gridCount)
  const gridHeights = new Float32Array(gridCount)
  const filled = new Uint8Array(gridCount)
  for (let gj = 0; gj < gridH; gj++) {
    for (let gi = 0; gi < gridW; gi++) {
      const x0 = Math.max(0, Math.floor(gi * STRIDE + STRIDE / 2 - STRIDE))
      const x1 = Math.min(width, Math.ceil(gi * STRIDE + STRIDE / 2 + STRIDE))
      const y0 = Math.max(0, Math.floor(gj * STRIDE + STRIDE / 2 - STRIDE))
      const y1 = Math.min(height, Math.ceil(gj * STRIDE + STRIDE / 2 + STRIDE))
      let sum = 0
      let count = 0
      for (let py = y0; py < y1; py++) {
        for (let px = x0; px < x1; px++) {
          const index = py * width + px
          if (mask[index]) {
            sum += elevation[index]
            count++
          }
        }
      }
      const area = (x1 - x0) * (y1 - y0)
      const v = gj * gridW + gi
      if (count > 0) {
        coverage[v] = count / area
        gridHeights[v] = sum / count
        filled[v] = 1
      }
    }
  }

  // Give empty vertices a height from nearby filled ones so border points can interpolate.
  for (let pass = 0; pass < 3; pass++) {
    const next = filled.slice()
    for (let gj = 0; gj < gridH; gj++) {
      for (let gi = 0; gi < gridW; gi++) {
        const v = gj * gridW + gi
        if (filled[v]) continue
        let sum = 0
        let count = 0
        for (let dj = -1; dj <= 1; dj++) {
          for (let di = -1; di <= 1; di++) {
            const ni = gi + di
            const nj = gj + dj
            if (ni < 0 || nj < 0 || ni >= gridW || nj >= gridH) continue
            const n = nj * gridW + ni
            if (filled[n]) {
              sum += gridHeights[n]
              count++
            }
          }
        }
        if (count > 0) {
          gridHeights[v] = sum / count
          next[v] = 1
        }
      }
    }
    filled.set(next)
  }

  const used = new Uint8Array(gridCount)
  for (let v = 0; v < gridCount; v++) used[v] = coverage[v] >= 0.5 ? 1 : 0

  // Border crossing vertices, one per grid edge whose ends differ. Horizontal edge ids come first, then vertical.
  const edgeVertex = new Int32Array(gridCount * 2).fill(-1)
  const edgeA: number[] = []
  const edgeB: number[] = []
  const addEdge = (id: number, p: number, q: number) => {
    if (used[p] === used[q]) return
    edgeVertex[id] = gridCount + edgeA.length
    edgeA.push(p)
    edgeB.push(q)
  }
  for (let gj = 0; gj < gridH; gj++) {
    for (let gi = 0; gi < gridW; gi++) {
      const v = gj * gridW + gi
      if (gi < gridW - 1) addEdge(v, v, v + 1)
      if (gj < gridH - 1) addEdge(gridCount + v, v, v + gridW)
    }
  }
  const surfaceCount = gridCount + edgeA.length

  const cellW = gridW - 1
  const cellH = gridH - 1
  const MAX_POLY = 6
  const poly = new Int32Array(MAX_POLY)
  const isCross = new Uint8Array(MAX_POLY)

  // Visits the inside polygon(s) of every cell, in perimeter order a, b, d, c.
  const visitCells = (onPoly: (n: number) => void) => {
    const corners = [0, 0, 0, 0]
    const edges = [0, 0, 0, 0]
    for (let cj = 0; cj < cellH; cj++) {
      for (let ci = 0; ci < cellW; ci++) {
        const a = cj * gridW + ci
        const c = a + gridW
        corners[0] = a
        corners[1] = a + 1
        corners[2] = c + 1
        corners[3] = c
        edges[0] = edgeVertex[a]
        edges[1] = edgeVertex[gridCount + a + 1]
        edges[2] = edgeVertex[c]
        edges[3] = edgeVertex[gridCount + a]
        const inside = used[corners[0]] + used[corners[1]] + used[corners[2]] + used[corners[3]]
        if (inside === 0) continue

        if (inside === 2 && used[corners[0]] === used[corners[2]]) {
          const centre = (coverage[corners[0]] + coverage[corners[1]] + coverage[corners[2]] + coverage[corners[3]]) / 4
          if (centre < 0.5) {
            for (let k = 0; k < 4; k++) {
              if (!used[corners[k]]) continue
              poly[0] = edges[(k + 3) % 4]
              poly[1] = corners[k]
              poly[2] = edges[k]
              isCross[0] = 1
              isCross[1] = 0
              isCross[2] = 1
              onPoly(3)
            }
            continue
          }
        }

        let n = 0
        for (let k = 0; k < 4; k++) {
          if (used[corners[k]]) {
            poly[n] = corners[k]
            isCross[n++] = 0
          }
          if (edges[k] >= 0) {
            poly[n] = edges[k]
            isCross[n++] = 1
          }
        }
        onPoly(n)
      }
    }
  }

  let triangleCount = 0
  let wallCount = 0
  visitCells((n) => {
    triangleCount += n - 2
    for (let k = 0; k < n; k++) {
      if (isCross[k] && isCross[(k + 1) % n]) wallCount++
    }
  })

  const vertexCount = surfaceCount + wallCount * 4
  const positions = new Float32Array(vertexCount * 3)
  const heights = new Float32Array(vertexCount)
  const indices = new Uint32Array((triangleCount + wallCount * 2) * 3)

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
  for (let e = 0; e < edgeA.length; e++) {
    const v = gridCount + e
    const p = edgeA[e]
    const q = edgeB[e]
    const t = (0.5 - coverage[p]) / (coverage[q] - coverage[p])
    positions[v * 3] = positions[p * 3] + (positions[q * 3] - positions[p * 3]) * t
    positions[v * 3 + 2] = positions[p * 3 + 2] + (positions[q * 3 + 2] - positions[p * 3 + 2]) * t
    heights[v] = gridHeights[p] + (gridHeights[q] - gridHeights[p]) * t
    positions[v * 3 + 1] = (heights[v] * exaggeration) / UNIT
  }

  let tri = 0
  const pushTriangle = (a: number, b: number, c: number) => {
    indices[tri++] = a
    indices[tri++] = b
    indices[tri++] = c
  }

  let wall = surfaceCount
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

  visitCells((n) => {
    if (n === 4 && !isCross[0] && !isCross[1] && !isCross[2] && !isCross[3]) {
      // Fully inside cell: poly is a, b, d, c.
      pushTriangle(poly[0], poly[3], poly[1])
      pushTriangle(poly[1], poly[3], poly[2])
      return
    }
    for (let k = 1; k < n - 1; k++) pushTriangle(poly[0], poly[k + 1], poly[k])
    for (let k = 0; k < n; k++) {
      const next = (k + 1) % n
      if (isCross[k] && isCross[next]) pushWall(poly[next], poly[k])
    }
  })

  const geometry = new BufferGeometry()
  geometry.setAttribute('position', new BufferAttribute(positions, 3))
  const colours = new Float32Array(vertexCount * 3)
  const colour = new Color()
  for (let v = 0; v < surfaceCount; v++) {
    elevationColour(heights[v], colour)
    colours[v * 3] = colour.r
    colours[v * 3 + 1] = colour.g
    colours[v * 3 + 2] = colour.b
  }
  colour.set(WALL_COLOUR)
  for (let v = surfaceCount; v < vertexCount; v++) {
    colours[v * 3] = colour.r
    colours[v * 3 + 1] = colour.g
    colours[v * 3 + 2] = colour.b
  }
  geometry.setAttribute('color', new BufferAttribute(colours, 3))
  geometry.setIndex(new BufferAttribute(indices, 1))
  geometry.computeVertexNormals()
  geometry.computeBoundingSphere()

  return { geometry, heights, gridCount, surfaceCount, vertexCount, used, bottomY }
}

/** Rewrites the surface and wall-top heights for a new vertical exaggeration. */
export function applyExaggeration(terrain: TerrainGeometryData, exaggeration: number): void {
  const { geometry, heights, surfaceCount, vertexCount } = terrain
  const position = geometry.getAttribute('position') as BufferAttribute
  const array = position.array as Float32Array

  for (let v = 0; v < surfaceCount; v++) {
    array[v * 3 + 1] = (heights[v] * exaggeration) / UNIT
  }
  for (let v = surfaceCount; v < vertexCount; v += 4) {
    array[v * 3 + 1] = (heights[v] * exaggeration) / UNIT
    array[(v + 1) * 3 + 1] = (heights[v + 1] * exaggeration) / UNIT
  }

  position.needsUpdate = true
  geometry.computeVertexNormals()
}

export function worldHeight(metres: number, exaggeration: number): number {
  return (metres * exaggeration) / UNIT
}
