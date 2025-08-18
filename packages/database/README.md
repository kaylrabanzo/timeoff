# Database Package - Modular Architecture

This package provides a modular, scalable database layer for the TimeOff application with proper separation of concerns and maintainable code structure.

## Architecture Overview

The database package follows a modular architecture with clear separation of concerns:

```
packages/database/src/
├── modules/
│   ├── shared/           # Shared utilities and types
│   ├── users/           # User management module
│   ├── leave-requests/  # Leave request management module
│   ├── leave-balances/  # Leave balance management module
│   ├── departments/     # Department management module
│   ├── teams/          # Team management module
│   ├── notifications/  # Notification management module
│   ├── calendar-events/ # Calendar event management module
│   ├── leave-policies/ # Leave policy management module
│   ├── audit-logs/     # Audit logging module
│   └── database-service.ts # Main service factory
└── index.ts            # Main entry point with backward compatibility
```

## Module Structure

Each module follows a consistent structure:

```
module-name/
├── types.ts      # TypeScript interfaces and types
├── repository.ts # Database access layer
├── service.ts    # Business logic layer
└── index.ts      # Module exports
```

### Layer Responsibilities

1. **Types Layer** (`types.ts`)
   - Defines TypeScript interfaces for the module
   - Includes data transfer objects (DTOs)
   - Defines filter and query interfaces

2. **Repository Layer** (`repository.ts`)
   - Handles direct database operations
   - Implements CRUD operations
   - Manages database queries and transactions
   - Handles database-specific error handling

3. **Service Layer** (`service.ts`)
   - Contains business logic
   - Orchestrates operations across repositories
   - Handles cross-cutting concerns (audit logging, notifications)
   - Implements validation and business rules

## Modules

### Shared Module
- **Location**: `modules/shared/`
- **Purpose**: Common utilities and types used across all modules
- **Key Features**:
  - Base entity interfaces
  - Database utility functions
  - Error handling utilities
  - Query and filter interfaces

### Users Module
- **Location**: `modules/users/`
- **Purpose**: User management and authentication
- **Key Features**:
  - User CRUD operations
  - Team member management
  - User statistics
  - Role-based operations

### Leave Requests Module
- **Location**: `modules/leave-requests/`
- **Purpose**: Leave request lifecycle management
- **Key Features**:
  - Leave request CRUD operations
  - Approval/rejection workflow
  - Team request management
  - Bulk operations
  - Status management

### Leave Balances Module
- **Location**: `modules/leave-balances/`
- **Purpose**: Leave balance tracking and management
- **Key Features**:
  - Balance tracking by user and year
  - Automatic balance updates
  - Carry-over calculations
  - Balance summaries

### Departments Module
- **Location**: `modules/departments/`
- **Purpose**: Department management
- **Key Features**:
  - Department CRUD operations
  - Manager assignment
  - Department statistics

### Teams Module
- **Location**: `modules/teams/`
- **Purpose**: Team management within departments
- **Key Features**:
  - Team CRUD operations
  - Team lead assignment
  - Department-based team organization

### Notifications Module
- **Location**: `modules/notifications/`
- **Purpose**: User notification management
- **Key Features**:
  - Notification CRUD operations
  - Read/unread status management
  - Notification types and templates

### Calendar Events Module
- **Location**: `modules/calendar-events/`
- **Purpose**: Calendar event management
- **Key Features**:
  - Event CRUD operations
  - Date range queries
  - Event type management
  - User and department filtering

### Leave Policies Module
- **Location**: `modules/leave-policies/`
- **Purpose**: Leave policy configuration
- **Key Features**:
  - Policy CRUD operations
  - Policy type management
  - Active policy queries

### Audit Logs Module
- **Location**: `modules/audit-logs/`
- **Purpose**: System audit logging
- **Key Features**:
  - Audit log creation
  - User action tracking
  - Resource-based logging
  - Filtering and querying

## Usage

### Using the Modular Services

```typescript
import { DatabaseServiceFactory } from '@timeoff/database';

// Get the service factory instance
const serviceFactory = DatabaseServiceFactory.getInstance(supabaseClient);

// Access specific services
const userService = serviceFactory.getUserService();
const leaveRequestService = serviceFactory.getLeaveRequestService();
const notificationService = serviceFactory.getNotificationService();

// Use services
const user = await userService.getUserById('user-id');
const requests = await leaveRequestService.getPendingLeaveRequests();
```

### Backward Compatibility

The package maintains backward compatibility with the existing `IDatabaseService` interface:

```typescript
import { databaseService } from '@timeoff/database';

// Legacy usage still works
const user = await databaseService.getUserById('user-id');
const requests = await databaseService.getAllLeaveRequests();
```

### Dependency Injection

Services are designed for dependency injection and can be easily mocked for testing:

```typescript
// In tests
const mockUserService = {
  getUserById: jest.fn(),
  createUser: jest.fn(),
  // ... other methods
};

const mockLeaveRequestService = {
  createLeaveRequest: jest.fn(),
  // ... other methods
};
```

## Key Benefits

### 1. Separation of Concerns
- Clear separation between data access, business logic, and types
- Each module has a single responsibility
- Easy to understand and maintain

### 2. Modularity
- Modules can be developed and tested independently
- Easy to add new modules or modify existing ones
- Loose coupling between modules

### 3. Maintainability
- Consistent structure across all modules
- Centralized error handling and utilities
- Clear naming conventions

### 4. Scalability
- Easy to add new features without affecting existing code
- Services can be extended independently
- Support for complex business logic

### 5. Testability
- Each layer can be tested independently
- Easy to mock dependencies
- Clear interfaces for testing

## Error Handling

The package implements a centralized error handling system:

```typescript
import { DatabaseUtils } from '@timeoff/database';

// Standardized error creation
const error = DatabaseUtils.createError('User not found', 'NOT_FOUND', { userId });

// Database error handling
try {
  const user = await userRepository.findById(id);
} catch (error) {
  throw DatabaseUtils.handleDatabaseError(error, 'findUserById');
}
```

## Best Practices

### 1. Service Layer Usage
- Always use the service layer for business operations
- Don't bypass the service layer to access repositories directly
- Use the service layer for cross-cutting concerns

### 2. Error Handling
- Use the centralized error handling utilities
- Provide meaningful error messages
- Include relevant context in error details

### 3. Type Safety
- Use TypeScript interfaces for all data structures
- Validate input data before processing
- Use proper typing for function parameters and return values

### 4. Testing
- Test each layer independently
- Mock dependencies for isolated testing
- Use integration tests for complex workflows

## Migration Guide

### From Legacy Code

1. **Update Imports**
   ```typescript
   // Old
   import { databaseService } from '@timeoff/database';
   
   // New (optional - backward compatibility maintained)
   import { DatabaseServiceFactory } from '@timeoff/database';
   ```

2. **Use Modular Services**
   ```typescript
   // Old
   const user = await databaseService.getUserById(id);
   
   // New
   const userService = serviceFactory.getUserService();
   const user = await userService.getUserById(id);
   ```

3. **Leverage New Features**
   ```typescript
   // New features available
   const userStats = await userService.getUserStats();
   const balanceSummary = await leaveBalanceService.getLeaveBalanceSummary(userId, year);
   ```

## Contributing

When adding new modules or modifying existing ones:

1. Follow the established module structure
2. Use the shared utilities for common operations
3. Implement proper error handling
4. Add comprehensive TypeScript types
5. Include audit logging where appropriate
6. Write tests for all layers

## Future Enhancements

- [ ] Add caching layer for frequently accessed data
- [ ] Implement database migrations management
- [ ] Add real-time subscription management
- [ ] Create admin dashboard for system monitoring
- [ ] Add bulk operation optimizations
- [ ] Implement advanced filtering and search capabilities
