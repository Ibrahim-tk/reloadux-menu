import * as NavigationMenu from '@radix-ui/react-navigation-menu'
import { describe } from '../../data/nav'
import type { PanelProps } from '../types'
import { useOverflowHint } from '../../shell/useOverflowHint'
import { Glyph } from '../../components/Glyph'
import styles from './SolutionsServices.module.css'

export function SolutionsServices({ menu }: PanelProps) {
  const columns = [...menu.groups, ...menu.aside]
  const scrollRef = useOverflowHint<HTMLDivElement>()

  return (
    <div className={styles.panel}>
      <div className={styles.card}>
        <div className={styles.scroller} ref={scrollRef}>
        {menu.solutions && (
          <section className={styles.solutions} aria-labelledby="ss-solutions">
            <h3 id="ss-solutions" className={styles.pill}>
              Solutions
            </h3>
            <ul className={styles.solutionList}>
              {menu.solutions.map((s) => (
                <li key={s.href}>
                  <NavigationMenu.Link className={styles.solution} href={s.href}>
                    <span className={styles.tileLg}>
                      <Glyph name={s.glyph} size={24} />
                    </span>
                    <span className={styles.solutionText}>
                      <span className={styles.solutionTitle}>{s.title}</span>
                      <span className={styles.solutionSub}>{s.subtitle}</span>
                      <span className={styles.solutionBody}>{s.description}</span>
                    </span>
                  </NavigationMenu.Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className={styles.services} aria-labelledby="ss-services">
          <h3 id="ss-services" className={styles.pill}>
            Services
          </h3>
          <div className={styles.columns}>
            {columns.map((g) => (
              <section key={g.id} aria-labelledby={`ss-${g.id}`}>
                <h4 id={`ss-${g.id}`} className={styles.groupTitle}>
                  {g.href ? <NavigationMenu.Link href={g.href}>{g.title}</NavigationMenu.Link> : g.title}
                </h4>
                <ul className={styles.items}>
                  {g.links.map((l, i) => {
                    const desc = describe(l.label)
                    return (
                      <li key={`${l.href}-${i}`}>
                        <NavigationMenu.Link className={styles.item} href={l.href}>
                          <span className={styles.tile}>
                            <Glyph seed={l.label} />
                          </span>
                          <span className={styles.itemText}>
                            <span className={styles.itemTitle}>{l.label}</span>
                            {desc && <span className={styles.itemDesc}>{desc}</span>}
                          </span>
                        </NavigationMenu.Link>
                      </li>
                    )
                  })}
                </ul>
              </section>
            ))}
          </div>
        </section>
        </div>
      </div>
    </div>
  )
}
