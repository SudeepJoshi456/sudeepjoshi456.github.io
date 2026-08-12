import { useEffect, useRef } from 'react'

/**
 * Dot field with a glowing ball that follows the pointer and parts nearby dots.
 */
export function SiteBackdrop() {
  const rootRef = useRef<HTMLDivElement>(null)
  const baseRef = useRef<HTMLDivElement>(null)
  const accentRef = useRef<HTMLDivElement>(null)
  const wakeRef = useRef<HTMLDivElement>(null)
  const glowRef = useRef<HTMLDivElement>(null)
  const shineRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const root = rootRef.current
    const base = baseRef.current
    const accent = accentRef.current
    const wake = wakeRef.current
    const glow = glowRef.current
    const shine = shineRef.current
    if (!root || !base || !accent || !wake || !glow || !shine) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return

    let raf = 0
    let targetScroll = window.scrollY
    let scroll = targetScroll

    let targetX = window.innerWidth * 0.5
    let targetY = window.innerHeight * 0.35
    let x = targetX
    let y = targetY
    let prevX = x
    let prevY = y
    let visible = 0
    let targetVisible = 0

    const tick = () => {
      scroll += (targetScroll - scroll) * 0.08
      prevX = x
      prevY = y
      x += (targetX - x) * 0.22
      y += (targetY - y) * 0.22
      const vx = x - prevX
      const vy = y - prevY
      visible += (targetVisible - visible) * 0.12

      const sy = scroll * 0.12
      const sy2 = scroll * 0.22
      const nx = (x / (window.innerWidth || 1) - 0.5) * 2
      const ny = (y / (window.innerHeight || 1) - 0.5) * 2

      base.style.transform = `translate3d(${nx * 8}px, ${sy + ny * 6}px, 0)`
      accent.style.transform = `translate3d(${-nx * 12}px, ${sy2 - ny * 9}px, 0)`

      const speed = Math.min(1, Math.hypot(vx, vy) / 6)

      // Orb/shine use the same viewport coords as the cursor (fixed layer)
      glow.style.opacity = String(0.5 + visible * 0.5)
      glow.style.left = `${x}px`
      glow.style.top = `${y}px`
      glow.style.transform = `translate(-50%, -50%) scale(${1 + speed * 0.15})`

      shine.style.opacity = String(0.4 + visible * 0.6 + speed * 0.15)
      shine.style.left = `${x}px`
      shine.style.top = `${y}px`
      shine.style.transform = 'translate(-50%, -50%)'

      // Wake is also fixed to the viewport, so mask coords match clientX/Y
      wake.style.setProperty('--spot-x', `${x}px`)
      wake.style.setProperty('--spot-y', `${y}px`)
      wake.style.opacity = String(0.2 + visible * 0.8)
      // Part dots opposite the motion (background shift, not layer offset)
      wake.style.backgroundPosition = `${11 - vx * 3.5}px ${11 - vy * 3.5}px`

      raf = requestAnimationFrame(tick)
    }

    const onScroll = () => {
      targetScroll = window.scrollY
    }

    const onMove = (e: MouseEvent) => {
      targetX = e.clientX
      targetY = e.clientY
      targetVisible = 1
    }

    const onLeave = () => {
      targetVisible = 0.2
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('mousemove', onMove, { passive: true })
    document.addEventListener('mouseleave', onLeave)
    onScroll()
    raf = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseleave', onLeave)
    }
  }, [])

  return (
    <div ref={rootRef} className="site-backdrop" aria-hidden>
      <div className="site-backdrop__wash" />
      <div ref={baseRef} className="site-backdrop__dots site-backdrop__dots--parallax" />
      <div
        ref={accentRef}
        className="site-backdrop__dots site-backdrop__dots--accent site-backdrop__dots--parallax"
      />
      <div ref={wakeRef} className="site-backdrop__dots site-backdrop__dots--wake" />
      <div ref={glowRef} className="site-backdrop__orb" />
      <div ref={shineRef} className="site-backdrop__shine" />
      <div className="site-backdrop__vignette" />
    </div>
  )
}
