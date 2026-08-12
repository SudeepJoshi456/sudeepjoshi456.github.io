import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

/** Vault lock cursor for fine pointers. Falls back to system cursor otherwise. */
export function CursorAura() {
  const [visible, setVisible] = useState(false)
  const [hovering, setHovering] = useState(false)
  const [enabled, setEnabled] = useState(false)

  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const springX = useSpring(x, { stiffness: 320, damping: 30, mass: 0.35 })
  const springY = useSpring(y, { stiffness: 320, damping: 30, mass: 0.35 })

  useEffect(() => {
    try {
      const fine = window.matchMedia('(pointer: fine)').matches
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (!fine || reduced) return
      setEnabled(true)
      document.documentElement.classList.add('has-cursor-aura')

      const move = (e: MouseEvent) => {
        x.set(e.clientX)
        y.set(e.clientY)
        setVisible(true)
      }
      const leave = () => setVisible(false)
      const over = (e: MouseEvent) => {
        const target = e.target as HTMLElement | null
        if (!target) return
        setHovering(Boolean(target.closest('a, button, [role="button"], input, label')))
      }

      window.addEventListener('mousemove', move)
      window.addEventListener('mouseover', over)
      document.addEventListener('mouseleave', leave)

      return () => {
        document.documentElement.classList.remove('has-cursor-aura')
        window.removeEventListener('mousemove', move)
        window.removeEventListener('mouseover', over)
        document.removeEventListener('mouseleave', leave)
      }
    } catch {
      setEnabled(false)
    }
  }, [x, y])

  if (!enabled) return null

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed top-0 left-0 z-[90] -translate-x-1/2 -translate-y-1/2"
      style={{ x: springX, y: springY, opacity: visible ? 1 : 0 }}
    >
      <div
        className={`flex items-center justify-center rounded-full border border-accent/50 bg-panel/90 text-accent shadow-[0_4px_18px_rgba(0,0,0,0.14)] backdrop-blur-sm transition-all duration-200 ${
          hovering ? 'h-9 w-9 scale-110' : 'h-7 w-7'
        }`}
      >
        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" aria-hidden>
          <rect x="5" y="10" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.8" />
          <path
            d="M8 10V7.5a4 4 0 0 1 8 0V10"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <circle cx="12" cy="15" r="1.2" fill="currentColor" />
        </svg>
      </div>
    </motion.div>
  )
}
