import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Hash passwords for test users
  const hashedPassword = await bcrypt.hash('password123', 10);

  // Create sample users
  const user1 = await prisma.user.upsert({
    where: { email: 'john.doe@example.com' },
    update: {},
    create: {
      email: 'john.doe@example.com',
      name: 'John Doe',
      password: hashedPassword,
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
      password: hashedPassword,
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

  // Create sample documents
  const document1 = await prisma.document.upsert({
    where: { id: 1 },
    update: {},
    create: {
      filename: 'policy_document_pol001.pdf',
      originalName: 'Policy Document POL-001.pdf',
      mimeType: 'application/pdf',
      size: 1024000,
      uploadedBy: user2.id,
      policyId: policy1.id,
    },
  });

  const document2 = await prisma.document.upsert({
    where: { id: 2 },
    update: {},
    create: {
      filename: 'claim_evidence_clm001.jpg',
      originalName: 'Accident Photo - Front Bumper.jpg',
      mimeType: 'image/jpeg',
      size: 512000,
      uploadedBy: user1.id,
      claimId: claim1.id,
    },
  });

  console.log('✅ Database seeding completed successfully!');
  console.log('Created:', {
    users: [user1.name, user2.name],
    buses: [bus1.registrationNumber, bus2.registrationNumber],
    policies: [policy1.policyNumber, policy2.policyNumber],
    claims: [claim1.claimNumber],
    documents: [document1.originalName, document2.originalName],
  });
  console.log('\n🔐 Test Login Credentials:');
  console.log('Email: john.doe@example.com | Password: password123 (Customer)');
  console.log('Email: jane.smith@example.com | Password: password123 (Agent)');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });