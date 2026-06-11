'use client'

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Card } from '@/components/ui/card'
import { useMounted } from '@/hooks/use-mounted'

function makeSeries(base: number, variance: number, seed: number) {
  return Array.from({ length: 24 }, (_, i) => {
    const v =
      base +
      Math.sin((i + seed) / 3) * variance +
      Math.cos((i + seed) / 5) * (variance / 2)
    return { t: i, power: Number(v.toFixed(1)) }
  })
}

export function BaselineChart({
  title,
  subtitle,
  base,
  variance,
  seed,
  color = 'var(--color-chart-1)',
  domain,
}: {
  title: string
  subtitle: string
  base: number
  variance: number
  seed: number
  color?: string
  domain: [number, number]
}) {
  const data = makeSeries(base, variance, seed)
  const gid = `fill-${seed}`
  const mounted = useMounted()

  return (
    <Card className="glass p-5">
      <div className="mb-3">
        <h3 className="text-sm font-semibold">{title}</h3>
        <p className="text-xs text-muted-foreground">{subtitle}</p>
      </div>
      <div className="h-44 w-full">
        {mounted ? (
          <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 6, right: 6, left: -18, bottom: 0 }}>
            <defs>
              <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity={0.4} />
                <stop offset="100%" stopColor={color} stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="var(--color-border)"
              vertical={false}
            />
            <XAxis dataKey="t" hide />
            <YAxis
              domain={domain}
              tick={{ fill: 'var(--color-muted-foreground)', fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              width={42}
              unit="W"
            />
            <Tooltip
              contentStyle={{
                background: 'var(--color-popover)',
                border: '1px solid var(--color-border)',
                borderRadius: 10,
                fontSize: 12,
              }}
              formatter={(v: number) => [`${v} W`, 'Power']}
              labelFormatter={() => ''}
            />
            <Area
              type="monotone"
              dataKey="power"
              stroke={color}
              strokeWidth={2}
              fill={`url(#${gid})`}
              isAnimationActive={false}
              dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
        ) : (
          <div className="h-full w-full animate-pulse rounded-lg bg-muted/30" />
        )}
      </div>
    </Card>
  )
}
