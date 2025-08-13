# Authentication System

This document describes the comprehensive authentication system implemented for the Timeoff Management System.

## Features

### 🔐 Dual Authentication Options

- **Traditional Login**: Email/password authentication with secure password handling
- **Google SSO**: One-click Google authentication via NextAuth.js
- **Unified Experience**: Seamless switching between authentication methods

### 🎨 Modern UI/UX

- **Glass-morphism Design**: Modern card-based design with backdrop blur effects
- **Smooth Animations**: Micro-interactions and smooth transitions
- **Responsive Design**: Optimized for mobile and desktop
- **Loading States**: Skeleton screens and loading indicators

### 🔒 Security Features

- **Password Strength Indicator**: Real-time password strength validation
- **Password Requirements**: Visual feedback for password requirements
- **Secure Token Storage**: JWT-based session management
- **Remember Me**: Secure token storage with configurable expiration
- **Password Reset Flow**: Complete email-based password reset system

### ✅ Form Validation

- **Real-time Validation**: Instant feedback on form inputs
- **Error Handling**: Comprehensive error messages and states
- **Accessibility**: Proper ARIA labels and keyboard navigation
- **Input Masking**: Password visibility toggle

## Pages

### `/auth/signin`
- Traditional email/password login
- Google OAuth integration
- Password strength indicator
- Remember me functionality
- Forgot password link
- Link to sign up page

### `/auth/signup`
- User registration form
- Password strength indicator with requirements
- Terms and conditions acceptance
- Marketing communications opt-in
- Google OAuth integration
- Link to sign in page

### `/auth/forgot-password`
- Email-based password reset
- Success state with instructions
- Resend email functionality
- Back to sign in link

### `/auth/reset-password`
- Password reset with token validation
- Password strength indicator
- Password confirmation
- Success state with redirect

### `/auth/error`
- Comprehensive error handling
- Specific error messages for different scenarios
- Action buttons for error resolution
- Support contact information

## Components

### Authentication Loading (`auth-loading.tsx`)
- Skeleton screens for authentication states
- Dashboard loading component
- Consistent loading experience

### Navigation (`navigation.tsx`)
- User menu with avatar
- Sign in/sign up buttons for unauthenticated users
- Sign out functionality
- User profile information display

## Configuration

### NextAuth Configuration (`lib/auth.ts`)
- Google OAuth provider
- Credentials provider with bcrypt password hashing
- JWT session strategy
- Custom pages configuration
- Session callbacks for user data

### Middleware (`middleware.ts`)
- Route protection
- Authentication state management
- Redirect handling

## Environment Variables

Required environment variables:

```env
# NextAuth
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

## Security Considerations

### Password Security
- Bcrypt hashing for password storage
- Password strength requirements
- Secure password reset flow
- Rate limiting on authentication attempts

### Session Management
- JWT-based sessions
- Configurable session expiration
- Secure token storage
- Automatic session refresh

### OAuth Security
- Google OAuth 2.0 implementation
- Secure callback handling
- User data validation
- Account linking protection

## User Experience

### Accessibility
- Proper ARIA labels
- Keyboard navigation support
- Screen reader compatibility
- High contrast mode support

### Mobile Optimization
- Touch-friendly interface
- Responsive design
- Mobile-specific interactions
- Optimized loading states

### Error Handling
- User-friendly error messages
- Specific error types
- Recovery suggestions
- Support contact information

## Database Schema

The authentication system expects the following user table structure:

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  firstName VARCHAR(100) NOT NULL,
  lastName VARCHAR(100) NOT NULL,
  password VARCHAR(255), -- NULL for OAuth users
  avatar TEXT,
  department VARCHAR(100) DEFAULT 'Unassigned',
  team VARCHAR(100) DEFAULT 'Unassigned',
  role VARCHAR(50) DEFAULT 'employee',
  managerId UUID REFERENCES users(id),
  hireDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  isActive BOOLEAN DEFAULT true,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## API Endpoints

### Authentication Endpoints
- `POST /api/auth/signin` - Traditional login
- `POST /api/auth/signup` - User registration
- `POST /api/auth/forgot-password` - Password reset request
- `POST /api/auth/reset-password` - Password reset
- `POST /api/auth/signout` - Sign out

### OAuth Endpoints
- `GET /api/auth/signin/google` - Google OAuth initiation
- `GET /api/auth/callback/google` - Google OAuth callback

## Testing

### Manual Testing Checklist
- [ ] Traditional login with valid credentials
- [ ] Traditional login with invalid credentials
- [ ] Google OAuth login
- [ ] User registration
- [ ] Password strength validation
- [ ] Password reset flow
- [ ] Error handling
- [ ] Session management
- [ ] Sign out functionality
- [ ] Mobile responsiveness
- [ ] Accessibility compliance

### Automated Testing
- Unit tests for authentication logic
- Integration tests for OAuth flow
- E2E tests for complete user flows
- Security testing for vulnerabilities

## Deployment

### Production Considerations
- Secure environment variables
- HTTPS enforcement
- Rate limiting
- Monitoring and logging
- Backup and recovery procedures

### Environment Setup
1. Configure environment variables
2. Set up Google OAuth credentials
3. Configure database connection
4. Set up email service for password reset
5. Configure monitoring and logging

## Support

For authentication-related issues:
1. Check the error logs
2. Verify environment variables
3. Test OAuth configuration
4. Review database connectivity
5. Contact the development team

## Future Enhancements

### Planned Features
- Multi-factor authentication (MFA)
- Social login providers (GitHub, LinkedIn)
- Email verification flow
- Account linking
- Advanced session management
- Audit logging

### Security Improvements
- Rate limiting implementation
- Advanced password policies
- Session hijacking protection
- CSRF protection
- XSS prevention 