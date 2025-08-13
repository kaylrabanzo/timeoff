# 🚨 Environment Setup Required

The security fixes I implemented now properly validate environment variables. Here's how to set them up:

## Quick Setup

1. **Copy the environment template:**
   ```bash
   cd apps/web
   cp env.example .env.local
   ```

2. **Edit the `.env.local` file** with your actual values:
   ```bash
   nano .env.local  # or use your preferred editor
   ```

## Required Environment Variables

### 1. Supabase Configuration
From your [Supabase Dashboard](https://supabase.com/dashboard):
- `NEXT_PUBLIC_SUPABASE_URL` - Your project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your anon/public key
- `SUPABASE_SERVICE_ROLE_KEY` - Your service role key (optional for development)

### 2. NextAuth Configuration
```bash
# Generate a secure secret
openssl rand -base64 32
```
- `NEXTAUTH_URL` - Set to `http://localhost:3000` for development
- `NEXTAUTH_SECRET` - Use the generated secret above

### 3. Google OAuth (if using Google sign-in)
From [Google Cloud Console](https://console.cloud.google.com/):
1. Create a new project or select existing
2. Enable Google+ API
3. Create OAuth 2.0 credentials
4. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`

- `GOOGLE_CLIENT_ID` - Your OAuth client ID
- `GOOGLE_CLIENT_SECRET` - Your OAuth client secret

## For Development Without Google OAuth

If you want to test quickly without setting up Google OAuth, you can temporarily modify the auth configuration:

1. **Comment out Google Provider** in `apps/web/src/lib/auth.ts`:
   ```typescript
   providers: [
     // GoogleProvider({
     //   clientId: env.GOOGLE_CLIENT_ID,
     //   clientSecret: env.GOOGLE_CLIENT_SECRET,
     // }),
     CredentialsProvider({
       // ... existing credentials provider
     })
   ]
   ```

2. **Temporarily update env validation** in `apps/web/src/lib/env.ts`:
   ```typescript
   const requiredVars = [
     'NEXT_PUBLIC_SUPABASE_URL',
     'NEXT_PUBLIC_SUPABASE_ANON_KEY',
     'NEXTAUTH_URL',
     'NEXTAUTH_SECRET',
     // Comment these out temporarily:
     // 'GOOGLE_CLIENT_ID',
     // 'GOOGLE_CLIENT_SECRET'
   ] as const
   ```

## Verification

After setting up your `.env.local` file, the application should start without the environment error.

## Security Note

The new validation is working correctly! It prevents the application from running with missing credentials, which protects against configuration errors in production.
