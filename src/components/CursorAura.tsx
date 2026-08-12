import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

/** Futuristic radar-blip cursor for fine pointers. */
export function CursorAura() {
  const [visible, setVisible] = useState(false)
  const [hovering, setHovering] = useState(false)
  const [enabled, setEnabled] = useState(false)

  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const springX = useSpring(x, { stiffness: 380, damping: 32, mass: 0.28 })
  const springY = useSpring(y, { stiffness: 380, damping: 32, mass: 0.28 })

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
      <div className={`relative transition-transform duration-200 ${hovering ? 'scale-125' : 'scale-100'}`}>
        {/* Expanding radar rings */}
        <span className="radar-ring radar-ring--a" />
        <span className="radar-ring radar-ring--b" />

        {/* Crosshair ticks */}
        <span className="absolute left-1/2 top-0 h-1.5 w-px -translate-x-1/2 -translate-y-3 bg-accent/70" />
        <span className="absolute bottom-0 left-1/2 h-1.5 w-px -translate-x-1/2 translate-y-3 bg-accent/70" />
        <span className="absolute left-0 top-1/2 h-px w-1.5 -translate-x-3 -translate-y-1/2 bg-accent/70" />
        <span className="absolute right-0 top-1/2 h-px w-1.5 -translate-y-1/2 translate-x-3 bg-accent/70" />

        {/* Core blip */}
        <span
          className={`relative z-10 block rounded-full bg-accent shadow-[0_0_12px_color-mix(in_srgb,var(--accent)_70%,transparent)] ${
            hovering ? 'h-2.5 w-2.5' : 'h-2 w-2'
          }`}
        />
      </div>
    </motion.div>
  )
}
