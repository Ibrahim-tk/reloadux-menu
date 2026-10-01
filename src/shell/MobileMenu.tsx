import { useEffect, useId, useState } from 'react'
import chevron from '../assets/chevron.svg'
import { nav, type MegaMenuData, type NavGroup } from '../data/nav'
import { useOverflowHint } from './useOverflowHint'
import styles from './MobileMenu.module.css'

type Props = {
  menus: Record<string, MegaMenuData>
  open: boolean
  onOpenChange: (open: boolean) => void
}

/** Accordion row whose label stays a link; the chevron alone toggles the children. */
function Disclosure({ label, href, level, children }: { label: string; href?: string; level: 1 | 2; children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const id = useId()
  return (
    <li className={styles.item} data-level={level} data-open={open || undefined}>
      <div className={styles.row}>
        {href ? (
          <a className={styles.rowLink} href={href}>
            {label}
          </a>
        ) : (
          <button type="button" className={styles.rowLink} onClick={() => setOpen(!open)} aria-expanded={open} aria-controls={id}>
            {label}
          </button>
        )}
        <button
          type="button"
          className={styles.toggle}
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-controls={id}
          aria-label={`${open ? 'Collapse' : 'Expand'} ${label}`}
        >
          <img src={chevron} alt="" width={20} height={20} className={styles.chevron} />
        </button>
      </div>
      {/* Collapsed panels stay in the DOM so crawlers still see every link. */}
      <div id={id} className={styles.panel} hidden={!open}>
        {children}
      </div>
    </li>
  )
}

function Links({ links }: { links: { label: string; href: string }[] }) {
  return (
    <ul className={styles.links}>
      {links.map((l) => (
        <li key={l.href + l.label}>
          <a className={styles.link} href={l.href}>
            {l.label}
          </a>
        </li>
      ))}
    </ul>
  )
}

const groupsOf = (m: MegaMenuData): NavGroup[] => [...m.groups, ...m.aside.filter((g) => g.links.length)]

export function MobileMenu({ menus, open, onOpenChange }: Props) {
  const sheet = useOverflowHint<HTMLDivElement>()

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onOpenChange(false)
    const close = () => window.matchMedia('(min-width: 1024px)').matches && onOpenChange(false)
    window.addEventListener('keydown', onKey)
    window.addEventListener('resize', close)
    document.documentElement.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('resize', close)
      document.documentElement.style.overflow = ''
    }
  }, [open, onOpenChange])

  return (
    <>
      <button
        type="button"
        className={styles.burger}
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={open ? 'Close menu' : 'Open menu'}
        data-open={open || undefined}
        onClick={() => onOpenChange(!open)}
      >
        <span />
        <span />
      </button>

      <div id="mobile-menu" className={styles.wrap} data-open={open || undefined} inert={!open}>
        <div ref={sheet} className={styles.sheet}>
          <ul className={styles.list}>
            {nav.topNav.map((item) =>
              item.megaMenu ? (
                <Disclosure key={item.id} label={item.label} href={item.href} level={1}>
                  <ul className={styles.sub}>
                    {groupsOf(menus[item.megaMenu]).map((g) => (
                      <Disclosure key={g.id} label={g.title} href={g.href} level={2}>
                        <Links links={g.links} />
                      </Disclosure>
                    ))}
                  </ul>
                </Disclosure>
              ) : item.dropdown ? (
                <Disclosure key={item.id} label={item.label} href={item.href} level={1}>
                  <Links links={nav.resources.links} />
                </Disclosure>
              ) : (
                <li key={item.id} className={styles.item} data-level={1}>
                  <a className={styles.rowLink} href={item.href}>
                    {item.label}
                  </a>
                </li>
              ),
            )}
          </ul>
        </div>
        <div className={styles.footer}>
          <a className={styles.cta} href={nav.cta.href}>
            {nav.cta.label}
          </a>
        </div>
      </div>
    </>
  )
}
