import { useEffect, useRef, useState, type ReactNode } from 'react'
import { motion } from 'framer-motion'

/** Soft fade-in for homepage blocks — always falls back to visible. */
export function FadeIn({
  children,
  className = '',
  delay = 0,
}: {
  children: ReactNode
  className?: string
  delay?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setReady(true)
      return
    }

    let done = false
    const reveal = () => {
      if (done) return
      done = true
      setReady(true)
    }

    // Fallback so content never stays invisible
    const fallback = window.setTimeout(reveal, 900 + delay * 1000)

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return
        reveal()
        observer.disconnect()
      },
      { threshold: 0.01, rootMargin: '40px 0px' },
    )

    observer.observe(el)

    // If already on screen at mount, reveal immediately
    const rect = el.getBoundingClientRect()
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      window.setTimeout(reveal, Math.max(0, delay * 1000))
    }

    return () => {
      observer.disconnect()
      window.clearTimeout(fallback)
    }
  }, [delay])

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 10 }}
      animate={ready ? { opacity: 1, y: 0 } : { opacity: 0.001, y: 10 }}
      transition={{ duration: 0.45, delay: ready ? delay : 0, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}
