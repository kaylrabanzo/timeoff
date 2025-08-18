# Database Service Usage Examples

This document provides examples of how to use the new modular database service layer.

## Basic Usage

### Using the Service Factory

```typescript
import { DatabaseServiceFactory } from '@timeoff/database';
import { supabase } from '@timeoff/database';

// Get the service factory instance
const serviceFactory = DatabaseServiceFactory.getInstance(supabase);

// Access specific services
const userService = serviceFactory.getUserService();
const leaveRequestService = serviceFactory.getLeaveRequestService();
const notificationService = serviceFactory.getNotificationService();
```

### Using Legacy Interface (Backward Compatible)

```typescript
import { databaseService } from '@timeoff/database';

// Legacy usage still works
const user = await databaseService.getUserById('user-id');
const requests = await databaseService.getAllLeaveRequests();
```

## User Management Examples

### Get User Information

```typescript
// Get user by ID
const user = await userService.getUserById('user-123');

// Get user by email
const user = await userService.getUserByEmail('john.doe@company.com');

// Get all users with filters
const activeUsers = await userService.getAllUsers({ is_active: true });
const departmentUsers = await userService.getAllUsers({ department: 'Engineering' });
```

### Team Management

```typescript
// Get team members for a manager
const teamMembers = await userService.getTeamMembers('manager-123');

// Get manager team statistics
const teamStats = await userService.getManagerTeamStats('manager-123');
console.log(`Team has ${teamStats.teamMembersCount} members`);
console.log(`Pending requests: ${teamStats.pendingRequestsCount}`);
console.log(`Approved this month: ${teamStats.monthlyApprovedCount}`);
```

### User Operations

```typescript
// Create a new user
const newUser = await userService.createUser({
  email: 'jane.smith@company.com',
  first_name: 'Jane',
  last_name: 'Smith',
  department: 'Marketing',
  team: 'Digital',
  role: 'employee',
  hire_date: new Date(),
  is_active: true
}, 'admin-123'); // createdBy parameter for audit logging

// Update user
const updatedUser = await userService.updateUser('user-123', {
  department: 'Sales',
  role: 'supervisor'
}, 'admin-123');

// Change user role
const user = await userService.changeUserRole('user-123', 'supervisor', 'admin-123');

// Deactivate user
const deactivatedUser = await userService.deactivateUser('user-123', 'admin-123');
```

## Leave Request Management Examples

### Create and Manage Leave Requests

```typescript
// Create a leave request
const leaveRequest = await leaveRequestService.createLeaveRequest({
  user_id: 'user-123',
  leave_type: 'vacation',
  start_date: '2024-01-15',
  end_date: '2024-01-19',
  total_days: 5,
  reason: 'Family vacation'
}, 'user-123');

// Get user's leave requests
const userRequests = await leaveRequestService.getLeaveRequestsByUser('user-123');

// Get pending requests for a manager
const pendingRequests = await leaveRequestService.getPendingLeaveRequests('manager-123');

// Get team requests
const teamRequests = await leaveRequestService.getTeamLeaveRequests('manager-123');
```

### Approval Workflow

```typescript
// Approve a leave request
const approvedRequest = await leaveRequestService.approveLeaveRequest('request-123', {
  approver_id: 'manager-123',
  comments: 'Approved - enjoy your vacation!'
});

// Reject a leave request
const rejectedRequest = await leaveRequestService.rejectLeaveRequest('request-123', {
  approver_id: 'manager-123',
  rejection_reason: 'Insufficient notice period'
});

// Cancel a leave request
const cancelledRequest = await leaveRequestService.cancelLeaveRequest('request-123', 'user-123');
```

### Bulk Operations

```typescript
// Bulk approve multiple requests
const approvedRequests = await leaveRequestService.bulkUpdateLeaveRequests(
  ['request-1', 'request-2', 'request-3'],
  { 
    status: 'approved',
    approver_id: 'manager-123'
  },
  'manager-123'
);
```

## Leave Balance Management Examples

```typescript
const leaveBalanceService = serviceFactory.getLeaveBalanceService();

// Get user's leave balance for current year
const balances = await leaveBalanceService.getLeaveBalance('user-123', 2024);

// Create or update leave balance
const balance = await leaveBalanceService.createLeaveBalance({
  user_id: 'user-123',
  leave_type: 'vacation',
  total_allowance: 25,
  used_days: 5,
  year: 2024
});

// Get leave balance summary
const summary = await leaveBalanceService.getLeaveBalanceSummary('user-123', 2024);
console.log(`Total remaining: ${summary.total_remaining} days`);
console.log(`Total used: ${summary.total_used} days`);
```

## Notification Management Examples

```typescript
const notificationService = serviceFactory.getNotificationService();

// Get user notifications
const notifications = await notificationService.getNotificationsByUser('user-123', 10);

// Create a notification
const notification = await notificationService.createNotification({
  user_id: 'user-123',
  title: 'Leave Request Approved',
  message: 'Your vacation request has been approved.',
  type: 'request_approved',
  related_id: 'request-123'
});

// Mark notification as read
const readNotification = await notificationService.markNotificationAsRead('notification-123');

// Get unread count
const unreadCount = await notificationService.getUnreadCount('user-123');
```

## Calendar Events Examples

```typescript
const calendarEventService = serviceFactory.getCalendarEventService();

// Get calendar events for a date range
const events = await calendarEventService.getCalendarEventsByDateRange(
  new Date('2024-01-01'),
  new Date('2024-01-31'),
  'user-123' // optional user filter
);

// Create a leave event
const leaveEvent = await calendarEventService.createLeaveEvent(
  'user-123',
  new Date('2024-01-15'),
  new Date('2024-01-19'),
  'vacation',
  'manager-123'
);

// Create a holiday event
const holidayEvent = await calendarEventService.createHolidayEvent(
  'New Year\'s Day',
  new Date('2024-01-01'),
  new Date('2024-01-01'),
  'admin-123'
);
```

## Department and Team Management Examples

```typescript
const departmentService = serviceFactory.getDepartmentService();
const teamService = serviceFactory.getTeamService();

// Get all departments
const departments = await departmentService.getAllDepartments({ is_active: true });

// Create a department
const department = await departmentService.createDepartment({
  name: 'Research & Development',
  description: 'Innovation and product development',
  manager_id: 'manager-123'
}, 'admin-123');

// Get teams by department
const teams = await teamService.getTeamsByDepartment('dept-123');

// Create a team
const team = await teamService.createTeam({
  name: 'Frontend Team',
  department_id: 'dept-123',
  description: 'Frontend development team',
  lead_id: 'lead-123'
}, 'admin-123');
```

## Audit Logging Examples

```typescript
const auditLogService = serviceFactory.getAuditLogService();

// Get audit logs for a user
const userLogs = await auditLogService.getAuditLogsByUserId('user-123');

// Get audit logs for a resource
const resourceLogs = await auditLogService.getAuditLogsByResource('leave_request', 'request-123');

// Log user actions
await auditLogService.logUserAction(
  'user-123',
  'VIEW_DASHBOARD',
  'dashboard',
  'user-123'
);

// Log login/logout
await auditLogService.logLogin('user-123', '192.168.1.1', 'Mozilla/5.0...');
await auditLogService.logLogout('user-123', '192.168.1.1', 'Mozilla/5.0...');
```

## Error Handling Examples

```typescript
import { DatabaseUtils } from '@timeoff/database';

try {
  const user = await userService.getUserById('non-existent-id');
} catch (error) {
  if (error.code === 'NOT_FOUND') {
    console.log('User not found');
  } else if (error.code === 'DATABASE_ERROR') {
    console.log('Database error occurred');
  }
}

// Create custom errors
const customError = DatabaseUtils.createError(
  'Invalid leave request',
  'VALIDATION_ERROR',
  { field: 'start_date', value: 'invalid-date' }
);
```

## Advanced Usage Patterns

### Service Composition

```typescript
// Combine multiple services for complex operations
async function processLeaveRequest(requestId: string, approverId: string) {
  const request = await leaveRequestService.getLeaveRequestById(requestId);
  
  // Approve the request
  const approvedRequest = await leaveRequestService.approveLeaveRequest(requestId, {
    approver_id: approverId,
    comments: 'Approved'
  });
  
  // Update leave balance
  await leaveBalanceService.updateBalanceAfterApproval(approvedRequest);
  
  // Create calendar event
  await calendarEventService.createLeaveEvent(
    request.user_id,
    new Date(request.start_date),
    new Date(request.end_date),
    request.leave_type,
    approverId
  );
  
  // Send notification
  await notificationService.createNotification({
    user_id: request.user_id,
    title: 'Leave Request Approved',
    message: 'Your leave request has been approved.',
    type: 'request_approved',
    related_id: requestId
  });
}
```

### Filtering and Pagination

```typescript
// Get leave requests with filters
const requests = await leaveRequestService.getAllLeaveRequests({
  status: 'pending',
  date_range: {
    start: new Date('2024-01-01'),
    end: new Date('2024-01-31')
  }
});

// Get users with filters
const users = await userService.getAllUsers({
  department: 'Engineering',
  is_active: true
});
```

This modular approach provides a clean, maintainable, and scalable way to interact with the database while maintaining backward compatibility with existing code.
