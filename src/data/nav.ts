import raw from './navigation.json'

export type NavLink = { label: string; href: string }
export type NavGroup = { id: string; title: string; href?: string; links: NavLink[] }
export type Featured = { eyebrow: string; title: string; description: string; cta: NavLink }
export type Solution = { title: string; subtitle: string; description: string; href: string; glyph: string }
export type Promo = { title: string; description: string; href: string }
export type Article = NavLink & { kicker: string; type: string; topic: string }
export type MegaMenuData = {
  groups: NavGroup[]
  aside: NavGroup[]
  featured?: Featured
  viewAll?: NavLink
  solutions?: Solution[]
  promos?: Promo[]
  utility?: { label: string; cta: NavLink }
  announcement?: { tag: string; title: string; description: string; href: string }
  statement?: string
  articles?: Article[]
}
export type TopNavItem = { id: string; label: string; href: string; megaMenu?: string }

type NavigationFile = {
  brand: { name: string; href: string }
  topNav: TopNavItem[]
  cta: NavLink
  megaMenus: Record<string, MegaMenuData>
  stressPool: { links: string[]; groups: NavGroup[]; aside: NavGroup[] }
  descriptions: Record<string, string>
}

export const nav = raw as unknown as NavigationFile

/** How much extra content the Lab bar layers on top of the Figma copy. */
export type ContentScale = { links: number; groups: number; aside: number }
export const BASE_SCALE: ContentScale = { links: 0, groups: 0, aside: 0 }

const slug = (s: string) => s.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

/** Returns the mega menu with stress-pool items appended per the scale. */
export function buildMenu(id: string, scale: ContentScale): MegaMenuData {
  const base = nav.megaMenus[id]
  const pool = nav.stressPool

  const withExtraLinks = (g: NavGroup, offset: number): NavGroup => ({
    ...g,
    links: [
      ...g.links,
      ...Array.from({ length: scale.links }, (_, i) => {
        const label = pool.links[(offset + i) % pool.links.length]
        return { label, href: `${g.href ?? ''}/${slug(label)}` }
      }),
    ],
  })

  const groups = [...base.groups, ...pool.groups.slice(0, scale.groups)].map((g, i) => withExtraLinks(g, i * 3))
  const aside = [...base.aside, ...pool.aside.slice(0, scale.aside)]
  return { ...base, groups, aside }
}

export const SCALE_LIMITS: ContentScale = {
  links: nav.stressPool.links.length,
  groups: nav.stressPool.groups.length,
  aside: nav.stressPool.aside.length,
}

export const describe = (label: string): string | undefined => nav.descriptions[label]
