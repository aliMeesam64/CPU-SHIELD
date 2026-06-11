import { ArrowDown } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

export type FlowNode = {
  icon: LucideIcon
  title: string
  subtitle?: string
  status?: string
  tone?: 'primary' | 'accent' | 'success' | 'muted'
}

const toneMap = {
  primary: 'bg-primary/15 text-primary ring-primary/25',
  accent: 'bg-accent/15 text-accent ring-accent/25',
  success: 'bg-success/15 text-success ring-success/25',
  muted: 'bg-secondary text-muted-foreground ring-border',
}

export function FlowDiagram({ nodes }: { nodes: FlowNode[] }) {
  return (
    <div className="flex flex-col items-center">
      {nodes.map((node, i) => {
        const Icon = node.icon
        const tone = node.tone ?? 'primary'
        return (
          <div key={node.title} className="flex w-full flex-col items-center">
            <div className="glass flex w-full max-w-md items-center gap-4 rounded-xl p-4">
              <div
                className={cn(
                  'flex size-12 shrink-0 items-center justify-center rounded-xl ring-1',
                  toneMap[tone],
                )}
              >
                <Icon className="size-6" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">{node.title}</p>
                {node.subtitle ? (
                  <p className="truncate text-xs text-muted-foreground">
                    {node.subtitle}
                  </p>
                ) : null}
              </div>
              {node.status ? (
                <span className="flex items-center gap-1.5 rounded-full border border-success/30 bg-success/10 px-2.5 py-1 text-[11px] font-medium text-success">
                  <span className="size-1.5 rounded-full bg-success" />
                  {node.status}
                </span>
              ) : null}
            </div>
            {i < nodes.length - 1 ? (
              <div className="flex h-8 items-center justify-center">
                <ArrowDown className="size-4 text-muted-foreground" />
              </div>
            ) : null}
          </div>
        )
      })}
    </div>
  )
}
