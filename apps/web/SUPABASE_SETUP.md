# Supabase Setup for Timeoff Application

## Environment Variables

Create a `.env.local` file in the `apps/web` directory with the following variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# NextAuth Configuration
NEXTAUTH_SECRET=your_nextauth_secret_key
NEXTAUTH_URL=http://localhost:3000

# Google OAuth (for Google sign-in)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

## Supabase Project Setup

1. **Create a Supabase Project**:
   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Note down your project URL and anon key

2. **Run Database Migrations**:
   - The database schema is already defined in `packages/database/migrations/`
   - Apply the migrations to your Supabase project:
     ```sql
     -- Run the initial schema migration
     -- This creates the users table and other required tables
     
     -- Then run the auth fields migration
     -- This adds password and other authentication fields
     ```

3. **Configure Row Level Security (RLS)**:
   - The migrations include RLS policies
   - Make sure RLS is enabled on all tables
   - Test the policies to ensure they work as expected

## Features Implemented

### Signup Functionality
- ✅ User registration with email/password
- ✅ Password hashing with bcrypt
- ✅ Form validation
- ✅ Password strength indicator
- ✅ Google OAuth integration
- ✅ Email uniqueness validation
- ✅ Terms and conditions acceptance
- ✅ Marketing preferences

### Authentication Features
- ✅ NextAuth.js integration
- ✅ Credentials provider (email/password)
- ✅ Google OAuth provider
- ✅ Session management
- ✅ User data mapping between camelCase and snake_case

### Database Features
- ✅ Users table with all required fields
- ✅ Proper indexing for performance
- ✅ Row Level Security (RLS) policies
- ✅ Audit logging support
- ✅ Leave management tables

## Testing the Signup

1. Start the development server:
   ```bash
   cd apps/web
   npm run dev
   ```

2. Navigate to `/auth/signup`

3. Fill out the form and test:
   - Email validation
   - Password strength requirements
   - Terms acceptance
   - Successful registration
   - Error handling

## Next Steps

1. **Email Verification**: Implement email verification flow
2. **Password Reset**: Add password reset functionality
3. **Profile Management**: Allow users to update their profiles
4. **Admin Panel**: Create admin interface for user management
5. **Leave Management**: Implement the leave request system 