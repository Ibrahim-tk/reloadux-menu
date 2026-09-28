import type { ContentScale } from '../data/nav'
import { SCALE_LIMITS } from '../data/nav'
import type { Variant } from '../variants/types'
import styles from './LabBar.module.css'

type Props = {
  variants: Variant[]
  activeId: string
  onSelect: (id: string) => void
  scale: ContentScale
  onScale: (s: ContentScale) => void
  pinned: boolean
  onPinned: (p: boolean) => void
  theme: 'dark' | 'light'
  onTheme: (t: 'dark' | 'light') => void
  stats: { groups: number; links: number }
}

function Stepper({ label, value, max, onChange }: { label: string; value: number; max: number; onChange: (n: number) => void }) {
  return (
    <div className={styles.stepper} role="group" aria-label={`Extra ${label}`}>
      <button type="button" onClick={() => onChange(Math.max(0, value - 1))} disabled={value === 0} aria-label={`Fewer ${label}`}>
        −
      </button>
      <span className={styles.stepperValue}>
        +{value} <span className={styles.dim}>{label}</span>
      </span>
      <button type="button" onClick={() => onChange(Math.min(max, value + 1))} disabled={value === max} aria-label={`More ${label}`}>
        +
      </button>
    </div>
  )
}

export function LabBar(p: Props) {
  const index = p.variants.findIndex((v) => v.id === p.activeId)
  const active = p.variants[index]
  const step = (d: number) => p.onSelect(p.variants[(index + d + p.variants.length) % p.variants.length].id)
  const set = (k: keyof ContentScale) => (n: number) => p.onScale({ ...p.scale, [k]: n })
  const isBase = !p.scale.links && !p.scale.groups && !p.scale.aside

  return (
    <div className={styles.bar} role="toolbar" aria-label="Mega menu lab">
      <div className={styles.section}>
        <button type="button" className={styles.icon} onClick={() => step(-1)} aria-label="Previous variant" title="Previous  [">
          ‹
        </button>
        <label className={styles.select}>
          <span className={styles.srOnly}>Variant</span>
          <select value={p.activeId} onChange={(e) => p.onSelect(e.target.value)}>
            {p.variants.map((v) => (
              <option key={v.id} value={v.id}>
                {v.id} · {v.name}
              </option>
            ))}
          </select>
          <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden className={styles.selectIcon}>
            <path d="m3 4.5 3 3 3-3" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </label>
        <span className={styles.position}>
          {index + 1}/{p.variants.length}
        </span>
        <button type="button" className={styles.icon} onClick={() => step(1)} aria-label="Next variant" title="Next  ]">
          ›
        </button>
      </div>

      <p className={styles.notes} title={active?.notes}>
        {active?.notes}
      </p>

      <div className={styles.section}>
        <span className={styles.stats}>
          {p.stats.groups} groups · {p.stats.links} links
        </span>
        <Stepper label="links" value={p.scale.links} max={SCALE_LIMITS.links} onChange={set('links')} />
        <Stepper label="groups" value={p.scale.groups} max={SCALE_LIMITS.groups} onChange={set('groups')} />
        <Stepper label="aside" value={p.scale.aside} max={SCALE_LIMITS.aside} onChange={set('aside')} />
        <button type="button" className={styles.text} onClick={() => p.onScale({ links: 0, groups: 0, aside: 0 })} disabled={isBase}>
          Reset
        </button>
        <span className={styles.sep} />
        <button type="button" className={styles.toggle} aria-pressed={p.pinned} onClick={() => p.onPinned(!p.pinned)} title="Pin menu open  P">
          Pin open
        </button>
        <button
          type="button"
          className={styles.toggle}
          aria-pressed={p.theme === 'light'}
          onClick={() => p.onTheme(p.theme === 'dark' ? 'light' : 'dark')}
          title="Toggle theme  T"
        >
          {p.theme === 'dark' ? 'Dark' : 'Light'}
        </button>
      </div>
    </div>
  )
}
