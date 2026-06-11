'use client'

import { useEffect, useState } from 'react'
import { AlertTriangle, CheckCircle2, BarChart3, Clock } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface DetectionResult {
  id: string
  timestamp: Date
  taskName: string
  confidenceScore: number
  isAnomalous: boolean
  powerDeviation: number
  status: 'normal' | 'suspicious' | 'critical'
}

export function LiveDetectionMonitor() {
  const [detections, setDetections] = useState<DetectionResult[]>([])
  const [stats, setStats] = useState({
    totalAnalyzed: 0,
    anomaliesDetected: 0,
    lastUpdateTime: new Date(),
  })

  useEffect(() => {
    // Initialize with some data
    setStats({
      totalAnalyzed: 156,
      anomaliesDetected: 3,
      lastUpdateTime: new Date(),
    })

    // Simulate real-time detection results
    const interval = setInterval(() => {
      const isAnomalous = Math.random() > 0.92
      const newDetection: DetectionResult = {
        id: Date.now().toString(),
        timestamp: new Date(),
        taskName: ['idle', 'browser', 'registry', 'system'][
          Math.floor(Math.random() * 4)
        ],
        confidenceScore: 50 + Math.random() * 50,
        isAnomalous: isAnomalous,
        powerDeviation: (Math.random() - 0.5) * 8,
        status: isAnomalous
          ? Math.random() > 0.5
            ? 'suspicious'
            : 'critical'
          : 'normal',
      }

      setDetections((prev) => [newDetection, ...prev].slice(0, 12))

      setStats((prev) => ({
        totalAnalyzed: prev.totalAnalyzed + 1,
        anomaliesDetected: isAnomalous
          ? prev.anomaliesDetected + 1
          : prev.anomaliesDetected,
        lastUpdateTime: new Date(),
      }))
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const getStatusColor = (status: DetectionResult['status']) => {
    switch (status) {
      case 'critical':
        return 'text-danger border-danger/30 bg-danger/10'
      case 'suspicious':
        return 'text-warning border-warning/30 bg-warning/10'
      default:
        return 'text-success border-success/30 bg-success/10'
    }
  }

  const getStatusIcon = (status: DetectionResult['status']) => {
    return status === 'normal' ? (
      <CheckCircle2 className="size-4" />
    ) : (
      <AlertTriangle className="size-4" />
    )
  }

  const anomalyRate =
    stats.totalAnalyzed > 0
      ? ((stats.anomaliesDetected / stats.totalAnalyzed) * 100).toFixed(1)
      : '0.0'

  return (
    <Card className="glass p-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold">Detection Monitor</h3>
          <p className="text-xs text-muted-foreground">ML-based anomaly detection</p>
        </div>
        <Badge
          variant="outline"
          className={
            stats.anomaliesDetected > 0
              ? 'border-warning/30 bg-warning/10 text-warning'
              : 'border-success/30 bg-success/10 text-success'
          }
        >
          {stats.anomaliesDetected > 0 ? 'Threats Found' : 'Secure'}
        </Badge>
      </div>

      {/* Stats */}
      <div className="mb-4 grid grid-cols-3 gap-2">
        <div className="rounded-lg border border-border bg-secondary/40 p-3">
          <p className="text-[11px] text-muted-foreground mb-1">Analyzed</p>
          <p className="font-mono font-bold text-sm">{stats.totalAnalyzed}</p>
        </div>
        <div className="rounded-lg border border-border bg-secondary/40 p-3">
          <p className="text-[11px] text-muted-foreground mb-1">Anomalies</p>
          <p className="font-mono font-bold text-sm text-warning">
            {stats.anomaliesDetected}
          </p>
        </div>
        <div className="rounded-lg border border-border bg-secondary/40 p-3">
          <p className="text-[11px] text-muted-foreground mb-1">Rate</p>
          <p className="font-mono font-bold text-sm">{anomalyRate}%</p>
        </div>
      </div>

      {/* Detection Results */}
      <div className="space-y-2 max-h-80 overflow-y-auto">
        {detections.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-muted-foreground text-sm">
            <BarChart3 className="size-8 mb-2 opacity-40" />
            Awaiting detection results...
          </div>
        ) : (
          detections.map((detection) => (
            <div
              key={detection.id}
              className={`flex items-start gap-3 rounded-lg border p-3 transition-all ${getStatusColor(
                detection.status
              )}`}
            >
              <div className="mt-0.5 flex-shrink-0">
                {getStatusIcon(detection.status)}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs font-semibold capitalize">
                    {detection.taskName}
                  </p>
                  <span className="font-mono text-[11px]">
                    {detection.confidenceScore.toFixed(0)}%
                  </span>
                </div>
                <p className="text-xs opacity-90 mt-1">
                  Power deviation: {detection.powerDeviation > 0 ? '+' : ''}
                  {detection.powerDeviation.toFixed(2)} W
                </p>
                <p className="text-[10px] opacity-60 mt-1 flex items-center gap-1">
                  <Clock className="size-3" />
                  {detection.timestamp.toLocaleTimeString('en-GB', {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                  })}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Last Update */}
      <div className="mt-4 pt-4 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
        <span>Last update: {stats.lastUpdateTime.toLocaleTimeString('en-GB')}</span>
        <div className="size-2 rounded-full bg-success animate-pulse" />
      </div>
    </Card>
  )
}
