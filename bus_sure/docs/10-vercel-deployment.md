# Vercel Deployment Guide

## Prerequisites

- Vercel account ([sign up](https://vercel.com/signup))
- GitHub/GitLab/Bitbucket repository
- PostgreSQL database (Neon, Supabase, or other)

## Deployment Steps

### 1. Prepare Your Project

Ensure these files exist:
- `vercel.json` - Deployment configuration
- `.env.example` - Environment variable template
- `next.config.ts` - Next.js configuration

### 2. Connect to Vercel

#### Option A: Vercel Dashboard
1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your Git repository
3. Select the project root directory

#### Option B: Vercel CLI
```bash
npm i -g vercel
vercel login
vercel
```

### 3. Configure Environment Variables

In Vercel Dashboard → Project Settings → Environment Variables:

#### Production Variables
```
DATABASE_URL = postgresql://user:pass@host/db?sslmode=require
JWT_SECRET = your-production-secret-key-here
NEXT_PUBLIC_APP_ENV = production
NEXT_PUBLIC_API_URL = https://yourdomain.vercel.app
```

#### Preview Variables (Optional)
```
DATABASE_URL = postgresql://preview-db-url
JWT_SECRET = preview-secret-key
NEXT_PUBLIC_APP_ENV = staging
NEXT_PUBLIC_API_URL = https://preview.yourdomain.vercel.app
```

### 4. Configure Build Settings

Vercel auto-detects Next.js, but you can customize:

**Build Command**: `prisma generate && next build`
**Output Directory**: `.next`
**Install Command**: `npm install`

These are configured in `vercel.json`:
```json
{
  "buildCommand": "prisma generate && next build",
  "installCommand": "npm install",
  "framework": "nextjs",
  "regions": ["iad1"]
}
```

### 5. Deploy

#### Automatic Deployment
- Push to main branch → Production deployment
- Push to other branches → Preview deployment

#### Manual Deployment
```bash
vercel --prod
```

## Database Setup for Production

### Using Neon (Recommended)

1. Create account at [neon.tech](https://neon.tech)
2. Create new project
3. Copy connection string
4. Add to Vercel environment variables

**Connection String Format**:
```
postgresql://user:pass@ep-xxx.neon.tech/db?sslmode=require
```

### Using Supabase

1. Create project at [supabase.com](https://supabase.com)
2. Go to Settings → Database
3. Copy connection string (Transaction mode)
4. Add to Vercel environment variables

### Run Migrations

After deployment, run migrations:

```bash
# Using Vercel CLI
vercel env pull .env.production
npx prisma migrate deploy

# Or use Prisma Data Platform
# https://cloud.prisma.io
```

## Vercel Configuration

### vercel.json

```json
{
  "buildCommand": "prisma generate && next build",
  "installCommand": "npm install",
  "framework": "nextjs",
  "regions": ["iad1"]
}
```

**Options**:
- `buildCommand`: Custom build command
- `installCommand`: Custom install command
- `framework`: Framework detection
- `regions`: Deployment regions (iad1 = US East)

### next.config.ts

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: false,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
};

export default nextConfig;
```

## Deployment Checklist

### Before Deployment
- [ ] All environment variables configured
- [ ] Database accessible from Vercel
- [ ] JWT_SECRET is strong and unique
- [ ] Build succeeds locally (`npm run build`)
- [ ] No TypeScript errors
- [ ] No ESLint errors

### After Deployment
- [ ] Test database connection: `/api/test-db`
- [ ] Test authentication: `/api/auth/login`
- [ ] Verify environment variables loaded
- [ ] Check deployment logs for errors
- [ ] Test all critical user flows

## Troubleshooting

### Build Fails: Prisma Client Not Generated

**Problem**: `@prisma/client` not found during build

**Solution**: Ensure build command includes `prisma generate`:
```json
{
  "buildCommand": "prisma generate && next build"
}
```

### Database Connection Failed

**Problem**: Cannot connect to database from Vercel

**Solutions**:
1. Check DATABASE_URL is correct
2. Ensure database allows connections from Vercel IPs
3. Verify SSL mode: `?sslmode=require`
4. Test connection locally with production DATABASE_URL

### Environment Variables Not Loading

**Problem**: Variables are undefined in production

**Solutions**:
1. Check variables are set in Vercel dashboard
2. Ensure correct environment scope (Production/Preview)
3. Redeploy after adding variables
4. Client variables must start with `NEXT_PUBLIC_`

### Build Timeout

**Problem**: Build exceeds time limit

**Solutions**:
1. Optimize dependencies
2. Remove unused packages
3. Use `npm ci` instead of `npm install`
4. Upgrade Vercel plan if needed

### API Routes Return 500

**Problem**: API routes fail in production

**Solutions**:
1. Check deployment logs in Vercel dashboard
2. Verify all environment variables are set
3. Test API routes locally with production env
4. Check database migrations are applied

## Monitoring & Logs

### View Deployment Logs
1. Go to Vercel Dashboard
2. Select your project
3. Click on deployment
4. View "Building" and "Runtime" logs

### Real-time Logs
```bash
vercel logs <deployment-url>
```

### Analytics
Vercel provides:
- Page views
- API route performance
- Error tracking
- Web vitals

## Custom Domain

### Add Custom Domain
1. Go to Project Settings → Domains
2. Add your domain
3. Configure DNS records:
   - Type: `A` or `CNAME`
   - Value: Provided by Vercel

### SSL Certificate
- Automatically provisioned by Vercel
- Renews automatically
- No configuration needed

## Performance Optimization

### Edge Functions
API routes run on Vercel Edge Network for low latency.

### Caching
Configure caching headers:
```typescript
export const revalidate = 3600; // Revalidate every hour
```

### Image Optimization
Next.js Image component automatically optimized on Vercel.

## Rollback

### Rollback to Previous Deployment
1. Go to Deployments tab
2. Find previous successful deployment
3. Click "..." → "Promote to Production"

### Using CLI
```bash
vercel rollback
```

## CI/CD Integration

### GitHub Actions
Vercel automatically deploys on push. For custom workflows:

```yaml
name: Deploy
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - run: npm ci
      - run: npm run build
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

## Cost Optimization

### Free Tier Limits
- 100 GB bandwidth/month
- 100 hours serverless function execution
- Unlimited deployments

### Pro Tier ($20/month)
- 1 TB bandwidth
- 1000 hours execution
- Advanced analytics
- Team collaboration

## Security

### Environment Variables
- Never commit secrets to git
- Use different secrets per environment
- Rotate secrets regularly

### HTTPS
- Enforced by default
- Automatic SSL certificates
- HSTS enabled

### Headers
Configure security headers in `next.config.ts`:
```typescript
async headers() {
  return [
    {
      source: '/:path*',
      headers: [
        { key: 'X-Frame-Options', value: 'DENY' },
        { key: 'X-Content-Type-Options', value: 'nosniff' },
      ],
    },
  ];
}
```

## Next Steps

- [Production Checklist](./11-production-checklist.md) - Pre-launch verification
- [API Endpoints](./08-api-endpoints.md) - Test your APIs
