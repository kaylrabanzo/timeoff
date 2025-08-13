# 🐳 Docker Environment Setup

The Docker Compose file needs environment variables at the **host level**. Here's how to fix the environment variable error:

## Quick Fix

1. **Create a `.env` file in the ROOT directory** (same level as docker-compose.dev.yml):

```bash
# From the root directory (/Users/kaylrabanzo/Desktop/chykalophia/timeoff)
touch .env
```

2. **Add the following content to the `.env` file**:

```env
# Environment variables for Docker Compose

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://lvscrngetawbztaiadpr.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx2c2NybmdldGF3Ynp0YWlhZHByIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQzMjU3ODgsImV4cCI6MjA2OTkwMTc4OH0.Xc322AaAFWSRn60vQZzEdYPjTK0PX5E8n4nmtha3ayE

# NextAuth Configuration
NEXTAUTH_SECRET=super-secret-key-change-this-in-production-please-make-it-long-and-secure
NEXTAUTH_URL=http://localhost:3000

# Google OAuth (optional - leave empty if not using Google sign-in)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```

3. **Test the Docker setup**:

```bash
npm run docker:dev
# or
docker-compose -f docker-compose.dev.yml up
```

## Alternative: Export Environment Variables

If you prefer not to create a `.env` file, you can export the variables in your shell:

```bash
export NEXT_PUBLIC_SUPABASE_URL="https://lvscrngetawbztaiadpr.supabase.co"
export NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx2c2NybmdldGF3Ynp0YWlhZHByIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQzMjU3ODgsImV4cCI6MjA2OTkwMTc4OH0.Xc322AaAFWSRn60vQZzEdYPjTK0PX5E8n4nmtha3ayE"
export NEXTAUTH_SECRET="super-secret-key-change-this-in-production"
export NEXTAUTH_URL="http://localhost:3000"
export GOOGLE_CLIENT_ID=""
export GOOGLE_CLIENT_SECRET=""

# Then run docker-compose
docker-compose -f docker-compose.dev.yml up
```

## Understanding the Issue

The Docker Compose file uses syntax like `${NEXT_PUBLIC_SUPABASE_URL}` which means:
- Docker Compose looks for these variables on your **host machine**
- It then passes them to the container
- The container receives them as environment variables

The validation error you're seeing happens because:
1. Docker Compose can't find the variables on the host
2. It passes empty values to the container
3. Our new validation code correctly catches this and fails

## Security Note

The `.env` file in the root is for Docker Compose and is different from the `.env.local` file in apps/web that we discussed earlier.
