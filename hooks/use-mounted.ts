'use client'

import { useEffect, useState } from 'react'

/**
 * Returns true only after the component has mounted on the client.
 * Used to defer Recharts' ResponsiveContainer until the DOM has real
 * dimensions, avoiding the "width(-1)/height(-1)" SSR warning.
 */
export function useMounted() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  return mounted
}
