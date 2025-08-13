#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

function createMigration(migrationName) {
  if (!migrationName) {
    console.error('❌ Please provide a migration name');
    console.log('Usage: node scripts/create-migration.js <migration_name>');
    console.log('Example: node scripts/create-migration.js add_user_preferences');
    process.exit(1);
  }

  // Sanitize the migration name
  const sanitizedName = migrationName
    .toLowerCase()
    .replace(/[^a-z0-9_]/g, '_')
    .replace(/_+/g, '_');

  // Get the next migration number
  const migrationsDir = path.join(__dirname, '../packages/database/migrations');
  const existingMigrations = fs.readdirSync(migrationsDir)
    .filter(file => file.endsWith('.sql'))
    .map(file => {
      const match = file.match(/^(\d+)_/);
      return match ? parseInt(match[1]) : 0;
    })
    .sort((a, b) => a - b);

  const nextNumber = existingMigrations.length > 0 
    ? Math.max(...existingMigrations) + 1 
    : 1;

  // Format the number with leading zeros
  const formattedNumber = nextNumber.toString().padStart(3, '0');
  
  const fileName = `${formattedNumber}_${sanitizedName}.sql`;
  const filePath = path.join(migrationsDir, fileName);

  // Create the migration file with a template
  const template = `-- Migration: ${migrationName}
-- Description: Add your migration description here
-- Date: ${new Date().toISOString().split('T')[0]}

-- Your SQL statements go here
-- Example:
-- CREATE TABLE example_table (
--     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
--     name VARCHAR(255) NOT NULL,
--     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
-- );

`;

  fs.writeFileSync(filePath, template);

  console.log('✅ Migration created successfully!');
  console.log(`📁 File: ${filePath}`);
  console.log(`🔗 Symlink: supabase/migrations/${fileName}`);
  console.log('');
  console.log('📝 Next steps:');
  console.log('1. Edit the migration file with your SQL statements');
  console.log('2. Test locally: npm run supabase:db:push');
  console.log('3. Commit your changes');
}

// Get migration name from command line arguments
const migrationName = process.argv[2];

createMigration(migrationName); 