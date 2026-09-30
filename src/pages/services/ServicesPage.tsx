import { useEffect } from 'react'
import site from '../../data/site.json'
import servicesData from '../../data/servicesPage.json'
import industriesData from '../../data/industriesPage.json'
import { LabHeader } from '../../shell/LabHeader'
import placeholder from '../../assets/work-eminnt.png'
import { IndustryLayouts, PageSwitcher, useSwitch } from './IndustryLayouts'
import { SiteFooter } from './SiteFooter'
import styles from './ServicesPage.module.css'

// Client logos shipped with the page, keyed by file name.
const logos = import.meta.glob<string>('../../assets/clients/*.svg', { eager: true, import: 'default' })
const logo = (file: string) => logos[`../../assets/clients/${file}`]

// Per-service images, keyed by file name; services without one fall back to the placeholder.
const serviceImages = import.meta.glob<string>('../../assets/services/*', { eager: true, import: 'default' })
const serviceImage = (file?: string) => (file ? serviceImages[`../../assets/services/${file}`] : undefined)

function ArrowUpRight({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" aria-hidden>
      <path d="M4.5 11.5 11.5 4.5M5.5 4.5h6v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function Hero({ hero }: { hero: PageData['hero'] }) {
  const clients = site.clients
  return (
    <section className={styles.hero}>
      <div className={styles.heroInner}>
        {'eyebrow' in hero && <p className={styles.heroEyebrow}>{String(hero.eyebrow)}</p>}
        <h1 className={styles.heroTitle}>
          {hero.title.map((line) => (
            <span key={line}>{line}</span>
          ))}
        </h1>
        {'description' in hero && <p className={styles.heroDesc}>{String(hero.description)}</p>}
        <a className={styles.heroCta} href={hero.cta.href}>
          {hero.cta.label} <span aria-hidden>→</span>
        </a>
      </div>

      <div className={styles.marquee} aria-label="Clients">
        {/* Two copies of the list make the loop seamless; the second is hidden from assistive tech. */}
        <div className={styles.marqueeTrack}>
          {[0, 1].map((copy) => (
            <ul key={copy} className={styles.logos} aria-hidden={copy === 1 || undefined}>
              {clients.map((c) => (
                <li key={c.file}>
                  <img src={logo(c.file)} alt={copy === 0 ? c.name : ''} height={32} loading="lazy" />
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </section>
  )
}

type Service = { label: string; href: string; summary: string; image?: string }
type PageData = {
  title: string
  layout?: string
  intro?: { eyebrow: string; title: string }
  hero: { title: string[]; cta: { label: string; href: string }; eyebrow?: string; description?: string }
  categories: { id: string; title: string; href: string; summary: string; image?: string; services: Service[] }[]
}
export type Category = PageData['categories'][number]

function CategorySection({ category }: { category: Category }) {
  return (
    <section className={styles.category} aria-labelledby={`cat-${category.id}`}>
      <div className={styles.categoryHead}>
        <h2 id={`cat-${category.id}`} className={styles.categoryTitle}>
          <a href={category.href}>{category.title}</a>
        </h2>
        <a className={styles.categoryLink} href={category.href}>
          Explore {category.title} <ArrowUpRight className={styles.inlineArrow} />
        </a>
      </div>

      {/* Every row is a real link; hover or focus opens its summary. */}
      <ul className={styles.rows}>
        {category.services.map((s) => (
          <li key={s.label}>
            <a className={styles.row} href={s.href}>
              <span className={styles.rowHead}>
                <span className={styles.rowTitle}>{s.label}</span>
                <ArrowUpRight className={styles.rowArrow} />
              </span>
              <span className={styles.rowBody}>
                <span className={styles.rowBodyInner}>
                  {/* Placeholder image until each service has its own. */}
                  <span className={styles.rowImage}>
                    <img
                      src={serviceImage(s.image) ?? placeholder}
                      data-placeholder={s.image ? undefined : ''}
                      alt=""
                      loading="lazy"
                    />
                  </span>
                  <span className={styles.rowText}>
                    <span className={styles.rowSummary}>{s.summary}</span>
                    <span className={styles.rowMore}>View service</span>
                  </span>
                </span>
              </span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  )
}

/** Shared layout for the services and industries pages: black hero, white category sections, site footer. */
function ListingPage({ page }: { page: PageData }) {
  const isServices = page.layout !== 'split'
  // Services page: with or without images in the opened rows, plus light/dark.
  const [images, setImages] = useSwitch('images', ['on', 'off'] as const, isServices)
  useEffect(() => {
    document.title = page.title
  }, [page.title])

  return (
    <>
      <LabHeader />
      <main>
        <Hero hero={page.hero} />
        <div className={styles.light} data-images={isServices ? images : undefined}>
          {page.intro && (
            <header className={styles.intro}>
              <p className={styles.introEyebrow}>{page.intro.eyebrow}</p>
              <p className={styles.introTitle}>{page.intro.title}</p>
            </header>
          )}
          {page.layout === 'split' ? (
            <IndustryLayouts categories={page.categories} image={placeholder} />
          ) : (
            <>
              {page.categories.map((c) => (
                <CategorySection key={c.id} category={c} />
              ))}
              <PageSwitcher
                label="Services layout"
                options={[
                  { id: 'on', name: 'A · With image' },
                  { id: 'off', name: 'B · Text only' },
                ]}
                value={images}
                onChange={(v) => setImages(v as 'on' | 'off')}
              />
            </>
          )}
        </div>
      </main>
      <SiteFooter footer={site.footer} />
    </>
  )
}

export const ServicesPage = () => <ListingPage page={servicesData} />
export const IndustriesPage = () => <ListingPage page={industriesData} />
