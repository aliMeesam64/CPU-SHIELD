import {
  Monitor,
  Zap,
  Gauge,
  CircuitBoard,
  Cpu,
  FunctionSquare,
  BrainCircuit,
  LayoutDashboard,
} from 'lucide-react'
import { PageHeader } from '@/components/dashboard/page-header'
import { FlowDiagram, type FlowNode } from '@/components/dashboard/flow-diagram'
import { Card } from '@/components/ui/card'

const pipeline: FlowNode[] = [
  { icon: Monitor, title: 'Target Computer', subtitle: 'HP Compaq Pro 6300' },
  {
    icon: Zap,
    title: 'CPU Power Rail',
    subtitle: '12V ATX supply line',
    tone: 'accent',
  },
  {
    icon: Gauge,
    title: 'ACS712 Sensor',
    subtitle: 'Hall-effect current transducer',
    tone: 'accent',
  },
  {
    icon: CircuitBoard,
    title: 'ADS1115 ADC',
    subtitle: '16-bit I²C digitizer',
    tone: 'accent',
  },
  { icon: Cpu, title: 'Raspberry Pi', subtitle: 'Edge acquisition node' },
  {
    icon: FunctionSquare,
    title: 'Feature Extraction',
    subtitle: 'Statistical & spectral features',
  },
  {
    icon: BrainCircuit,
    title: 'Machine Learning Engine',
    subtitle: 'Random Forest classifier',
    tone: 'success',
  },
  {
    icon: LayoutDashboard,
    title: 'Dashboard',
    subtitle: 'Visualization & alerts',
    tone: 'success',
  },
]

const stages = [
  {
    title: 'Acquisition Layer',
    desc: 'Non-intrusive current sensing on the CPU power rail, digitized at 16-bit resolution.',
    items: ['ACS712 sensor', 'ADS1115 ADC', 'I²C bus @ 0x48'],
  },
  {
    title: 'Processing Layer',
    desc: 'Edge node samples, buffers and extracts time/frequency-domain features per window.',
    items: ['200 Hz sampling', 'Sliding windows', '32 features/window'],
  },
  {
    title: 'Intelligence Layer',
    desc: 'Trained classifier distinguishes benign from malicious power signatures in real time.',
    items: ['Random Forest', '98.4% accuracy', 'Live inference'],
  },
]

export default function ArchitecturePage() {
  return (
    <>
      <PageHeader
        title="System Architecture"
        description="End-to-end data flow from physical power measurement to malware classification and visualization."
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="glass p-6 lg:col-span-2">
          <h3 className="mb-5 text-sm font-semibold">
            Detection Pipeline
          </h3>
          <FlowDiagram nodes={pipeline} />
        </Card>

        <div className="flex flex-col gap-4">
          {stages.map((s, i) => (
            <Card key={s.title} className="glass p-5">
              <div className="flex items-center gap-2">
                <span className="flex size-6 items-center justify-center rounded-md bg-primary/15 font-mono text-xs font-semibold text-primary">
                  {i + 1}
                </span>
                <h4 className="text-sm font-semibold">{s.title}</h4>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                {s.desc}
              </p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {s.items.map((it) => (
                  <span
                    key={it}
                    className="rounded-md border border-border bg-secondary/50 px-2 py-0.5 text-[11px] text-muted-foreground"
                  >
                    {it}
                  </span>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </>
  )
}
