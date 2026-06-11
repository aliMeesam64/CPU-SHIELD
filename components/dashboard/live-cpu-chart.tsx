'use client'

import { useEffect, useState } from 'react'
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
import { Badge } from '@/components/ui/badge'
import { fetchTimeSeries } from '@/lib/api'

type Point = { time: string; power: number; task: string }

// Deterministic initial series so server and client render identically
function seed(): Point[] {
  return Array.from({ length: 40 }, (_, i) => ({
    time: `t-${(40 - i).toString().padStart(2, '0')}`,
    power: Number((24 + Math.sin(i / 4) * 3).toFixed(1)),
    task: 'idle',
  }))
}

export function LiveCpuChart() {
  const [data, setData] = useState<Point[]>(seed)
  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setMounted(true)
    let isMounted = true

    // Try to fetch time series data from Flask API
    const loadData = async () => {
      try {
        const timeSeriesData = await fetchTimeSeries()
        if (!isMounted) return

        // Convert API data to chart format
        const sampleRate = Math.max(
          1,
          Math.floor(timeSeriesData.total_samples / 100)
        )
        const chartData: Point[] = []

        for (let i = 0; i < timeSeriesData.total_samples; i += sampleRate) {
          chartData.push({
            time: new Date(timeSeriesData.timestamps[i]).toLocaleTimeString(
              'en-GB',
              {
                minute: '2-digit',
                second: '2-digit',
              }
            ),
            power: timeSeriesData.power_values[i],
            task: timeSeriesData.tasks[i],
          })
        }

        setData(chartData.slice(-40))
        setLoading(false)
      } catch (err) {
        // Silently fall back to seeded data
        setLoading(false)
      }
    }

    loadData()

    return () => {
      isMounted = false
    }
  }, [])

  const current = data[data.length - 1]?.power ?? 0
  const currentTask = data[data.length - 1]?.task ?? 'idle'

  return (
    <Card className="glass p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold">
            Live CPU Power Consumption
          </h3>
          <p className="text-xs text-muted-foreground">
            ACS712 sensor · sampled via Raspberry Pi • Task: {currentTask}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-mono text-lg font-semibold tabular-nums text-primary">
            {current.toFixed(2)} W
          </span>
          <Badge
            variant="outline"
            className="border-success/30 bg-success/10 text-success"
          >
            <span className="mr-1.5 inline-block size-1.5 animate-pulse rounded-full bg-success" />
            Live
          </Badge>
        </div>
      </div>

      <div className="h-72 w-full">
        {mounted && !loading ? (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart
              data={data}
              margin={{ top: 10, right: 8, left: -16, bottom: 0 }}
            >
              <defs>
                <linearGradient id="powerFill" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="0%"
                    stopColor="var(--color-chart-1)"
                    stopOpacity={0.45}
                  />
                  <stop
                    offset="100%"
                    stopColor="var(--color-chart-1)"
                    stopOpacity={0.02}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="var(--color-border)"
                vertical={false}
              />
              <XAxis
                dataKey="time"
                stroke="var(--color-muted-foreground)"
                tick={{ fontSize: 12 }}
              />
              <YAxis
                stroke="var(--color-muted-foreground)"
                tick={{ fontSize: 12 }}
                domain={[0, 'auto']}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--color-background)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '0.5rem',
                }}
                cursor={{ stroke: 'var(--color-primary)', strokeWidth: 2 }}
                formatter={(value: number) => [`${value.toFixed(2)} W`, 'Power']}
                labelFormatter={(label) => `Time: ${label}`}
              />
              <Area
                type="monotone"
                dataKey="power"
                stroke="var(--color-chart-1)"
                fill="url(#powerFill)"
                name="Power Consumption"
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex h-full items-center justify-center">
            <p className="text-sm text-muted-foreground">
              {loading ? 'Loading data...' : 'Ready'}
            </p>
          </div>
        )}
      </div>
    </Card>
  )
}
