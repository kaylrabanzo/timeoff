import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ClientSessionProvider } from '@/providers/session-provider'
import { MinimalSessionProvider } from '@/providers/minimal-session-provider'

// Force dynamic rendering for all pages
export const dynamic = 'force-dynamic'
export const revalidate = 0

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Timeoff Management System',
  description: 'Comprehensive timeoff management system for modern organizations',
  keywords: ['timeoff', 'leave management', 'hr', 'employee management'],
  authors: [{ name: 'Timeoff Team' }],
  robots: 'index, follow',
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ClientSessionProvider>
          {children}
        </ClientSessionProvider>
      </body>
    </html>
  )
} 