import * as NavigationMenu from '@radix-ui/react-navigation-menu'
import type { NavGroup } from '../../data/nav'
import type { PanelProps } from '../types'
import { useOverflowHint } from '../../shell/useOverflowHint'
import styles from './ClassicGrid.module.css'

function MenuLink({ label, href }: { label: string; href: string }) {
  return (
    <NavigationMenu.Link className={styles.link} href={href}>
      {label}
    </NavigationMenu.Link>
  )
}

function Group({ group }: { group: NavGroup }) {
  return (
    <section className={styles.group} aria-labelledby={`g-${group.id}`}>
      <h3 id={`g-${group.id}`} className={styles.groupTitle}>
        {group.href ? <a href={group.href}>{group.title}</a> : group.title}
      </h3>
      <ul className={styles.columns}>
        {group.links.map((l, i) => (
          <li key={`${l.href}-${i}`}>
            <MenuLink {...l} />
          </li>
        ))}
      </ul>
    </section>
  )
}

export function ClassicGrid({ menu }: PanelProps) {
  const scrollRef = useOverflowHint<HTMLDivElement>()
  return (
    <div className={styles.panel} ref={scrollRef}>
      <div className={styles.inner}>
        <div className={styles.main}>
          {menu.groups.map((g) => (
            <Group key={g.id} group={g} />
          ))}
        </div>

        <aside className={styles.aside}>
          {menu.aside.map((section) => (
            <section key={section.id} className={styles.asideSection} aria-labelledby={`a-${section.id}`}>
              <h3 id={`a-${section.id}`} className={styles.asideTitle}>
                {section.title}
              </h3>
              <ul className={styles.asideList}>
                {section.links.map((l, i) => (
                  <li key={`${l.href}-${i}`}>
                    <MenuLink {...l} />
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </aside>
      </div>
    </div>
  )
}
