import * as NavigationMenu from '@radix-ui/react-navigation-menu'
import { useState } from 'react'
import type { ResourceCard, ResourceLink } from '../data/nav'
import { LogoMark } from './Logo'
import { useHoverIntent } from './useHoverIntent'
import styles from './ResourcesMenu.module.css'

function Card({ card, active }: { card: ResourceCard; active: boolean }) {
  return (
    <NavigationMenu.Link
      className={styles.card}
      href={card.href}
      data-active={active || undefined}
      aria-label={`${card.type}: ${card.kicker}, ${card.label}`}
      // Hidden cards stay in the DOM for crawlers but leave the tab order.
      tabIndex={active ? undefined : -1}
    >
      <span className={styles.cover} aria-hidden>
        <span className={styles.sheet}>
          <span className={styles.coverLogo}>
            <LogoMark />
          </span>
          <span className={styles.kicker}>{card.kicker}</span>
          <span className={styles.coverTitle}>{card.label}</span>
        </span>
      </span>
      <span className={styles.meta}>
        <span>{card.type}</span>
        <span className={styles.dot} aria-hidden>
          •
        </span>
        <span>{card.topic}</span>
      </span>
      <span className={styles.headline}>{card.headline}</span>
    </NavigationMenu.Link>
  )
}

/** Small two-column dropdown, shared by every variant: links on the left, the hovered one's card on the right. */
export function ResourcesMenu({ links, anchor }: { links: ResourceLink[]; anchor: number }) {
  const [activeId, setActiveId] = useState(links[0]?.id)
  const intent = useHoverIntent()

  return (
    <div className={styles.wrap} style={{ '--anchor': `${anchor}px` } as React.CSSProperties}>
      <div className={styles.panel}>
        <div className={styles.linksCol}>
        <p className={styles.eyebrow}>Resources</p>
        <ul className={styles.links}>
          {links.map((l) => (
            <li key={l.id}>
              <NavigationMenu.Link
                className={styles.link}
                href={l.href}
                data-active={l.id === activeId || undefined}
                {...intent(() => setActiveId(l.id))}
              >
                <span className={styles.linkLabel}>{l.label}</span>
              </NavigationMenu.Link>
            </li>
          ))}
        </ul>
        </div>
        <div className={styles.stage}>
          {links.map((l) => (
            <Card key={l.id} card={l.card} active={l.id === activeId} />
          ))}
        </div>
      </div>
    </div>
  )
}
