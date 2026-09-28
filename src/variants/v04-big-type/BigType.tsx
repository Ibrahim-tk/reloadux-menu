import * as NavigationMenu from '@radix-ui/react-navigation-menu'
import type { PanelProps } from '../types'
import { useOverflowHint } from '../../shell/useOverflowHint'
import styles from './BigType.module.css'

/** ↗ sized in em so it tracks the category label's type size. */
function ArrowUpRight() {
  return (
    <svg className={styles.arrow} viewBox="0 0 16 16" fill="none" aria-hidden>
      <path d="M4.5 11.5 11.5 4.5M5.5 4.5h6v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

/** Glues the last word to the arrow so the arrow never wraps onto a line by itself. */
function LinkLabel({ label }: { label: string }) {
  const cut = label.lastIndexOf(' ')
  const head = cut > 0 ? label.slice(0, cut + 1) : ''
  const tail = cut > 0 ? label.slice(cut + 1) : label
  return (
    <>
      {head && <span className={styles.linkText}>{head}</span>}
      <span className={styles.nowrap}>
        <span className={styles.linkText}>{tail}</span>
        <ArrowUpRight />
      </span>
    </>
  )
}

/** Type steps down as the menu grows, so an SEO-sized menu still fits. */
function density(totalLinks: number) {
  if (totalLinks > 72) return 'dense'
  if (totalLinks > 36) return 'compact'
  return 'roomy'
}

export function BigType({ menu }: PanelProps) {
  const columns = [...menu.groups, ...menu.aside]
  const total = columns.reduce((n, g) => n + g.links.length, 0)
  const scrollRef = useOverflowHint<HTMLDivElement>()

  return (
    <div className={styles.panel} data-density={density(total)} ref={scrollRef}>
      <div className={styles.body}>
        <div className={styles.columns}>
          {columns.map((g) => (
            <section key={g.id} className={styles.column} aria-labelledby={`bt-${g.id}`}>
              <h3 id={`bt-${g.id}`} className={styles.label}>
                {g.href ? (
                  <NavigationMenu.Link className={styles.labelLink} href={g.href}>
                    <LinkLabel label={g.title} />
                  </NavigationMenu.Link>
                ) : (
                  g.title
                )}
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

        {menu.promos && (
          <div className={styles.promos}>
            {menu.promos.map((p, i) => (
              <NavigationMenu.Link key={p.href} className={styles.promo} href={p.href} data-tone={i % 2}>
                <span className={styles.promoTitle}>{p.title}</span>
                <span className={styles.promoBody}>{p.description}</span>
                <span className={styles.promoArrow} aria-hidden>
                  →
                </span>
              </NavigationMenu.Link>
            ))}
          </div>
        )}
      </div>

      {menu.utility && (
        <div className={styles.utility}>
          <div className={styles.utilityInner}>
            <span className={styles.utilityLabel}>{menu.utility.label}</span>
            <NavigationMenu.Link className={styles.utilityCta} href={menu.utility.cta.href}>
              {menu.utility.cta.label} <span aria-hidden>→</span>
            </NavigationMenu.Link>
            <span className={styles.utilityCount}>
              {columns.length} categories · {total} services
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
