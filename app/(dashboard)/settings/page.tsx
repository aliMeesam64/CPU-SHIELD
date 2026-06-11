'use client'

import { useState, useEffect } from 'react'
import { Cpu, Gauge, Waves, BrainCircuit, Palette, Save } from 'lucide-react'
import { PageHeader } from '@/components/dashboard/page-header'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useTheme } from '@/hooks/use-theme'

function Field({
  label,
  hint,
  children,
}: {
  label: string
  hint?: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-sm font-medium">{label}</p>
        {hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
      </div>
      <div className="sm:w-56">{children}</div>
    </div>
  )
}

function SectionCard({
  icon: Icon,
  title,
  desc,
  children,
}: {
  icon: typeof Cpu
  title: string
  desc: string
  children: React.ReactNode
}) {
  return (
    <Card className="glass p-5">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-lg bg-primary/15 text-primary">
          <Icon className="size-5" />
        </div>
        <div>
          <h3 className="text-sm font-semibold">{title}</h3>
          <p className="text-xs text-muted-foreground">{desc}</p>
        </div>
      </div>
      <Separator className="mb-4" />
      <div className="flex flex-col gap-4">{children}</div>
    </Card>
  )
}

export default function SettingsPage() {
  const [autoCapture, setAutoCapture] = useState(true)
  const [alerts, setAlerts] = useState(true)
  const [glass, setGlass] = useState(true)
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <>
      <PageHeader
        title="Settings"
        description="Configure the acquisition node, sensor calibration, sampling and model parameters."
      >
        <Button size="sm" className="gap-2">
          <Save className="size-4" />
          Save Changes
        </Button>
      </PageHeader>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <SectionCard
          icon={Cpu}
          title="Raspberry Pi Configuration"
          desc="Edge acquisition node settings"
        >
          <Field label="Host Address" hint="LAN endpoint">
            <input
              defaultValue="192.168.1.42"
              className="w-full rounded-md border border-input bg-secondary/40 px-3 py-2 font-mono text-sm outline-none focus:ring-2 focus:ring-ring"
            />
          </Field>
          <Field label="Auto Capture" hint="Start on boot">
            <div className="flex sm:justify-end">
              <Switch checked={autoCapture} onCheckedChange={setAutoCapture} />
            </div>
          </Field>
        </SectionCard>

        <SectionCard
          icon={Gauge}
          title="Sensor Configuration"
          desc="ACS712 calibration parameters"
        >
          <Field label="Sensor Model">
            <Select defaultValue="20a">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5a">ACS712 - 5A</SelectItem>
                <SelectItem value="20a">ACS712 - 20A</SelectItem>
                <SelectItem value="30a">ACS712 - 30A</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <Field label="Sensitivity" hint="mV per Ampere">
            <input
              defaultValue="100"
              className="w-full rounded-md border border-input bg-secondary/40 px-3 py-2 font-mono text-sm outline-none focus:ring-2 focus:ring-ring"
            />
          </Field>
        </SectionCard>

        <SectionCard
          icon={Waves}
          title="Sampling Rate"
          desc="Data acquisition frequency"
        >
          <Field label="Sample Rate">
            <Select defaultValue="200">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="100">100 Hz</SelectItem>
                <SelectItem value="200">200 Hz</SelectItem>
                <SelectItem value="500">500 Hz</SelectItem>
                <SelectItem value="860">860 Hz (max)</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <Field label="Window Size">
            <Select defaultValue="1s">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="500ms">500 ms</SelectItem>
                <SelectItem value="1s">1 second</SelectItem>
                <SelectItem value="2s">2 seconds</SelectItem>
              </SelectContent>
            </Select>
          </Field>
        </SectionCard>

        <SectionCard
          icon={BrainCircuit}
          title="Model Selection"
          desc="Active classification model"
        >
          <Field label="Algorithm">
            <Select defaultValue="rf">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rf">Random Forest</SelectItem>
                <SelectItem value="svm">Support Vector Machine</SelectItem>
                <SelectItem value="xgb">XGBoost</SelectItem>
                <SelectItem value="lstm">LSTM Network</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <Field label="Real-time Alerts" hint="Notify on detection">
            <div className="flex sm:justify-end">
              <Switch checked={alerts} onCheckedChange={setAlerts} />
            </div>
          </Field>
        </SectionCard>

        <SectionCard
          icon={Palette}
          title="Theme Settings"
          desc="Dashboard appearance"
        >
          <Field label="Color Scheme">
            <Select value={mounted ? theme : 'cyber'} onValueChange={(value) => setTheme(value as any)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light Mode</SelectItem>
                <SelectItem value="cyber">Cyber Dark (default)</SelectItem>
                <SelectItem value="midnight">Midnight</SelectItem>
                <SelectItem value="matrix">Matrix Green</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <Field label="Glassmorphism" hint="Frosted card surfaces">
            <div className="flex sm:justify-end">
              <Switch checked={glass} onCheckedChange={setGlass} />
            </div>
          </Field>
        </SectionCard>
      </div>
    </>
  )
}
