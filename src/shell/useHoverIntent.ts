import { useEffect, useRef } from 'react'

/**
 * Pointer hover waits `delay` ms before firing, so sweeping across items on the
 * way to their content doesn't flip the preview. Keyboard focus fires at once.
 */
export function useHoverIntent(delay = 110) {
  const timer = useRef<number>(undefined)
  useEffect(() => () => window.clearTimeout(timer.current), [])

  return (fire: () => void) => ({
    onPointerEnter: () => {
      window.clearTimeout(timer.current)
      timer.current = window.setTimeout(fire, delay)
    },
    onPointerLeave: () => window.clearTimeout(timer.current),
    onFocus: fire,
  })
}
