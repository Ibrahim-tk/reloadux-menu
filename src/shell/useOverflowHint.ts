import { useEffect, useLayoutEffect, useRef } from 'react'

/**
 * Marks a scroll container with data-fade="top|bottom|both|none" so global CSS can
 * fade the clipped edge — the cue that a height-capped menu has more below.
 */
export function useOverflowHint<T extends HTMLElement>({ bottomOnly = false } = {}) {
  const ref = useRef<T>(null)

  const update = () => {
    const el = ref.current
    if (!el) return
    const top = !bottomOnly && el.scrollTop > 2
    const bottom = el.scrollTop + el.clientHeight < el.scrollHeight - 2
    el.dataset.fade = top && bottom ? 'both' : top ? 'top' : bottom ? 'bottom' : 'none'
  }

  // Content changes (Lab bar scale, search) re-render the variant; re-measure each time.
  useLayoutEffect(update)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    el.addEventListener('scroll', update, { passive: true })
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => {
      el.removeEventListener('scroll', update)
      ro.disconnect()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return ref
}
