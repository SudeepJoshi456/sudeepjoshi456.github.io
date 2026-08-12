import { useEffect, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  aboutLines,
  education,
  experience,
  leadership,
  projects,
  recognition,
  skills,
} from '../data/content'
import { IconLayers, IconMark, IconSpark, IconTile, IconUser } from './Icons'
import type { DetailView } from '../types'

function Arrow() {
  return <span className="mt-[0.15em] select-none text-accent">↳</span>
}

function companyMark(company: string) {
  if (company === 'Microsoft') return <IconMark label="MS" tone="ms" />
  if (company === 'Amazon') return <IconMark label="AZ" tone="amz" />
  if (company === 'WGI') return <IconMark label="WG" tone="wgi" />
  return <IconMark label={company.slice(0, 2).toUpperCase()} />
}

function SectionLabel({ children }: { children: ReactNode }) {
  return <p className="vault-label mb-3">{children}</p>
}

function StackChips({ items }: { items: string[] }) {
  return (
    <ul className="mt-5 flex flex-wrap gap-1.5">
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
    const job = experience.find((e) => e.id === view.id)
    if (!job) return null
    eyebrow = 'Experience'
    title = job.company
    icon = companyMark(job.company)
    body = (
      <>
        <p className="text-sm text-ink-soft">{job.role}</p>
        <p className="mt-1 text-xs text-mute">
          {job.dates}, {job.location}
        </p>
        <p className="mt-5 text-sm font-medium text-accent">{job.metric}</p>

        <div className="mt-8">
          <SectionLabel>Impact</SectionLabel>
          <ul className="space-y-3 text-sm leading-relaxed text-ink-soft">
            {job.bullets.map((b) => (
              <li key={b.slice(0, 40)} className="grid grid-cols-[1rem_1fr] gap-2.5">
                <Arrow />
                <span>{b}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-8">
          <SectionLabel>Stack</SectionLabel>
          <StackChips items={job.stack} />
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
      <ul className="space-y-8">
        {projects.map((project, index) => (
          <li
            key={project.id}
            className={index > 0 ? 'border-t border-line/80 pt-8' : undefined}
          >
            <p className="font-display text-base font-semibold text-ink">{project.title}</p>
            <p className="mt-1 text-xs text-mute">{project.year}</p>
            {project.highlight ? (
              <p className="mt-3 text-sm font-medium text-accent">{project.highlight}</p>
            ) : null}
            <p className="mt-4 text-sm leading-relaxed text-ink-soft">{project.description}</p>
            <div className="mt-4">
              <StackChips items={project.stack} />
            </div>
          </li>
        ))}
      </ul>
    )
  }

  if (view.type === 'project') {
    const project = projects.find((p) => p.id === view.id)
    if (!project) return null
    eyebrow = 'Project'
    title = project.title
    icon = (
      <IconTile>
        <IconLayers />
      </IconTile>
    )
    body = (
      <>
        <p className="text-xs text-mute">{project.year}</p>
        {project.highlight ? (
          <p className="mt-4 text-sm font-medium text-accent">{project.highlight}</p>
        ) : null}
        <div className="mt-8">
          <SectionLabel>Overview</SectionLabel>
          <p className="text-sm leading-relaxed text-ink-soft">{project.description}</p>
        </div>
        <div className="mt-8">
          <SectionLabel>Stack</SectionLabel>
          <StackChips items={project.stack} />
        </div>
      </>
    )
  }

  if (view.type === 'about') {
    eyebrow = 'About'
    title = 'Background'
    icon = (
      <IconTile>
        <IconUser />
      </IconTile>
    )
    body = (
      <>
        <ul className="space-y-3 text-sm leading-relaxed text-ink-soft">
          {aboutLines.map((line) => (
            <li key={line} className="grid grid-cols-[1rem_1fr] gap-2.5">
              <Arrow />
              <span>{line}</span>
            </li>
          ))}
        </ul>

        <div className="mt-10">
          <SectionLabel>Education</SectionLabel>
          <ul className="divide-y divide-line/80 border-y border-line/80">
            {education.map((ed) => (
              <li key={ed.id} className="py-4">
                <p className="text-sm font-medium text-ink">{ed.school}</p>
                <p className="mt-1 text-xs text-mute">
                  {ed.dates}, {ed.location}
                </p>
                <p className="mt-2 text-sm text-ink-soft">{ed.detail}</p>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-10">
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

  if (view.type === 'skills') {
    eyebrow = 'Skills'
    title = 'Skills & Recognition'
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
        <div className="mt-8">
          <SectionLabel>Frameworks</SectionLabel>
          <StackChips items={skills.frameworks} />
        </div>
        <div className="mt-8">
          <SectionLabel>Cloud</SectionLabel>
          <StackChips items={skills.cloud} />
        </div>
        <div className="mt-8">
          <SectionLabel>Tools</SectionLabel>
          <StackChips items={skills.tools} />
        </div>
        <div className="mt-10">
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

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[60] flex justify-end bg-[#020617]/40 backdrop-blur-[2px]"
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
              className="w-full rounded-xl bg-ink px-4 py-3 text-sm font-medium text-bg"
            >
              Close
            </button>
          </div>
        </motion.aside>
      </motion.div>
    </AnimatePresence>
  )
}
