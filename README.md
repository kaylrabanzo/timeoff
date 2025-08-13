# Timeoff Management System

A comprehensive timeoff management system built with Next.js 14, Supabase, and modern web technologies.

## 🚀 Features

- **Authentication**: Google OAuth integration with NextAuth.js
- **Leave Management**: Complete leave request workflow
- **Dashboard**: Personal and team overview with real-time updates
- **Calendar Integration**: Visual calendar with leave periods
- **Team Management**: Supervisor and admin tools
- **Real-time Updates**: WebSocket integration for live notifications
- **Responsive Design**: Mobile-first approach with modern UI
- **Role-based Access**: Employee, Supervisor, Admin, HR roles

## 🛠 Tech Stack

- **Frontend**: Next.js 14 (App Router) with React 18
- **UI Framework**: shadcn/ui with Tailwind CSS
- **Backend**: Supabase (Database, Auth, Real-time)
- **Authentication**: NextAuth.js with Google SSO
- **State Management**: TanStack Query
- **Form Handling**: React Hook Form with Zod validation
- **Monorepo**: Turborepo for package management
- **Type Safety**: TypeScript throughout

## 📁 Project Structure

```
timeoff/
├── apps/
│   └── web/                 # Next.js web application
├── packages/
│   ├── types/              # Shared TypeScript types
│   ├── ui/                 # Shared UI components
│   ├── database/           # Database utilities and Supabase integration
│   │   └── migrations/     # Database migrations (single source of truth)
│   └── utils/              # Shared utility functions
├── supabase/
│   └── migrations/         # Symlink to packages/database/migrations
├── package.json            # Root package configuration
└── turbo.json             # Turborepo configuration
```

## 🔄 Migration Workflow

**Single Source of Truth**: All database migrations are stored in `packages/database/migrations/` and symlinked to `supabase/migrations/` for CLI compatibility.

### Creating New Migrations

```bash
# Create new migration in the single source location
touch packages/database/migrations/008_your_migration_name.sql

# The migration will automatically be available to Supabase CLI
supabase db push
```

### Migration Commands

```bash
# Apply migrations to local Supabase
npm run supabase:db:push

# Reset local database
npm run supabase:db:reset

# Generate TypeScript types
npm run supabase:gen:types
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm 9+
- Docker & Docker Compose (for containerized deployment)
- Supabase account
- Google OAuth credentials

### 1. Clone and Install

```bash
git clone <repository-url>
cd timeoff
npm install
```

### 2. Environment Setup

Create a `.env.local` file in the `apps/web` directory:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Database Configuration
DATABASE_URL=your_database_url

# Application Configuration
NODE_ENV=development
```

### 3. Database Setup

1. Create a new Supabase project
2. Run the database migrations (see `packages/database/migrations/`)
3. Set up Row Level Security (RLS) policies
4. Configure real-time subscriptions

### 4. Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google`
   - `https://your-domain.com/api/auth/callback/google`

### 5. Development

#### Option A: Local Development
```bash
# Start development server
npm run dev

# Build all packages
npm run build

# Type checking
npm run type-check

# Linting
npm run lint
```

#### Option B: Docker Development
```bash
# Build and run development environment
./scripts/docker-run.sh dev

# Or manually:
docker-compose -f docker-compose.dev.yml up -d
```

### 6. Production Deployment

#### Docker Production
```bash
# Build the Docker image
./scripts/docker-build.sh

# Run production environment
./scripts/docker-run.sh

# Or manually:
docker-compose up -d
```

#### Docker Commands
```bash
# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Rebuild services
docker-compose build

# Clean up volumes
docker-compose down -v

# Scale web service
docker-compose up -d --scale web=3
```

## 📦 Package Scripts

### Root Level
- `npm run dev` - Start all development servers
- `npm run build` - Build all packages
- `npm run lint` - Lint all packages
- `npm run type-check` - Type check all packages

### Individual Packages
- `npm run dev` - Start development server (web app)
- `npm run build` - Build package
- `npm run clean` - Clean build artifacts

## 🗄 Database Schema

The system uses the following main tables:

- **users** - User profiles and authentication
- **leave_requests** - Leave request submissions
- **leave_balances** - User leave allowances
- **departments** - Organizational departments
- **teams** - Team assignments
- **notifications** - System notifications
- **calendar_events** - Calendar events and holidays
- **audit_logs** - Activity tracking

## 🔐 Authentication & Authorization

### Roles
- **Employee**: Submit and view own requests
- **Supervisor**: Approve team requests, view team calendar
- **Admin**: Full system access, user management
- **HR**: Policy management, reporting

### Permissions
- Role-based access control (RBAC)
- Department and team-based restrictions
- Audit logging for all actions

## 🎨 UI Components

The system uses a comprehensive component library:

- **Base Components**: Button, Input, Card, Badge, etc.
- **Specialized Components**: LeaveRequestCard, Dashboard components
- **Layout Components**: Navigation, Sidebar, Footer
- **Form Components**: DatePicker, FileUpload, etc.

## 📊 Features by Phase

### Phase 1 (Current)
- ✅ Authentication with Google OAuth
- ✅ Basic dashboard with user overview
- ✅ Leave request submission
- ✅ Real-time notifications

### Phase 2 (Next)
- 🔄 Calendar views and integration
- 🔄 Approval workflows
- 🔄 Team management features
- 🔄 Advanced filtering and search

### Phase 3 (Future)
- 📋 Advanced reporting and analytics
- 📋 Mobile optimization
- 📋 Admin features and user management
- 📋 Policy configuration

### Phase 4 (Future)
- 📋 Integration capabilities
- 📋 Advanced analytics
- 📋 Compliance features
- 📋 API documentation

## 🧪 Testing

```bash
# Run tests
npm run test

# Run tests with coverage
npm run test:coverage

# Run e2e tests
npm run test:e2e
```

## 🚀 Deployment

### Docker Deployment (Recommended)

The application is fully containerized and ready for production deployment.

#### Local Docker Deployment
```bash
# Build and run production environment
./scripts/docker-build.sh
./scripts/docker-run.sh
```

#### Cloud Deployment
- **AWS ECS/Fargate**: Use the provided Dockerfile
- **Google Cloud Run**: Deploy the container directly
- **Azure Container Instances**: Use the Docker image
- **Kubernetes**: Use the provided docker-compose.yml as reference

### Vercel Deployment

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Manual Deployment

```bash
# Build the application
npm run build

# Start production server
npm run start
```

## 📈 Performance

- **Page Load**: < 2 seconds
- **Time to Interactive**: < 3 seconds
- **Bundle Size**: Optimized with code splitting
- **Caching**: Aggressive caching strategy
- **SEO**: Optimized meta tags and structured data
- **Docker Image Size**: ~200MB (optimized with multi-stage builds)
- **Container Startup**: < 30 seconds

## 🔧 Configuration

### Docker Configuration

The application includes comprehensive Docker support:

- **Production Dockerfile**: Multi-stage build for optimized production images
- **Development Dockerfile**: Hot reloading for development
- **Docker Compose**: Complete application stack with database and caching
- **Nginx Configuration**: Reverse proxy with rate limiting and security headers

### Environment Variables

Create a `.env` file in the root directory:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Database Configuration (for local Docker)
DATABASE_URL=postgresql://postgres:postgres@postgres:5432/timeoff
```

### Supabase Configuration

1. Create tables and relationships
2. Set up Row Level Security policies
3. Configure real-time subscriptions
4. Set up storage buckets for file uploads

### NextAuth Configuration

1. Configure Google OAuth provider
2. Set up session handling
3. Configure callbacks for user creation
4. Set up JWT token handling

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:

- Create an issue in the GitHub repository
- Check the documentation in `/docs`
- Review the API documentation

## 🗺 Roadmap

- [ ] Calendar integration with external calendars
- [ ] Mobile app development
- [ ] Advanced analytics dashboard
- [ ] Multi-language support
- [ ] Advanced reporting features
- [ ] Integration with HR systems
- [ ] API for third-party integrations 