import type site from '../../data/site.json'
import { Logo } from '../../shell/Logo'
import styles from './SiteFooter.module.css'

type Footer = (typeof site)['footer']

function SocialIcon({ label }: { label: string }) {
  if (label === 'LinkedIn')
    return (
      <svg viewBox="0 0 24 24" aria-hidden>
        <path fill="currentColor" d="M6.94 8.5H3.56V20h3.38V8.5ZM5.25 3A1.97 1.97 0 1 0 5.25 7a1.97 1.97 0 0 0 0-3.94ZM20.44 13.4c0-3.1-1.66-4.54-3.87-4.54a3.34 3.34 0 0 0-3.02 1.66V8.5h-3.37V20h3.37v-5.69c0-1.5.28-2.95 2.14-2.95 1.83 0 1.86 1.71 1.86 3.05V20h3.39l-.5-6.6Z" />
      </svg>
    )
  if (label === 'Facebook')
    return (
      <svg viewBox="0 0 24 24" aria-hidden>
        <path fill="currentColor" d="M13.5 21v-7.5H16l.5-3h-3V8.6c0-.87.3-1.6 1.6-1.6h1.5V4.2c-.26-.03-1.16-.2-2.2-.2-2.2 0-3.9 1.34-3.9 3.8v2.7H8v3h2.5V21h3Z" />
      </svg>
    )
  return (
    <svg viewBox="0 0 24 24" aria-hidden>
      <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="3.8" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" />
    </svg>
  )
}

/** The reloadux.com footer: contact + location, link columns with socials, then capabilities, solutions and industries. */
export function SiteFooter({ footer }: { footer: Footer }) {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.top}>
          <Logo href="/" name="reloadux" />
          <div>
            <p className={styles.heading}>Contact info</p>
            <p className={styles.text}>
              <a href={`mailto:${footer.contact.email}`}>{footer.contact.email}</a>
              <br />
              <a href={`tel:${footer.contact.tel}`}>{footer.contact.phone}</a>
            </p>
          </div>
          <div>
            <p className={styles.heading}>Our Location</p>
            <p className={styles.text}>
              {footer.location.map((l) => (
                <span key={l} className={styles.line}>
                  {l}
                </span>
              ))}
            </p>
          </div>
        </div>

        <div className={styles.grid}>
          {footer.columns.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <p className={styles.heading}>{col.title}</p>
              <ul className={styles.list}>
                {col.links.map((l) => (
                  <li key={l.label}>
                    <a href={l.href}>{l.label}</a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
          <div>
            <p className={styles.heading}>Socials</p>
            <ul className={styles.socials}>
              {footer.socials.map((s) => (
                <li key={s.label}>
                  <a href={s.href} aria-label={s.label} target="_blank" rel="noreferrer">
                    <SocialIcon label={s.label} />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {footer.wideColumns.map((col) => (
          <nav key={col.title} className={styles.wide} aria-label={col.title}>
            <p className={styles.heading}>{col.title}</p>
            <ul className={styles.wideList}>
              {col.links.map((l) => (
                <li key={l.label}>
                  <a href={l.href}>{l.label}</a>
                </li>
              ))}
            </ul>
          </nav>
        ))}

        <p className={styles.legal}>{footer.legal}</p>
      </div>
    </footer>
  )
}
