import type { ComponentType } from 'react'
import type { MegaMenuData } from '../data/nav'

export type PanelProps = { menu: MegaMenuData }

export type Variant = {
  id: string
  name: string
  /** One line on the idea behind this variant; shown in the Lab bar. */
  notes: string
  Panel: ComponentType<PanelProps>
}
