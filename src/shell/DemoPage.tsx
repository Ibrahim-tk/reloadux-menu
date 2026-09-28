import styles from './DemoPage.module.css'

/** Stand-in page content so the menu's blur scrim has something to sit over. */
export function DemoPage() {
  return (
    <main className={styles.page}>
      <p className={styles.overline}>AI-native UX design agency</p>
      <h1 className={styles.title}>We design products people actually adopt.</h1>
      <div className={styles.grid}>
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className={styles.card} data-tone={i % 3} />
        ))}
      </div>
    </main>
  )
}
