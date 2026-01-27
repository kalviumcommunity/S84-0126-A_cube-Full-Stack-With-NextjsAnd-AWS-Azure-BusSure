import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Create sample users
  const user1 = await prisma.user.upsert({
    where: { email: 'john.doe@example.com' },
    update: {},
    create: {
      email: 'john.doe@example.com',
      name: 'John Doe',
      phone: '+1234567890',
      role: 'CUSTOMER',
    },
  });

  const user2 = await prisma.user.upsert({
    where: { email: 'jane.smith@example.com' },
    update: {},
    create: {
      email: 'jane.smith@example.com',
      name: 'Jane Smith',
      phone: '+1987654321',
      role: 'AGENT',
    },
  });

  // Create sample buses
  const bus1 = await prisma.bus.upsert({
    where: { registrationNumber: 'ABC-123' },
    update: {},
    create: {
      registrationNumber: 'ABC-123',
      make: 'Volvo',
      model: 'B7R',
      year: 2020,
      capacity: 45,
      engineNumber: 'ENG123456',
      chassisNumber: 'CHS789012',
    },
  });

  const bus2 = await prisma.bus.upsert({
    where: { registrationNumber: 'XYZ-789' },
    update: {},
    create: {
      registrationNumber: 'XYZ-789',
      make: 'Mercedes',
      model: 'Travego',
      year: 2021,
      capacity: 50,
      engineNumber: 'ENG789012',
      chassisNumber: 'CHS345678',
    },
  });

  // Create sample policies
  const policy1 = await prisma.policy.upsert({
    where: { policyNumber: 'POL-001' },
    update: {},
    create: {
      policyNumber: 'POL-001',
      userId: user1.id,
      busId: bus1.id,
      startDate: new Date(),
      endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
      premium: 5000.00,
      coverage: 100000.00,
      status: 'ACTIVE',
    },
  });

  const policy2 = await prisma.policy.upsert({
    where: { policyNumber: 'POL-002' },
    update: {},
    create: {
      policyNumber: 'POL-002',
      userId: user1.id,
      busId: bus2.id,
      startDate: new Date(),
      endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
      premium: 6000.00,
      coverage: 120000.00,
      status: 'ACTIVE',
    },
  });

  // Create sample claims
  const claim1 = await prisma.claim.upsert({
    where: { claimNumber: 'CLM-001' },
    update: {},
    create: {
      claimNumber: 'CLM-001',
      userId: user1.id,
      policyId: policy1.id,
      incidentDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
      description: 'Minor accident damage to front bumper',
      amount: 2500.00,
      status: 'PENDING',
    },
  });

  console.log('✅ Database seeding completed successfully!');
  console.log('Created:', {
    users: [user1.name, user2.name],
    buses: [bus1.registrationNumber, bus2.registrationNumber],
    policies: [policy1.policyNumber, policy2.policyNumber],
    claims: [claim1.claimNumber],
  });
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });