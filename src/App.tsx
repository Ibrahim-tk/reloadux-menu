import { useEffect, useMemo, useState } from 'react'
import { BASE_SCALE, buildMenu, nav, type ContentScale } from './data/nav'
import { DemoPage } from './shell/DemoPage'
import { LabBar } from './shell/LabBar'
import { SiteHeader } from './shell/SiteHeader'
import { variants } from './variants'

type Theme = 'dark' | 'light'
type LabState = { scale: ContentScale; pinned: boolean; theme: Theme }

const STORAGE_KEY = 'mm-lab'
const DEFAULTS: LabState = { scale: BASE_SCALE, pinned: false, theme: 'dark' }

function load(): LabState {
  try {
    return { ...DEFAULTS, ...JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}') }
  } catch {
    return DEFAULTS
  }
}

function initialVariant() {
  const fromUrl = new URLSearchParams(location.search).get('v')
  return variants.find((v) => v.id === fromUrl)?.id ?? variants[0].id
}

export default function App() {
  const [variantId, setVariantId] = useState(initialVariant)
  const [lab, setLab] = useState(load)
  const [open, setOpen] = useState('')

  const variant = variants.find((v) => v.id === variantId) ?? variants[0]
  const menuIds = useMemo(() => nav.topNav.flatMap((i) => (i.megaMenu ? [i.megaMenu] : [])), [])
  const menus = useMemo(
    () => Object.fromEntries(menuIds.map((id) => [id, buildMenu(id, lab.scale)])),
    [menuIds, lab.scale],
  )

  const services = menus.services
  const stats = {
    groups: services.groups.length + services.aside.length,
    links: [...services.groups, ...services.aside].reduce((n, g) => n + g.links.length, 0),
  }

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lab))
    } catch {
      /* private mode — fine */
    }
    document.documentElement.dataset.theme = lab.theme
  }, [lab])

  useEffect(() => {
    const url = new URL(location.href)
    url.searchParams.set('v', variantId)
    history.replaceState(null, '', url)
  }, [variantId])

  // [ / ] switch variants, P pins, T toggles theme.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey || (e.target as HTMLElement).closest('input, textarea')) return
      const i = variants.findIndex((v) => v.id === variantId)
      if (e.key === ']') setVariantId(variants[(i + 1) % variants.length].id)
      else if (e.key === '[') setVariantId(variants[(i - 1 + variants.length) % variants.length].id)
      else if (e.key.toLowerCase() === 'p') setLab((s) => ({ ...s, pinned: !s.pinned }))
      else if (e.key.toLowerCase() === 't') setLab((s) => ({ ...s, theme: s.theme === 'dark' ? 'light' : 'dark' }))
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [variantId])

  const value = lab.pinned ? menuIds[0] : open

  return (
    <>
      <LabBar
        variants={variants}
        activeId={variant.id}
        onSelect={setVariantId}
        scale={lab.scale}
        onScale={(scale) => setLab((s) => ({ ...s, scale }))}
        pinned={lab.pinned}
        onPinned={(pinned) => setLab((s) => ({ ...s, pinned }))}
        theme={lab.theme}
        onTheme={(theme) => setLab((s) => ({ ...s, theme }))}
        stats={stats}
      />
      <SiteHeader
        key={variant.id}
        menus={menus}
        Panel={variant.Panel}
        value={value}
        onValueChange={(v) => !lab.pinned && setOpen(v)}
      />
      <DemoPage />
    </>
  )
}
