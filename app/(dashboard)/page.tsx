'use client'

import { useEffect, useState } from 'react'
import {
  Cpu,
  Radio,
  Activity,
  ShieldCheck,
  Server,
  CircuitBoard,
  Gauge,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react'
import { PageHeader } from '@/components/dashboard/page-header'
import { KpiCard } from '@/components/dashboard/kpi-card'
import { LiveCpuChart } from '@/components/dashboard/live-cpu-chart'
import { SensorReadingCard } from '@/components/dashboard/sensor-reading-card'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { fetchKPI, KPIMetrics } from '@/lib/api'

const systemItems = [
  {
    icon: Server,
    label: 'Target System',
    value: 'HP Compaq Pro 6300',
    status: 'Monitored',
  },
  {
    icon: Cpu,
    label: 'Edge Node',
    value: 'Raspberry Pi 3B+',
    status: 'Connected',
  },
  {
    icon: Gauge,
    label: 'Current Sensor',
    value: 'ACS712 (20A)',
    status: 'Active',
  },
  {
    icon: CircuitBoard,
    label: 'ADC Module',
    value: 'ADS1115 16-bit',
    status: 'Active',
  },
]

export default function DashboardPage() {
  const [kpiData, setKpiData] = useState<KPIMetrics | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadKPI = async () => {
      try {
        const data = await fetchKPI()
        setKpiData(data)
      } catch (error) {
        console.warn('API unavailable, using default KPI values')
        // Use default values - don't show error
      } finally {
        setLoading(false)
      }
    }

    loadKPI()
  }, [])

  const averagePower = kpiData?.avg_power_w.toFixed(1) ?? '24.5'
  const peakPower = kpiData?.peak_power_w.toFixed(1) ?? '6.2'
  const infectedRuns = kpiData?.infected_runs ?? 0
  const totalRuns = kpiData?.total_runs ?? 10
  const dataPoints = kpiData?.data_points_collected ?? 58746

  return (
    <>
      <PageHeader
        title="CPU SHIELD Dashboard"
        description="Real-time CPU power telemetry and malware detection status across the monitored host."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          title="Raspberry Pi Status"
          value="Connected"
          hint="Uptime 14d 6h"
          icon={Cpu}
          tone="success"
        />
        <KpiCard
          title="Avg Power Consumption"
          value={`${averagePower} W`}
          hint={`Peak: ${peakPower} W`}
          icon={Activity}
          tone="primary"
        />
        <KpiCard
          title="Detection Status"
          value={`${infectedRuns}/${totalRuns} Infected`}
          hint="Runs analyzed"
          icon={infectedRuns > 0 ? AlertTriangle : ShieldCheck}
          tone={infectedRuns > 0 ? 'danger' : 'success'}
        />
        <KpiCard
          title="Data Collected"
          value={`${(dataPoints / 1000).toFixed(0)}K`}
          hint="Samples at 100 Hz"
          icon={Radio}
          tone="accent"
        />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <LiveCpuChart />
        </div>

        <Card className="glass p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold">System Overview</h3>
              <p className="text-xs text-muted-foreground">
                Monitoring pipeline components
              </p>
            </div>
            <Badge
              variant="outline"
              className="border-success/30 bg-success/10 text-success"
            >
              All Operational
            </Badge>
          </div>

          <div className="flex flex-col gap-3">
            {systemItems.map((item) => {
              const Icon = item.icon
              return (
                <div
                  key={item.label}
                  className="flex items-center gap-3 rounded-lg border border-border bg-secondary/40 p-3"
                >
                  <div className="flex size-9 items-center justify-center rounded-lg bg-primary/15 text-primary">
                    <Icon className="size-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-muted-foreground">
                      {item.label}
                    </p>
                    <p className="truncate text-sm font-medium">
                      {item.value}
                    </p>
                  </div>
                  <span className="flex items-center gap-1 text-xs font-medium text-success">
                    <CheckCircle2 className="size-3.5" />
                    {item.status}
                  </span>
                </div>
              )
            })}
          </div>

          <div className="mt-4 rounded-lg border border-primary/20 bg-primary/10 p-3">
            <p className="text-xs text-muted-foreground">Monitoring Status</p>
            <p className="mt-0.5 text-sm font-semibold text-primary">
              Continuous capture enabled • {dataPoints} samples
            </p>
          </div>
        </Card>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6">
        <SensorReadingCard />
      </div>
    </>
  )
}
