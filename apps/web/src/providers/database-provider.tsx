'use client'

import React, { createContext, useContext, ReactNode } from 'react'
import { IDatabaseService, createDatabaseService } from '@timeoff/database'
import { supabase } from '@/lib/supabase'

// Database service context
const DatabaseServiceContext = createContext<IDatabaseService | null>(null)

// Provider props
interface DatabaseServiceProviderProps {
  children: ReactNode
  service?: IDatabaseService
}

/**
 * Database Service Provider
 * Provides database service instance through React context for dependency injection
 */
export function DatabaseServiceProvider({
  children,
  service
}: DatabaseServiceProviderProps) {
  // Create default service if none provided (useful for testing)
  const databaseService = service || createDatabaseService(supabase)

  return (
    <DatabaseServiceContext.Provider value={databaseService}>
      {children}
    </DatabaseServiceContext.Provider>
  )
}

/**
 * Hook to access database service
 * Throws error if used outside provider
 */
export function useDatabaseService(): IDatabaseService {
  const service = useContext(DatabaseServiceContext)

  if (!service) {
    throw new Error(
      'useDatabaseService must be used within a DatabaseServiceProvider. ' +
      'Make sure to wrap your component tree with <DatabaseServiceProvider>.'
    )
  }

  return service
}

/**
 * Hook for safe access to database service
 * Returns null if used outside provider (useful for optional usage)
 */
export function useDatabaseServiceOptional(): IDatabaseService | null {
  return useContext(DatabaseServiceContext)
}
