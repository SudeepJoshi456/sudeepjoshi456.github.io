import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { profile } from '../data/content'

const steps = [
  'authenticating visitor',
  'verifying clearance',
  `unlocking ${profile.name}`,
  'opening professional vault',
]

type VaultEntranceProps = {
  onComplete: () => void
}

export function VaultEntrance({ onComplete }: VaultEntranceProps) {
  const [step, setStep] = useState(0)
  const [progress, setProgress] = useState(0)
  const [phase, setPhase] = useState<'boot' | 'open'>('boot')
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      onComplete()
      return
    }

    const timers: number[] = []
    timers.push(window.setTimeout(() => setStep(1), 700))
    timers.push(window.setTimeout(() => setStep(2), 1400))
    timers.push(window.setTimeout(() => setStep(3), 2100))
    timers.push(window.setTimeout(() => setPhase('open'), 2800))
    timers.push(
      window.setTimeout(() => {
        setVisible(false)
        window.setTimeout(onComplete, 450)
      }, 3900),
    )

    const start = performance.now()
    let raf = 0
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / 2800)
      setProgress(t)
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    return () => {
      timers.forEach(clearTimeout)
      cancelAnimationFrame(raf)
    }
  }, [onComplete])

  const skip = () => {
    setVisible(false)
    window.setTimeout(onComplete, 200)
  }

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-[#070908] text-[#e8efe9]"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.45 }}
        >
          <motion.div
            className="absolute inset-y-0 left-0 w-1/2 border-r border-white/10 bg-[linear-gradient(90deg,#0a0e0c,#121816)]"
            animate={phase === 'open' ? { x: '-105%' } : { x: 0 }}
            transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
          />
          <motion.div
            className="absolute inset-y-0 right-0 w-1/2 border-l border-white/10 bg-[linear-gradient(270deg,#0a0e0c,#121816)]"
            animate={phase === 'open' ? { x: '105%' } : { x: 0 }}
            transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
          />

          <div
            className="pointer-events-none absolute inset-0 opacity-30 mix-blend-overlay"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.55'/%3E%3C/svg%3E\")",
            }}
          />

          <div className="relative z-10 w-full max-w-md px-6 text-center">
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-6 text-[10px] uppercase tracking-[0.35em] text-[#7d8a81]"
            >
              secure entry
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, letterSpacing: '0.4em', filter: 'blur(8px)' }}
              animate={{ opacity: 1, letterSpacing: '0.08em', filter: 'blur(0px)' }}
              transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
              className="font-display text-3xl font-bold text-[#edf2ee] sm:text-4xl"
            >
              {profile.name}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.5 }}
              className="mt-3 text-sm text-[#9aada0]"
            >
              entering professional vault
            </motion.p>

            <div className="mx-auto mt-10 h-[2px] w-full max-w-xs overflow-hidden rounded-full bg-white/10">
              <motion.div className="h-full origin-left bg-[#7ddea8]" style={{ scaleX: progress }} />
            </div>

            <div className="mt-6 min-h-[1.5rem] font-mono text-xs text-[#7ddea8]">
              <AnimatePresence mode="wait">
                <motion.span
                  key={steps[Math.min(step, steps.length - 1)]}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.25 }}
                  className="inline-block"
                >
                  {steps[Math.min(step, steps.length - 1)]}
                  <span className="ml-1 animate-pulse">_</span>
                </motion.span>
              </AnimatePresence>
            </div>

            <button
              type="button"
              onClick={skip}
              className="mt-10 text-[11px] uppercase tracking-[0.2em] text-[#7d8a81] transition hover:text-[#edf2ee]"
            >
              skip
            </button>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
