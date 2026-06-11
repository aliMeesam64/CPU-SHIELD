import type { LucideIcon } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'

type Tone = 'primary' | 'success' | 'accent' | 'warning'

const tones: Record<Tone, { text: string; bg: string; ring: string }> = {
  primary: {
    text: 'text-primary',
    bg: 'bg-primary/15',
    ring: 'ring-primary/25',
  },
  success: {
    text: 'text-success',
    bg: 'bg-success/15',
    ring: 'ring-success/25',
  },
  accent: { text: 'text-accent', bg: 'bg-accent/15', ring: 'ring-accent/25' },
  warning: {
    text: 'text-warning',
    bg: 'bg-warning/15',
    ring: 'ring-warning/25',
  },
}

export function KpiCard({
  title,
  value,
  hint,
  icon: Icon,
  tone = 'primary',
}: {
  title: string
  value: string
  hint?: string
  icon: LucideIcon
  tone?: Tone
}) {
  const t = tones[tone]
  return (
    <Card className="glass relative overflow-hidden p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-muted-foreground">
            {title}
          </p>
          <p className="mt-2 text-2xl font-semibold tracking-tight">{value}</p>
          {hint ? (
            <p className={cn('mt-1 text-xs font-medium', t.text)}>{hint}</p>
          ) : null}
        </div>
        <div
          className={cn(
            'flex size-11 shrink-0 items-center justify-center rounded-xl ring-1',
            t.bg,
            t.ring,
          )}
        >
          <Icon className={cn('size-5', t.text)} />
        </div>
      </div>
      <div
        className={cn(
          'pointer-events-none absolute -right-6 -top-6 size-20 rounded-full opacity-20 blur-2xl',
          t.bg,
        )}
      />
    </Card>
  )
}
