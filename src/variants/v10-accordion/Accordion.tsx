import * as NavigationMenu from '@radix-ui/react-navigation-menu'
import { useState } from 'react'
import { describe, type NavGroup } from '../../data/nav'
import { useHoverIntent } from '../../shell/useHoverIntent'
import { useOverflowHint } from '../../shell/useOverflowHint'
import type { PanelProps } from '../types'
import styles from './Accordion.module.css'

const pad = (n: number) => String(n).padStart(2, '0')

function Column({
  group,
  index,
  active,
  hoverProps,
}: {
  group: NavGroup
  index: number
  active: boolean
  hoverProps: ReturnType<ReturnType<typeof useHoverIntent>>
}) {
  const bodyRef = useOverflowHint<HTMLDivElement>()
  return (
    <section className={styles.col} data-active={active || undefined} {...hoverProps}>
      {/* Collapsed face: number + vertical title. The title is the category page link. */}
      <NavigationMenu.Link className={styles.spine} href={group.href} tabIndex={active ? -1 : 0} onFocus={hoverProps.onFocus}>
        <span className={styles.num}>{pad(index + 1)}</span>
        <span className={styles.spineTitle}>{group.title}</span>
      </NavigationMenu.Link>

      {/* Expanded face. Always in the DOM so every link stays crawlable. */}
      <div className={styles.body} ref={bodyRef} aria-hidden={!active}>
        <div className={styles.bodyHead}>
          <span className={styles.num}>{pad(index + 1)}</span>
          <NavigationMenu.Link className={styles.title} href={group.href} tabIndex={active ? 0 : -1}>
            {group.title}
          </NavigationMenu.Link>
          {describe(group.title) && <p className={styles.desc}>{describe(group.title)}</p>}
        </div>
        <ul className={styles.links}>
          {group.links.map((l, i) => (
            <li key={`${l.href}-${i}`}>
              <NavigationMenu.Link className={styles.link} href={l.href} tabIndex={active ? 0 : -1}>
                {l.label}
              </NavigationMenu.Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export function Accordion({ menu }: PanelProps) {
  const all = [...menu.groups, ...menu.aside]
  const [activeId, setActiveId] = useState(all[0]?.id)
  const intent = useHoverIntent(140)

  return (
    <div className={styles.panel}>
      <div className={styles.strip}>
        {all.map((g, i) => (
          <Column key={g.id} group={g} index={i} active={g.id === activeId} hoverProps={intent(() => setActiveId(g.id))} />
        ))}
      </div>
    </div>
  )
}
