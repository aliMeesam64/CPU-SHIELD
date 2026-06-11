'use client'

import { useEffect, useState } from 'react'
import { Menu } from 'lucide-react'
import {
  Avatar,
  AvatarFallback,
} from '@/components/ui/avatar'

function useClock() {
  const [now, setNow] = useState<Date | null>(null)
  useEffect(() => {
    setNow(new Date())
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])
  return now
}

export function Topbar() {
  const now = useClock()

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between gap-4 border-b border-border bg-background/80 px-4 backdrop-blur-md md:px-6">
      <div className="flex items-center gap-3">
        <button
          className="rounded-md p-2 text-muted-foreground hover:bg-secondary md:hidden"
          aria-label="Open menu"
        >
          <Menu className="size-5" />
        </button>
        <div className="leading-tight">
          <h1 className="text-balance text-sm font-semibold md:text-base">
            Malware Detection via CPU Power Consumption
          </h1>
          <p className="hidden text-xs text-muted-foreground sm:block">
            Process Behavior Analysis · Final Year Project
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 md:gap-5">
        <div className="hidden items-center gap-2 rounded-full border border-success/30 bg-success/10 px-3 py-1.5 lg:flex">
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-success opacity-75" />
            <span className="relative inline-flex size-2 rounded-full bg-success" />
          </span>
          <span className="text-xs font-medium text-success">
            System Online
          </span>
        </div>

        <div className="hidden text-right md:block">
          <p className="font-mono text-sm tabular-nums text-foreground">
            {now ? now.toLocaleTimeString('en-GB') : '--:--:--'}
          </p>
          <p className="text-[11px] text-muted-foreground">
            {now
              ? now.toLocaleDateString('en-GB', {
                  weekday: 'short',
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                })
              : '--'}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="hidden text-right sm:block">
            <p className="text-sm font-medium leading-none">A. Researcher</p>
            <p className="text-[11px] text-muted-foreground">Security Analyst</p>
          </div>
          <Avatar className="size-9 ring-1 ring-primary/30">
            <AvatarFallback className="bg-primary/15 text-sm font-semibold text-primary">
              AR
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  )
}
