'use client'

import { SessionProvider } from 'next-auth/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
// import { Toaster } from 'react-hot-toast'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { DatabaseServiceProvider } from './database-provider'
import { useState } from 'react'
import { Navigation } from '@/components/navigation'

interface ClientSessionProviderProps {
    children: React.ReactNode
}

export function ClientSessionProvider({ children }: ClientSessionProviderProps) {
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        staleTime: 60 * 1000, // 1 minute
                        refetchOnWindowFocus: false,
                        retry: 1,
                    },
                    mutations: {
                        retry: 1,
                    },
                },
            })
    )

    return (
        <SessionProvider>
            <QueryClientProvider client={queryClient}>
                <DatabaseServiceProvider>
                    <Navigation />
                    {children}
                    {/* <Toaster
                        position="top-right"
                        toastOptions={{
                            duration: 4000,
                            style: {
                                background: 'hsl(var(--background))',
                                color: 'hsl(var(--foreground))',
                                border: '1px solid hsl(var(--border))',
                            },
                        }}
                    /> */}

                    <Sonner richColors />
                </DatabaseServiceProvider>
            </QueryClientProvider>
        </SessionProvider>
    )
}
