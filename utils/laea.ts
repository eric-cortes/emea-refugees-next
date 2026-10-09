const A = 6378137
const F = 1 / 298.257222101
const E2 = F * (2 - F)
const E = Math.sqrt(E2)
const LAT0 = (52 * Math.PI) / 180
const LON0 = (10 * Math.PI) / 180
const FALSE_EASTING = 4321000
const FALSE_NORTHING = 3210000

export interface ProjectedPoint {
  x: number
  y: number
}

function authalicQ(phi: number): number {
  const s = Math.sin(phi)
  return (1 - E2) * (s / (1 - E2 * s * s) - (1 / (2 * E)) * Math.log((1 - E * s) / (1 + E * s)))
}

const QP = authalicQ(Math.PI / 2)
const Q0 = authalicQ(LAT0)
const RQ = A * Math.sqrt(QP / 2)
const BETA0 = Math.asin(Q0 / QP)
const M0 = Math.cos(LAT0) / Math.sqrt(1 - E2 * Math.sin(LAT0) ** 2)
const D = (A * M0) / (RQ * Math.cos(BETA0))

/**
 * Projects WGS84/ETRS89 lat/lng (degrees) to EPSG:3035 (ETRS89 / LAEA Europe)
 * using the ellipsoidal Lambert Azimuthal Equal-Area forward formulas (Snyder).
 */
export function projectLaea(lat: number, lng: number): ProjectedPoint {
  const phi = (lat * Math.PI) / 180
  const dLam = (lng * Math.PI) / 180 - LON0
  const beta = Math.asin(authalicQ(phi) / QP)
  const b =
    RQ *
    Math.sqrt(2 / (1 + Math.sin(BETA0) * Math.sin(beta) + Math.cos(BETA0) * Math.cos(beta) * Math.cos(dLam)))

  return {
    x: FALSE_EASTING + b * D * Math.cos(beta) * Math.sin(dLam),
    y:
      FALSE_NORTHING +
      (b / D) * (Math.cos(BETA0) * Math.sin(beta) - Math.sin(BETA0) * Math.cos(beta) * Math.cos(dLam)),
  }
}
