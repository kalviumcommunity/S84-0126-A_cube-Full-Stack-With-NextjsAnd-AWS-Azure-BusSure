# Project Overview

## What is BusSure?

BusSure is a full-stack insurance management system built with Next.js, designed to handle bus insurance policies, claims, and customer data with enterprise-grade security and performance.

## Key Features

### Core Functionality
- User authentication with JWT tokens
- Policy management for bus insurance
- Claims processing and tracking
- Refund request handling
- Customer and agent dashboards

### Technical Highlights
- **Type-Safe Database Access**: Prisma ORM with PostgreSQL
- **Secure Authentication**: bcrypt password hashing + JWT tokens
- **Modern Stack**: Next.js 16, React 19, TypeScript
- **Optimized Queries**: Database indexing and query optimization
- **Transaction Support**: ACID-compliant database operations

## Technology Stack

### Frontend
- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS 4

### Backend
- Next.js API Routes
- Prisma ORM 5.22
- PostgreSQL (Neon)
- JWT Authentication

### Development Tools
- ESLint for code quality
- Prisma Studio for database management
- tsx for TypeScript execution

## Project Structure

```
bus_sure/
├── app/                      # Next.js app directory
│   ├── api/                  # API routes
│   │   ├── auth/            # Authentication endpoints
│   │   ├── claims/          # Claims management
│   │   ├── refunds/         # Refund processing
│   │   └── users/           # User management
│   ├── components/          # React components
│   ├── dashboard/           # Dashboard pages
│   ├── login/               # Auth pages
│   └── policies/            # Policy pages
├── lib/                     # Utility libraries
│   ├── auth.ts             # Auth helpers
│   ├── prisma.ts           # Database client
│   └── redis.ts            # Caching layer
├── prisma/                  # Database schema
│   ├── schema.prisma       # Prisma schema
│   ├── migrations/         # Migration history
│   └── seed.ts             # Seed data
├── scripts/                 # Utility scripts
└── docs/                    # Documentation
```

## User Roles

- **Customer**: Book policies, submit claims, request refunds
- **Agent**: Manage customer policies and claims
- **Admin**: Full system access and management

## Next Steps

- [Setup Guide](./02-setup-guide.md) - Get started with development
- [Database Schema](./04-database-schema.md) - Understand the data model
- [Authentication System](./07-authentication.md) - Learn about security
