import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { experience, profile, projects } from '../data/content'
import type { DetailView } from '../types'

export type { DetailView }
import {
  IconBriefcase,
  IconCode,
  IconFile,
  IconHome,
  IconLayers,
  IconLink,
  IconMail,
  IconMark,
  IconSearch,
  IconSpark,
  IconTile,
  IconUser,
} from './Icons'

type CommandItem = {
  id: string
  group: string
  title: string
  subtitle?: string
  keywords: string
  icon: ReactNode
  keepOpen?: boolean
  run: () => void
}

type CommandPaletteProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onOpenDetail: (view: Exclude<DetailView, null>) => void
  onGoHome?: () => void
}

function isMac() {
  return typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform)
}

function companyMark(company: string) {
  if (company === 'Microsoft') return <IconMark label="MS" tone="ms" />
  if (company === 'Amazon') return <IconMark label="AZ" tone="amz" />
  if (company === 'WGI') return <IconMark label="WG" tone="wgi" />
  return <IconMark label={company.slice(0, 2).toUpperCase()} />
}

const categories = [
  { id: 'all', label: 'All', icon: <IconSearch className="h-3.5 w-3.5" /> },
  { id: 'navigate', label: 'Home', icon: <IconHome className="h-3.5 w-3.5" /> },
  { id: 'experience', label: 'Experience', icon: <IconBriefcase className="h-3.5 w-3.5" /> },
  { id: 'projects', label: 'Projects', icon: <IconLayers className="h-3.5 w-3.5" /> },
  { id: 'pages', label: 'Pages', icon: <IconUser className="h-3.5 w-3.5" /> },
  { id: 'actions', label: 'Links', icon: <IconLink className="h-3.5 w-3.5" /> },
] as const

export function CommandPalette({
  open,
  onOpenChange,
  onOpenDetail,
  onGoHome,
}: CommandPaletteProps) {
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const [category, setCategory] = useState<(typeof categories)[number]['id']>('all')
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  const items = useMemo<CommandItem[]>(() => {
    const list: CommandItem[] = [
      {
        id: 'home',
        group: 'navigate',
        title: 'Home',
        subtitle: 'back to the vault overview',
        keywords: 'home top start overview',
        icon: (
          <IconTile>
            <IconHome />
          </IconTile>
        ),
        run: () => {
          onGoHome?.()
          window.scrollTo({ top: 0, behavior: 'smooth' })
        },
      },
      {
        id: 'about',
        group: 'pages',
        title: 'About & education',
        subtitle: 'background, schools, seeking new grad roles',
        keywords: 'about education school alabama jacksonville gpa new grad',
        icon: (
          <IconTile>
            <IconUser />
          </IconTile>
        ),
        keepOpen: true,
        run: () => onOpenDetail({ type: 'about' }),
      },
      {
        id: 'skills',
        group: 'pages',
        title: 'Skills & recognition',
        subtitle: 'languages, cloud, awards',
        keywords: 'skills stack python typescript aws recognition meta bloomberg',
        icon: (
          <IconTile>
            <IconSpark />
          </IconTile>
        ),
        keepOpen: true,
        run: () => onOpenDetail({ type: 'skills' }),
      },
      {
        id: 'resume',
        group: 'actions',
        title: 'Open resume PDF',
        subtitle: 'download / view',
        keywords: 'resume cv pdf download',
        icon: (
          <IconTile>
            <IconFile />
          </IconTile>
        ),
        run: () => window.open(profile.links.resume, '_blank', 'noopener,noreferrer'),
      },
      {
        id: 'email',
        group: 'actions',
        title: 'Email Sudeep',
        subtitle: profile.email,
        keywords: 'email contact mail joshisudeep',
        icon: (
          <IconTile>
            <IconMail />
          </IconTile>
        ),
        run: () => {
          window.location.href = `mailto:${profile.email}`
        },
      },
      {
        id: 'linkedin',
        group: 'actions',
        title: 'Open LinkedIn',
        subtitle: 'profile',
        keywords: 'linkedin social',
        icon: (
          <IconTile>
            <IconLink />
          </IconTile>
        ),
        run: () => window.open(profile.links.linkedin, '_blank', 'noopener,noreferrer'),
      },
      {
        id: 'github',
        group: 'actions',
        title: 'Open GitHub',
        subtitle: 'code & repos',
        keywords: 'github code repos',
        icon: (
          <IconTile>
            <IconCode />
          </IconTile>
        ),
        run: () => window.open(profile.links.github, '_blank', 'noopener,noreferrer'),
      },
      ...experience.map((job) => ({
        id: `exp-${job.id}`,
        group: 'experience',
        title: `${job.role} at ${job.company}`,
        subtitle: `${job.metric}, ${job.dates}`,
        keywords: `${job.company} ${job.role} ${job.metric} ${job.stack.join(' ')} ${job.summary}`,
        icon: companyMark(job.company),
        keepOpen: true,
        run: () => onOpenDetail({ type: 'experience', id: job.id }),
      })),
      ...projects.map((project) => ({
        id: `proj-${project.id}`,
        group: 'projects',
        title: project.title,
        subtitle: project.highlight ?? project.year,
        keywords: `${project.title} ${project.stack.join(' ')} ${project.description}`,
        icon: (
          <IconTile>
            <IconLayers />
          </IconTile>
        ),
        keepOpen: true,
        run: () => onOpenDetail({ type: 'project', id: project.id }),
      })),
    ]

    const q = query.trim().toLowerCase()
    return list.filter((item) => {
      const inCategory = category === 'all' || item.group === category
      if (!inCategory) return false
      if (!q) return true
      return (
        item.title.toLowerCase().includes(q) ||
        item.subtitle?.toLowerCase().includes(q) ||
        item.keywords.toLowerCase().includes(q) ||
        item.group.toLowerCase().includes(q)
      )
    })
  }, [category, onGoHome, onOpenDetail, query])

  useEffect(() => {
    if (!open) {
      setQuery('')
      setActive(0)
      setCategory('all')
      return
    }
    const id = window.setTimeout(() => inputRef.current?.focus(), 10)
    return () => window.clearTimeout(id)
  }, [open])

  useEffect(() => {
    setActive(0)
  }, [query, category])

  useEffect(() => {
    const el = listRef.current?.querySelector<HTMLElement>(`[data-index="${active}"]`)
    el?.scrollIntoView({ block: 'nearest' })
  }, [active])

  useEffect(() => {
    if (!open) return

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onOpenChange(false)
        return
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setActive((i) => Math.min(i + 1, Math.max(items.length - 1, 0)))
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault()
        setActive((i) => Math.max(i - 1, 0))
      }
      if (e.key === 'Enter' && items[active]) {
        e.preventDefault()
        const item = items[active]
        item.run()
        if (!item.keepOpen) onOpenChange(false)
      }
    }

    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [active, items, onOpenChange, open])

  const grouped = useMemo(() => {
    const map = new Map<string, CommandItem[]>()
    for (const item of items) {
      const arr = map.get(item.group) ?? []
      arr.push(item)
      map.set(item.group, arr)
    }
    return [...map.entries()]
  }, [items])

  let flatIndex = -1

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-50 flex items-end justify-center sm:items-start sm:px-4 sm:pt-[10vh] md:pt-[14vh]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.16 }}
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) onOpenChange(false)
          }}
        >
          <div className="absolute inset-0 bg-[#070908]/55 backdrop-blur-md" />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Vault index"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
            className="relative flex max-h-[88vh] w-full max-w-xl flex-col overflow-hidden rounded-t-2xl border border-line/80 bg-panel shadow-[0_30px_100px_rgba(0,0,0,0.45)] backdrop-blur-xl sm:max-h-none sm:rounded-2xl"
          >
            <div className="flex justify-center pt-2 sm:hidden" aria-hidden>
              <span className="h-1 w-10 rounded-full bg-line" />
            </div>
            <div className="border-b border-line px-4 pt-3 sm:pt-3.5">
              <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-mute">
                Vault index
              </p>
            </div>
            <div className="relative flex items-center gap-3 border-b border-line px-4 py-3.5">
              <IconTile className="border-accent/30 bg-accent/10 text-accent">
                <IconSearch />
              </IconTile>
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search the vault..."
                className="w-full bg-transparent text-[0.95rem] text-ink outline-none placeholder:text-mute"
                autoComplete="off"
                spellCheck={false}
                enterKeyHint="search"
              />
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                className="shrink-0 rounded-full border border-line bg-wash px-3 py-1.5 text-xs font-medium text-ink-soft transition hover:text-ink"
                aria-label="Close search"
              >
                Close
              </button>
            </div>

            <div className="relative flex gap-2 overflow-x-auto border-b border-line px-3 py-2.5">
              {categories.map((cat) => {
                const selected = category === cat.id
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategory(cat.id)}
                    className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs transition ${
                      selected
                        ? 'border-accent/40 bg-accent/15 text-accent'
                        : 'border-line bg-wash/60 text-mute hover:text-ink'
                    }`}
                  >
                    {cat.icon}
                    {cat.label}
                  </button>
                )
              })}
            </div>

            <div ref={listRef} className="relative min-h-0 flex-1 overflow-y-auto p-2 sm:max-h-[min(52vh,440px)]">
              {items.length === 0 ? (
                <p className="px-3 py-10 text-center text-sm text-mute">No results for “{query}”</p>
              ) : (
                grouped.map(([group, groupItems]) => (
                  <div key={group} className="mb-2">
                    <p className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-mute">
                      {group}
                    </p>
                    <ul>
                      {groupItems.map((item) => {
                        flatIndex += 1
                        const index = flatIndex
                        const selected = index === active
                        return (
                          <li key={item.id}>
                            <button
                              type="button"
                              data-index={index}
                              onMouseEnter={() => setActive(index)}
                              onClick={() => {
                                item.run()
                                if (!item.keepOpen) onOpenChange(false)
                              }}
                              className={`flex w-full items-center gap-3 rounded-xl px-2.5 py-3 text-left transition sm:py-2.5 ${
                                selected
                                  ? 'bg-accent/12 text-ink ring-1 ring-accent/25'
                                  : 'text-ink-soft hover:bg-wash/80'
                              }`}
                            >
                              {item.icon}
                              <span className="min-w-0 flex-1">
                                <span className="block text-sm font-medium">{item.title}</span>
                                {item.subtitle ? (
                                  <span className="mt-0.5 block truncate text-xs text-mute">
                                    {item.subtitle}
                                  </span>
                                ) : null}
                              </span>
                              <span className="text-[10px] uppercase tracking-wider text-accent sm:hidden">
                                open
                              </span>
                              {selected ? (
                                <span className="hidden text-[10px] uppercase tracking-wider text-accent sm:inline">
                                  enter
                                </span>
                              ) : null}
                            </button>
                          </li>
                        )
                      })}
                    </ul>
                  </div>
                ))
              )}
            </div>

            <div className="relative flex items-center justify-between gap-3 border-t border-line px-4 py-3 text-[11px] text-mute">
              <span className="sm:hidden">Tap a result to open</span>
              <span className="hidden sm:inline">↑↓ move, ↵ open, esc close</span>
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                className="rounded-lg border border-line px-2.5 py-1 text-xs text-ink-soft hover:text-ink sm:hidden"
              >
                Close menu
              </button>
              <span className="hidden sm:inline">{isMac() ? '⌘/' : 'Ctrl /'}</span>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}

export function useCommandMenu(onToggle: () => void) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && (e.key === '/' || e.code === 'Slash')) {
        e.preventDefault()
        onToggle()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onToggle])
}
