export const BASE_PATH = '/emea'

export function asset(path: string): string {
  return `${BASE_PATH}${path.startsWith('/') ? path : `/${path}`}`
}
