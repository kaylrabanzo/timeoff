# Development Setup Guide

## 🚀 Quick Start

### Prerequisites
- Docker Desktop installed and running
- Node.js 18+ installed locally
- npm 9+ installed

### 1. Initial Setup
```bash
# Clone the repository
git clone <repository-url>
cd timeoff

# Install dependencies locally
npm install

# Start development environment
npm run dev:start
```

### 2. Development Workflow

#### Starting the Development Environment
```bash
npm run dev:start
```
This will:
- Install packages locally
- Start all Docker services (web, postgres, redis, adminer)
- Wait for PostgreSQL to be ready
- Show service status

#### Installing New Packages
```bash
# Install packages locally first
npm install <package-name>

# Install packages in the running container (no restart needed)
npm run dev:install
```

#### Stopping Services
```bash
npm run dev:stop
```

#### Restarting Services
```bash
npm run dev:restart
```

#### Checking Status
```bash
npm run dev:status
```

#### Viewing Logs
```bash
npm run dev:logs
```

#### Cleaning Up
```bash
npm run dev:clean
```

## 🐳 Docker Services

### Services Overview
- **Web App**: Next.js development server on port 3000
- **PostgreSQL**: Database on port 5432
- **Redis**: Cache on port 6379
- **Adminer**: Database admin tool on port 8080

### Access URLs
- Web Application: http://localhost:3000
- Database Admin: http://localhost:8080
- Database: localhost:5432 (user: postgres, password: postgres, db: timeoff_dev)

## 🔧 Troubleshooting

### PostgreSQL Not Starting
```bash
# Check PostgreSQL logs
docker compose -f docker-compose.dev.yml logs postgres

# Reset PostgreSQL data
docker compose -f docker-compose.dev.yml down -v
npm run dev:start
```

### Package Installation Issues
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
npm run dev:install
```

### Docker Volume Issues
```bash
# Clean up volumes
npm run dev:clean
npm run dev:start
```

### Port Conflicts
If you get port conflicts, check what's running on the ports:
```bash
# Check what's using port 3000
lsof -i :3000

# Check what's using port 5432
lsof -i :5432
```

## 📁 Project Structure

```
timeoff/
├── apps/
│   └── web/                 # Next.js web application
├── packages/
│   ├── database/            # Database types and migrations
│   ├── types/              # Shared TypeScript types
│   ├── ui/                 # Shared UI components
│   └── utils/              # Shared utilities
├── scripts/
│   └── dev-setup.sh        # Development setup script
├── docker-compose.dev.yml   # Development Docker configuration
├── Dockerfile.dev          # Development Dockerfile
└── package.json            # Root package.json with workspaces
```

## 🔄 Development Workflow

1. **Start Development Environment**
   ```bash
   npm run dev:start
   ```

2. **Make Code Changes**
   - Edit files in `apps/web/src/`
   - Changes are automatically reflected due to volume mounting

3. **Install New Dependencies**
   ```bash
   # Add to package.json
   npm install <package-name>
   
   # Install in container
   npm run dev:install
   ```

4. **Database Changes**
   - Add migrations in `packages/database/migrations/`
   - Run migrations: `npm run supabase:db:push`

5. **Stop Development**
   ```bash
   npm run dev:stop
   ```

## 🛠️ Advanced Configuration

### Environment Variables
Create a `.env.development` file with your configuration:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
```

### Custom Docker Configuration
The development setup uses:
- **Volume Mounting**: Source code is mounted for hot reloading
- **Health Checks**: PostgreSQL has health checks to ensure it's ready
- **Optimized Builds**: Dependencies are cached for faster builds

### Performance Tips
1. **Use the dev scripts**: They handle package installation without restarts
2. **Monitor resource usage**: Use `docker stats` to monitor container resources
3. **Clean up regularly**: Use `npm run dev:clean` to free up disk space
4. **Use volume mounts**: Source code changes are reflected immediately

## 🐛 Common Issues

### Issue: "Port already in use"
**Solution**: Stop conflicting services or change ports in `docker-compose.dev.yml`

### Issue: "PostgreSQL connection failed"
**Solution**: Wait for PostgreSQL to be ready or restart services

### Issue: "Package not found in container"
**Solution**: Run `npm run dev:install` after installing packages locally

### Issue: "Docker out of space"
**Solution**: Run `npm run dev:clean` to clean up unused containers and images 