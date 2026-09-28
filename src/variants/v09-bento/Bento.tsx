import * as NavigationMenu from '@radix-ui/react-navigation-menu'
import { useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import type { NavGroup } from '../../data/nav'
import { useOverflowHint } from '../../shell/useOverflowHint'
import type { PanelProps } from '../types'
import styles from './Bento.module.css'

/** Links shown before a tile collapses the rest behind "+N more". All stay in the DOM. */
const TILE_LIMIT = 9
/** Must match --unit in Bento.module.css. */
const UNIT = 4
const GAP = 8

/** Masonry: measure the tile's content and span exactly that many 4px grid rows. */
function Tile({ className, children, as = 'section', href }: { className: string; children: ReactNode; as?: 'section' | 'a'; href?: string }) {
  const inner = useRef<HTMLDivElement>(null)
  const [span, setSpan] = useState(1)
  useLayoutEffect(() => {
    const el = inner.current
    if (!el) return
    const measure = () => setSpan(Math.ceil((el.offsetHeight + GAP) / UNIT))
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])
  const style = { gridRowEnd: `span ${span}` }
  const body = (
    <div ref={inner} className={styles.tileInner}>
      {children}
    </div>
  )
  return as === 'a' ? (
    <NavigationMenu.Link className={className} href={href} style={style}>
      {body}
    </NavigationMenu.Link>
  ) : (
    <section className={className} style={style}>
      {body}
    </section>
  )
}

function GroupTile({ group, chips }: { group: NavGroup; chips?: boolean }) {
  const [open, setOpen] = useState(false)
  const overflow = chips ? 0 : Math.max(0, group.links.length - TILE_LIMIT)
  const visible = open || !overflow ? group.links.length : TILE_LIMIT

  return (
    <Tile className={styles.tile}>
      <header className={styles.tileHead}>
        {group.href ? (
          <NavigationMenu.Link className={styles.tileTitle} href={group.href}>
            {group.title}
          </NavigationMenu.Link>
        ) : (
          <span className={styles.tileTitle}>{group.title}</span>
        )}
        <span className={styles.count}>{String(group.links.length).padStart(2, '0')}</span>
      </header>
      <ul className={chips ? styles.chips : styles.links}>
        {group.links.map((l, i) => (
          <li key={`${l.href}-${i}`} hidden={i >= visible || undefined}>
            <NavigationMenu.Link className={chips ? styles.chip : styles.link} href={l.href}>
              {l.label}
            </NavigationMenu.Link>
          </li>
        ))}
      </ul>
      {overflow > 0 && (
        <button type="button" className={styles.more} onClick={() => setOpen((o) => !o)} aria-expanded={open}>
          {open ? 'Show less' : `+${overflow} more`}
        </button>
      )}
    </Tile>
  )
}

export function Bento({ menu }: PanelProps) {
  const scrollRef = useOverflowHint<HTMLDivElement>()
  const promo = menu.promos?.[1]

  return (
    <div className={styles.panel} ref={scrollRef}>
      <div className={styles.grid}>
        <Tile className={styles.hero}>
          <p className={styles.heroKicker}>Services</p>
          {menu.statement && <p className={styles.heroText}>{menu.statement}</p>}
          <div className={styles.heroActions}>
            {menu.featured && (
              <NavigationMenu.Link className={styles.primary} href={menu.featured.cta.href}>
                {menu.featured.cta.label}
              </NavigationMenu.Link>
            )}
            {menu.viewAll && (
              <NavigationMenu.Link className={styles.secondary} href={menu.viewAll.href}>
                {menu.viewAll.label} <span aria-hidden>→</span>
              </NavigationMenu.Link>
            )}
          </div>
        </Tile>

        {menu.groups.map((g) => (
          <GroupTile key={g.id} group={g} />
        ))}

        {promo && (
          <Tile as="a" className={styles.promo} href={promo.href}>
            <span className={styles.promoTitle}>{promo.title}</span>
            <span className={styles.promoBody}>{promo.description}</span>
            <span className={styles.promoArrow} aria-hidden>
              ↗
            </span>
          </Tile>
        )}

        {menu.aside.map((g) => (
          <GroupTile key={g.id} group={g} chips />
        ))}
      </div>
    </div>
  )
}
