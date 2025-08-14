# Supabase Relationship Fix

## Issue
The error `PGRST201` was occurring because Supabase/PostgREST found multiple foreign key relationships between the `leave_requests` and `users` tables:

1. `leave_requests_user_id_fkey` - linking `leave_requests(user_id)` to `users(id)`
2. `leave_requests_approver_id_fkey` - linking `leave_requests(approver_id)` to `users(id)`

## Solution
Updated all database queries to explicitly specify which relationship to use when joining tables.

### Fixed Queries

#### Before (Ambiguous)
```sql
SELECT *, users!inner(*) FROM leave_requests
```

#### After (Explicit)
```sql
SELECT *, users!leave_requests_user_id_fkey(*) FROM leave_requests
```

### Updated Methods
- `getAllLeaveRequests()` - Now specifies user relationship
- `getTeamLeaveRequests()` - Now specifies user relationship  
- `getPendingLeaveRequests()` - Now specifies user relationship
- `getLeaveRequestById()` - Now specifies user relationship
- `getManagerTeamStats()` - Now specifies user relationship in queries

### Type Updates
Added `approval_comments?: string` field to both:
- `/packages/database/src/index.ts` LeaveRequest interface
- `/packages/types/src/index.ts` LeaveRequest interface

## Testing
All linting errors have been resolved. The queries should now work correctly with Supabase without the PGRST201 ambiguity error.

## Database Schema Note
The fix assumes you have these foreign key constraints in your database:
- `leave_requests_user_id_fkey`: `leave_requests(user_id) → users(id)`
- `leave_requests_approver_id_fkey`: `leave_requests(approver_id) → users(id)`

If your constraint names are different, update the relationship names accordingly in the queries.
