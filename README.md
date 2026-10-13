# EMEA Refugees

A bilingual (English and German) site about refugee routes across Europe, built with Next.js App Router, React, TypeScript, Tailwind CSS, next-intl, Framer Motion, and React Three Fiber.

## Requirements

- Node.js
- pnpm 11

## Development

```bash
pnpm install
pnpm dev
```

## Checks

```bash
pnpm lint   # ESLint
pnpm build  # production build
pnpm start  # serve the production build
```

## Project structure

| Folder         | Contents                                                                  |
| -------------- | ------------------------------------------------------------------------- |
| `app/[locale]` | Locale layout, not-found page, and the `(site)` routes                    |
| `components/`  | UI, Layout, Map, Cities, Intro, Terrain, and TerrainMap components        |
| `constants/`   | Cities, regions, causes, sources, and map path data                       |
| `i18n/`        | next-intl routing, request config, and navigation helpers                 |
| `messages/`    | Translation JSON files, one folder per locale                             |
| `utils/`       | `cn`, SEO helpers, pathname normalization, and media-query/motion hooks   |
| `proxy.ts`     | next-intl middleware that handles locale prefixes                         |

## Translations

Locales are defined in `i18n/routing.ts`: `en` (default) and `de`. Every URL carries a locale prefix (`localePrefix: 'always'`).

Messages live in `messages/<locale>/<namespace>.json`. The namespaces are `common`, `map`, `cities`, `mapTest`, `impressum`, and `sources`, and they are loaded in `i18n/request.ts`. Add each new key to both `en` and `de`.

The root layout (`app/[locale]/layout.tsx`) sends only the client-needed namespaces to `NextIntlClientProvider`, selected in `pickClientMessages`. If a client component needs a namespace or key that is not listed there, add it to `pickClientMessages`.

## Content

- `constants/cities.ts` defines each city: `slug`, map position (`cx`, `cy`), `type` (`route` or `stop`), `hasPage`, `images`, optional `video`, `stat`, and `lat`/`lng`. Cities with `hasPage: true` get a page at `/cities/<slug>/`. City names and article text are in `messages/<locale>/cities.json`.
- `constants/regions.ts` defines the terrain regions: heightmap, pixel size, bounds, elevation and exaggeration settings, a marker, and optional points of interest.
- Images are stored with their real `width` and `height`. When you add an image, add its pixel size to the entry.

## Project conventions

- Internal links must keep trailing slashes (`trailingSlash: true` in `next.config.ts`).
- Pages live under `app/[locale]/(site)/`, split into the `(nav)` and `(no-nav)` route groups. Put new routes in the group that matches their navigation.
- Use `cn` from `utils/cn.ts` to compose class names.
- Components are server components by default. Only interactive parts (map, nav, drawers, intro, WebGL terrain) are marked `'use client'`; keep static content such as the city article on the server.

See [`AGENTS.md`](./AGENTS.md) for contributor details.
