import * as NavigationMenu from '@radix-ui/react-navigation-menu'
import { useState } from 'react'
import { describe } from '../../data/nav'
import { useHoverIntent } from '../../shell/useHoverIntent'
import { useOverflowHint } from '../../shell/useOverflowHint'
import type { PanelProps } from '../types'
import styles from './Index.module.css'

export function Index({ menu }: PanelProps) {
  const all = [...menu.groups, ...menu.aside]
  const [activeId, setActiveId] = useState(all[0]?.id)
  const active = all.find((g) => g.id === activeId) ?? all[0]
  const intent = useHoverIntent()
  const listRef = useOverflowHint<HTMLOListElement>()
  const previewRef = useOverflowHint<HTMLDivElement>()
  // Fewer categories → bigger type. Keeps the index inside the height cap.
  const size = all.length > 8 ? 'sm' : all.length > 5 ? 'md' : 'lg'

  return (
    <div className={styles.panel}>
      <div className={styles.inner}>
        <ol className={styles.index} data-size={size} ref={listRef}>
          {all.map((g) => (
            <li key={g.id}>
              <NavigationMenu.Link
                className={styles.row}
                href={g.href}
                data-active={g.id === active.id || undefined}
                {...intent(() => setActiveId(g.id))}
              >
                <span className={styles.title}>{g.title}</span>
                <span className={styles.arrow} aria-hidden>
                  →
                </span>
              </NavigationMenu.Link>
            </li>
          ))}
        </ol>

        {/* All previews stay in the DOM for crawlers; only the active one shows. */}
        <div className={styles.preview} ref={previewRef}>
          {all.map((g) => (
            <section key={g.id} className={styles.pane} data-active={g.id === active.id || undefined}>
              {describe(g.title) && <p className={styles.desc}>{describe(g.title)}</p>}
              <ul className={styles.links}>
                {g.links.map((l, j) => (
                  <li key={`${l.href}-${j}`}>
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
