import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

export function CursorAura() {
  const [visible, setVisible] = useState(false)
  const [hovering, setHovering] = useState(false)
  const [enabled, setEnabled] = useState(false)

  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const springX = useSpring(x, { stiffness: 280, damping: 28, mass: 0.4 })
  const springY = useSpring(y, { stiffness: 280, damping: 28, mass: 0.4 })
  const ringX = useSpring(x, { stiffness: 140, damping: 22, mass: 0.55 })
  const ringY = useSpring(y, { stiffness: 140, damping: 22, mass: 0.55 })

  useEffect(() => {
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
      const interactive = target.closest('a, button, [role="button"], input, label')
      setHovering(Boolean(interactive))
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
  }, [x, y])

  if (!enabled) return null

  return (
    <>
      <motion.div
        aria-hidden
        className="pointer-events-none fixed top-0 left-0 z-[90] mix-blend-difference"
        style={{
          x: springX,
          y: springY,
          translateX: '-50%',
          translateY: '-50%',
          opacity: visible ? 1 : 0,
        }}
      >
        <div
          className={`rounded-full bg-white transition-transform duration-200 ${
            hovering ? 'h-2.5 w-2.5 scale-150' : 'h-1.5 w-1.5'
          }`}
        />
      </motion.div>
      <motion.div
        aria-hidden
        className="pointer-events-none fixed top-0 left-0 z-[89]"
        style={{
          x: ringX,
          y: ringY,
          translateX: '-50%',
          translateY: '-50%',
          opacity: visible ? 0.9 : 0,
        }}
      >
        <div
          className={`rounded-full border border-accent/70 transition-all duration-300 ${
            hovering ? 'h-12 w-12 bg-accent/10' : 'h-8 w-8 bg-transparent'
          }`}
        />
      </motion.div>
    </>
  )
}
