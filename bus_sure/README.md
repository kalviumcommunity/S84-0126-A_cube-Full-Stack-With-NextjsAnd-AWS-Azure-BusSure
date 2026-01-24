This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

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
