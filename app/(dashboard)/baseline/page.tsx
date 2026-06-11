import { Database, Clock, Activity, TrendingUp } from 'lucide-react'
import { PageHeader } from '@/components/dashboard/page-header'
import { KpiCard } from '@/components/dashboard/kpi-card'
import { BaselineChart } from '@/components/dashboard/baseline-chart'
import { Card } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

const comparison = [
  { activity: 'Idle State', avg: '18.2 W', peak: '21.4 W', std: '0.9 W' },
  { activity: 'Web Browsing', avg: '26.7 W', peak: '34.1 W', std: '3.2 W' },
  { activity: 'Video Playback', avg: '31.5 W', peak: '38.9 W', std: '2.4 W' },
  { activity: 'File Transfer', avg: '29.1 W', peak: '41.2 W', std: '4.8 W' },
]

export default function BaselinePage() {
  return (
    <>
      <PageHeader
        title="Baseline Creation and Analysis"
        description="Characterising normal CPU power signatures across representative workloads to define detection thresholds."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          title="Total Samples"
          value="148,320"
          hint="Across 4 workloads"
          icon={Database}
          tone="primary"
        />
        <KpiCard
          title="Recording Duration"
          value="12h 24m"
          hint="Continuous capture"
          icon={Clock}
          tone="accent"
        />
        <KpiCard
          title="Average Power"
          value="26.4 W"
          hint="Combined mean"
          icon={Activity}
          tone="success"
        />
        <KpiCard
          title="Peak Power"
          value="41.2 W"
          hint="File transfer burst"
          icon={TrendingUp}
          tone="warning"
        />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <BaselineChart
          title="Idle State"
          subtitle="Power consumption during idle"
          base={18.2}
          variance={1.4}
          seed={1}
          color="var(--color-chart-3)"
          domain={[14, 24]}
        />
        <BaselineChart
          title="Web Browsing"
          subtitle="Power consumption during web browsing"
          base={26.7}
          variance={3.5}
          seed={5}
          color="var(--color-chart-1)"
          domain={[18, 38]}
        />
        <BaselineChart
          title="Video Playback"
          subtitle="Power consumption during video playback"
          base={31.5}
          variance={2.6}
          seed={9}
          color="var(--color-chart-2)"
          domain={[24, 42]}
        />
        <BaselineChart
          title="File Transfer"
          subtitle="Power consumption during file transfer"
          base={29.1}
          variance={5}
          seed={13}
          color="var(--color-chart-4)"
          domain={[20, 44]}
        />
      </div>

      <Card className="glass mt-6 p-5">
        <h3 className="mb-4 text-sm font-semibold">
          Workload Comparison Summary
        </h3>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead>Activity</TableHead>
                <TableHead className="text-right">Average Power</TableHead>
                <TableHead className="text-right">Peak Power</TableHead>
                <TableHead className="text-right">Standard Deviation</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {comparison.map((row) => (
                <TableRow key={row.activity} className="border-border">
                  <TableCell className="font-medium">{row.activity}</TableCell>
                  <TableCell className="text-right font-mono">
                    {row.avg}
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    {row.peak}
                  </TableCell>
                  <TableCell className="text-right font-mono text-muted-foreground">
                    {row.std}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </>
  )
}
