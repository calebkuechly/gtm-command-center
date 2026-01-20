'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { SessionProvider } from 'next-auth/react'
import { useState, useEffect } from 'react'
import { Toaster } from 'react-hot-toast'

function ThemeInitializer() {
  useEffect(() => {
    // Get theme from localStorage or system preference
    const stored = localStorage.getItem('gtm-dashboard-storage')
    let theme = 'system'

    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        theme = parsed.state?.theme || 'system'
      } catch (e) {
        // Ignore parse errors
      }
    }

    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light'
    const effectiveTheme = theme === 'system' ? systemTheme : theme

    document.documentElement.classList.remove('light', 'dark')
    document.documentElement.classList.add(effectiveTheme)
  }, [])

  return null
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30 * 1000, // 30 seconds
            refetchOnWindowFocus: true,
            retry: 2,
          },
        },
      })
  )

  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeInitializer />
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: 'var(--toast-bg)',
              color: 'var(--toast-color)',
              borderRadius: '0.75rem',
              padding: '0.75rem 1rem',
            },
            success: {
              iconTheme: {
                primary: '#10b981',
                secondary: '#ffffff',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#ffffff',
              },
            },
          }}
        />
      </QueryClientProvider>
    </SessionProvider>
  )
}
