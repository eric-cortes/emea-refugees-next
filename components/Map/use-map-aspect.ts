import { useEffect, useState } from 'react'

export type MapAspect = 'xMidYMid slice' | 'xMidYMid meet'

export function useMapAspect(): MapAspect {
  const [aspect, setAspect] = useState<MapAspect>('xMidYMid slice')

  useEffect(() => {
    const query = window.matchMedia('(orientation: portrait)')
    const update = () => setAspect(query.matches ? 'xMidYMid meet' : 'xMidYMid slice')
    update()
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [])

  return aspect
}
