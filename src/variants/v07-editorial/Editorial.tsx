import * as NavigationMenu from '@radix-ui/react-navigation-menu'
import { describe } from '../../data/nav'
import { LogoMark } from '../../shell/Logo'
import { useOverflowHint } from '../../shell/useOverflowHint'
import type { PanelProps } from '../types'
import styles from './Editorial.module.css'

/** Past this many links, descriptions drop out so the menu stays inside the height cap. */
const DESCRIPTION_LIMIT = 40

export function Editorial({ menu }: PanelProps) {
  const mainRef = useOverflowHint<HTMLDivElement>()
  const railRef = useOverflowHint<HTMLElement>()
  const columns = [...menu.groups, ...menu.aside]
  const total = columns.reduce((n, g) => n + g.links.length, 0)
  const showDesc = total <= DESCRIPTION_LIMIT

  return (
    <div className={styles.panel}>
      <div className={styles.card}>
        <div className={styles.layout}>
          {/* Links and articles scroll independently so both stay inside the height cap. */}
          <div className={styles.main} ref={mainRef}>
            <div className={styles.columns} data-desc={showDesc || undefined}>
              {columns.map((g) => (
                <section key={g.id} className={styles.block} aria-labelledby={`ed-${g.id}`}>
                  <h3 id={`ed-${g.id}`} className={styles.eyebrow}>
                    {g.href ? <NavigationMenu.Link href={g.href}>{g.title}</NavigationMenu.Link> : g.title}
                  </h3>
                  <ul>
                    {g.links.map((l, i) => {
                      const desc = showDesc ? describe(l.label) : undefined
                      return (
                        <li key={`${l.href}-${i}`}>
                          <NavigationMenu.Link className={styles.item} href={l.href}>
                            <span className={styles.itemTitle}>{l.label}</span>
                            {desc && <span className={styles.itemDesc}>{desc}</span>}
                          </NavigationMenu.Link>
                        </li>
                      )
                    })}
                  </ul>
                </section>
              ))}
            </div>
          </div>

          {menu.articles && (
            <aside className={styles.articles} aria-labelledby="ed-articles" ref={railRef}>
              <h3 id="ed-articles" className={styles.articlesTitle}>
                Latest articles
              </h3>
              <ul>
                {menu.articles.map((a) => (
                  <li key={a.href}>
                    <NavigationMenu.Link className={styles.article} href={a.href} aria-label={`${a.kicker}: ${a.label}`}>
                      <span className={styles.cover} aria-hidden>
                        <span className={styles.sheet}>
                          <span className={styles.coverLogo}>
                            <LogoMark />
                          </span>
                          <span className={styles.kicker}>{a.kicker}</span>
                          <span className={styles.coverTitle}>{a.label}</span>
                        </span>
                      </span>
                      <span className={styles.meta}>
                        <span>{a.type}</span>
                        <span className={styles.dot} aria-hidden>
                          •
                        </span>
                        <span>{a.topic}</span>
                      </span>
                    </NavigationMenu.Link>
                  </li>
                ))}
              </ul>
            </aside>
          )}
        </div>
      </div>
    </div>
  )
}
