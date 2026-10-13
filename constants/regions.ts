
export interface RegionPoi {
  id: string
  lat: number
  lng: number
  cx: number
  cy: number
  image: string
}

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
  pois?: RegionPoi[]
}

export const REGIONS: Region[] = [
  {
    id: 'germany',
    heightmap: '/assets/images/map/heightmap-germany.png',
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
    slabThickness: 20000,
    marker: 'berlin',
  },
  {
    id: 'bosnia',
    heightmap: '/assets/images/map/heightmap-bosnia.png',
    width: 1122,
    height: 1024,
    metresPerPixel: 301.204822115385,
    minX: 4763562.482352949,
    minY: 2190404.2588990596,
    maxX: 5101514.292766411,
    maxY: 2498837.996745214,
    elevationOffset: 100,
    elevationScale: 10,
    exaggeration: 4,
    slabThickness: 14000,
    marker: 'sarajevo',
    pois: [{ id: 'drina', lat: 44.19, lng: 19.37, cx: 313.83, cy: 260.82, image: '/assets/images/sarajevo/drina-placeholder.webp' }],
  },
  {
    id: 'bihac',
    heightmap: '/assets/images/map/heightmap-bosnia.png',
    width: 1122,
    height: 1024,
    metresPerPixel: 301.204822115385,
    minX: 4763562.482352949,
    minY: 2190404.2588990596,
    maxX: 5101514.292766411,
    maxY: 2498837.996745214,
    elevationOffset: 100,
    elevationScale: 10,
    exaggeration: 4,
    slabThickness: 14000,
    marker: 'bihac',
  },
  {
    id: 'austria',
    heightmap: '/assets/images/map/heightmap-austria.png',
    width: 1200,
    height: 640,
    metresPerPixel: 490.82360225626036,
    minX: 4274732.489801563,
    minY: 2585717.3872028245,
    maxX: 4863720.812509075,
    maxY: 2899844.492646831,
    elevationOffset: 100,
    elevationScale: 10,
    exaggeration: 5,
    slabThickness: 16000,
    marker: 'vienna',
  },
  {
    id: 'greece',
    heightmap: '/assets/images/map/heightmap-greece.png',
    width: 1045,
    height: 1024,
    metresPerPixel: 791.6791478647151,
    minX: 5137903.460907297,
    minY: 1416383.2629931318,
    maxX: 5965208.170425924,
    maxY: 2227062.7104066,
    elevationOffset: 100,
    elevationScale: 10,
    exaggeration: 5,
    slabThickness: 18000,
    marker: 'athen',
  },
  {
    id: 'lesbos',
    heightmap: '/assets/images/map/heightmap-lesbos.png',
    width: 1200,
    height: 855,
    metresPerPixel: 74.5556725652027,
    minX: 5675961.173687123,
    minY: 1908191.5154399392,
    maxX: 5765427.980765365,
    maxY: 1971936.6154831876,
    elevationOffset: 100,
    elevationScale: 10,
    exaggeration: 3,
    slabThickness: 5000,
    marker: 'lesbos',
  },
  {
    id: 'syria',
    heightmap: '/assets/images/map/heightmap-syria.png',
    width: 725,
    height: 1024,
    metresPerPixel: 721.3131911077762,
    minX: 6614799.370671974,
    minY: 1454099.759321888,
    maxX: 7137751.434225111,
    maxY: 2192724.467016251,
    elevationOffset: 100,
    elevationScale: 10,
    exaggeration: 5,
    slabThickness: 18000,
    marker: 'damascus',
  },
]

export function getRegion(id: string): Region | undefined {
  return REGIONS.find(region => region.id === id)
}

export function getRegionForCity(slug: string): Region | undefined {
  return REGIONS.find(region => region.marker === slug)
}
