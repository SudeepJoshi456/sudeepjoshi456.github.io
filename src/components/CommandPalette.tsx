import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import type { DetailView } from '../types'

export type { DetailView }
import {
  IconBriefcase,
  IconFile,
  IconHome,
  IconLayers,
  IconLink,
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

export function CommandPalette({
  open,
  onOpenChange,
  onOpenDetail,
  onGoHome,
}: CommandPaletteProps) {
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  const items = useMemo<CommandItem[]>(() => {
    const list: CommandItem[] = [
      {
        id: 'home',
        group: 'vault',
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
        id: 'experience',
        group: 'vault',
        title: 'Experience',
        subtitle: 'Microsoft, Amazon, WGI',
        keywords: 'experience microsoft amazon wgi intern work',
        icon: (
          <IconTile>
            <IconBriefcase />
          </IconTile>
        ),
        keepOpen: true,
        run: () => onOpenDetail({ type: 'experience' }),
      },
      {
        id: 'education',
        group: 'vault',
        title: 'Education',
        subtitle: 'AAMU, JSU, about, leadership',
        keywords: 'education school alabama jacksonville aamu about',
        icon: (
          <IconTile>
            <IconUser />
          </IconTile>
        ),
        keepOpen: true,
        run: () => onOpenDetail({ type: 'education' }),
      },
      {
        id: 'projects',
        group: 'vault',
        title: 'Projects',
        subtitle: 'FICO, Uplift Biz',
        keywords: 'projects fico uplift portfolio',
        icon: (
          <IconTile>
            <IconLayers />
          </IconTile>
        ),
        keepOpen: true,
        run: () => onOpenDetail({ type: 'projects' }),
      },
      {
        id: 'skills',
        group: 'vault',
        title: 'Skills & recognition',
        subtitle: 'languages, cloud, awards',
        keywords: 'skills recognition awards stack python typescript',
        icon: (
          <IconTile>
            <IconSpark />
          </IconTile>
        ),
        keepOpen: true,
        run: () => onOpenDetail({ type: 'skills' }),
      },
      {
        id: 'links',
        group: 'vault',
        title: 'Links',
        subtitle: 'LinkedIn, GitHub, email, resume',
        keywords: 'links linkedin github email resume contact',
        icon: (
          <IconTile>
            <IconLink />
          </IconTile>
        ),
        keepOpen: true,
        run: () => onOpenDetail({ type: 'links' }),
      },
      {
        id: 'resume',
        group: 'vault',
        title: 'Open resume PDF',
        subtitle: 'download / view',
        keywords: 'resume cv pdf download',
        icon: (
          <IconTile>
            <IconFile />
          </IconTile>
        ),
        run: () => window.open('/Sudeep_Joshi_Resume.pdf', '_blank', 'noopener,noreferrer'),
      },
    ]

    const q = query.trim().toLowerCase()
    if (!q) return list
    return list.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.subtitle?.toLowerCase().includes(q) ||
        item.keywords.toLowerCase().includes(q),
    )
  }, [onGoHome, onOpenDetail, query])

  useEffect(() => {
    if (!open) {
      setQuery('')
      setActive(0)
      return
    }
    const id = window.setTimeout(() => inputRef.current?.focus(), 10)
    return () => window.clearTimeout(id)
  }, [open])

  useEffect(() => {
    setActive(0)
  }, [query])

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
      if (e.key === 'Enter') {
        e.preventDefault()
        const item = items[active]
        if (!item) return
        item.run()
        if (!item.keepOpen) onOpenChange(false)
      }
    }

    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [active, items, onOpenChange, open])

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
          <div className="absolute inset-0 bg-[#0b0e12]/55 backdrop-blur-md" />

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
              <p className="vault-label">Vault index</p>
            </div>
            <div className="relative flex items-center gap-3 border-b border-line px-4 py-3.5">
              <IconTile className="border-accent/30 bg-accent/10 text-accent">
                <IconSearch />
              </IconTile>
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search sections..."
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

            <div ref={listRef} className="relative min-h-0 flex-1 overflow-y-auto p-2 sm:max-h-[min(52vh,440px)]">
              {items.length === 0 ? (
                <p className="px-3 py-10 text-center text-sm text-mute">No results for “{query}”</p>
              ) : (
                <ul>
                  {items.map((item, index) => {
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
                            <span className="block font-display text-sm font-medium">{item.title}</span>
                            {item.subtitle ? (
                              <span className="mt-0.5 block text-xs text-mute">{item.subtitle}</span>
                            ) : null}
                          </span>
                          <span className="text-[10px] uppercase tracking-wider text-accent sm:hidden">
                            open
                          </span>
                        </button>
                      </li>
                    )
                  })}
                </ul>
              )}
            </div>

            <div className="relative flex items-center justify-between gap-3 border-t border-line px-4 py-3 text-xs text-mute">
              <span>Sections open in the side panel</span>
              <span className="hidden sm:inline">{isMac() ? '⌘/' : 'Ctrl+/'}</span>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}

export function useCommandMenu(toggle: () => void) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === '/') {
        e.preventDefault()
        toggle()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [toggle])
}
