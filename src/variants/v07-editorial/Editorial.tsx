import * as NavigationMenu from '@radix-ui/react-navigation-menu'
import workThumb from '../../assets/work-eminnt.png'
import { useOverflowHint } from '../../shell/useOverflowHint'
import type { PanelProps } from '../types'
import styles from './Editorial.module.css'

export function Editorial({ menu }: PanelProps) {
  const mainRef = useOverflowHint<HTMLDivElement>()
  const railRef = useOverflowHint<HTMLElement>()
  const columns = [...menu.groups, ...menu.aside]

  return (
    <div className={styles.panel}>
      <div className={styles.card}>
        <div className={styles.layout}>
          {/* Links and articles scroll independently so both stay inside the height cap. */}
          <div className={styles.main} ref={mainRef}>
            <div className={styles.columns}>
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
                    {g.links.map((l, i) => (
                      <li key={`${l.href}-${i}`}>
                        <NavigationMenu.Link className={styles.item} href={l.href}>
                          <span className={styles.itemTitle}>{l.label}</span>
                        </NavigationMenu.Link>
                      </li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>
          </div>

          <aside className={styles.articles} aria-label="Featured work and contact" ref={railRef}>
            {menu.featuredWork && (
              <div className={styles.articleRow}>
                <h3 className={styles.articlesTitle}>Featured work</h3>
                <NavigationMenu.Link className={styles.article} href={menu.featuredWork.href}>
                  <span className={styles.workThumb}>
                    <img src={workThumb} alt="" loading="lazy" />
                  </span>
                  <span className={`${styles.headline} ${styles.headlineFull}`}>{menu.featuredWork.label}</span>
                </NavigationMenu.Link>
              </div>
            )}
            {menu.ctaHeading && (
              <div className={styles.cta}>
                <p className={styles.ctaTitle}>{menu.ctaHeading}</p>
                <div className={styles.ctaActions}>
                  {menu.ctaPrimary && (
                    <NavigationMenu.Link className={styles.ctaButton} href={menu.ctaPrimary.href}>
                      {menu.ctaPrimary.label}
                    </NavigationMenu.Link>
                  )}
                </div>
                {menu.viewAll && (
                  <NavigationMenu.Link className={styles.ctaTextLink} href={menu.viewAll.href}>
                    View all services <span aria-hidden>→</span>
                  </NavigationMenu.Link>
                )}
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  )
}
