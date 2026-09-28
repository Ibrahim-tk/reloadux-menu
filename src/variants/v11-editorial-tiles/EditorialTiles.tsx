import * as NavigationMenu from '@radix-ui/react-navigation-menu'
import { describe } from '../../data/nav'
import { LogoMark } from '../../shell/Logo'
import { useOverflowHint } from '../../shell/useOverflowHint'
import type { PanelProps } from '../types'
import styles from './EditorialTiles.module.css'

/** Past this many links, descriptions drop out so the menu stays inside the height cap. */
const DESCRIPTION_LIMIT = 40

export function EditorialTiles({ menu }: PanelProps) {
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
                    {g.href ? (
                      <NavigationMenu.Link href={g.href}>
                        {g.title}
                        <svg className={styles.eyebrowArrow} viewBox="0 0 16 16" fill="none" aria-hidden>
                          <path d="M4.5 11.5 11.5 4.5M5.5 4.5h6v6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </NavigationMenu.Link>
                    ) : (
                      g.title
                    )}
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
              <div className={styles.articleRow}>
              <h3 id="ed-articles" className={styles.articlesTitle}>
                Latest articles
              </h3>
              <ul>
                {menu.articles.map((a) => (
                  <li key={a.href}>
                    <NavigationMenu.Link className={styles.tile} href={a.href} aria-label={`${a.type}: ${a.headline}`}>
                      <span className={styles.thumb} aria-hidden>
                        <span className={styles.sheet}>
                          <span className={styles.coverLogo}>
                            <LogoMark />
                          </span>
                          <span className={styles.coverTitle}>{a.label}</span>
                        </span>
                      </span>
                      <span className={styles.tileBody}>
                        <span className={styles.meta}>
                          <span>{a.type}</span>
                          <span className={styles.dot} aria-hidden>
                            •
                          </span>
                          <span>{a.topic}</span>
                        </span>
                        <span className={styles.headline}>{a.headline}</span>
                      </span>
                    </NavigationMenu.Link>
                  </li>
                ))}
              </ul>
              </div>
              {menu.utility && (
                <NavigationMenu.Link className={styles.cta} href={menu.utility.cta.href}>
                  <span className={styles.ctaTitle}>{menu.utility.label}</span>
                  <span className={styles.ctaAction}>
                    {menu.utility.cta.label} <span aria-hidden>→</span>
                  </span>
                </NavigationMenu.Link>
              )}
            </aside>
          )}
        </div>
      </div>
    </div>
  )
}
