import reload from '../assets/logo-reload.svg'
import u1 from '../assets/logo-u1.svg'
import u2 from '../assets/logo-u2.svg'
import styles from './Logo.module.css'

/** The bare white wordmark (no link), positioned inside a 120×27 box. Reused on article covers. */
export function LogoMark() {
  return (
    <span className={styles.mark}>
      <img src={reload} alt="" width={84.589} height={24} className={styles.reload} />
      <img src={u1} alt="" width={14.158} height={18.149} className={styles.u1} />
      <img src={u2} alt="" width={17.466} height={18.135} className={styles.u2} />
    </span>
  )
}

/** reloadux wordmark, assembled from the three Figma layers at their exact offsets. */
export function Logo({ href, name }: { href: string; name: string }) {
  return (
    <a href={href} className={styles.logo} aria-label={name}>
      <LogoMark />
    </a>
  )
}
