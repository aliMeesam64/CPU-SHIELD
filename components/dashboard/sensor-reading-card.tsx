'use client'

import { useEffect, useRef, useState } from 'react'
import {
  Line,
  LineChart,
  ResponsiveContainer,
  YAxis,
  Tooltip,
} from 'recharts'
import { Card } from '@/components/ui/card'

type Point = { i: number; current: number }

function seed(): Point[] {
  return Array.from({ length: 30 }, (_, i) => ({
    i,
    current: Number((2.1 + Math.sin(i / 3) * 0.4 + 0.1).toFixed(2)),
  }))
}

export function SensorReadingCard() {
  const [data, setData] = useState<Point[]>(seed)
  const [mounted, setMounted] = useState(false)
  const idx = useRef(30)

  useEffect(() => {
    setMounted(true)
    
    // Reinitialize with randomized data after mount to avoid hydration mismatch
    setData(
      Array.from({ length: 30 }, (_, i) => ({
        i,
        current: Number((2.1 + Math.sin(i / 3) * 0.4 + Math.random() * 0.2).toFixed(2)),
      }))
    )

    const id = setInterval(() => {
      setData((prev) => {
        const next = {
          i: idx.current++,
          current: Number(
            (2.1 + Math.sin(idx.current / 3) * 0.4 + Math.random() * 0.25).toFixed(2),
          ),
        }
        return [...prev.slice(1), next]
      })
    }, 1500)
    return () => clearInterval(id)
  }, [])

  const value = data[data.length - 1]?.current ?? 0

  return (
    <Card className="glass p-5">
      <h3 className="text-sm font-semibold">Current Sensor Reading</h3>
      <p className="text-xs text-muted-foreground">
        ACS712 instantaneous current draw
      </p>

      <div className="mt-4 flex items-end gap-2">
        <span className="font-mono text-3xl font-semibold tabular-nums text-accent">
          {mounted ? value.toFixed(2) : '2.10'}
        </span>
        <span className="mb-1 text-sm text-muted-foreground">A RMS</span>
      </div>

      <div className="mt-3 h-24 w-full">
        {mounted ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 4, right: 4, left: 4, bottom: 0 }}>
              <YAxis domain={[1, 3.5]} hide />
              <Tooltip
                contentStyle={{
                  background: 'var(--color-popover)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 10,
                  fontSize: 12,
                }}
                formatter={(v: number) => [`${v} A`, 'Current']}
                labelFormatter={() => ''}
              />
              <Line
                type="monotone"
                dataKey="current"
                stroke="var(--color-chart-2)"
                strokeWidth={2}
                dot={false}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full w-full animate-pulse rounded-lg bg-muted/30" />
        )}
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2 text-center">
        {[
          { l: 'Voltage', v: '11.9 V' },
          { l: 'Power', v: '24.5 W' },
          { l: 'Samples/s', v: '200' },
        ].map((m) => (
          <div
            key={m.l}
            className="rounded-lg border border-border bg-secondary/40 p-2"
          >
            <p className="text-[11px] text-muted-foreground">{m.l}</p>
            <p className="font-mono text-sm font-medium">{m.v}</p>
          </div>
        ))}
      </div>
    </Card>
  )
}
