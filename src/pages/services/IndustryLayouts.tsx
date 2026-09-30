import { useEffect, useRef, useState } from 'react'
import type { Category } from './ServicesPage'
import styles from './IndustryLayouts.module.css'

// Per-industry images, keyed by file name; industries without one use the placeholder.
const industryImages = import.meta.glob<string>('../../assets/industries/*', { eager: true, import: 'default' })

/** The industry's own image, or the placeholder (flagged so its baked-in corners get cropped). */
function IndustryImage({ category, fallback }: { category: Category; fallback: string }) {
  const own = category.image ? industryImages[`../../assets/industries/${category.image}`] : undefined
  return <img src={own ?? fallback} data-placeholder={own ? undefined : ''} alt="" loading="lazy" />
}

type Props = { categories: Category[]; image: string }

const LAYOUTS = [
  { id: 'split', name: 'A · Alternating split' },
  { id: 'sticky', name: 'B · Sticky index' },
] as const
type LayoutId = (typeof LAYOUTS)[number]['id']

/** A — text and a big image side by side, swapping sides each section. */
function Split({ categories, image }: Props) {
  return (
    <>
      {categories.map((c, i) => (
        <section key={c.id} className={styles.split} data-flip={i % 2 === 1 || undefined} aria-labelledby={`ind-${c.id}`}>
          <div className={styles.splitText}>
            <h2 id={`ind-${c.id}`} className={styles.label}>
              <a href={c.href}>{c.title}</a>
            </h2>
            <p className={styles.headline}>{c.summary}</p>
            <a className={styles.ghost} href={c.href}>
              <span className={styles.ghostText}>Explore {c.title}</span>
              <span className={styles.ghostArrow} aria-hidden>
                →
              </span>
            </a>
          </div>
          <a className={styles.splitMedia} href={c.href} tabIndex={-1} aria-hidden>
            <IndustryImage category={c} fallback={image} />
          </a>
        </section>
      ))}
    </>
  )
}

/** B — big serif index pinned on the left; images scroll past on the right and light up their name. */
function Sticky({ categories, image }: Props) {
  const [active, setActive] = useState(categories[0]?.id)
  const refs = useRef<Record<string, HTMLElement | null>>({})

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id.replace('pane-', ''))),
      { rootMargin: '-45% 0px -45% 0px' },
    )
    Object.values(refs.current).forEach((el) => el && io.observe(el))
    return () => io.disconnect()
  }, [categories])

  return (
    <div className={styles.sticky}>
      <nav className={styles.index} aria-label="Industries">
        <ol>
          {categories.map((c) => (
            <li key={c.id}>
              <a href={`#pane-${c.id}`} className={styles.indexLink} data-active={c.id === active || undefined}>
                {c.title}
              </a>
            </li>
          ))}
        </ol>
      </nav>
      <div className={styles.panes}>
        {categories.map((c) => (
          <section key={c.id} id={`pane-${c.id}`} ref={(el) => void (refs.current[c.id] = el)} className={styles.pane} aria-labelledby={`st-${c.id}`}>
            <a className={styles.paneMedia} href={c.href} tabIndex={-1} aria-hidden>
              <IndustryImage category={c} fallback={image} />
            </a>
            {/* The pinned index shows the name; keep a heading for screen readers and SEO. */}
            <h2 id={`st-${c.id}`} className={styles.srOnly}>
              {c.title}
            </h2>
            <p className={styles.headline}>{c.summary}</p>
            <a className={styles.ghost} href={c.href}>
              <span className={styles.ghostText}>Explore {c.title}</span>
              <span className={styles.ghostArrow} aria-hidden>
                →
              </span>
            </a>
          </section>
        ))}
      </div>
    </div>
  )
}

/** A prototype toggle kept in the URL (?key=value) so each combination can be shared. */
export function useSwitch<T extends string>(key: string, values: readonly T[], enabled = true) {
  const [value, setValue] = useState<T>(() => {
    const q = new URLSearchParams(location.search).get(key) as T | null
    return q && values.includes(q) ? q : values[0]
  })
  useEffect(() => {
    if (!enabled) return
    const url = new URL(location.href)
    url.searchParams.set(key, value)
    history.replaceState(null, '', url)
  }, [key, value, enabled])
  return [value, setValue] as const
}

/** Floating pill bar: page-specific layout options, then Light / Dark for the sections. */
export function PageSwitcher({
  label,
  options,
  value,
  onChange,
}: {
  label: string
  options: { id: string; name: string }[]
  value: string
  onChange: (id: string) => void
}) {
  const [tone, setTone] = useSwitch('tone', ['dark', 'light'] as const)

  // The light sections read this to flip to their dark palette.
  useEffect(() => {
    document.documentElement.dataset.tone = tone
    return () => {
      delete document.documentElement.dataset.tone
    }
  }, [tone])

  return (
    <div className={styles.switcher} role="radiogroup" aria-label={label}>
      {options.map((o) => (
        <button key={o.id} type="button" role="radio" aria-checked={o.id === value} onClick={() => onChange(o.id)}>
          {o.name}
        </button>
      ))}
      <hr aria-hidden />
      {(['dark', 'light'] as const).map((t) => (
        <button key={t} type="button" role="radio" aria-checked={t === tone} onClick={() => setTone(t)}>
          {t === 'light' ? 'Light' : 'Dark'}
        </button>
      ))}
    </div>
  )
}

/** Candidate layouts for the industries section, switchable from the pill bar (?layout=). */
export function IndustryLayouts(props: Props) {
  const [layout, setLayout] = useSwitch('layout', LAYOUTS.map((l) => l.id))

  return (
    <>
      {layout === 'split' && <Split {...props} />}
      {layout === 'sticky' && <Sticky {...props} />}
      <PageSwitcher label="Industries layout" options={[...LAYOUTS]} value={layout} onChange={(v) => setLayout(v as LayoutId)} />
    </>
  )
}
