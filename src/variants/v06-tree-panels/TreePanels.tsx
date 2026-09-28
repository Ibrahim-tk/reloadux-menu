import * as NavigationMenu from '@radix-ui/react-navigation-menu'
import { Glyph } from '../../components/Glyph'
import { describe, type NavGroup } from '../../data/nav'
import { useOverflowHint } from '../../shell/useOverflowHint'
import type { PanelProps } from '../types'
import styles from './TreePanels.module.css'

/** Parent link with its children hanging off a connector line. */
function Tree({ group }: { group: NavGroup }) {
  const parent = (
    <>
      <Glyph seed={group.title} size={16} />
      <span className={styles.label}>{group.title}</span>
    </>
  )
  return (
    <li className={styles.tree}>
      {group.href ? (
        <NavigationMenu.Link className={styles.treeParent} href={group.href}>
          {parent}
        </NavigationMenu.Link>
      ) : (
        <span className={styles.treeParent}>{parent}</span>
      )}
      <ul className={styles.treeChildren}>
        {group.links.map((l, i) => (
          <li key={`${l.href}-${i}`}>
            <NavigationMenu.Link className={styles.treeLink} href={l.href}>
              <span className={styles.label}>{l.label}</span>
            </NavigationMenu.Link>
          </li>
        ))}
      </ul>
    </li>
  )
}

export function TreePanels({ menu }: PanelProps) {
  const leftRef = useOverflowHint<HTMLDivElement>()
  const rightRef = useOverflowHint<HTMLDivElement>()
  const promo = menu.promos?.[0]

  return (
    <div className={styles.panel}>
      <div className={styles.frame}>
        {/* Left card: overview promo + nested (tree) lists for the secondary sections */}
        <div className={styles.card} ref={leftRef}>
          {promo && (
            <NavigationMenu.Link className={styles.promo} href={promo.href}>
              <span className={styles.promoTitle}>{promo.title}</span>
              <span className={styles.promoBody}>{promo.description}</span>
            </NavigationMenu.Link>
          )}
          <p className={styles.caption}>Industries &amp; more</p>
          <ul className={styles.trees}>
            {menu.aside.map((g) => (
              <Tree key={g.id} group={g} />
            ))}
          </ul>
        </div>

        {/* Right card: one column per service group */}
        <div className={styles.cardMain}>
          <div className={styles.groupsScroll} ref={rightRef}>
            <div className={styles.groups}>
              {menu.groups.map((g) => (
                <section key={g.id} className={styles.group}>
                  <NavigationMenu.Link className={styles.groupHead} href={g.href ?? '#'}>
                    <span className={styles.groupIcon}>
                      <Glyph seed={g.title} size={18} />
                    </span>
                    <span className={styles.groupText}>
                      <span className={styles.groupTitle}>{g.title}</span>
                      {describe(g.title) && <span className={styles.groupDesc}>{describe(g.title)}</span>}
                    </span>
                  </NavigationMenu.Link>
                  <ul className={styles.links}>
                    {g.links.map((l, i) => (
                      <li key={`${l.href}-${i}`}>
                        <NavigationMenu.Link className={styles.link} href={l.href}>
                          <Glyph seed={l.label} size={14} />
                          <span className={styles.label}>{l.label}</span>
                        </NavigationMenu.Link>
                      </li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>
          </div>

          {menu.announcement && (
            <NavigationMenu.Link className={styles.announce} href={menu.announcement.href}>
              <span className={styles.tag}>{menu.announcement.tag}</span>
              <span className={styles.announceText}>
                <span className={styles.label}>{menu.announcement.title}</span>
                <span className={styles.announceDesc}>{menu.announcement.description}</span>
              </span>
            </NavigationMenu.Link>
          )}
        </div>
      </div>
    </div>
  )
}
