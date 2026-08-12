import { AnimatePresence, motion } from 'framer-motion'
import { useShortcutLabel, useIsTouch } from '../hooks/useDevice'

type CommandQuestProps = {
  open: boolean
  progress: number
  total: number
  unlocked: boolean
  onOpenSearch: () => void
  onDismiss: () => void
}

const titles = ['Mission 1', 'Mission 2', 'Mission 3', 'Clearance granted']

export function CommandQuest({
  open,
  progress,
  total,
  unlocked,
  onOpenSearch,
  onDismiss,
}: CommandQuestProps) {
  const touch = useIsTouch()
  const shortcut = useShortcutLabel()
  const pct = Math.min(100, Math.round((progress / total) * 100))
  const title = unlocked ? titles[3] : titles[Math.min(progress, 2)]

  const hint = touch
    ? 'Tap Search to open the vault menu'
    : `Press ${shortcut} to open the vault menu`

  const nextGoal =
    progress <= 0
      ? 'Open Search'
      : progress === 1
        ? 'Open any Experience'
        : progress === 2
          ? 'Open About or Skills'
          : 'All missions complete'

  if (!open && !unlocked) return null

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          initial={{ opacity: 0, y: 18, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.98 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="fixed bottom-5 left-1/2 z-30 w-[min(94vw,24rem)] -translate-x-1/2 overflow-hidden rounded-2xl border border-accent/30 bg-panel shadow-[0_18px_60px_rgba(0,0,0,0.22)] backdrop-blur-xl"
        >
          <div className="absolute inset-x-0 top-0 h-1 bg-wash">
            <motion.div
              className="h-full bg-accent"
              initial={false}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>

          <div className="p-4 pt-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-accent">
                  {title}
                </p>
                <p className="mt-1 text-sm font-medium text-ink">{hint}</p>
                <p className="mt-1 text-xs text-mute">
                  {progress}/{total}, {nextGoal}
                </p>
              </div>
              {!touch ? (
                <motion.kbd
                  animate={{ scale: [1, 1.06, 1], boxShadow: ['0 0 0 0 rgba(8,145,178,0)', '0 0 0 6px rgba(8,145,178,0.15)', '0 0 0 0 rgba(8,145,178,0)'] }}
                  transition={{ duration: 2.2, repeat: Infinity }}
                  className="rounded-lg border border-accent/40 bg-accent/10 px-2 py-1 font-mono text-xs text-accent"
                >
                  {shortcut}
                </motion.kbd>
              ) : null}
            </div>

            <div className="mt-3 flex gap-1.5">
              {Array.from({ length: total }).map((_, i) => (
                <span
                  key={i}
                  className={`h-1.5 flex-1 rounded-full ${i < progress ? 'bg-accent' : 'bg-line'}`}
                />
              ))}
            </div>

            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={onOpenSearch}
                className="flex-1 rounded-xl bg-ink px-3 py-2.5 text-sm font-medium text-bg transition hover:bg-accent"
              >
                {touch ? 'Open Search' : `Try ${shortcut}`}
              </button>
              <button
                type="button"
                onClick={onDismiss}
                className="rounded-xl border border-line px-3 py-2.5 text-sm text-mute hover:text-ink"
              >
                Later
              </button>
            </div>
          </div>
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
      animate={{ boxShadow: ['0 0 0 0 rgba(8,145,178,0)', '0 0 0 8px rgba(8,145,178,0.12)', '0 0 0 0 rgba(8,145,178,0)'] }}
      transition={{ duration: 2.4, repeat: Infinity }}
      className="inline-flex items-center gap-1.5 rounded-full border border-accent/35 bg-accent/12 px-2.5 py-1.5 text-[11px] text-accent"
    >
      <span>{touch ? 'Search' : 'Search'}</span>
      {!touch ? (
        <kbd className="rounded border border-accent/35 bg-bg/70 px-1 py-0.5 text-[10px]">{shortcut}</kbd>
      ) : (
        <span className="rounded border border-accent/35 bg-bg/70 px-1 py-0.5 text-[10px]">tap</span>
      )}
    </motion.button>
  )
}
