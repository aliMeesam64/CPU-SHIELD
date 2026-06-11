import {
  Server,
  Gauge,
  CircuitBoard,
  Cpu,
  MonitorSmartphone,
  Activity,
  Wifi,
  HeartPulse,
} from 'lucide-react'
import { PageHeader } from '@/components/dashboard/page-header'
import { FlowDiagram, type FlowNode } from '@/components/dashboard/flow-diagram'
import { SensorReadingCard } from '@/components/dashboard/sensor-reading-card'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const components = [
  {
    icon: Server,
    name: 'HP Compaq Pro 6300',
    role: 'Target System',
    connection: 'Power Rail Tap',
    health: 98,
  },
  {
    icon: Gauge,
    name: 'ACS712 Current Sensor',
    role: 'Current Sensing',
    connection: 'Analog Out → ADC',
    health: 96,
  },
  {
    icon: CircuitBoard,
    name: 'ADS1115 ADC',
    role: '16-bit Conversion',
    connection: 'I²C @ 0x48',
    health: 99,
  },
  {
    icon: Cpu,
    name: 'Raspberry Pi 4 Model B',
    role: 'Edge Processing',
    connection: 'GPIO / I²C',
    health: 95,
  },
  {
    icon: MonitorSmartphone,
    name: 'Analysis Workstation',
    role: 'ML & Dashboard',
    connection: 'LAN / SSH',
    health: 100,
  },
]

const flow: FlowNode[] = [
  {
    icon: Server,
    title: 'HP Compaq Pro 6300',
    subtitle: 'Target System',
    status: 'Online',
  },
  {
    icon: Gauge,
    title: 'ACS712 Current Sensor',
    subtitle: 'Hall-effect current sensing',
    status: 'Active',
    tone: 'accent',
  },
  {
    icon: CircuitBoard,
    title: 'ADS1115 ADC',
    subtitle: '16-bit analog-to-digital',
    status: 'Active',
    tone: 'accent',
  },
  {
    icon: Cpu,
    title: 'Raspberry Pi 4 Model B',
    subtitle: 'Edge acquisition node',
    status: 'Connected',
  },
  {
    icon: MonitorSmartphone,
    title: 'Analysis Workstation',
    subtitle: 'Feature extraction & ML',
    status: 'Ready',
    tone: 'success',
  },
]

function healthTone(h: number) {
  if (h >= 97) return 'text-success'
  if (h >= 90) return 'text-accent'
  return 'text-warning'
}

export default function HardwarePage() {
  return (
    <>
      <PageHeader
        title="Hardware Integration"
        description="Physical acquisition chain from the monitored host's power rail to the analysis workstation."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {components.map((c) => {
          const Icon = c.icon
          return (
            <Card key={c.name} className="glass p-4">
              <div className="flex items-center justify-between">
                <div className="flex size-10 items-center justify-center rounded-lg bg-primary/15 text-primary">
                  <Icon className="size-5" />
                </div>
                <span className="relative flex size-2.5">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-success opacity-60" />
                  <span className="relative inline-flex size-2.5 rounded-full bg-success" />
                </span>
              </div>
              <p className="mt-3 text-sm font-semibold leading-tight">
                {c.name}
              </p>
              <p className="text-xs text-muted-foreground">{c.role}</p>

              <div className="mt-3 space-y-2 border-t border-border pt-3">
                <div className="flex items-center gap-1.5 text-xs">
                  <Wifi className="size-3.5 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    {c.connection}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1.5 text-muted-foreground">
                    <HeartPulse className="size-3.5" />
                    Health
                  </span>
                  <span className={`font-mono font-medium ${healthTone(c.health)}`}>
                    {c.health}%
                  </span>
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="glass p-6 lg:col-span-2">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold">
                Hardware Architecture Diagram
              </h3>
              <p className="text-xs text-muted-foreground">
                Signal path through the acquisition pipeline
              </p>
            </div>
            <Badge
              variant="outline"
              className="border-primary/30 bg-primary/10 text-primary"
            >
              <Activity className="mr-1 size-3" />
              Streaming
            </Badge>
          </div>
          <FlowDiagram nodes={flow} />
        </Card>

        <SensorReadingCard />
      </div>
    </>
  )
}
