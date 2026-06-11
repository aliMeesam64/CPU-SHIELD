import { useEffect, useState } from 'react'

export function useTheme() {
  const [theme, setTheme] = useState<'light' | 'dark' | 'cyber' | 'midnight' | 'matrix'>('cyber')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Get theme from localStorage or default to 'cyber'
    const savedTheme = localStorage.getItem('theme') as typeof theme || 'cyber'
    setTheme(savedTheme)
    applyTheme(savedTheme)
  }, [])

  const applyTheme = (newTheme: typeof theme) => {
    const root = document.documentElement
    
    // Remove all theme classes
    root.classList.remove('light', 'cyber', 'midnight', 'matrix')
    
    // Apply the new theme class
    root.classList.add(newTheme)
    
    // Ensure 'dark' class is present for non-light themes
    if (newTheme !== 'light') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
    
    localStorage.setItem('theme', newTheme)
    setTheme(newTheme)
  }

  return { theme, setTheme: applyTheme, mounted }
}
