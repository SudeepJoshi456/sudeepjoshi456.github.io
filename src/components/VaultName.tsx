import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

/** Vault-style name reveal: characters decrypt in like a clearance readout. */
export function VaultName({ name }: { name: string }) {
  const [reduced, setReduced] = useState(false)
  const [done, setDone] = useState(false)

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    setReduced(prefersReduced)
    if (prefersReduced) {
      setDone(true)
      return
    }
    const t = window.setTimeout(() => setDone(true), name.length * 55 + 400)
    return () => clearTimeout(t)
  }, [name])

  if (reduced) {
    return (
      <h1 className="font-display text-base font-bold tracking-tight text-ink sm:text-lg">{name}</h1>
    )
  }

  return (
    <h1 className="font-display text-base font-bold tracking-tight text-ink sm:text-lg">
      <span className="sr-only">{name}</span>
      <span aria-hidden className="inline-flex flex-wrap">
        {name.split('').map((char, i) => (
          <motion.span
            key={`${char}-${i}`}
            className={char === ' ' ? 'inline-block w-[0.35em]' : 'inline-block'}
            initial={{ opacity: 0, y: 6, filter: 'blur(6px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{
              duration: 0.35,
              delay: 0.08 + i * 0.045,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {char === ' ' ? '\u00A0' : char}
          </motion.span>
        ))}
        <motion.span
          aria-hidden
          className="ml-0.5 inline-block w-[0.45em] translate-y-[0.05em] bg-accent"
          style={{ height: '0.9em' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: done ? 0 : [0, 1, 1, 0] }}
          transition={
            done
              ? { duration: 0.25 }
              : { duration: 0.9, repeat: Infinity, ease: 'linear' }
          }
        />
      </span>
    </h1>
  )
}
