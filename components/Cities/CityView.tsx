import type { City } from '@/constants/cities'
import CityArticle from './CityArticle'
import CityMap from './CityMap'

interface CityViewProps {
  city: City
}

export default function CityView({ city }: CityViewProps) {
  return (
    <CityMap city={city}>
      <CityArticle city={city} />
    </CityMap>
  )
}
