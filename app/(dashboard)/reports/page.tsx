'use client'

import { useState } from 'react'
import { FileText, Activity, BrainCircuit, Cpu, Download, FileBarChart } from 'lucide-react'
import { PageHeader } from '@/components/dashboard/page-header'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

const initialReports = [
  {
    icon: Activity,
    name: 'Baseline Report',
    desc: 'Power signature characterisation across 4 reference workloads.',
    date: 'Generated 08 Jun 2026, 14:22',
    size: '2.4 MB',
    format: 'PDF',
    tone: 'text-success bg-success/15',
  },
  {
    icon: BrainCircuit,
    name: 'Training Report',
    desc: 'Random Forest model metrics, feature importance and confusion matrix.',
    date: 'Generated 09 Jun 2026, 09:47',
    size: '3.1 MB',
    format: 'PDF',
    tone: 'text-primary bg-primary/15',
  },
  {
    icon: Cpu,
    name: 'Hardware Status Report',
    desc: 'Acquisition chain health, calibration logs and connectivity audit.',
    date: 'Generated 10 Jun 2026, 07:15',
    size: '1.2 MB',
    format: 'PDF',
    tone: 'text-accent bg-accent/15',
  },
]

function formatDate(date: Date): string {
  return date.toLocaleDateString('en-GB', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default function ReportsPage() {
  const [reports, setReports] = useState(initialReports)

  const handleGenerateReport = () => {
    const newReport = {
      icon: Activity,
      name: 'Baseline Report',
      desc: 'Power signature characterisation across 4 reference workloads.',
      date: `Generated ${formatDate(new Date())}`,
      size: (2.0 + Math.random() * 1.0).toFixed(1) + ' MB',
      format: 'PDF',
      tone: 'text-success bg-success/15',
    }
    setReports([newReport, ...reports])
  }

  return (
    <>
      <PageHeader
        title="Analysis Reports"
        description="Generated documentation for baseline characterisation, model training and hardware status."
      >
        <Button size="sm" className="gap-2" onClick={handleGenerateReport}>
          <FileBarChart className="size-4" />
          Generate New
        </Button>
      </PageHeader>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {reports.map((r, idx) => {
          const Icon = r.icon
          return (
            <Card key={`${r.name}-${idx}`} className="glass flex flex-col p-5">
              <div className="flex items-start justify-between">
                <div className={`flex size-11 items-center justify-center rounded-xl ${r.tone}`}>
                  <Icon className="size-5" />
                </div>
                <Badge variant="outline" className="border-border text-muted-foreground">
                  {r.format} · {r.size}
                </Badge>
              </div>
              <h3 className="mt-4 text-sm font-semibold">{r.name}</h3>
              <p className="mt-1 flex-1 text-pretty text-xs leading-relaxed text-muted-foreground">
                {r.desc}
              </p>
              <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
                <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                  <FileText className="size-3.5" />
                  {r.date}
                </span>
              </div>
              <Button variant="secondary" size="sm" className="mt-3 w-full gap-2">
                <Download className="size-4" />
                Download
              </Button>
            </Card>
          )
        })}
      </div>
    </>
  )
}
