import { useCallback, useState, type ReactNode } from 'react'
import { motion } from 'framer-motion'
import {
  CommandPalette,
  useCommandMenu,
  type DetailView,
} from './components/CommandPalette'
import { CommandQuest, QuestTracker, SealedVaultCard, SearchPulse } from './components/CommandQuest'
import { CursorAura } from './components/CursorAura'
import { DetailPanel } from './components/DetailPanel'
import { FadeIn } from './components/FadeIn'
import { IconMark } from './components/Icons'
import { VaultEntrance } from './components/VaultEntrance'
import { experience, leadership, profile, projects } from './data/content'
import { useIsTouch, useShortcutLabel } from './hooks/useDevice'
import { useTheme } from './hooks/useTheme'

function Arrow() {
  return <span className="mt-[0.15em] select-none text-accent">↳</span>
}

function SectionRail({
  label,
  action,
}: {
  label: string
  action?: ReactNode
}) {
  return (
    <div className="mb-4 flex items-baseline justify-between gap-3">
      <p className="vault-label">{label}</p>
      {action}
    </div>
  )
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
  'CS @ Alabama A&M, 4.0 GPA, looking for new grad roles',
]

const QUEST_TOTAL = 3

export default function App() {
  const [vaultDone, setVaultDone] = useState(() => {
    if (typeof window === 'undefined') return true
    return sessionStorage.getItem('vault-entered') === '1'
  })
  const [paletteOpen, setPaletteOpen] = useState(false)
  const [detail, setDetail] = useState<DetailView>(null)
  const [showCelebrate, setShowCelebrate] = useState(false)
  const [questProgress, setQuestProgress] = useState(0)
  const { theme, toggle } = useTheme()
  const touch = useIsTouch()
  const shortcut = useShortcutLabel()
  const unlocked = questProgress >= QUEST_TOTAL

  /** Only advance one step at a time, in order. Resets on refresh. */
  const completeMission = useCallback((mission: 1 | 2 | 3) => {
    setQuestProgress((prev) => {
      if (mission !== prev + 1) return prev
      const next = prev + 1
      if (next >= QUEST_TOTAL) {
        // Close Search/detail so the sealed-vault invite can appear on the homepage.
        queueMicrotask(() => {
          setPaletteOpen(false)
          setDetail(null)
        })
      }
      return next
    })
  }, [])

  const finishVault = useCallback(() => {
    sessionStorage.setItem('vault-entered', '1')
    setVaultDone(true)
  }, [])

  const openPalette = useCallback(() => {
    setPaletteOpen(true)
    completeMission(1)
  }, [completeMission])

  const togglePalette = useCallback(() => {
    setPaletteOpen((open) => {
      const next = !open
      if (next) completeMission(1)
      return next
    })
  }, [completeMission])

  useCommandMenu(togglePalette)

  const openDetail = useCallback(
    (view: Exclude<DetailView, null>) => {
      setDetail(view)
      if (view.type === 'about') completeMission(2)
      if (view.type === 'experience') completeMission(3)
    },
    [completeMission],
  )

  const dismissCelebrate = () => {
    setShowCelebrate(false)
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
        className="vault-shell min-h-screen"
      >
        <div className="vault-shell__floor" aria-hidden />
        <header className="mx-auto flex max-w-lg items-center justify-between px-5 pt-7 sm:px-6">
          <div>
            <p className="vault-label">Professional vault</p>
            <h1 className="mt-1 font-display text-base font-bold tracking-tight text-ink sm:text-lg">
              {profile.name}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <SearchPulse shortcut={shortcut} touch={touch} onClick={openPalette} />
            <button
              type="button"
              onClick={toggle}
              className="rounded-full border border-line px-2.5 py-1 text-xs text-mute transition hover:text-ink"
              aria-label={`Switch to ${theme === 'dark' ? 'daylight' : 'night'} vault lighting`}
            >
              {theme === 'dark' ? 'day' : 'night'}
            </button>
          </div>
        </header>

        <main className="mx-auto max-w-lg px-5 pb-44 pt-14 sm:px-6 sm:pt-20">
          <FadeIn delay={0.02}>
            <p className="text-sm text-ink-soft">{profile.title}</p>
            <p className="mt-2 text-sm text-mute">{profile.school}</p>
            <p className="mt-3 text-sm font-medium text-accent">{profile.status}</p>
            {!unlocked ? (
              <p className="mt-4 text-sm text-ink-soft">
                Start with{' '}
                <button
                  type="button"
                  onClick={openPalette}
                  className="font-medium text-accent underline decoration-accent/35 underline-offset-4 transition hover:decoration-accent"
                >
                  Search
                </button>{' '}
                to tour the vault.
              </p>
            ) : null}
          </FadeIn>

          {unlocked ? (
            <FadeIn delay={0.04} className="mt-8">
              <SealedVaultCard onOpen={() => setShowCelebrate(true)} />
            </FadeIn>
          ) : null}

          <FadeIn delay={0.06} className="mt-12">
            <SectionRail label="highlights" />
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
            <SectionRail
              label="experience"
              action={
                <button
                  type="button"
                  onClick={openPalette}
                  className="text-xs font-medium text-accent transition hover:underline hover:underline-offset-4"
                >
                  search vault
                </button>
              }
            />

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
            <SectionRail label="more" />
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
            <SectionRail label="leadership" />
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
              className="mt-3 text-xs font-medium text-accent transition hover:underline hover:underline-offset-4"
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
              <button type="button" onClick={openPalette} className="transition hover:text-accent">
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

      <QuestTracker
        progress={questProgress}
        total={QUEST_TOTAL}
        visible={vaultDone && !unlocked && !showCelebrate}
      />

      <CommandQuest celebrate={showCelebrate} onDismissCelebrate={dismissCelebrate} />

      <CommandPalette
        open={paletteOpen}
        onOpenChange={(open) => {
          setPaletteOpen(open)
          if (open) completeMission(1)
        }}
        onOpenDetail={openDetail}
        onGoHome={() => setDetail(null)}
      />

      {detail ? <DetailPanel view={detail} onClose={() => setDetail(null)} /> : null}
    </div>
  )
}
