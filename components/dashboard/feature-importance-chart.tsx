'use client'

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { useMounted } from '@/hooks/use-mounted'

const data = [
  { feature: 'Power Mean', importance: 0.24 },
  { feature: 'Power Std', importance: 0.19 },
  { feature: 'Peak Freq', importance: 0.16 },
  { feature: 'Spectral Entropy', importance: 0.13 },
  { feature: 'RMS Current', importance: 0.1 },
  { feature: 'Crest Factor', importance: 0.08 },
  { feature: 'Skewness', importance: 0.06 },
  { feature: 'Kurtosis', importance: 0.04 },
]

export function FeatureImportanceChart() {
  const mounted = useMounted()
  if (!mounted) {
    return <div className="h-80 w-full animate-pulse rounded-lg bg-muted/30" />
  }
  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 4, right: 16, left: 8, bottom: 0 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="var(--color-border)"
            horizontal={false}
          />
          <XAxis
            type="number"
            domain={[0, 0.28]}
            tick={{ fill: 'var(--color-muted-foreground)', fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v) => `${(v * 100).toFixed(0)}%`}
          />
          <YAxis
            type="category"
            dataKey="feature"
            tick={{ fill: 'var(--color-muted-foreground)', fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            width={104}
          />
          <Tooltip
            cursor={{ fill: 'var(--color-secondary)', opacity: 0.4 }}
            contentStyle={{
              background: 'var(--color-popover)',
              border: '1px solid var(--color-border)',
              borderRadius: 10,
              fontSize: 12,
            }}
            formatter={(v: number) => [`${(v * 100).toFixed(1)}%`, 'Importance']}
          />
          <Bar
            dataKey="importance"
            fill="var(--color-chart-1)"
            radius={[0, 4, 4, 0]}
            barSize={18}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
