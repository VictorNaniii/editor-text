'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { FaSun, FaMoon } from 'react-icons/fa'

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme, resolvedTheme } = useTheme()

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true)
  }, [])

  // Return a placeholder during SSR and initial hydration
  if (!mounted) {
    return (
      <div className="flex items-center gap-2">
        {/* Placeholder button to maintain layout */}
        <div className="p-2 rounded w-8 h-8 bg-gray-200 dark:bg-gray-700 animate-pulse" />
        {/* Placeholder select to maintain layout */}
        <div className="px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 min-w-[120px] h-10 animate-pulse" />
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2">
      {/* Quick toggle button */}
      <button
        onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
        className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        title={`Switch to ${resolvedTheme === 'dark' ? 'light' : 'dark'} mode`}
      >
        {resolvedTheme === 'dark' ? (
          <FaSun className="w-4 h-4 text-yellow-500" />
        ) : (
          <FaMoon className="w-4 h-4 text-gray-600" />
        )}
      </button>

      {/* Theme dropdown */}
      <select
        value={theme}
        onChange={(e) => setTheme(e.target.value)}
        className="px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm min-w-[120px] h-10"
        title="Select Theme"
      >
        <option value="system">System</option>
        <option value="light">Light</option>
        <option value="dark">Dark</option>
      </select>
    </div>
  )
}
