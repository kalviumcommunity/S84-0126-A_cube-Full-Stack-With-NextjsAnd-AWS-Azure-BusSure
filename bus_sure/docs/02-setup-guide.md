# Setup Guide

## Prerequisites

- Node.js 18 or higher
- npm or yarn package manager
- PostgreSQL database (local or cloud)
- Git

## Installation Steps

### 1. Clone the Repository

```bash
git clone <repository-url>
cd bus_sure
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
# Database
DATABASE_URL="postgresql://user:password@host:5432/database?sslmode=require"

# Application
NEXT_PUBLIC_APP_ENV="development"
NEXT_PUBLIC_API_URL="http://localhost:3000"

# JWT Secret (generate a secure random string)
JWT_SECRET="your-super-secret-jwt-key-change-in-production"

# Optional: Redis for caching
REDIS_URL="redis://localhost:6379"
```

### 4. Database Setup

Generate Prisma client:
```bash
npm run db:generate
```

Run migrations:
```bash
npm run db:migrate
```

Seed sample data:
```bash
npm run db:seed
```

### 5. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

### Development
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Database
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema to database
- `npm run db:migrate` - Create and run migrations
- `npm run db:studio` - Open Prisma Studio GUI
- `npm run db:seed` - Seed database with sample data
- `npm run db:reset` - Reset database and reseed
- `npm run db:status` - Check migration status

### Testing
- `npm run test:auth` - Test authentication APIs
- `npm run db:test` - Test database connection

## Verification

### 1. Test Database Connection

Visit: `http://localhost:3000/api/test-db`

Expected response:
```json
{
  "success": true,
  "message": "Database connection successful"
}
```

### 2. View Database in Prisma Studio

```bash
npm run db:studio
```

Opens at: `http://localhost:5555`

### 3. Test Authentication

Run the auth test script:
```bash
npm run test:auth
```

## Troubleshooting

### Database Connection Issues

**Problem**: Cannot connect to database

**Solution**:
- Verify DATABASE_URL in `.env`
- Check database is running
- Ensure SSL mode is correct for your database

### Prisma Client Not Generated

**Problem**: `@prisma/client` not found

**Solution**:
```bash
npm run db:generate
```

### Migration Errors

**Problem**: Migration fails

**Solution**:
```bash
# Check migration status
npm run db:status

# Reset database (WARNING: deletes all data)
npm run db:reset
```

### Port Already in Use

**Problem**: Port 3000 is already in use

**Solution**:
```bash
# Use different port
PORT=3001 npm run dev
```

## Next Steps

- [Environment Configuration](./03-environment-config.md) - Detailed environment setup
- [Database Schema](./04-database-schema.md) - Understand the data model
- [API Endpoints](./08-api-endpoints.md) - Explore available APIs
