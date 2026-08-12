import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { profile } from '../data/content'
import { useIsTouch, useShortcutLabel } from '../hooks/useDevice'

type Mission = {
  id: number
  title: string
  detail: string
}

export function getMissions(touch: boolean, shortcut: string): Mission[] {
  return [
    {
      id: 1,
      title: 'Open Search',
      detail: touch ? 'Tap Search in the top right' : `Press ${shortcut} or tap Search`,
    },
    {
      id: 2,
      title: 'Open an Experience',
      detail: 'In Search, open any Microsoft / Amazon role (right under Home)',
    },
    {
      id: 3,
      title: 'Open About & education',
      detail: 'Still in Search, tap “About & education”',
    },
  ]
}

/** Always-visible checklist while the quest is active. */
export function QuestTracker({
  progress,
  total,
  visible,
}: {
  progress: number
  total: number
  visible: boolean
}) {
  const touch = useIsTouch()
  const shortcut = useShortcutLabel()
  const missions = getMissions(touch, shortcut)

  if (!visible) return null

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-[70] flex justify-center px-3 pb-3">
      <div className="pointer-events-auto w-full max-w-lg rounded-xl border border-accent/35 bg-panel/95 p-3 shadow-[0_12px_40px_rgba(0,0,0,0.18)] backdrop-blur-md">
        <div className="mb-2 flex items-center justify-between gap-2">
          <p className="vault-label vault-label--accent">
            Clearance · {progress}/{total}
          </p>
          <p className="vault-label">
            {progress >= total
              ? 'Complete'
              : `Next: ${missions[Math.min(progress, total - 1)]?.title}`}
          </p>
        </div>
        <ol className="space-y-1.5">
          {missions.map((mission) => {
            const done = progress >= mission.id
            const active = !done && progress + 1 === mission.id
            return (
              <li
                key={mission.id}
                className={`flex items-start gap-2 rounded-lg px-2 py-1.5 text-left ${
                  active ? 'bg-accent/15 ring-1 ring-accent/40' : done ? 'opacity-70' : 'opacity-45'
                }`}
              >
                <span
                  className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
                    done ? 'bg-accent text-bg' : active ? 'bg-ink text-bg' : 'border border-line text-mute'
                  }`}
                >
                  {done ? '✓' : mission.id}
                </span>
                <span className="min-w-0">
                  <span className={`block text-sm font-semibold ${active ? 'text-ink' : 'text-ink-soft'}`}>
                    {mission.title}
                    {active ? (
                      <span className="ml-1.5 text-[10px] font-semibold uppercase tracking-wide text-accent">
                        now
                      </span>
                    ) : null}
                  </span>
                  {active ? (
                    <span className="mt-0.5 block text-xs leading-snug text-mute">{mission.detail}</span>
                  ) : null}
                </span>
              </li>
            )
          })}
        </ol>
      </div>
    </div>
  )
}

/** Bottom notice after quest complete. Does not interrupt browsing. */
export function VaultCompleteNotice({
  visible,
  onOpen,
  onDismiss,
}: {
  visible: boolean
  onOpen: () => void
  onDismiss: () => void
}) {
  if (!visible) return null

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-[75] flex justify-center px-3 pb-3">
      <div className="pointer-events-auto w-full max-w-lg rounded-xl border border-accent/40 bg-panel/95 p-3 shadow-[0_12px_40px_rgba(0,0,0,0.2)] backdrop-blur-md">
        <div className="flex items-start gap-3">
          <span aria-hidden className="mt-0.5 text-xl">
            🔐
          </span>
          <div className="min-w-0 flex-1">
            <p className="vault-label vault-label--accent">Clearance complete</p>
            <p className="mt-1 text-sm leading-snug text-ink">
              Quest finished. Keep exploring, or open the vault when you are ready.
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={onOpen}
                className="rounded-lg bg-ink px-3 py-2 text-xs font-medium text-bg transition hover:bg-accent"
              >
                Open vault
              </button>
              <button
                type="button"
                onClick={onDismiss}
                className="rounded-lg px-3 py-2 text-xs font-medium text-mute transition hover:text-ink"
              >
                Keep exploring
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/** Homepage invite: sealed vault, only opens when the visitor chooses. */
export function SealedVaultCard({ onOpen }: { onOpen: () => void }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="group w-full rounded-xl border border-accent/30 bg-accent/10 px-3 py-3 text-left transition hover:bg-accent/15"
    >
      <span className="flex items-start gap-3">
        <motion.span
          aria-hidden
          className="mt-0.5 text-2xl"
          animate={{ y: [0, -2, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
        >
          🔐
        </motion.span>
        <span className="min-w-0 flex-1">
          <span className="vault-label vault-label--accent">Vault sealed</span>
          <span className="mt-1 block text-sm font-semibold text-ink">
            Quest complete. Open the vault when you are ready.
          </span>
          <span className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-accent">
            Open vault
            <span className="transition group-hover:translate-x-0.5" aria-hidden>
              →
            </span>
          </span>
        </span>
      </span>
    </button>
  )
}

const endings = [
  {
    id: 'recruit' as const,
    title: 'Recruit for a team',
    detail: "You're hiring for new grads. Open a transmission.",
    mailSubject: 'Vault recruit: new grad role',
  },
  {
    id: 'briefing' as const,
    title: 'Send a briefing',
    detail: 'Not hiring yet. Still want to connect.',
    mailSubject: 'Saw your vault: quick chat?',
  },
]

export function CommandQuest({
  celebrate,
  onDismissCelebrate,
}: {
  celebrate: boolean
  onDismissCelebrate: () => void
}) {
  const [intent, setIntent] = useState<'recruit' | 'briefing' | null>(null)
  const [phase, setPhase] = useState<'opening' | 'open'>('opening')
  const selected = endings.find((e) => e.id === intent)

  useEffect(() => {
    if (!celebrate) {
      setIntent(null)
      setPhase('opening')
      return
    }

    setPhase('opening')
    setIntent(null)
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const timer = window.setTimeout(() => setPhase('open'), reduced ? 0 : 1100)
    return () => clearTimeout(timer)
  }, [celebrate])

  const close = () => {
    setIntent(null)
    onDismissCelebrate()
  }

  return (
    <AnimatePresence>
      {celebrate ? (
        <motion.div
          key="celebrate"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[80] flex items-end justify-center bg-[#0b0e12]/50 px-4 pb-6 backdrop-blur-sm sm:items-center sm:pb-0"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget && phase === 'open') close()
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 28, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-md overflow-hidden rounded-2xl border border-accent/40 bg-bg p-5 shadow-[0_24px_80px_rgba(0,0,0,0.35)]"
          >
            <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-accent/20 blur-2xl" />

            <AnimatePresence mode="wait">
              {phase === 'opening' ? (
                <motion.div
                  key="opening"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="py-6 text-center"
                >
                  <p className="vault-label vault-label--accent">Opening vault</p>
                  <div className="relative mx-auto mt-6 h-28 w-44 overflow-hidden rounded-xl border border-line bg-wash">
                    <motion.div
                      className="absolute inset-y-0 left-0 w-1/2 border-r border-line bg-panel"
                      initial={{ x: 0 }}
                      animate={{ x: '-105%' }}
                      transition={{ duration: 0.85, ease: [0.76, 0, 0.24, 1], delay: 0.15 }}
                    />
                    <motion.div
                      className="absolute inset-y-0 right-0 w-1/2 border-l border-line bg-panel"
                      initial={{ x: 0 }}
                      animate={{ x: '105%' }}
                      transition={{ duration: 0.85, ease: [0.76, 0, 0.24, 1], delay: 0.15 }}
                    />
                    <motion.span
                      aria-hidden
                      className="absolute inset-0 flex items-center justify-center text-3xl"
                      initial={{ scale: 0.85, opacity: 0.5 }}
                      animate={{ scale: [0.85, 1.08, 1], opacity: 1 }}
                      transition={{ duration: 0.9, delay: 0.2 }}
                    >
                      🔐
                    </motion.span>
                  </div>
                  <p className="mt-5 text-sm text-ink-soft">Clearance confirmed. Stand by.</p>
                </motion.div>
              ) : (
                <motion.div
                  key="open"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <p className="vault-label vault-label--accent">Clearance granted</p>
                  <h2 className="mt-2 font-display text-2xl font-bold tracking-tight text-ink">
                    <span aria-hidden className="mr-1.5">
                      🔐
                    </span>
                    Operator clearance unlocked.
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                    You finished the vault tour. How do you want to proceed?
                  </p>

                  <div className="mt-5 space-y-2">
                    {endings.map((ending) => {
                      const active = intent === ending.id
                      return (
                        <button
                          key={ending.id}
                          type="button"
                          onClick={() => setIntent(ending.id)}
                          className={`block w-full rounded-xl border px-4 py-3 text-left transition ${
                            active
                              ? 'border-accent/50 bg-accent/15'
                              : 'border-line bg-wash hover:border-accent/45 hover:bg-accent/10'
                          }`}
                        >
                          <span className="block text-sm font-semibold text-ink">{ending.title}</span>
                          <span className="mt-0.5 block text-xs text-mute">{ending.detail}</span>
                        </button>
                      )
                    })}
                    <button
                      type="button"
                      onClick={close}
                      className="block w-full rounded-xl border border-line bg-wash px-4 py-3 text-left transition hover:bg-panel"
                    >
                      <span className="block text-sm font-semibold text-ink">Decline mission</span>
                      <span className="mt-0.5 block text-xs text-mute">Keep browsing the vault.</span>
                    </button>
                  </div>

                  <AnimatePresence initial={false}>
                    {selected ? (
                      <motion.div
                        key={selected.id}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.22 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-4 rounded-xl border border-accent/30 bg-accent/10 p-3">
                          <p className="vault-label vault-label--accent">Reach out via</p>
                          <div className="mt-2 grid grid-cols-2 gap-2">
                            <a
                              href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(profile.email)}&su=${encodeURIComponent(selected.mailSubject)}`}
                              target="_blank"
                              rel="noreferrer"
                              className="rounded-xl bg-ink px-3 py-2.5 text-center text-sm font-medium text-bg transition hover:bg-accent"
                            >
                              Gmail
                            </a>
                            <a
                              href={profile.links.linkedin}
                              target="_blank"
                              rel="noreferrer"
                              className="rounded-xl border border-line bg-bg px-3 py-2.5 text-center text-sm font-medium text-ink transition hover:border-accent/40 hover:text-accent"
                            >
                              LinkedIn
                            </a>
                          </div>
                        </div>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>

                  <a
                    href={profile.links.resume}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-4 block text-center text-sm text-mute transition hover:text-accent"
                  >
                    Inspect clearance file →
                  </a>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}

export function SearchPulse({
  shortcut,
  touch,
  onClick,
}: {
  shortcut: string
  touch: boolean
  onClick: () => void
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      aria-label="Open command menu"
      animate={{
        boxShadow: [
          '0 0 0 0 color-mix(in srgb, var(--accent) 0%, transparent)',
          '0 0 0 8px color-mix(in srgb, var(--accent) 14%, transparent)',
          '0 0 0 0 color-mix(in srgb, var(--accent) 0%, transparent)',
        ],
      }}
      transition={{ duration: 2.4, repeat: Infinity }}
      className="inline-flex items-center gap-1.5 rounded-full border border-accent/35 bg-accent/12 px-2.5 py-1.5 text-xs text-accent"
    >
      <span className="font-display font-medium">Search</span>
      {!touch ? (
        <kbd className="rounded border border-accent/35 bg-bg/70 px-1 py-0.5 font-body text-[10px]">{shortcut}</kbd>
      ) : (
        <span className="rounded border border-accent/35 bg-bg/70 px-1 py-0.5 font-body text-[10px]">tap</span>
      )}
    </motion.button>
  )
}
