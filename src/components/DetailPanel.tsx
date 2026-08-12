import { useEffect, useState, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  aboutLines,
  education,
  experience,
  leadership,
  profile,
  projects,
  recognition,
  skills,
} from '../data/content'
import { BrandLogo, logoForCompany } from './BrandLogo'
import { IconLayers, IconLink, IconSpark, IconTile, IconUser } from './Icons'
import type { DetailView } from '../types'

function Arrow() {
  return <span className="mt-[0.15em] select-none text-accent">↳</span>
}

function SectionLabel({ children }: { children: ReactNode }) {
  return <p className="vault-label mb-3">{children}</p>
}

function StackChips({ items }: { items: string[] }) {
  return (
    <ul className="mt-4 flex flex-wrap gap-1.5">
      {items.map((item) => (
        <li
          key={item}
          className="rounded-md border border-line bg-wash/80 px-2 py-1 text-xs text-ink-soft"
        >
          {item}
        </li>
      ))}
    </ul>
  )
}

function AccordionItem({
  title,
  subtitle,
  logo,
  defaultOpen = false,
  children,
}: {
  title: string
  subtitle?: string
  logo?: ReactNode
  defaultOpen?: boolean
  children: ReactNode
}) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div className="border-b border-line/80">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-start gap-3 py-3.5 text-left transition hover:bg-wash/40"
        aria-expanded={open}
      >
        {logo}
        <span className="min-w-0 flex-1">
          <span className="block text-sm font-semibold text-ink">{title}</span>
          {subtitle ? <span className="mt-0.5 block text-xs text-mute">{subtitle}</span> : null}
        </span>
        <span className="mt-0.5 text-xs text-mute" aria-hidden>
          {open ? '−' : '+'}
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="overflow-hidden"
          >
            <div className="pb-4 pl-11 pr-1">{children}</div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}

export function DetailPanel({
  view,
  onClose,
}: {
  view: Exclude<DetailView, null>
  onClose: () => void
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  let eyebrow = ''
  let title = ''
  let icon: ReactNode = null
  let body: ReactNode = null

  if (view.type === 'experience') {
    eyebrow = 'Experience'
    title = 'Roles'
    icon = (
      <IconTile>
        <IconLayers />
      </IconTile>
    )
    body = (
      <div className="divide-y-0 border-y border-line/80">
        {experience.map((job, index) => {
          const logoId = logoForCompany(job.company)
          return (
            <AccordionItem
              key={job.id}
              defaultOpen={index === 0}
              title={`${job.role} @ ${job.company}`}
              subtitle={`${job.dates} · ${job.location}`}
              logo={
                logoId ? (
                  <BrandLogo id={logoId} label={job.company} className="h-8 w-8" />
                ) : (
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-line bg-wash text-[10px] font-semibold text-mute">
                    {job.company.slice(0, 2).toUpperCase()}
                  </span>
                )
              }
            >
              <p className="text-sm font-medium text-accent">{job.metric}</p>
              <ul className="mt-3 space-y-2.5 text-sm leading-relaxed text-ink-soft">
                {job.bullets.map((b) => (
                  <li key={b.slice(0, 40)} className="grid grid-cols-[1rem_1fr] gap-2.5">
                    <Arrow />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
              <StackChips items={job.stack} />
            </AccordionItem>
          )
        })}
      </div>
    )
  }

  if (view.type === 'education') {
    eyebrow = 'Education'
    title = 'Schools'
    icon = (
      <IconTile>
        <IconUser />
      </IconTile>
    )
    body = (
      <>
        <div className="border-y border-line/80">
          {education.map((ed, index) => (
            <AccordionItem
              key={ed.id}
              defaultOpen={index === 0}
              title={ed.school}
              subtitle={`${ed.dates} · ${ed.location}`}
              logo={
                ed.id === 'aamu' ? (
                  <BrandLogo id="aamu" label="AAMU" className="h-8 w-8" />
                ) : (
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-line bg-wash text-[10px] font-semibold text-mute">
                    JSU
                  </span>
                )
              }
            >
              <p className="text-sm text-ink-soft">{ed.detail}</p>
            </AccordionItem>
          ))}
        </div>
        <div className="mt-8">
          <SectionLabel>About</SectionLabel>
          <ul className="space-y-3 text-sm leading-relaxed text-ink-soft">
            {aboutLines.map((line) => (
              <li key={line} className="grid grid-cols-[1rem_1fr] gap-2.5">
                <Arrow />
                <span>{line}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-8">
          <SectionLabel>Leadership</SectionLabel>
          <ul className="space-y-2.5 text-sm text-ink-soft">
            {leadership.map((item) => (
              <li key={item} className="grid grid-cols-[1rem_1fr] gap-2.5">
                <Arrow />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </>
    )
  }

  if (view.type === 'projects') {
    eyebrow = 'Projects'
    title = 'Selected work'
    icon = (
      <IconTile>
        <IconLayers />
      </IconTile>
    )
    body = (
      <div className="border-y border-line/80">
        {projects.map((project, index) => (
          <AccordionItem
            key={project.id}
            defaultOpen={index === 0}
            title={project.title}
            subtitle={project.year}
          >
            {project.highlight ? (
              <p className="text-sm font-medium text-accent">{project.highlight}</p>
            ) : null}
            <p className="mt-3 text-sm leading-relaxed text-ink-soft">{project.description}</p>
            <StackChips items={project.stack} />
          </AccordionItem>
        ))}
      </div>
    )
  }

  if (view.type === 'skills') {
    eyebrow = 'Skills'
    title = 'Skills & recognition'
    icon = (
      <IconTile>
        <IconSpark />
      </IconTile>
    )
    body = (
      <>
        <div>
          <SectionLabel>Languages</SectionLabel>
          <StackChips items={skills.languages} />
        </div>
        <div className="mt-6">
          <SectionLabel>Frameworks</SectionLabel>
          <StackChips items={skills.frameworks} />
        </div>
        <div className="mt-6">
          <SectionLabel>Cloud</SectionLabel>
          <StackChips items={skills.cloud} />
        </div>
        <div className="mt-6">
          <SectionLabel>Tools</SectionLabel>
          <StackChips items={skills.tools} />
        </div>
        <div className="mt-8">
          <SectionLabel>Recognition</SectionLabel>
          <ul className="space-y-2.5 text-sm text-ink-soft">
            {recognition.map((item) => (
              <li key={item} className="grid grid-cols-[1rem_1fr] gap-2.5">
                <Arrow />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </>
    )
  }

  if (view.type === 'links') {
    eyebrow = 'Links'
    title = 'Reach out'
    icon = (
      <IconTile>
        <IconLink />
      </IconTile>
    )
    const items = [
      { label: 'LinkedIn', href: profile.links.linkedin, external: true },
      { label: 'GitHub', href: profile.links.github, external: true },
      { label: 'Email', href: `mailto:${profile.email}`, external: false },
      { label: 'Resume', href: profile.links.resume, external: true },
    ]
    body = (
      <ul className="divide-y divide-line/80 border-y border-line/80">
        {items.map((item) => (
          <li key={item.label}>
            <a
              href={item.href}
              {...(item.external ? { target: '_blank', rel: 'noreferrer' } : {})}
              className="flex items-center justify-between gap-3 py-3.5 text-sm font-medium text-ink transition hover:text-accent"
            >
              <span>{item.label}</span>
              <span aria-hidden className="text-mute">
                →
              </span>
            </a>
          </li>
        ))}
      </ul>
    )
  }

  if (view.type === 'about') {
    // Back-compat: treat About as Education panel.
    eyebrow = 'Education'
    title = 'Schools'
    icon = (
      <IconTile>
        <IconUser />
      </IconTile>
    )
    body = (
      <ul className="space-y-3 text-sm leading-relaxed text-ink-soft">
        {aboutLines.map((line) => (
          <li key={line} className="grid grid-cols-[1rem_1fr] gap-2.5">
            <Arrow />
            <span>{line}</span>
          </li>
        ))}
      </ul>
    )
  }

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[60] flex justify-end bg-[#0b0e12]/40 backdrop-blur-[2px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onMouseDown={(e) => {
          if (e.target === e.currentTarget) onClose()
        }}
      >
        <motion.aside
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          className="flex h-full w-full max-w-lg flex-col border-l border-line bg-bg shadow-[-20px_0_60px_rgba(0,0,0,0.2)]"
        >
          <div className="flex items-start justify-between gap-4 border-b border-line px-5 py-4">
            <div className="flex min-w-0 items-start gap-3">
              {icon}
              <div className="min-w-0">
                <p className="vault-label">{eyebrow}</p>
                <h2 className="mt-1 font-display text-xl font-bold tracking-tight text-ink">{title}</h2>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center gap-1.5 rounded-full border border-line bg-wash px-3 py-1.5 text-xs font-medium text-ink-soft transition hover:text-ink"
              aria-label="Close panel"
            >
              <span>Close</span>
              <kbd className="hidden rounded border border-line bg-bg px-1 py-0.5 text-[10px] text-mute sm:inline">
                esc
              </kbd>
            </button>
          </div>
          <div className="overflow-y-auto px-5 py-6 pb-8">{body}</div>
          <div className="border-t border-line p-4 sm:hidden">
            <button
              type="button"
              onClick={onClose}
              className="w-full rounded-xl border border-line bg-wash px-4 py-3 text-sm font-medium text-ink"
            >
              Close
            </button>
          </div>
        </motion.aside>
      </motion.div>
    </AnimatePresence>
  )
}
