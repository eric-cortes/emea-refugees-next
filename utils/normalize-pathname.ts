export const normalizePathname = (pathname: string | null) => {
  if (!pathname || pathname === '/') {
    return '/'
  }

  return pathname.replace(/\/$/, '')
}
