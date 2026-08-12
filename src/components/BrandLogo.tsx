type LogoId = 'microsoft' | 'amazon' | 'nsf' | 'aamu' | 'wgi'

const logoSrc: Record<LogoId, string> = {
  microsoft: '/logos/microsoft.svg',
  amazon: '/logos/amazon.svg',
  nsf: '/logos/nsf.svg',
  aamu: '/logos/aamu.svg',
  wgi: '/logos/wgi.svg',
}

export function BrandLogo({
  id,
  label,
  className = 'h-6 w-6',
}: {
  id: LogoId
  label: string
  className?: string
}) {
  return (
    <span className={`inline-flex shrink-0 items-center justify-center rounded-md border border-line bg-wash p-1 ${className}`}>
      <img src={logoSrc[id]} alt="" aria-hidden className="h-full w-full object-contain" />
      <span className="sr-only">{label}</span>
    </span>
  )
}

export function logoForCompany(company: string): LogoId | null {
  if (company === 'Microsoft') return 'microsoft'
  if (company === 'Amazon') return 'amazon'
  if (company === 'WGI') return 'wgi'
  if (company === 'NSF') return 'nsf'
  if (company === 'Alabama A&M University' || company === 'AAMU') return 'aamu'
  return null
}
