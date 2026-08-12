import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  CommandPalette,
  useCommandMenu,
  type DetailView,
} from './components/CommandPalette'
import { CursorAura } from './components/CursorAura'
import { DetailPanel } from './components/DetailPanel'
import { FadeIn } from './components/FadeIn'
import { IconMark } from './components/Icons'
import { VaultEntrance } from './components/VaultEntrance'
import { experience, leadership, profile, projects } from './data/content'
import { useTheme } from './hooks/useTheme'

function Arrow() {
  return <span className="mt-[0.15em] select-none text-accent">↳</span>
}

function isMac() {
  return typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform)
}

function companyTone(company: string): 'ms' | 'amz' | 'wgi' | 'default' {
  if (company === 'Microsoft') return 'ms'
  if (company === 'Amazon') return 'amz'
  if (company === 'WGI') return 'wgi'
  return 'default'
}

const bigTech = experience.filter((job) => job.company === 'Microsoft' || job.company === 'Amazon')
const otherExp = experience.filter((job) => job.company !== 'Microsoft' && job.company !== 'Amazon')

const highlights = [
  '3 Big Tech internships (Microsoft, Amazon ×2)',
  'Shipped Copilot AI and Slack/AWS features used by managers in production',
  'CS @ Alabama A&M, 4.0 GPA, open to full-time roles',
]

export default function App() {
  const [vaultDone, setVaultDone] = useState(() => {
    if (typeof window === 'undefined') return true
    return sessionStorage.getItem('vault-entered') === '1'
  })
  const [paletteOpen, setPaletteOpen] = useState(false)
  const [detail, setDetail] = useState<DetailView>(null)
  const [showTip, setShowTip] = useState(false)
  const { theme, toggle } = useTheme()
  const mod = isMac() ? '⌘' : 'Ctrl'

  const finishVault = useCallback(() => {
    sessionStorage.setItem('vault-entered', '1')
    setVaultDone(true)
  }, [])

  const togglePalette = useCallback(() => {
    setPaletteOpen((open) => !open)
    setShowTip(false)
    localStorage.setItem('seen-cmd-tip', '1')
  }, [])

  useCommandMenu(togglePalette)

  useEffect(() => {
    if (!vaultDone || localStorage.getItem('seen-cmd-tip')) return
    const t = window.setTimeout(() => setShowTip(true), 1400)
    return () => window.clearTimeout(t)
  }, [vaultDone])

  const openDetail = useCallback((view: Exclude<DetailView, null>) => {
    setDetail(view)
  }, [])

  const dismissTip = () => {
    setShowTip(false)
    localStorage.setItem('seen-cmd-tip', '1')
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      {!vaultDone ? <VaultEntrance onComplete={finishVault} /> : null}
      <CursorAura />

      <div className="site-backdrop" aria-hidden>
        <div className="site-backdrop__wash" />
        <div className="site-backdrop__dots" />
        <div className="site-backdrop__dots site-backdrop__dots--accent" />
        <div className="site-backdrop__vignette" />
      </div>

      <motion.div
        initial={false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        style={{ visibility: vaultDone ? 'visible' : 'hidden' }}
      >
        <header className="mx-auto flex max-w-lg items-center justify-between px-5 pt-7 sm:px-6">
          <h1 className="font-display text-[15px] font-bold tracking-tight text-ink sm:text-base">
            {profile.name}
          </h1>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={togglePalette}
              className="inline-flex items-center gap-1.5 rounded-full border border-accent/25 bg-accent/10 px-2.5 py-1 text-[11px] text-accent transition hover:bg-accent/20"
              aria-label="Open command menu"
            >
              <span className="hidden sm:inline">search</span>
              <kbd className="rounded border border-accent/30 bg-bg/60 px-1 py-0.5 text-[10px]">
                {mod}/
              </kbd>
            </button>
            <button
              type="button"
              onClick={toggle}
              className="rounded-full border border-line px-2.5 py-1 text-[11px] text-mute transition hover:text-ink"
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
            >
              {theme === 'dark' ? 'light' : 'dark'}
            </button>
          </div>
        </header>

        <main className="mx-auto max-w-lg px-5 pb-20 pt-14 sm:px-6 sm:pt-20">
          <FadeIn delay={0.02}>
            <p className="text-sm text-ink-soft">{profile.title}</p>
            <p className="mt-2 text-sm text-mute">{profile.school}</p>
          </FadeIn>

          <FadeIn delay={0.06} className="mt-12">
            <p className="mb-4 text-[11px] font-medium uppercase tracking-[0.18em] text-mute">
              highlights
            </p>
            <ul className="space-y-3 text-sm leading-relaxed text-ink-soft">
              {highlights.map((line) => (
                <li key={line} className="grid grid-cols-[1rem_1fr] gap-2.5">
                  <Arrow />
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </FadeIn>

          <FadeIn delay={0.08} className="mt-12">
            <div className="mb-4 flex items-baseline justify-between gap-3">
              <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-mute">
                experience
              </p>
              <button
                type="button"
                onClick={togglePalette}
                className="text-[11px] text-accent transition hover:underline hover:underline-offset-4"
              >
                search all
              </button>
            </div>

            <ul className="divide-y divide-line/80 border-y border-line/80">
              {bigTech.map((job) => (
                <li key={job.id}>
                  <button
                    type="button"
                    onClick={() => openDetail({ type: 'experience', id: job.id })}
                    className="group flex w-full items-start gap-3 py-4 text-left transition-colors hover:bg-wash/50"
                  >
                    <IconMark
                      label={job.company === 'Microsoft' ? 'MS' : 'AZ'}
                      tone={companyTone(job.company)}
                    />
                    <span className="min-w-0 flex-1">
                      <span className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                        <span className="text-sm font-medium text-ink group-hover:text-accent">
                          {job.company}
                        </span>
                        <span className="text-xs text-mute">{job.role}</span>
                      </span>
                      <span className="mt-1 block text-xs text-ink-soft">{job.metric}</span>
                    </span>
                    <span className="mt-1 text-xs text-mute opacity-0 transition group-hover:opacity-100">
                      →
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </FadeIn>

          <FadeIn delay={0.1} className="mt-12">
            <p className="mb-4 text-[11px] font-medium uppercase tracking-[0.18em] text-mute">
              more
            </p>
            <ul className="space-y-3 text-sm text-ink-soft">
              {otherExp.map((job) => (
                <li key={job.id}>
                  <button
                    type="button"
                    onClick={() => openDetail({ type: 'experience', id: job.id })}
                    className="grid w-full grid-cols-[1rem_1fr] gap-2.5 text-left transition hover:text-ink"
                  >
                    <Arrow />
                    <span>
                      <span className="text-ink">{job.company}</span>
                      <span className="text-mute">, {job.metric}</span>
                    </span>
                  </button>
                </li>
              ))}
              {projects.map((project) => (
                <li key={project.id}>
                  <button
                    type="button"
                    onClick={() => openDetail({ type: 'project', id: project.id })}
                    className="grid w-full grid-cols-[1rem_1fr] gap-2.5 text-left transition hover:text-ink"
                  >
                    <Arrow />
                    <span>
                      <span className="text-ink">{project.title}</span>
                      {project.highlight ? (
                        <span className="text-mute">, {project.highlight}</span>
                      ) : null}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </FadeIn>

          <FadeIn delay={0.11} className="mt-12">
            <p className="mb-4 text-[11px] font-medium uppercase tracking-[0.18em] text-mute">
              leadership
            </p>
            <ul className="space-y-2.5 text-sm text-ink-soft">
              {leadership.slice(0, 3).map((item) => (
                <li key={item} className="grid grid-cols-[1rem_1fr] gap-2.5">
                  <Arrow />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={() => openDetail({ type: 'about' })}
              className="mt-3 text-[11px] text-accent transition hover:underline hover:underline-offset-4"
            >
              View all
            </button>
          </FadeIn>

          <FadeIn delay={0.12} className="mt-12">
            <nav className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-ink-soft">
              <button
                type="button"
                onClick={() => openDetail({ type: 'about' })}
                className="transition hover:text-accent"
              >
                About
              </button>
              <button type="button" onClick={togglePalette} className="transition hover:text-accent">
                Experience
              </button>
              <button
                type="button"
                onClick={() => openDetail({ type: 'project', id: 'fico' })}
                className="transition hover:text-accent"
              >
                Projects
              </button>
              <button
                type="button"
                onClick={() => openDetail({ type: 'skills' })}
                className="transition hover:text-accent"
              >
                Skills
              </button>
            </nav>
          </FadeIn>

          <FadeIn delay={0.14} className="mt-8 border-t border-line/80 pt-6">
            <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-mute">
              <a href={profile.links.linkedin} target="_blank" rel="noreferrer" className="hover:text-accent">
                LinkedIn
              </a>
              <a href={profile.links.github} target="_blank" rel="noreferrer" className="hover:text-accent">
                GitHub
              </a>
              <a href={`mailto:${profile.email}`} className="hover:text-accent">
                Email
              </a>
              <a href={profile.links.resume} target="_blank" rel="noreferrer" className="hover:text-accent">
                Resume
              </a>
            </div>
          </FadeIn>
        </main>
      </motion.div>

      <AnimatePresence>
        {showTip ? (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-5 left-1/2 z-30 flex w-[min(92vw,22rem)] -translate-x-1/2 items-center gap-3 rounded-full border border-line bg-panel px-4 py-2.5 shadow-[0_12px_40px_rgba(0,0,0,0.16)] backdrop-blur-md"
          >
            <p className="flex-1 text-xs text-ink-soft">
              press <kbd className="rounded border border-line bg-wash px-1 py-0.5 text-ink">{mod}/</kbd>{' '}
              to explore
            </p>
            <button type="button" onClick={dismissTip} className="text-xs text-mute hover:text-ink">
              ok
            </button>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <CommandPalette
        open={paletteOpen}
        onOpenChange={(open) => {
          setPaletteOpen(open)
          if (open) {
            setShowTip(false)
            localStorage.setItem('seen-cmd-tip', '1')
          }
        }}
        onOpenDetail={openDetail}
        onGoHome={() => setDetail(null)}
      />

      {detail ? <DetailPanel view={detail} onClose={() => setDetail(null)} /> : null}
    </div>
  )
}
