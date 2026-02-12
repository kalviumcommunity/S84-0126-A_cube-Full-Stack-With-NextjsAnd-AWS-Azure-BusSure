# Environment Configuration

## Environment Variables

### Required Variables

#### DATABASE_URL
PostgreSQL connection string for Prisma.

```env
DATABASE_URL="postgresql://user:password@host:5432/database?sslmode=require"
```

**Format**: `postgresql://[user]:[password]@[host]:[port]/[database]?[params]`

**Examples**:
- Local: `postgresql://postgres:password@localhost:5432/bussure`
- Neon: `postgresql://user:pass@ep-xxx.neon.tech/db?sslmode=require`
- Supabase: `postgresql://postgres:pass@db.xxx.supabase.co:5432/postgres`

#### JWT_SECRET
Secret key for signing JWT tokens.

```env
JWT_SECRET="your-super-secret-jwt-key-minimum-32-characters-long"
```

**Security**:
- Use a strong, random string (minimum 32 characters)
- Never commit to version control
- Different secret for each environment

**Generate secure secret**:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Public Variables

#### NEXT_PUBLIC_APP_ENV
Application environment identifier.

```env
NEXT_PUBLIC_APP_ENV="development"
```

**Values**: `development`, `staging`, `production`

#### NEXT_PUBLIC_API_URL
Base URL for API calls.

```env
NEXT_PUBLIC_API_URL="http://localhost:3000"
```

**Examples**:
- Development: `http://localhost:3000`
- Production: `https://yourdomain.com`

### Optional Variables

#### REDIS_URL
Redis connection string for caching.

```env
REDIS_URL="redis://localhost:6379"
```

**Format**: `redis://[user]:[password]@[host]:[port]/[db]`

## Environment Files

### .env
Main environment file (not committed to git).

```env
DATABASE_URL="postgresql://..."
JWT_SECRET="..."
NEXT_PUBLIC_APP_ENV="development"
NEXT_PUBLIC_API_URL="http://localhost:3000"
```

### .env.example
Template file (committed to git).

```env
NEXT_PUBLIC_APP_ENV="development"
NEXT_PUBLIC_API_URL="http://localhost:3000"
DATABASE_URL="postgresql://user:password@host:5432/database?sslmode=require"
JWT_SECRET="your-secret-key-here"
```

### .env.local
Local overrides (not committed to git).

```env
# Override for local development
DATABASE_URL="postgresql://postgres:password@localhost:5432/bussure_dev"
```

### .env.production
Production-specific variables (not committed to git).

```env
NEXT_PUBLIC_APP_ENV="production"
NEXT_PUBLIC_API_URL="https://yourdomain.com"
DATABASE_URL="postgresql://..."
JWT_SECRET="..."
```

## Environment-Specific Configuration

### Development
```env
NEXT_PUBLIC_APP_ENV="development"
NEXT_PUBLIC_API_URL="http://localhost:3000"
DATABASE_URL="postgresql://localhost:5432/bussure_dev"
JWT_SECRET="dev-secret-key-not-for-production"
```

### Staging
```env
NEXT_PUBLIC_APP_ENV="staging"
NEXT_PUBLIC_API_URL="https://staging.yourdomain.com"
DATABASE_URL="postgresql://staging-db-url"
JWT_SECRET="staging-secret-key"
```

### Production
```env
NEXT_PUBLIC_APP_ENV="production"
NEXT_PUBLIC_API_URL="https://yourdomain.com"
DATABASE_URL="postgresql://production-db-url"
JWT_SECRET="production-secret-key-very-secure"
```

## Vercel Environment Variables

### Setting Variables in Vercel

1. Go to Project Settings → Environment Variables
2. Add each variable with appropriate scope:
   - Production
   - Preview
   - Development

### Required Vercel Variables

```
DATABASE_URL (Production, Preview)
JWT_SECRET (Production, Preview)
NEXT_PUBLIC_APP_ENV (Production, Preview, Development)
NEXT_PUBLIC_API_URL (Production, Preview, Development)
```

### Vercel-Specific Variables

Vercel automatically provides:
- `VERCEL_URL` - Deployment URL
- `VERCEL_ENV` - Environment (production, preview, development)
- `VERCEL_GIT_COMMIT_SHA` - Git commit hash

## Security Best Practices

### Do's ✅
- Use strong, random secrets
- Different secrets per environment
- Store secrets in environment variables
- Use `.env.example` for documentation
- Rotate secrets regularly

### Don'ts ❌
- Never commit `.env` files
- Don't hardcode secrets in code
- Don't share secrets in chat/email
- Don't use weak or predictable secrets
- Don't reuse secrets across projects

## Accessing Environment Variables

### Server-Side (API Routes, Server Components)
```typescript
// Access any environment variable
const dbUrl = process.env.DATABASE_URL;
const jwtSecret = process.env.JWT_SECRET;
```

### Client-Side (Browser)
```typescript
// Only NEXT_PUBLIC_* variables are available
const apiUrl = process.env.NEXT_PUBLIC_API_URL;
const env = process.env.NEXT_PUBLIC_APP_ENV;
```

## Troubleshooting

### Variable Not Found

**Problem**: `process.env.VARIABLE_NAME` is undefined

**Solutions**:
1. Check variable is defined in `.env`
2. Restart development server
3. For client-side, ensure variable starts with `NEXT_PUBLIC_`

### Database Connection Failed

**Problem**: Cannot connect to database

**Solutions**:
1. Verify DATABASE_URL format
2. Check database is accessible
3. Ensure SSL mode is correct
4. Test connection with Prisma Studio

### JWT Token Invalid

**Problem**: Token verification fails

**Solutions**:
1. Ensure JWT_SECRET is set
2. Same secret used for signing and verifying
3. Check token hasn't expired

## Next Steps

- [Database Schema](./04-database-schema.md) - Understand the data model
- [Vercel Deployment](./10-vercel-deployment.md) - Deploy to production
