'use client'

import { useCallback, useEffect, useRef, useState, type RefObject } from 'react'
import type { MapAspect } from './use-map-aspect'

export interface MapView {
  x: number
  y: number
  zoom: number
}

interface Options {
  container: RefObject<HTMLDivElement | null>
  start: MapView
  baseWidth: number
  baseHeight: number
  aspect: MapAspect
  reducedMotion: boolean
  onFrame: () => void
}

const Y_STRETCH = 1.07
const DOTS = { left: 212.02, right: 545.94, top: 133.38, bottom: 422.38 }
const MIN_ZOOM = 1
const MAX_ZOOM_FACTOR = 4
const DRAG_THRESHOLD = 4
const WHEEL_STEP = 0.0035
const PINCH_STEP = 0.01
const RESET_MS = 500
const LOG_IDLE_MS = 200
const DOT_RADIUS_PX = 4

export function viewBoxFor(view: MapView, baseWidth: number, baseHeight: number) {
  const width = baseWidth / view.zoom
  const height = baseHeight / view.zoom
  return [view.x - width / 2, view.y - height / 2, width, height].map(value => Math.round(value * 100) / 100).join(' ')
}

const clampValue = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))

const sameView = (a: MapView, b: MapView) => Math.abs(a.x - b.x) < 0.01 && Math.abs(a.y - b.y) < 0.01 && Math.abs(a.zoom - b.zoom) < 0.0001

export function useMapView({ container, start, baseWidth, baseHeight, aspect, reducedMotion, onFrame }: Options) {
  const [moved, setMoved] = useState(false)
  const [dragging, setDragging] = useState(false)
  const view = useRef<MapView>(start)
  const frame = useRef(0)
  const animation = useRef(0)
  const resetRef = useRef<() => void>(() => undefined)
  const onFrameRef = useRef(onFrame)

  useEffect(() => {
    onFrameRef.current = onFrame
  }, [onFrame])

  useEffect(() => {
    const root = container.current
    const svg = root?.querySelector<SVGSVGElement>(':scope > svg')
    if (!root || !svg) return

    const size = () => {
      const rect = root.getBoundingClientRect()
      return { width: rect.width, height: rect.height, left: rect.left, top: rect.top }
    }

    const fit = (width: number, height: number) => (aspect === 'xMidYMid slice' ? Math.max(width / baseWidth, height / baseHeight) : Math.min(width / baseWidth, height / baseHeight))

    const clamp = (next: MapView): MapView => ({
      zoom: next.zoom,
      x: clampValue(next.x, DOTS.left, DOTS.right),
      y: clampValue(next.y, DOTS.top, DOTS.bottom),
    })

    let logTimer = 0

    const logView = () => {
      if (process.env.NODE_ENV === 'production') return
      const { x, y, zoom } = view.current
      console.log(`const MAP_CENTER = { x: ${Math.round(x)}, y: ${Math.round(y)} }\nconst MAP_ZOOM = ${zoom.toFixed(2)}`)
    }

    const logViewSoon = () => {
      clearTimeout(logTimer)
      logTimer = window.setTimeout(logView, LOG_IDLE_MS)
    }

    const syncDotRadius = () => {
      const { width, height } = size()
      if (!width || !height) return
      svg.style.setProperty('--dot-r', String(DOT_RADIUS_PX / (view.current.zoom * fit(width, height))))
    }

    const apply = () => {
      frame.current = 0
      svg.setAttribute('viewBox', viewBoxFor(view.current, baseWidth, baseHeight))
      syncDotRadius()
      onFrameRef.current()
      setMoved(!sameView(view.current, start))
    }

    const schedule = () => {
      if (!frame.current) frame.current = requestAnimationFrame(apply)
    }

    const stopAnimation = () => {
      cancelAnimationFrame(animation.current)
      animation.current = 0
    }

    const reset = () => {
      stopAnimation()
      if (reducedMotion) {
        view.current = start
        schedule()
        logView()
        return
      }
      const from = view.current
      const begin = performance.now()
      const step = (now: number) => {
        const progress = Math.min(1, (now - begin) / RESET_MS)
        const eased = 1 - Math.pow(1 - progress, 3)
        view.current = {
          x: from.x + (start.x - from.x) * eased,
          y: from.y + (start.y - from.y) * eased,
          zoom: from.zoom + (start.zoom - from.zoom) * eased,
        }
        schedule()
        animation.current = progress < 1 ? requestAnimationFrame(step) : 0
        if (progress === 1) logView()
      }
      animation.current = requestAnimationFrame(step)
    }

    const inMapLayer = (target: EventTarget | null) => {
      if (!(target instanceof Element)) return false
      return target === root || svg.contains(target) || target.closest('[data-map-layer]') !== null
    }

    let drag: { id: number; x: number; y: number; origin: MapView; active: boolean } | null = null

    const swallowClick = (event: MouseEvent) => {
      event.stopPropagation()
      event.preventDefault()
    }

    const onMove = (event: PointerEvent) => {
      if (!drag || event.pointerId !== drag.id) return
      const dx = event.clientX - drag.x
      const dy = event.clientY - drag.y
      if (!drag.active) {
        if (Math.hypot(dx, dy) < DRAG_THRESHOLD) return
        drag.active = true
        stopAnimation()
        setDragging(true)
      }
      const { width, height } = size()
      const scale = drag.origin.zoom * fit(width, height)
      view.current = clamp({ zoom: drag.origin.zoom, x: drag.origin.x - dx / scale, y: drag.origin.y - dy / (scale * Y_STRETCH) })
      schedule()
    }

    const onEnd = (event: PointerEvent) => {
      if (!drag || event.pointerId !== drag.id) return
      const wasActive = drag.active
      drag = null
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onEnd)
      window.removeEventListener('pointercancel', onEnd)
      if (!wasActive) return
      setDragging(false)
      if (event.type === 'pointerup') logView()
      if (event.type === 'pointerup') {
        window.addEventListener('click', swallowClick, true)
        setTimeout(() => window.removeEventListener('click', swallowClick, true), 0)
      }
    }

    const onDown = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse' || event.button !== 0 || drag || !inMapLayer(event.target)) return
      drag = { id: event.pointerId, x: event.clientX, y: event.clientY, origin: view.current, active: false }
      window.addEventListener('pointermove', onMove)
      window.addEventListener('pointerup', onEnd)
      window.addEventListener('pointercancel', onEnd)
    }

    const onWheel = (event: WheelEvent) => {
      if (!event.ctrlKey && !event.metaKey) return
      event.preventDefault()
      stopAnimation()
      logViewSoon()
      const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? 400 : 1
      const delta = clampValue(event.deltaY * unit, -120, 120)
      const pinch = event.ctrlKey && event.deltaMode === 0 && Math.abs(event.deltaY) < 50
      const factor = Math.exp(-delta * (pinch ? PINCH_STEP : WHEEL_STEP))
      const { width, height, left, top } = size()
      if (!width || !height) return
      const k = fit(width, height)
      const current = view.current
      const zoom = clampValue(current.zoom * factor, MIN_ZOOM, start.zoom * MAX_ZOOM_FACTOR)
      const offsetX = event.clientX - left - width / 2
      const offsetY = event.clientY - top - height / 2
      const before = current.zoom * k
      const after = zoom * k
      view.current = clamp(
        factor < 1
          ? { zoom, x: current.x, y: current.y }
          : {
              zoom,
              x: current.x + offsetX / before - offsetX / after,
              y: current.y + offsetY / (before * Y_STRETCH) - offsetY / (after * Y_STRETCH),
            },
      )
      schedule()
    }

    const onDragStart = (event: DragEvent) => event.preventDefault()

    const onResize = () => {
      if (!sameView(view.current, start)) view.current = clamp(view.current)
      schedule()
    }

    resetRef.current = reset

    root.addEventListener('pointerdown', onDown)
    root.addEventListener('wheel', onWheel, { passive: false })
    root.addEventListener('dragstart', onDragStart)
    window.addEventListener('resize', onResize)
    onResize()
    syncDotRadius()
    schedule()

    return () => {
      root.removeEventListener('pointerdown', onDown)
      root.removeEventListener('wheel', onWheel)
      root.removeEventListener('dragstart', onDragStart)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onEnd)
      window.removeEventListener('pointercancel', onEnd)
      cancelAnimationFrame(frame.current)
      frame.current = 0
      clearTimeout(logTimer)
      stopAnimation()
    }
  }, [container, start, baseWidth, baseHeight, aspect, reducedMotion])

  const resetView = useCallback(() => resetRef.current(), [])

  return { moved, dragging, resetView }
}
