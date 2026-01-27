This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Bus Sure - Insurance Management System

A full-stack Next.js application for managing bus insurance policies, claims, and customer data with Prisma ORM and PostgreSQL.

## Prisma ORM Setup & Integration

### Overview
This project uses Prisma ORM as the database toolkit, providing type-safe database access, auto-generated queries, and seamless integration with PostgreSQL. Prisma serves as the bridge between our Next.js application and the database, ensuring type safety and developer productivity.

### Database Schema
Our application manages four main entities:
- **Users**: Customer, agent, and admin accounts
- **Buses**: Vehicle information and registration details
- **Policies**: Insurance policies linking users and buses
- **Claims**: Insurance claims submitted by users

### Setup Steps Completed

1. **Prisma Installation & Initialization**
   ```bash
   npm install prisma --save-dev
   npm install @prisma/client
   npx prisma init
   ```

2. **Database Configuration**
   - Updated `.env` with PostgreSQL connection string
   - Configured `schema.prisma` with PostgreSQL provider

3. **Schema Definition**
   - Defined comprehensive models for bus insurance domain
   - Implemented proper relationships between entities
   - Added enums for user roles, policy status, and claim status

4. **Client Generation**
   ```bash
   npx prisma generate
   ```

5. **Database Connection Setup**
   - Created `lib/prisma.ts` with singleton pattern for development
   - Implemented connection pooling and logging configuration

### Key Features

#### Type Safety
Prisma generates TypeScript types automatically, ensuring compile-time safety for all database operations.

#### Schema Models
```typescript
// Example: User model with relations
model User {
  id        Int       @id @default(autoincrement())
  email     String    @unique
  name      String
  phone     String?
  role      UserRole  @default(CUSTOMER)
  policies  Policy[]
  claims    Claim[]
}
```

#### Client Usage Example
```typescript
import { prisma } from '@/lib/prisma';

// Type-safe query with relations
const users = await prisma.user.findMany({
  include: {
    policies: {
      include: { bus: true }
    },
    claims: true
  }
});
```

### API Routes
- `GET /api/test-db` - Database connection test
- `GET /api/users` - Fetch all users with relations
- `POST /api/users` - Create new user

### Available Scripts
```bash
npm run db:generate    # Generate Prisma client
npm run db:push        # Push schema to database
npm run db:migrate     # Create and run migrations
npm run db:studio      # Open Prisma Studio GUI
npm run db:seed        # Run database seeding
```

### Benefits of Prisma Integration

1. **Type Safety**: Compile-time type checking for all database operations
2. **Auto-completion**: IntelliSense support for queries and schema
3. **Migration Management**: Version-controlled database schema changes
4. **Query Optimization**: Efficient SQL generation and query planning
5. **Developer Experience**: Intuitive API and excellent tooling

### Database Connection Verification

The setup includes connection testing functionality that can be verified by:
1. Starting the development server: `npm run dev`
2. Visiting: `http://localhost:3000/api/test-db`
3. Expected response: `{"success": true, "message": "Database connection successful"}`

### Next Steps

1. Set up your PostgreSQL database
2. Update the `DATABASE_URL` in `.env` with your database credentials
3. Run `npm run db:push` to create tables
4. Use `npm run db:studio` to explore your database visually
# BusSure - Intercity Bus Refund System

BusSure is a transparent and reliable intercity bus refund system that provides hassle-free cancellations and instant refunds for bus bookings.

## Features

- **Instant Refunds**: Get your money back instantly when you cancel within the policy window
- **Transparent Policies**: Clear cancellation policies displayed upfront
- **Secure & Reliable**: Enterprise-grade security protocols for transactions and data

## Database Schema

### Core Entities
- **User**: Customers who book bus tickets
- **BusOperator**: Companies that operate buses  
- **Route**: Bus routes between cities
- **Bus**: Individual buses with capacity and amenities
- **Schedule**: Specific departure times for routes
- **Booking**: Customer reservations
- **Ticket**: Individual tickets within a booking
- **RefundPolicy**: Cancellation and refund rules
- **Payment**: Payment transactions
- **Refund**: Refund transactions

### Key Relationships
- Users can make multiple bookings
- Each booking contains multiple tickets
- Operators define refund policies that apply to refunds
- Schedules link routes and buses with specific departure times
- Payments and refunds track financial transactions

### Schema Highlights
- **Normalization**: Follows 1NF, 2NF, and 3NF principles
- **Performance**: Strategic indexes on frequently queried columns
- **Integrity**: Foreign key constraints with CASCADE deletes
- **Flexibility**: JSON storage for bus amenities

For detailed schema documentation, see [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md)

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Set up the database:
```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Seed sample data
npx tsx prisma/seed.ts
```


# Seed sample data
npx tsx prisma/seed.ts
```

4. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Database Commands

```bash
# View database in Prisma Studio
npx prisma studio

# Reset database and reseed
npx prisma migrate reset

# Generate new migration
npx prisma migrate dev --name migration_name

# Verify seeded data
npx tsx verify-data.ts
```

## Project Structure

```
bus_sure/
├── app/                    # Next.js app directory
│   ├── components/         # Reusable UI components
│   ├── dashboard/          # Dashboard pages
│   ├── login/             # Authentication pages
│   └── ...
├── prisma/                # Database schema and migrations
│   ├── schema.prisma      # Database schema definition
│   ├── seed.ts           # Database seeding script
│   └── migrations/        # Migration history
└── ...
```

## Technology Stack

- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS
- **Database**: SQLite (development), Prisma ORM
- **Authentication**: (To be implemented)
- **Deployment**: (To be configured)

## Development

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
