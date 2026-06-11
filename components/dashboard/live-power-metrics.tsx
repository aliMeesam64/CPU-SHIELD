'use client'

import { useEffect, useState } from 'react'
import { TrendingUp, TrendingDown, Zap } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface PowerMetrics {
  current: number
  min: number
  max: number
  average: number
  timestamp: Date
  trend: 'up' | 'down' | 'stable'
  isAnomalous: boolean
}

export function LivePowerMetrics() {
  const [metrics, setMetrics] = useState<PowerMetrics>({
    current: 24.5,
    min: 3.2,
    max: 28.7,
    average: 24.5,
    timestamp: new Date(),
    trend: 'stable',
    isAnomalous: false,
  })

  useEffect(() => {
    // Simulate real-time power metrics updates
    const interval = setInterval(() => {
      setMetrics((prev) => {
        const variation = (Math.random() - 0.5) * 2 // -1 to +1
        const newCurrent = Math.max(
          3,
          prev.current + variation + (Math.random() - 0.5) * 0.5
        )
        const newMin = Math.min(prev.min, newCurrent)
        const newMax = Math.max(prev.max, newCurrent)
        const newAverage = (prev.average + newCurrent) / 2

        let trend: 'up' | 'down' | 'stable' = 'stable'
        if (variation > 0.3) trend = 'up'
        else if (variation < -0.3) trend = 'down'

        return {
          current: parseFloat(newCurrent.toFixed(2)),
          min: parseFloat(newMin.toFixed(2)),
          max: parseFloat(newMax.toFixed(2)),
          average: parseFloat(newAverage.toFixed(2)),
          timestamp: new Date(),
          trend,
          isAnomalous: newCurrent > 30 || newCurrent < 2,
        }
      })
    }, 1500)

    return () => clearInterval(interval)
  }, [])

  const getTrendIcon = (trend: PowerMetrics['trend']) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="size-4 text-warning" />
      case 'down':
        return <TrendingDown className="size-4 text-primary" />
      default:
        return <Zap className="size-4 text-success" />
    }
  }

  return (
    <Card className="glass p-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold">Live Power Metrics</h3>
          <p className="text-xs text-muted-foreground">Real-time consumption data</p>
        </div>
        {metrics.isAnomalous && (
          <Badge
            variant="outline"
            className="border-danger/30 bg-danger/10 text-danger"
          >
            Anomaly
          </Badge>
        )}
      </div>

      {/* Current Power */}
      <div className="mb-4 rounded-lg border border-primary/20 bg-primary/5 p-4">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Current Power</p>
            <span className="font-mono text-4xl font-bold text-primary">
              {metrics.current.toFixed(2)}
            </span>
            <span className="ml-2 text-sm text-muted-foreground">W</span>
          </div>
          <div className="flex items-center gap-2">
            {getTrendIcon(metrics.trend)}
            <span className="text-xs font-medium capitalize">{metrics.trend}</span>
          </div>
        </div>
        <p className="text-[11px] text-muted-foreground mt-2">
          Updated at {metrics.timestamp.toLocaleTimeString('en-GB')}
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-lg border border-border bg-secondary/40 p-3">
          <p className="text-[11px] text-muted-foreground mb-1">Minimum</p>
          <p className="font-mono text-sm font-bold text-accent">
            {metrics.min.toFixed(2)} W
          </p>
        </div>

        <div className="rounded-lg border border-border bg-secondary/40 p-3">
          <p className="text-[11px] text-muted-foreground mb-1">Average</p>
          <p className="font-mono text-sm font-bold text-primary">
            {metrics.average.toFixed(2)} W
          </p>
        </div>

        <div className="rounded-lg border border-border bg-secondary/40 p-3">
          <p className="text-[11px] text-muted-foreground mb-1">Maximum</p>
          <p className="font-mono text-sm font-bold text-warning">
            {metrics.max.toFixed(2)} W
          </p>
        </div>
      </div>

      {/* Status Indicator */}
      <div className="mt-4 flex items-center gap-2 rounded-lg border border-border bg-secondary/40 p-3">
        <div className="size-2 rounded-full bg-success animate-pulse" />
        <span className="text-xs text-muted-foreground">
          Sampling at{' '}
          <span className="font-semibold text-foreground">100 Hz</span> •{' '}
          <span className="font-semibold text-foreground">±0.1W accuracy</span>
        </span>
      </div>
    </Card>
  )
}
