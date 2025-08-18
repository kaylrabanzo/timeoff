import { ServiceError, QueryOptions, FilterOptions, PaginationResult } from './types';

// Utility functions for common database operations
export class DatabaseUtils {
  /**
   * Creates a standardized service error
   */
  static createError(message: string, code: string, details?: Record<string, any>): ServiceError {
    const error = new Error(message) as ServiceError;
    error.code = code;
    error.details = details;
    return error;
  }

  /**
   * Applies query options to a Supabase query
   */
  static applyQueryOptions(query: any, options: QueryOptions): any {
    if (options.limit) {
      query = query.limit(options.limit);
    }
    
    if (options.offset) {
      query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
    }
    
    if (options.orderBy) {
      query = query.order(options.orderBy.column, { ascending: options.orderBy.direction === 'asc' });
    }
    
    return query;
  }

  /**
   * Applies filter options to a Supabase query
   */
  static applyFilters(query: any, filters: FilterOptions): any {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          query = query.in(key, value);
        } else {
          query = query.eq(key, value);
        }
      }
    });
    
    return query;
  }

  /**
   * Handles common database errors
   */
  static handleDatabaseError(error: any, operation: string): never {
    console.error(`Database error in ${operation}:`, error);
    
    if (error.code === 'PGRST116') {
      throw this.createError('Record not found', 'NOT_FOUND', { operation });
    }
    
    if (error.code === '23505') {
      throw this.createError('Duplicate record', 'DUPLICATE_ENTRY', { operation });
    }
    
    if (error.code === '23503') {
      throw this.createError('Referenced record not found', 'FOREIGN_KEY_VIOLATION', { operation });
    }
    
    throw this.createError(
      error.message || 'Database operation failed',
      'DATABASE_ERROR',
      { operation, originalError: error }
    );
  }

  /**
   * Creates pagination result from data and options
   */
  static createPaginationResult<T>(
    data: T[],
    page: number,
    limit: number,
    total: number
  ): PaginationResult<T> {
    return {
      data,
      pagination: {
        page,
        limit,
        total,
        total_pages: Math.ceil(total / limit)
      }
    };
  }

  /**
   * Validates required fields
   */
  static validateRequiredFields(data: Record<string, any>, requiredFields: string[]): void {
    const missingFields = requiredFields.filter(field => 
      data[field] === undefined || data[field] === null || data[field] === ''
    );
    
    if (missingFields.length > 0) {
      throw this.createError(
        `Missing required fields: ${missingFields.join(', ')}`,
        'VALIDATION_ERROR',
        { missingFields }
      );
    }
  }

  /**
   * Sanitizes data for database operations
   */
  static sanitizeData<T extends Record<string, any>>(data: T): T {
    const sanitized = { ...data };
    
    // Remove undefined values
    Object.keys(sanitized).forEach(key => {
      if (sanitized[key] === undefined) {
        delete sanitized[key];
      }
    });
    
    return sanitized;
  }
}
