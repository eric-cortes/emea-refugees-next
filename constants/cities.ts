export type CityType = 'route' | 'stop'

export interface CityStat {
  value: number
  decimals?: number
}

export interface PhotoCredit {
  author: string
  license?: string
  licenseUrl?: string
  source: string
}

export interface CityImage {
  src: string
  width: number
  height: number
  altKey: string
  credit?: PhotoCredit
}

export interface City {
  slug: string
  cx: number
  cy: number
  type: CityType
  hasPage: boolean
  images: CityImage[]
  video?: string
  stat?: CityStat
  years?: string
  lat?: number
  lng?: number
}

const VIDEO = '/assets/video/short.mp4'

const BERLIN_IMAGES: CityImage[] = [
  {
    src: '/assets/images/berlin/lageso-entrance.jpg',
    width: 1280,
    height: 960,
    altKey: 'lageso-entrance',
    credit: { author: 'Martin Lindner', license: 'CC BY-SA 3.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0', source: 'https://commons.wikimedia.org/wiki/File:LAGeSo-4.JPG' },
  },
  {
    src: '/assets/images/berlin/lageso-waiting.jpg',
    width: 1280,
    height: 960,
    altKey: 'lageso-waiting',
    credit: { author: 'Martin Lindner', license: 'CC BY-SA 3.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0', source: 'https://commons.wikimedia.org/wiki/File:LAGeSo-3.JPG' },
  },
  {
    src: '/assets/images/berlin/tempelhof-hangars.jpg',
    width: 1280,
    height: 853,
    altKey: 'tempelhof-hangars',
    credit: { author: 'Michael F. Mehnert', license: 'CC BY-SA 3.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0', source: 'https://commons.wikimedia.org/wiki/File:Tempelhof_EDDI_2009-05-12_04.JPG' },
  },
  {
    src: '/assets/images/berlin/tempelhof-tempohome.jpg',
    width: 1280,
    height: 852,
    altKey: 'tempelhof-tempohome',
    credit: { author: 'dronepicr', license: 'CC BY 2.0', licenseUrl: 'https://creativecommons.org/licenses/by/2.0', source: 'https://commons.wikimedia.org/wiki/File:Tempohome_Fl%C3%BCchtlingsunterkunft_Berlin_Tempelhof_(33947816788).jpg' },
  },
]

const VIENNA_IMAGES: CityImage[] = [
  {
    src: '/assets/images/vienna/border-line.jpg',
    width: 1280,
    height: 853,
    altKey: 'border-line',
    credit: { author: 'Mstyslav Chernov', license: 'CC BY-SA 4.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0', source: 'https://commons.wikimedia.org/wiki/File:A_line_of_Syrian_refugees_crossing_the_border_of_Hungary_and_Austria_on_their_way_to_Germany._Hungary,_Central_Europe,_6_September_2015.jpg' },
  },
  {
    src: '/assets/images/vienna/westbahnhof-welcome.jpg',
    width: 1280,
    height: 1741,
    altKey: 'westbahnhof-welcome',
    credit: { author: 'Manfred Werner (Tsui)', license: 'CC BY-SA 4.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0', source: 'https://commons.wikimedia.org/wiki/File:Vienna_Westbahnhof_September_2015_information_for_refugees_1.jpg' },
  },
  {
    src: '/assets/images/vienna/nickelsdorf.jpg',
    width: 1280,
    height: 1413,
    altKey: 'nickelsdorf',
    credit: { author: 'Bundesheer Fotos', license: 'CC BY-SA 2.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/2.0', source: 'https://commons.wikimedia.org/wiki/File:Nickelsdorf_(21510650680).jpg' },
  },
  {
    src: '/assets/images/vienna/spielfeld.jpg',
    width: 1280,
    height: 853,
    altKey: 'spielfeld',
    credit: { author: 'Bundesheer Fotos', license: 'CC BY-SA 2.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/2.0', source: 'https://commons.wikimedia.org/wiki/File:Spielfeld_(24290065511).jpg' },
  },
]

const SARAJEVO_IMAGES: CityImage[] = [
  {
    src: '/assets/images/sarajevo/panorama.jpg',
    width: 1280,
    height: 765,
    altKey: 'panorama',
    credit: { author: 'Julian Nyča', license: 'CC BY-SA 4.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0', source: 'https://commons.wikimedia.org/wiki/File:Sarajevo_City_Panorama.JPG' },
  },
  {
    src: '/assets/images/sarajevo/old-town.jpg',
    width: 1280,
    height: 854,
    altKey: 'old-town',
    credit: { author: 'Julian Nyča', license: 'CC BY-SA 3.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0', source: 'https://commons.wikimedia.org/wiki/File:Sarajevo_City_Center_from_Trebevic.JPG' },
  },
  {
    src: '/assets/images/sarajevo/railway-station.jpg',
    width: 1280,
    height: 720,
    altKey: 'railway-station',
    credit: { author: 'Adam Harangozó', license: 'CC BY-SA 4.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0', source: 'https://commons.wikimedia.org/wiki/File:Sarajevo_railway_station_interior_01.jpg' },
  },
]

const BIHAC_IMAGES: CityImage[] = [
  {
    src: '/assets/images/bihac/una-river.jpg',
    width: 1280,
    height: 960,
    altKey: 'una-river',
    credit: { author: 'Julian Nyča', license: 'CC BY-SA 3.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0', source: 'https://commons.wikimedia.org/wiki/File:Una_River_Bihac.jpg' },
  },
  {
    src: '/assets/images/bihac/pljesevica.jpg',
    width: 1280,
    height: 960,
    altKey: 'pljesevica',
    credit: { author: 'Silverije', license: 'CC BY-SA 4.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0', source: 'https://commons.wikimedia.org/wiki/File:Plje%C5%A1evica_-_pogled_iz_Korenice.jpg' },
  },
  {
    src: '/assets/images/bihac/pljesevica-view.jpg',
    width: 1280,
    height: 960,
    altKey: 'pljesevica-view',
    credit: { author: 'Hasan Zulic', license: 'CC BY 3.0', licenseUrl: 'https://creativecommons.org/licenses/by/3.0', source: 'https://commons.wikimedia.org/wiki/File:View_From_Pljesevica_-_panoramio.jpg' },
  },
  {
    src: '/assets/images/bihac/lipa-village.jpg',
    width: 1280,
    height: 960,
    altKey: 'lipa-village',
    credit: { author: 'Milos14 at Serbian Wikipedia', source: 'https://commons.wikimedia.org/wiki/File:%D0%A1%D0%B5%D0%BB%D0%BE_%D0%9B%D0%B8%D0%BF%D0%B0_%D0%BA%D0%BE%D0%B4_%D0%91%D0%B8%D1%85%D0%B0%D1%9B%D0%B0.jpg' },
  },
]

const ATHENS_IMAGES: CityImage[] = [
  {
    src: '/assets/images/athen/piraeus-camp.jpg',
    width: 1280,
    height: 772,
    altKey: 'piraeus-camp',
    credit: { author: 'C messier', license: 'CC BY-SA 4.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0', source: 'https://commons.wikimedia.org/wiki/File:%CE%9A%CE%B1%CF%84%CE%B1%CF%85%CE%BB%CE%B9%CF%83%CE%BC%CF%8C%CF%82_%CF%83%CF%84%CE%B7%CE%BD_%CF%80%CF%8D%CE%BB%CE%B7_%CE%952,_%CE%A0%CE%B5%CE%B9%CF%81%CE%B1%CE%B9%CE%AC%CF%82_25032016_6750.jpg' },
  },
  {
    src: '/assets/images/athen/idomeni-tents.jpg',
    width: 1280,
    height: 891,
    altKey: 'idomeni-tents',
    credit: { author: 'FiliSpa', license: 'CC BY-SA 4.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0', source: 'https://commons.wikimedia.org/wiki/File:Krize_v_Idomeni_-_Migranti.jpg' },
  },
  {
    src: '/assets/images/athen/idomeni-food-line.jpg',
    width: 1280,
    height: 961,
    altKey: 'idomeni-food-line',
    credit: { author: 'Heather Murdock/Voice of America', source: 'https://commons.wikimedia.org/wiki/File:Families_wait_in_long_lines_for_food_from_aid_organizations._Many_have_now_run_out_of_money_to_purchase_their_own_food_in_Indomeni,_Greece,_March_31,_2016.jpg' },
  },
  {
    src: '/assets/images/athen/diavata-camp.jpg',
    width: 1280,
    height: 960,
    altKey: 'diavata-camp',
    credit: { author: 'Sorneguer', license: 'CC BY-SA 4.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0', source: 'https://commons.wikimedia.org/wiki/File:Diavata_refugee_camp_greece.jpg' },
  },
]

const LESBOS_IMAGES: CityImage[] = [
  {
    src: '/assets/images/lesbos/boat-crossing.jpg',
    width: 1280,
    height: 855,
    altKey: 'boat-crossing',
    credit: { author: 'Mstyslav Chernov/Unframe', license: 'CC BY-SA 4.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0', source: 'https://commons.wikimedia.org/wiki/File:Refugees_on_a_boat_crossing_the_Mediterranean_sea,_heading_from_Turkish_coast_to_the_northeastern_Greek_island_of_Lesbos,_29_January_2016.jpg' },
  },
  {
    src: '/assets/images/lesbos/boats-skala-sykamias.jpg',
    width: 1280,
    height: 366,
    altKey: 'boats-skala-sykamias',
    credit: { author: 'Ggia', license: 'CC BY-SA 4.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0', source: 'https://commons.wikimedia.org/wiki/File:20151029_5boats_with_refugees_arriving_to_Skala_Sykamias_Lesvos_Greece.jpg' },
  },
  {
    src: '/assets/images/lesbos/camp.jpg',
    width: 1280,
    height: 852,
    altKey: 'camp',
    credit: { author: 'L-BBE', license: 'CC BY 3.0', licenseUrl: 'https://creativecommons.org/licenses/by/3.0', source: 'https://commons.wikimedia.org/wiki/File:Lesbos_refugeecamp_-_panoramio.jpg' },
  },
  {
    src: '/assets/images/lesbos/moria-fence.jpg',
    width: 1280,
    height: 720,
    altKey: 'moria-fence',
    credit: { author: 'Cathsign', license: 'CC BY-SA 4.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0', source: 'https://commons.wikimedia.org/wiki/File:Moria_Camp.jpg' },
  },
]

export const CITIES: City[] = [
  {
    slug: 'berlin',
    years: '2015–2016',
    cx: 219.94,
    cy: 133.38,
    type: 'route',
    hasPage: true,
    images: BERLIN_IMAGES,
    stat: { value: 1.3, decimals: 1 },
    lat: 52.52,
    lng: 13.405,
  },
  { slug: 'vienna', years: '2015–2016', cx: 272.93, cy: 197.4, type: 'route', hasPage: true, images: VIENNA_IMAGES, stat: { value: 4 }, lat: 48.2082, lng: 16.3738 },
  { slug: 'sarajevo', years: '2024–2026', cx: 302.96, cy: 267.37, type: 'route', hasPage: true, images: SARAJEVO_IMAGES, stat: { value: 1017 }, lat: 43.8563, lng: 18.4131 },
  { slug: 'bihac', years: '2017–2025', cx: 269.28, cy: 252.21, type: 'route', hasPage: true, images: BIHAC_IMAGES, stat: { value: 6000 }, lat: 44.8169, lng: 15.8708 },
  { slug: 'athen', years: '2015–2016', cx: 379.96, cy: 356.37, type: 'route', hasPage: true, images: ATHENS_IMAGES, stat: { value: 60000 }, lat: 37.9838, lng: 23.7275 },
  { slug: 'lesbos', years: '2015–2020', cx: 410.95, cy: 337.38, type: 'route', hasPage: true, images: LESBOS_IMAGES, stat: { value: 804 }, lat: 39.1067, lng: 26.555 },
  { slug: 'damascus', cx: 545.94, cy: 422.38, type: 'stop', hasPage: false, images: [], video: VIDEO, lat: 33.5138, lng: 36.2765 },
  { slug: 'lampedusa', cx: 236.2, cy: 391.4, type: 'stop', hasPage: false, images: [], video: VIDEO },
  { slug: 'rome', cx: 226.69, cy: 292.38, type: 'stop', hasPage: false, images: [], video: VIDEO },
  { slug: 'budapest', cx: 301.75, cy: 208.17, type: 'stop', hasPage: false, images: [], video: VIDEO },
  { slug: 'prag', cx: 242.15, cy: 170.25, type: 'stop', hasPage: false, images: [], video: VIDEO },
  { slug: 'warsaw', cx: 309.75, cy: 136.17, type: 'stop', hasPage: false, images: [], video: VIDEO },
  { slug: 'evros', cx: 404.75, cy: 310.28, type: 'stop', hasPage: false, images: [], lat: 40.88, lng: 26.17 },
]

export const CHAPTER_ORDER: string[] = ['lesbos', 'athen', 'sarajevo', 'bihac', 'vienna', 'berlin']

export const PAGE_SLUGS: string[] = CITIES.filter(city => city.hasPage).map(city => city.slug)

export function getCity(slug: string): City | undefined {
  return CITIES.find(city => city.slug === slug)
}
