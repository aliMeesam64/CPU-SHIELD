import { cn } from '@/lib/utils'

// rows = actual, cols = predicted
const matrix = [
  { label: 'Benign', values: [1184, 16] },
  { label: 'Malicious', values: [22, 978] },
]
const colLabels = ['Benign', 'Malicious']
const max = 1184

function cellTone(value: number, isDiagonal: boolean) {
  const intensity = value / max
  if (isDiagonal) {
    return {
      background: `color-mix(in oklch, var(--color-success) ${Math.round(
        intensity * 70 + 12,
      )}%, transparent)`,
    }
  }
  return {
    background: `color-mix(in oklch, var(--color-destructive) ${Math.round(
      (value / 60) * 60 + 10,
    )}%, transparent)`,
  }
}

export function ConfusionMatrix() {
  return (
    <div className="flex flex-col items-center gap-2">
      <p className="text-[11px] uppercase tracking-wider text-muted-foreground">
        Predicted
      </p>
      <div className="flex items-stretch gap-2">
        <div className="flex items-center">
          <p className="rotate-180 text-[11px] uppercase tracking-wider text-muted-foreground [writing-mode:vertical-rl]">
            Actual
          </p>
        </div>
        <div>
          <div className="ml-20 grid grid-cols-2 gap-2">
            {colLabels.map((c) => (
              <p
                key={c}
                className="text-center text-xs font-medium text-muted-foreground"
              >
                {c}
              </p>
            ))}
          </div>
          <div className="mt-2 flex flex-col gap-2">
            {matrix.map((row, ri) => (
              <div key={row.label} className="flex items-center gap-2">
                <p className="w-20 shrink-0 pr-2 text-right text-xs font-medium text-muted-foreground">
                  {row.label}
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {row.values.map((v, ci) => {
                    const isDiagonal = ri === ci
                    return (
                      <div
                        key={ci}
                        style={cellTone(v, isDiagonal)}
                        className={cn(
                          'flex size-24 flex-col items-center justify-center rounded-lg border border-border',
                        )}
                      >
                        <span className="font-mono text-xl font-semibold">
                          {v}
                        </span>
                        <span className="text-[10px] text-muted-foreground">
                          {isDiagonal
                            ? ri === 0
                              ? 'True Neg'
                              : 'True Pos'
                            : ri === 0
                              ? 'False Pos'
                              : 'False Neg'}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
