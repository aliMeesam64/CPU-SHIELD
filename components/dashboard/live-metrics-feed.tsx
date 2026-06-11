'use client'

import { useEffect, useState } from 'react'
import {
  Activity,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Zap,
  Clock,
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { fetchKPI } from '@/lib/api'

interface MetricUpdate {
  id: string
  timestamp: Date
  type: 'power' | 'detection' | 'status' | 'sample'
  title: string
  value: string
  icon: typeof Activity
  color: 'primary' | 'success' | 'danger' | 'warning'
}

export function LiveMetricsFeed() {
  const [updates, setUpdates] = useState<MetricUpdate[]>([])
  const [isLive, setIsLive] = useState(true)
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())

  useEffect(() => {
    // Initial load
    fetchKPI()
      .then((kpiData) => {
        const initialUpdates: MetricUpdate[] = [
          {
            id: '1',
            timestamp: new Date(),
            type: 'status',
            title: 'System Online',
            value: 'Raspberry Pi connected',
            icon: CheckCircle2,
            color: 'success',
          },
          {
            id: '2',
            timestamp: new Date(),
            type: 'power',
            title: 'Power Baseline',
            value: `${kpiData.avg_power_w.toFixed(1)} W average`,
            icon: Zap,
            color: 'primary',
          },
          {
            id: '3',
            timestamp: new Date(),
            type: 'sample',
            title: 'Sampling Active',
            value: `${kpiData.data_points_collected} samples collected`,
            icon: Activity,
            color: 'primary',
          },
          {
            id: '4',
            timestamp: new Date(),
            type: 'detection',
            title: `Detection Status`,
            value: `${kpiData.infected_runs}/${kpiData.total_runs} suspicious runs`,
            icon:
              kpiData.infected_runs > 0 ? AlertCircle : CheckCircle2,
            color:
              kpiData.infected_runs > 0 ? 'warning' : 'success',
          },
        ]
        setUpdates(initialUpdates)
        setLastUpdate(new Date())
      })
      .catch((error) => console.error('Failed to load KPI:', error))

    // Simulate real-time updates every 3-5 seconds
    const interval = setInterval(() => {
      setUpdates((prev) => {
        const newUpdate: MetricUpdate = {
          id: Date.now().toString(),
          timestamp: new Date(),
          type: ['power', 'detection', 'sample'][
            Math.floor(Math.random() * 3)
          ] as MetricUpdate['type'],
          title: ['Power Spike Detected', 'Sample Received', 'Anomaly Check'][
            Math.floor(Math.random() * 3)
          ],
          value: [
            `+${(Math.random() * 5).toFixed(2)} W above baseline`,
            `New data point recorded at ${new Date().toLocaleTimeString()}`,
            'ML model confidence: 95%',
          ][Math.floor(Math.random() * 3)],
          icon: [Zap, Activity, TrendingUp][
            Math.floor(Math.random() * 3)
          ] as typeof Activity,
          color: ['primary', 'success', 'warning'][
            Math.floor(Math.random() * 3)
          ] as MetricUpdate['color'],
        }

        return [newUpdate, ...prev].slice(0, 8)
      })
      setLastUpdate(new Date())
    }, 4000)

    return () => clearInterval(interval)
  }, [])

  const getColorClass = (color: MetricUpdate['color']) => {
    switch (color) {
      case 'success':
        return 'text-success border-success/30 bg-success/10'
      case 'danger':
        return 'text-danger border-danger/30 bg-danger/10'
      case 'warning':
        return 'text-warning border-warning/30 bg-warning/10'
      default:
        return 'text-primary border-primary/30 bg-primary/10'
    }
  }

  return (
    <Card className="glass p-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold">Live Activity Feed</h3>
          <p className="text-xs text-muted-foreground">Real-time monitoring updates</p>
        </div>
        <div className="flex items-center gap-2">
          {isLive && (
            <>
              <div className="size-2 rounded-full bg-success animate-pulse" />
              <Badge
                variant="outline"
                className="border-success/30 bg-success/10 text-success text-xs"
              >
                Live
              </Badge>
            </>
          )}
        </div>
      </div>

      <div className="space-y-2 max-h-96 overflow-y-auto">
        {updates.length === 0 ? (
          <div className="flex items-center justify-center py-8 text-muted-foreground text-sm">
            Waiting for updates...
          </div>
        ) : (
          updates.map((update) => {
            const Icon = update.icon
            return (
              <div
                key={update.id}
                className={`flex items-start gap-3 rounded-lg border p-3 transition-all ${getColorClass(
                  update.color
                )}`}
              >
                <Icon className="size-4 mt-0.5 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold">{update.title}</p>
                  <p className="text-xs opacity-90">{update.value}</p>
                  <p className="mt-1 text-[10px] opacity-60 flex items-center gap-1">
                    <Clock className="size-3" />
                    {update.timestamp.toLocaleTimeString('en-GB', {
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                    })}
                  </p>
                </div>
              </div>
            )
          })
        )}
      </div>

      <div className="mt-4 pt-4 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
        <span>Last update: {lastUpdate.toLocaleTimeString('en-GB')}</span>
        <button
          onClick={() => setIsLive(!isLive)}
          className="text-primary hover:underline"
        >
          {isLive ? 'Pause' : 'Resume'}
        </button>
      </div>
    </Card>
  )
}
