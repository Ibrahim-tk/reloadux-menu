import * as NavigationMenu from '@radix-ui/react-navigation-menu'
import { useEffect, useRef, useState } from 'react'
import type { NavGroup } from '../../data/nav'
import type { PanelProps } from '../types'
import { useOverflowHint } from '../../shell/useOverflowHint'
import styles from './CategoryRail.module.css'

/** Hover preview waits briefly so a diagonal move toward the pane doesn't flip categories. */
const HOVER_INTENT_MS = 110

function RailItem({ group, active, onPreview }: { group: NavGroup; active: boolean; onPreview: () => void }) {
  const timer = useRef<number>(undefined)
  const cancel = () => window.clearTimeout(timer.current)
  useEffect(() => cancel, [])

  const inner = (
    <>
      <span className={styles.railText}>{group.title}</span>
      <span className={styles.go} aria-hidden>
        →
      </span>
    </>
  )
  const handlers = {
    onPointerEnter: () => {
      cancel()
      timer.current = window.setTimeout(onPreview, HOVER_INTENT_MS)
    },
    onPointerLeave: cancel,
    onFocus: onPreview,
    'data-active': active || undefined,
    'aria-current': active ? ('true' as const) : undefined,
  }

  return (
    <li>
      {group.href ? (
        // The category is a real page: hover/focus previews it, click opens it.
        <NavigationMenu.Link className={styles.railItem} href={group.href} {...handlers}>
          {inner}
        </NavigationMenu.Link>
      ) : (
        <button type="button" className={styles.railItem} onClick={onPreview} {...handlers}>
          {inner}
        </button>
      )}
    </li>
  )
}

export function CategoryRail({ menu }: PanelProps) {
  const all = [...menu.groups, ...menu.aside]
  const [activeId, setActiveId] = useState(all[0]?.id)
  const active = all.find((g) => g.id === activeId) ?? all[0]
  const railRef = useOverflowHint<HTMLElement>()
  const stageRef = useOverflowHint<HTMLDivElement>()

  return (
    <div className={styles.panel}>
      <div className={styles.inner}>
        <nav className={styles.rail} aria-label="Service categories" ref={railRef}>
          <p className={styles.railLabel}>Services</p>
          <ul>
            {menu.groups.map((g) => (
              <RailItem key={g.id} group={g} active={g.id === active.id} onPreview={() => setActiveId(g.id)} />
            ))}
          </ul>
          {menu.aside.length > 0 && (
            <>
              <p className={styles.railLabel}>Explore</p>
              <ul>
                {menu.aside.map((g) => (
                  <RailItem key={g.id} group={g} active={g.id === active.id} onPreview={() => setActiveId(g.id)} />
                ))}
              </ul>
            </>
          )}
        </nav>

        {/* Every panel stays in the DOM so all links remain crawlable; only the active one is shown. */}
        <div className={styles.stage} ref={stageRef}>
          {all.map((g) => (
            <section key={g.id} id={`rail-${g.id}`} className={styles.pane} data-active={g.id === active.id || undefined}>
              <header className={styles.paneHead}>
                <h3 className={styles.paneTitle}>
                  {g.href ? (
                    <NavigationMenu.Link className={styles.titleLink} href={g.href}>
                      <span className={styles.titleText}>{g.title}</span>
                      <svg className={styles.arrow} viewBox="0 0 16 16" fill="none" aria-hidden>
                        <path d="M4.5 11.5 11.5 4.5M5.5 4.5h6v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </NavigationMenu.Link>
                  ) : (
                    g.title
                  )}
                </h3>
              </header>
              <ul className={styles.links}>
                {g.links.map((l, i) => (
                  <li key={`${l.href}-${i}`}>
                    <NavigationMenu.Link className={styles.link} href={l.href}>
                      {l.label}
                    </NavigationMenu.Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </div>
  )
}
