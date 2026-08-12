import { useEffect, useRef } from 'react'

/**
 * Steel-field backdrop whose dot layers drift with scroll (and lightly with the pointer).
 */
export function SiteBackdrop() {
  const rootRef = useRef<HTMLDivElement>(null)
  const baseRef = useRef<HTMLDivElement>(null)
  const accentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const root = rootRef.current
    const base = baseRef.current
    const accent = accentRef.current
    if (!root || !base || !accent) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return

    let raf = 0
    let targetScroll = window.scrollY
    let targetMx = 0
    let targetMy = 0
    let scroll = targetScroll
    let mx = 0
    let my = 0

    const tick = () => {
      scroll += (targetScroll - scroll) * 0.08
      mx += (targetMx - mx) * 0.06
      my += (targetMy - my) * 0.06

      const sy = scroll * 0.18
      const sy2 = scroll * 0.32
      const px = mx * 14
      const py = my * 10
      const px2 = mx * 22
      const py2 = my * 16

      base.style.transform = `translate3d(${px}px, ${sy + py}px, 0)`
      accent.style.transform = `translate3d(${-px2}px, ${sy2 - py2}px, 0)`

      raf = requestAnimationFrame(tick)
    }

    const onScroll = () => {
      targetScroll = window.scrollY
    }

    const onMove = (e: MouseEvent) => {
      const w = window.innerWidth || 1
      const h = window.innerHeight || 1
      targetMx = (e.clientX / w - 0.5) * 2
      targetMy = (e.clientY / h - 0.5) * 2
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('mousemove', onMove, { passive: true })
    onScroll()
    raf = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('mousemove', onMove)
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
      <div className="site-backdrop__vignette" />
    </div>
  )
}
