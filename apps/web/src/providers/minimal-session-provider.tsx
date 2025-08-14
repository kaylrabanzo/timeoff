'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { SessionProvider } from 'next-auth/react'
import { DatabaseServiceProvider } from './database-provider'

interface MinimalSessionProviderProps {
  children: React.ReactNode
}

export function MinimalSessionProvider({ children }: MinimalSessionProviderProps) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1 minute
        refetchOnWindowFocus: false,
        retry: 1,
      },
    },
  })

  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        <DatabaseServiceProvider>
          {children}
        </DatabaseServiceProvider>
      </QueryClientProvider>
    </SessionProvider>
  )
}
