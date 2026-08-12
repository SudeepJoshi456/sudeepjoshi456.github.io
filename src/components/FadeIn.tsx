import { useEffect, useRef, useState, type ReactNode } from 'react'
import { motion } from 'framer-motion'

/** Soft fade-in for homepage blocks — no loading chrome. */
export function FadeIn({
  children,
  className = '',
  delay = 0,
  once = true,
}: {
  children: ReactNode
  className?: string
  delay?: number
  once?: boolean
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

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return
        setReady(true)
        if (once) observer.disconnect()
      },
      { threshold: 0.12, rootMargin: '0px 0px -4% 0px' },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [once])

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={false}
      animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
      transition={{ duration: 0.5, delay: ready ? delay : 0, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}
