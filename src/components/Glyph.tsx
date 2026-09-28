/** Placeholder line icons until real service icons exist. Picked deterministically from the label. */
const PATHS: Record<string, string> = {
  sparkle: 'M12 3v4M12 17v4M3 12h4M17 12h4M6.5 6.5l2.5 2.5M15 15l2.5 2.5M17.5 6.5 15 9M9 15l-2.5 2.5',
  layers: 'm12 3 9 5-9 5-9-5 9-5Zm-9 9 9 5 9-5M3 16l9 5 9-5',
  chat: 'M4 5h16v11H9l-5 4V5Z',
  shield: 'M12 3 4 6v6c0 4.5 3.4 8.1 8 9 4.6-.9 8-4.5 8-9V6l-8-3Z',
  target: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0-5a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z',
  grid: 'M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z',
  compass: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm3.5-12.5-2 5-5 2 2-5 5-2Z',
  cursor: 'm5 3 14 7-6 2-2 6L5 3Z',
  chart: 'M4 20V10M10 20V4M16 20v-7M22 20H2',
  users: 'M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 10c0-3.3 3.1-6 7-6s7 2.7 7 6M17 3.5a4 4 0 0 1 0 7.5M22 21c0-2.6-1.8-4.8-4.5-5.6',
  pen: 'M4 20l4-1 11-11-3-3L5 16l-1 4Z',
  globe: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM3 12h18M12 3c2.5 2.5 3.8 5.5 3.8 9s-1.3 6.5-3.8 9c-2.5-2.5-3.8-5.5-3.8-9S9.5 5.5 12 3Z',
  sprint: 'M13 2 4 14h7l-1 8 9-12h-7l1-8Z',
  redesign: 'M20 11a8 8 0 0 0-14.9-4M4 4v4h4M4 13a8 8 0 0 0 14.9 4M20 20v-4h-4',
  team: 'M7 10a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm10 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM2 20c0-2.8 2.2-5 5-5s5 2.2 5 5M12 20c0-2.8 2.2-5 5-5s5 2.2 5 5',
}
const POOL = Object.keys(PATHS).slice(0, 12)

const hash = (s: string) => [...s].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7)

export function Glyph({ name, seed, size = 20 }: { name?: string; seed?: string; size?: number }) {
  const key = name && PATHS[name] ? name : POOL[hash(seed ?? '') % POOL.length]
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d={PATHS[key]} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
