# Database Migrations Guide

## 🎯 **Single Source of Truth**

All database migrations are stored in **one location**: `packages/database/migrations/`

The `supabase/migrations/` directory is a **symlink** to `packages/database/migrations/` to maintain compatibility with Supabase CLI.

## 📁 **Directory Structure**

```
packages/database/migrations/     # ← Single source of truth
├── 001_initial_schema.sql
├── 002_add_auth_fields.sql
├── 003_fix_rls_policies.sql
└── ...

supabase/migrations/             # ← Symlink (for CLI compatibility)
└── [symlink to packages/database/migrations/]
```

## 🚀 **Creating New Migrations**

### Option 1: Using the Script (Recommended)

```bash
# Create a new migration
npm run supabase:migration:create add_user_preferences

# This creates: packages/database/migrations/008_add_user_preferences.sql
```

### Option 2: Manual Creation

```bash
# Create migration file directly
touch packages/database/migrations/008_your_migration_name.sql
```

## 📝 **Migration Naming Convention**

- **Format**: `{number}_{description}.sql`
- **Number**: 3-digit sequential number (001, 002, 003...)
- **Description**: Lowercase with underscores
- **Examples**:
  - `001_initial_schema.sql`
  - `002_add_auth_fields.sql`
  - `008_add_user_preferences.sql`

## 🔧 **Migration Template**

```sql
-- Migration: add_user_preferences
-- Description: Add user preferences table for storing user settings
-- Date: 2024-01-15

-- Your SQL statements go here
CREATE TABLE user_preferences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    theme VARCHAR(20) DEFAULT 'light',
    notifications_enabled BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for performance
CREATE INDEX idx_user_preferences_user_id ON user_preferences(user_id);

-- Add RLS policies
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own preferences" ON user_preferences
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own preferences" ON user_preferences
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own preferences" ON user_preferences
    FOR UPDATE USING (auth.uid() = user_id);
```

## 🚀 **Applying Migrations**

### Local Development

```bash
# Apply all pending migrations
npm run supabase:db:push

# Reset database and apply all migrations
npm run supabase:db:reset

# Apply specific migration
npm run supabase:migration:run 008_add_user_preferences.sql
```

### Remote Development

```bash
# Apply to remote Supabase project
npm run supabase:db:push

# Reset remote database
npm run supabase:db:reset:remote
```

## 🔍 **Migration Best Practices**

### 1. **Always Test Locally First**
```bash
# Start local Supabase
npm run supabase:start

# Apply migration
npm run supabase:db:push

# Test your changes
# Stop local Supabase
npm run supabase:stop
```

### 2. **Use Descriptive Names**
```sql
-- ✅ Good
001_initial_schema.sql
002_add_auth_fields.sql
003_fix_rls_policies.sql

-- ❌ Bad
001_schema.sql
002_fields.sql
003_fix.sql
```

### 3. **Include Comments**
```sql
-- Migration: add_user_preferences
-- Description: Add user preferences table for storing user settings
-- Date: 2024-01-15
-- Author: Your Name
```

### 4. **Add Indexes for Performance**
```sql
-- Always add indexes for foreign keys and frequently queried columns
CREATE INDEX idx_table_column ON table_name(column_name);
```

### 5. **Enable RLS and Add Policies**
```sql
-- Enable RLS on new tables
ALTER TABLE new_table ENABLE ROW LEVEL SECURITY;

-- Add appropriate policies
CREATE POLICY "Policy name" ON table_name
    FOR SELECT USING (condition);
```

## 🛠 **Troubleshooting**

### Migration Fails
```bash
# Check migration status
npm run supabase:status

# View logs
supabase logs

# Reset and try again
npm run supabase:db:reset
npm run supabase:db:push
```

### Symlink Issues
```bash
# Recreate symlink if needed
rm -rf supabase/migrations
ln -s ../packages/database/migrations supabase/migrations
```

### Type Generation Issues
```bash
# Regenerate types after migration
npm run supabase:gen:types
```

## 📋 **Migration Checklist**

Before committing a migration:

- [ ] **Test locally** with `npm run supabase:db:push`
- [ ] **Verify RLS policies** are working correctly
- [ ] **Add appropriate indexes** for performance
- [ ] **Update TypeScript types** with `npm run supabase:gen:types`
- [ ] **Test the application** with the new schema
- [ ] **Document changes** in migration comments
- [ ] **Commit migration file** to version control

## 🔄 **Workflow Summary**

1. **Create migration**: `npm run supabase:migration:create <name>`
2. **Edit migration**: Add your SQL statements
3. **Test locally**: `npm run supabase:db:push`
4. **Generate types**: `npm run supabase:gen:types`
5. **Test application**: Verify everything works
6. **Commit changes**: Add migration to version control
7. **Deploy**: Apply to production when ready

## 🎯 **Benefits of This Setup**

- ✅ **Single source of truth** - No duplicate files
- ✅ **CLI compatibility** - Works with Supabase CLI
- ✅ **Package organization** - Migrations with database code
- ✅ **Version control** - All migrations tracked together
- ✅ **Team collaboration** - Clear workflow for all developers
- ✅ **Automation** - Scripts for common tasks 