import type { Variant } from './types'
import { ClassicGrid } from './v01-classic-grid/ClassicGrid'
import { CategoryRail } from './v02-category-rail/CategoryRail'
import { Directory } from './v03-directory/Directory'
import { BigType } from './v04-big-type/BigType'
import { SolutionsServices } from './v05-solutions-services/SolutionsServices'
import { TreePanels } from './v06-tree-panels/TreePanels'
import { Editorial } from './v07-editorial/Editorial'
import { Index } from './v08-index/Index'
import { Bento } from './v09-bento/Bento'
import { Accordion } from './v10-accordion/Accordion'

/**
 * Add a new variant: copy a folder (e.g. v01-classic-grid → v02-something),
 * rename the component, and append it here. The Lab bar picks it up.
 */
export const variants: Variant[] = [
  {
    id: 'v01',
    name: 'Category Rail',
    notes: 'Stripe/Atlassian pattern: hover a category in the left rail to swap the pane; the pane heading links to the category page.',
    Panel: CategoryRail
  },
  {
    id: 'v02',
    name: 'Index',
    notes: 'Awwwards pattern: serif (Libre Baskerville) category index, siblings dim on hover, link preview swaps.',
    Panel: Index
  },
  {
    id: 'v03',
    name: 'Classic Grid',
    notes: 'Figma baseline: category rows with 2 link columns and an Industries/Other aside.',
    Panel: ClassicGrid
  },
  {
    id: 'v04',
    name: 'Directory',
    notes: 'Apple-footer/Linear index: all groups in flowing columns, aside as chip strip.',
    Panel: Directory
  },
  {
    id: 'v05',
    name: 'Big Type',
    notes: 'Webflow-inspired: quiet group labels over oversized links, promo banners, utility strip. Type steps down as links grow.',
    Panel: BigType
  },
  {
    id: 'v06',
    name: 'Solutions + Services',
    notes: 'Arounda-inspired floating card: audience-framed solutions band on top, icon + one-line described services below.',
    Panel: SolutionsServices
  },
  {
    id: 'v07',
    name: 'Tree Panels',
    notes: 'Glean-inspired tray of cards: promo + tree-connected sub-lists on the left, icon-led group columns and an announcement strip on the right.',
    Panel: TreePanels
  },
  {
    id: 'v08',
    name: 'Editorial',
    notes: 'Lazarev-inspired: eyebrow labels over 16px described links, whitepaper-cover article rail. Descriptions drop past 40 links.',
    Panel: Editorial
  },
  {
    id: 'v09',
    name: 'Bento',
    notes: 'Awwwards pattern: content-sized bento tiles packed densely; long groups fold behind "+N more"; hero + promo tiles.',
    Panel: Bento
  },
  {
    id: 'v10',
    name: 'Accordion Columns',
    notes: 'Awwwards pattern: vertical category spines; the hovered one widens to reveal its links. Stacks on narrow screens.',
    Panel: Accordion,
  },
]
