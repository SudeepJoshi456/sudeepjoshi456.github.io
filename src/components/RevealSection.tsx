import { useEffect, useRef, useState, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

type RevealSectionProps = {
  id: string
  label: string
  children: ReactNode
  className?: string
  delay?: number
}

export function RevealSection({ id, label, children, className = '', delay = 0 }: RevealSectionProps) {
  const ref = useRef<HTMLElement>(null)
  const [state, setState] = useState<'idle' | 'loading' | 'ready'>('idle')

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      setState('ready')
      return
    }

    let loadTimer: number | undefined
    let started = false

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting || started) return
        started = true
        setState('loading')
        loadTimer = window.setTimeout(() => setState('ready'), 480 + delay)
        observer.disconnect()
      },
      { threshold: 0.18, rootMargin: '0px 0px -6% 0px' },
    )

    observer.observe(el)
    return () => {
      observer.disconnect()
      if (loadTimer) window.clearTimeout(loadTimer)
    }
  }, [delay])

  return (
    <section ref={ref} id={id} className={`relative ${className}`}>
      <AnimatePresence>
        {state === 'loading' ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="absolute -top-1 left-0 z-10 flex w-full items-center gap-3 text-xs text-accent"
          >
            <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />
            <span className="tracking-wide">loading {label}</span>
            <span className="h-px flex-1 bg-gradient-to-r from-accent/50 to-transparent" />
          </motion.div>
        ) : null}
      </AnimatePresence>

      <motion.div
        initial={false}
        animate={
          state === 'ready'
            ? { opacity: 1, y: 0, filter: 'blur(0px)' }
            : { opacity: 0.12, y: 22, filter: 'blur(5px)' }
        }
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={state === 'loading' ? 'pt-7' : ''}
      >
        {children}
      </motion.div>
    </section>
  )
}
