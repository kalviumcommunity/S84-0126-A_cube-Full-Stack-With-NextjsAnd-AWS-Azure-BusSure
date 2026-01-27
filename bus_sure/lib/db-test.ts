import { prisma } from './prisma';

// Test database connection
export async function testConnection() {
  try {
    await prisma.$connect();
    console.log('✅ Database connection successful');
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    return false;
  } finally {
    await prisma.$disconnect();
  }
}

// Example query functions for the bus insurance app
export async function getUsers() {
  try {
    const users = await prisma.user.findMany({
      include: {
        policies: true,
        claims: true,
      },
    });
    console.log('Users:', users);
    return users;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
}

export async function getPolicies() {
  try {
    const policies = await prisma.policy.findMany({
      include: {
        user: true,
        bus: true,
        claims: true,
      },
    });
    console.log('Policies:', policies);
    return policies;
  } catch (error) {
    console.error('Error fetching policies:', error);
    throw error;
  }
}

export async function createSampleData() {
  try {
    // Create a sample user
    const user = await prisma.user.create({
      data: {
        email: 'john.doe@example.com',
        name: 'John Doe',
        phone: '+1234567890',
        role: 'CUSTOMER',
      },
    });

    // Create a sample bus
    const bus = await prisma.bus.create({
      data: {
        registrationNumber: 'ABC-123',
        make: 'Volvo',
        model: 'B7R',
        year: 2020,
        capacity: 45,
        engineNumber: 'ENG123456',
        chassisNumber: 'CHS789012',
      },
    });

    // Create a sample policy
    const policy = await prisma.policy.create({
      data: {
        policyNumber: 'POL-001',
        userId: user.id,
        busId: bus.id,
        startDate: new Date(),
        endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
        premium: 5000.00,
        coverage: 100000.00,
        status: 'ACTIVE',
      },
    });

    console.log('✅ Sample data created successfully');
    return { user, bus, policy };
  } catch (error) {
    console.error('❌ Error creating sample data:', error);
    throw error;
  }
}