'use client'

import { useEffect, useState } from 'react'
import { Wifi, WifiOff, Activity } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface ConnectionStatus {
  sensorConnected: boolean
  dataStreamActive: boolean
  lastDataTime: Date
  sampleRate: number
  bufferedSamples: number
}

export function RealtimeConnectionStatus() {
  const [status, setStatus] = useState<ConnectionStatus>({
    sensorConnected: true,
    dataStreamActive: true,
    lastDataTime: new Date(),
    sampleRate: 100,
    bufferedSamples: 1024,
  })

  const [uptime, setUptime] = useState('0h 0m')

  useEffect(() => {
    // Simulate real-time data stream updates
    const interval = setInterval(() => {
      setStatus((prev) => ({
        ...prev,
        bufferedSamples: Math.floor(Math.random() * 2048) + 512,
        lastDataTime: new Date(),
        sampleRate: 100 + Math.floor(Math.random() * 5),
      }))
    }, 2000)

    // Update uptime every minute
    const uptimeInterval = setInterval(() => {
      const now = new Date()
      const hours = now.getHours()
      const minutes = now.getMinutes()
      setUptime(`${hours}h ${minutes}m`)
    }, 60000)

    setUptime(`${new Date().getHours()}h ${new Date().getMinutes()}m`)

    return () => {
      clearInterval(interval)
      clearInterval(uptimeInterval)
    }
  }, [])

  const timeSinceLastUpdate = Math.round(
    (new Date().getTime() - status.lastDataTime.getTime()) / 1000
  )

  return (
    <Card className="glass p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold">Connection Status</h3>
        <div className="flex items-center gap-2">
          {status.dataStreamActive ? (
            <Badge
              variant="outline"
              className="border-success/30 bg-success/10 text-success animate-pulse"
            >
              <Wifi className="size-3 mr-1" />
              Active
            </Badge>
          ) : (
            <Badge
              variant="outline"
              className="border-danger/30 bg-danger/10 text-danger"
            >
              <WifiOff className="size-3 mr-1" />
              Offline
            </Badge>
          )}
        </div>
      </div>

      <div className="space-y-3">
        {/* Sensor Status */}
        <div className="flex items-center justify-between rounded-lg border border-border bg-secondary/40 p-3">
          <div className="flex items-center gap-3">
            <div
              className={`size-3 rounded-full ${
                status.sensorConnected
                  ? 'bg-success animate-pulse'
                  : 'bg-danger'
              }`}
            />
            <div>
              <p className="text-xs font-medium">ACS712 Sensor</p>
              <p className="text-[11px] text-muted-foreground">Current sensor</p>
            </div>
          </div>
          <span
            className={`text-xs font-semibold ${
              status.sensorConnected ? 'text-success' : 'text-danger'
            }`}
          >
            {status.sensorConnected ? 'Connected' : 'Disconnected'}
          </span>
        </div>

        {/* Data Stream Status */}
        <div className="flex items-center justify-between rounded-lg border border-border bg-secondary/40 p-3">
          <div className="flex items-center gap-3">
            <div
              className={`size-3 rounded-full ${
                status.dataStreamActive
                  ? 'bg-primary animate-pulse'
                  : 'bg-muted'
              }`}
            />
            <div>
              <p className="text-xs font-medium">Data Stream</p>
              <p className="text-[11px] text-muted-foreground">
                Last update {timeSinceLastUpdate}s ago
              </p>
            </div>
          </div>
          <span className="text-xs font-mono">{status.sampleRate} Hz</span>
        </div>

        {/* Buffer Status */}
        <div className="rounded-lg border border-border bg-secondary/40 p-3">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-medium">Sample Buffer</p>
            <span className="font-mono text-xs text-primary">
              {status.bufferedSamples} / 2048
            </span>
          </div>
          <div className="h-2 w-full rounded-full bg-secondary overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{
                width: `${Math.min(
                  (status.bufferedSamples / 2048) * 100,
                  100
                )}%`,
              }}
            />
          </div>
        </div>

        {/* Uptime */}
        <div className="flex items-center justify-between rounded-lg border border-border bg-secondary/40 p-3">
          <div className="flex items-center gap-3">
            <Activity className="size-4 text-accent" />
            <div>
              <p className="text-xs font-medium">Monitoring Uptime</p>
              <p className="text-[11px] text-muted-foreground">Continuous capture</p>
            </div>
          </div>
          <span className="font-mono text-xs font-semibold">{uptime}</span>
        </div>
      </div>
    </Card>
  )
}
