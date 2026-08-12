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
      title: 'Open About & education',
      detail: 'In Search, tap “About & education” (near the top)',
    },
    {
      id: 3,
      title: 'Open an Experience',
      detail: 'Still in Search, open any Microsoft / Amazon role',
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
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-accent">
            Vault quest · {progress}/{total}
          </p>
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-ink">
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
                  className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[9px] font-bold ${
                    done ? 'bg-accent text-bg' : active ? 'bg-ink text-bg' : 'border border-line text-mute'
                  }`}
                >
                  {done ? '✓' : mission.id}
                </span>
                <span className="min-w-0">
                  <span className={`block text-xs font-semibold ${active ? 'text-ink' : 'text-ink-soft'}`}>
                    {mission.title}
                    {active ? (
                      <span className="ml-1.5 text-[9px] uppercase tracking-wider text-accent">now</span>
                    ) : null}
                  </span>
                  {active ? (
                    <span className="mt-0.5 block text-[11px] leading-snug text-mute">{mission.detail}</span>
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

const endings = [
  {
    id: 'recruit' as const,
    title: 'Recruit for a team',
    detail: "You're hiring — open a transmission.",
    mailSubject: 'Vault recruit — opportunity',
  },
  {
    id: 'briefing' as const,
    title: 'Send a briefing',
    detail: 'Not hiring yet — still want to connect.',
    mailSubject: 'Saw your vault — quick chat?',
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
  const selected = endings.find((e) => e.id === intent)

  useEffect(() => {
    if (!celebrate) setIntent(null)
  }, [celebrate])

  return (
    <AnimatePresence>
      {celebrate ? (
        <motion.div
          key="celebrate"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[80] flex items-end justify-center bg-[#020617]/45 px-4 pb-6 backdrop-blur-sm sm:items-center sm:pb-0"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) {
              setIntent(null)
              onDismissCelebrate()
            }
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
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-accent">
              Clearance granted
            </p>
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
                onClick={() => {
                  setIntent(null)
                  onDismissCelebrate()
                }}
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
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-accent">
                      Reach out via
                    </p>
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
          '0 0 0 0 rgba(8,145,178,0)',
          '0 0 0 8px rgba(8,145,178,0.12)',
          '0 0 0 0 rgba(8,145,178,0)',
        ],
      }}
      transition={{ duration: 2.4, repeat: Infinity }}
      className="inline-flex items-center gap-1.5 rounded-full border border-accent/35 bg-accent/12 px-2.5 py-1.5 text-[11px] text-accent"
    >
      <span>Search</span>
      {!touch ? (
        <kbd className="rounded border border-accent/35 bg-bg/70 px-1 py-0.5 text-[10px]">{shortcut}</kbd>
      ) : (
        <span className="rounded border border-accent/35 bg-bg/70 px-1 py-0.5 text-[10px]">tap</span>
      )}
    </motion.button>
  )
}
