import * as NavigationMenu from '@radix-ui/react-navigation-menu'
import { useState, type ComponentType } from 'react'
import chevron from '../assets/chevron.svg'
import { nav, type MegaMenuData } from '../data/nav'
import type { PanelProps } from '../variants/types'
import { Logo } from './Logo'
import { ResourcesMenu } from './ResourcesMenu'
import styles from './SiteHeader.module.css'

type Props = {
  menus: Record<string, MegaMenuData>
  Panel: ComponentType<PanelProps>
  /** Open mega menu id ('' = closed). */
  value: string
  onValueChange: (v: string) => void
}

export function SiteHeader({ menus, Panel, value, onValueChange }: Props) {
  // Left edge of the tab that owns a small dropdown, so the panel hangs beneath it.
  const [anchor, setAnchor] = useState(0)
  const measure = (e: { currentTarget: HTMLElement }) => setAnchor(e.currentTarget.getBoundingClientRect().left)

  return (
    <NavigationMenu.Root
      className={styles.root}
      value={value}
      onValueChange={onValueChange}
      delayDuration={80}
      data-open={value ? '' : undefined}
    >
      <div className={styles.bar}>
        <Logo href={nav.brand.href} name={nav.brand.name} />

        <NavigationMenu.List className={styles.list}>
          {nav.topNav.map((item) =>
            item.megaMenu ? (
              <NavigationMenu.Item key={item.id} value={item.megaMenu}>
                <NavigationMenu.Trigger className={styles.tab}>
                  {item.label}
                  <img src={chevron} alt="" width={20} height={20} className={styles.chevron} />
                </NavigationMenu.Trigger>
                <NavigationMenu.Content className={styles.content}>
                  <Panel menu={menus[item.megaMenu]} />
                </NavigationMenu.Content>
              </NavigationMenu.Item>
            ) : item.dropdown ? (
              <NavigationMenu.Item key={item.id} value={item.dropdown}>
                <NavigationMenu.Trigger className={styles.tab} onPointerEnter={measure} onFocus={measure}>
                  {item.label}
                  <img src={chevron} alt="" width={20} height={20} className={styles.chevron} />
                </NavigationMenu.Trigger>
                <NavigationMenu.Content className={styles.content}>
                  <ResourcesMenu links={nav.resources.links} anchor={anchor} />
                </NavigationMenu.Content>
              </NavigationMenu.Item>
            ) : (
              <NavigationMenu.Item key={item.id}>
                <NavigationMenu.Link className={styles.tab} href={item.href}>
                  {item.label}
                </NavigationMenu.Link>
              </NavigationMenu.Item>
            ),
          )}
        </NavigationMenu.List>

        <a className={styles.cta} href={nav.cta.href}>
          {nav.cta.label}
        </a>
      </div>

      <div className={styles.viewportWrap}>
        <NavigationMenu.Viewport className={styles.viewport} />
      </div>

      <div className={styles.scrim} aria-hidden onClick={() => onValueChange('')} />
    </NavigationMenu.Root>
  )
}
