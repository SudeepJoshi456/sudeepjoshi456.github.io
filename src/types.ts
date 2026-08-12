export type DetailView =
  | { type: 'experience'; id: string }
  | { type: 'project'; id: string }
  | { type: 'about' }
  | { type: 'skills' }
  | null
