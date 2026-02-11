# Database Migrations & Seed Scripts Guide

This guide demonstrates how to create reproducible database migrations and data seeding scripts using Prisma ORM for the Bus Insurance application.

## 📋 Overview

Our database schema includes:
- **Users**: Customers, agents, and admins
- **Buses**: Vehicle information and registration details
- **Policies**: Insurance policies linking users and buses
- **Claims**: Insurance claims against policies
- **Documents**: File attachments for policies and claims

## 🔄 Migration Workflow

### 1. Understanding Database Migrations

Migrations capture schema changes and keep your database in sync with your Prisma models. Each migration:
- Generates SQL files in `prisma/migrations/`
- Applies changes to your connected database
- Updates your Prisma client accordingly

### 2. Creating Your First Migration

```bash
# Create and apply initial migration
npx prisma migrate dev --name init_insurance_schema
```

**What happens:**
- Prisma analyzes your schema
- Generates migration SQL files
- Applies changes to the database
- Regenerates Prisma client

### 3. Adding New Models/Fields

When you modify your schema (like adding the Document model), create a new migration:

```bash
# Create migration for new changes
npx prisma migrate dev --name add_document_model
```

### 4. Migration Commands Reference

```bash
# Create and apply migration
npx prisma migrate dev --name <migration_name>

# Check migration status
npx prisma migrate status

# Reset database (⚠️ DESTRUCTIVE - removes all data)
npx prisma migrate reset --force

# Apply pending migrations (production)
npx prisma migrate deploy
```

## 🌱 Seed Scripts

### Current Seed Data

Our seed script (`prisma/seed.ts`) creates:
- 2 sample users (John Doe - Customer, Jane Smith - Agent)
- 2 sample buses (Volvo B7R, Mercedes Travego)
- 2 sample policies with different coverage amounts
- 1 sample claim for accident damage
- 2 sample documents (policy PDF, claim photo)

### Running Seeds

```bash
# Run seed script
npx prisma db seed

# Reset database and re-run seeds
npx prisma migrate reset
```

### Seed Script Features

✅ **Idempotent**: Uses `upsert()` to prevent duplicate entries  
✅ **Relational**: Properly links related data (users → policies → claims)  
✅ **Realistic**: Uses meaningful sample data for testing  
✅ **Logged**: Provides clear output of created records  

## 📊 Verifying Data

### Using Prisma Studio
```bash
npx prisma studio
```
Opens web interface at `http://localhost:5555` to browse and edit data.

### Using Database Queries
```typescript
// Example: Fetch user with policies and claims
const userWithData = await prisma.user.findUnique({
  where: { email: 'john.doe@example.com' },
  include: {
    policies: {
      include: {
        bus: true,
        claims: true,
        documents: true
      }
    }
  }
});
```

## 🔄 Rollback Strategies

### Safe Rollback Process

1. **Backup First**: Always backup production data
   ```bash
   # For SQLite
   cp dev.db dev.db.backup
   
   # For PostgreSQL
   pg_dump bus_sure_db > backup.sql
   ```

2. **Test in Staging**: Apply migrations to staging environment first

3. **Rollback Options**:
   ```bash
   # Complete reset (⚠️ DESTRUCTIVE)
   npx prisma migrate reset
   
   # Manual rollback (advanced)
   # 1. Remove migration files
   # 2. Revert schema changes
   # 3. Run prisma migrate dev
   ```

## 📁 Migration Files Structure

```
prisma/migrations/
├── 20260128091604_init_insurance_schema/
│   └── migration.sql          # Initial schema creation
├── 20260128091824_add_document_model/
│   └── migration.sql          # Added Document model
└── migration_lock.toml        # Database provider lock
```

## 🛡️ Production Safety

### Before Deploying Migrations

1. **Review Generated SQL**: Always check migration files
2. **Test Locally**: Run migrations on local copy of production data
3. **Backup Production**: Create full database backup
4. **Staging Deployment**: Test in staging environment
5. **Monitor Performance**: Check for long-running migrations

### Production Migration Command
```bash
# Use this in production (doesn't prompt for name)
npx prisma migrate deploy
```

## 📈 Migration Logs

### Successful Migration Output
```
✅ Initial Schema Migration (20260128091604_init_insurance_schema)
- Created tables: users, buses, policies, claims
- Added indexes for email, registration numbers, policy numbers
- Set up foreign key relationships

✅ Document Model Addition (20260128091824_add_document_model)
- Created documents table
- Added foreign keys to users, claims, policies
- Supports file metadata storage

✅ Seed Data Population
- 2 users created (Customer & Agent roles)
- 2 buses registered (Volvo B7R, Mercedes Travego)
- 2 active policies with $100K-$120K coverage
- 1 pending claim for $2,500
- 2 documents attached (policy PDF, claim photo)
```

## 🔍 Troubleshooting

### Common Issues

1. **Schema Drift**: Schema doesn't match database
   ```bash
   npx prisma db push  # Quick fix for development
   ```

2. **Migration Conflicts**: Multiple developers creating migrations
   ```bash
   npx prisma migrate reset  # Reset and re-apply all
   ```

3. **Seed Failures**: Constraint violations or missing data
   - Check foreign key relationships
   - Ensure unique constraints aren't violated
   - Verify data types match schema

## 🎯 Best Practices

1. **Descriptive Names**: Use clear migration names (`add_user_roles`, `fix_policy_constraints`)
2. **Small Changes**: Keep migrations focused on single features
3. **Review SQL**: Always check generated migration files
4. **Test Seeds**: Ensure seed scripts can run multiple times safely
5. **Document Changes**: Update this guide when adding new models
6. **Backup Strategy**: Regular backups before major schema changes

## 📚 Additional Resources

- [Prisma Migrate Documentation](https://www.prisma.io/docs/concepts/components/prisma-migrate)
- [Database Seeding Guide](https://www.prisma.io/docs/guides/database/seed-database)
- [Production Migration Best Practices](https://www.prisma.io/docs/guides/database/production-troubleshooting)