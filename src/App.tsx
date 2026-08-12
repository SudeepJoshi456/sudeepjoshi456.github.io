import { useCallback, useState, type ReactNode } from 'react'
import { motion } from 'framer-motion'
import {
  CommandPalette,
  useCommandMenu,
  type DetailView,
} from './components/CommandPalette'
import { CommandQuest, QuestTracker, SealedVaultCard, SearchPulse, VaultCompleteNotice } from './components/CommandQuest'
import { BrandLogo } from './components/BrandLogo'
import { CursorAura } from './components/CursorAura'
import { DetailPanel } from './components/DetailPanel'
import { FadeIn } from './components/FadeIn'
import { SiteBackdrop } from './components/SiteBackdrop'
import { VaultEntrance } from './components/VaultEntrance'
import { highlightLines, profile } from './data/content'
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
  const [noticeDismissed, setNoticeDismissed] = useState(false)
  const { theme, toggle } = useTheme()
  const touch = useIsTouch()
  const shortcut = useShortcutLabel()
  const unlocked = questProgress >= QUEST_TOTAL

  const completeMission = useCallback((mission: 1 | 2 | 3) => {
    setQuestProgress((prev) => {
      if (mission !== prev + 1) return prev
      return prev + 1
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
      if (view.type === 'experience') completeMission(2)
      if (view.type === 'education' || view.type === 'about') completeMission(3)
    },
    [completeMission],
  )

  const openVault = () => {
    setNoticeDismissed(true)
    setShowCelebrate(true)
  }

  const dismissCelebrate = () => {
    setShowCelebrate(false)
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      {!vaultDone ? <VaultEntrance onComplete={finishVault} /> : null}
      <CursorAura />

      <SiteBackdrop />

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
              <SealedVaultCard onOpen={openVault} />
            </FadeIn>
          ) : null}

          <FadeIn delay={0.06} className="mt-10">
            <SectionRail
              label="highlights"
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
            <ul className="space-y-2.5 text-sm text-ink-soft">
              {highlightLines.map((line) => (
                <li key={line.text}>
                  <button
                    type="button"
                    onClick={() =>
                      openDetail(
                        line.logo === 'aamu' || line.logo === 'nsf'
                          ? { type: 'education' }
                          : { type: 'experience' },
                      )
                    }
                    className="grid w-full grid-cols-[1.5rem_1fr] items-center gap-2.5 text-left transition hover:text-ink"
                  >
                    {line.logo ? (
                      <BrandLogo id={line.logo} label={line.text} className="h-6 w-6" />
                    ) : (
                      <Arrow />
                    )}
                    <span className="text-ink">{line.text}</span>
                  </button>
                </li>
              ))}
            </ul>
          </FadeIn>

          <FadeIn delay={0.12} className="mt-8 border-t border-line/80 pt-6">
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

      <VaultCompleteNotice
        visible={vaultDone && unlocked && !showCelebrate && !noticeDismissed}
        onOpen={openVault}
        onDismiss={() => setNoticeDismissed(true)}
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
