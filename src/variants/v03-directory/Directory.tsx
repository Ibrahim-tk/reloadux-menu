import * as NavigationMenu from '@radix-ui/react-navigation-menu'
import type { PanelProps } from '../types'
import { useOverflowHint } from '../../shell/useOverflowHint'
import styles from './Directory.module.css'

export function Directory({ menu }: PanelProps) {
  const scrollRef = useOverflowHint<HTMLDivElement>({ bottomOnly: true })

  return (
    <div className={styles.panel} ref={scrollRef}>
      <div className={styles.inner}>
        <div className={styles.columns}>
          {menu.groups.map((g) => (
            <section key={g.id} className={styles.block}>
              <h3 className={styles.blockTitle}>
                {g.href ? <NavigationMenu.Link href={g.href}>{g.title}</NavigationMenu.Link> : g.title}
              </h3>
              <ul>
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

        {menu.aside.length > 0 && (
          <div className={styles.strip}>
            {menu.aside.map((s) => (
              <section key={s.id} className={styles.stripRow}>
                <h3 className={styles.stripTitle}>{s.title}</h3>
                <ul className={styles.chips}>
                  {s.links.map((l, i) => (
                    <li key={`${l.href}-${i}`}>
                      <NavigationMenu.Link className={styles.chip} href={l.href}>
                        {l.label}
                      </NavigationMenu.Link>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
