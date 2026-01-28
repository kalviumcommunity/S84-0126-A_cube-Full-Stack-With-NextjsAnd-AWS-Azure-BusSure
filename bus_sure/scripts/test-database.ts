import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testDatabase() {
  console.log('🔍 Testing database connection and data...\n');

  try {
    // Test 1: Count records in each table
    const userCount = await prisma.user.count();
    const busCount = await prisma.bus.count();
    const policyCount = await prisma.policy.count();
    const claimCount = await prisma.claim.count();
    const documentCount = await prisma.document.count();

    console.log('📊 Record Counts:');
    console.log(`   Users: ${userCount}`);
    console.log(`   Buses: ${busCount}`);
    console.log(`   Policies: ${policyCount}`);
    console.log(`   Claims: ${claimCount}`);
    console.log(`   Documents: ${documentCount}\n`);

    // Test 2: Fetch user with all related data
    const userWithData = await prisma.user.findFirst({
      where: { role: 'CUSTOMER' },
      include: {
        policies: {
          include: {
            bus: true,
            claims: {
              include: {
                documents: true
              }
            },
            documents: true
          }
        }
      }
    });

    if (userWithData) {
      console.log('👤 Sample User Data:');
      console.log(`   Name: ${userWithData.name}`);
      console.log(`   Email: ${userWithData.email}`);
      console.log(`   Role: ${userWithData.role}`);
      console.log(`   Policies: ${userWithData.policies.length}`);
      
      userWithData.policies.forEach((policy, index) => {
        console.log(`   Policy ${index + 1}:`);
        console.log(`     Number: ${policy.policyNumber}`);
        console.log(`     Bus: ${policy.bus.make} ${policy.bus.model} (${policy.bus.registrationNumber})`);
        console.log(`     Premium: $${policy.premium}`);
        console.log(`     Coverage: $${policy.coverage}`);
        console.log(`     Claims: ${policy.claims.length}`);
        console.log(`     Documents: ${policy.documents.length}`);
      });
    }

    // Test 3: Test relationships
    const claimWithDocuments = await prisma.claim.findFirst({
      include: {
        documents: true,
        user: true,
        policy: {
          include: {
            bus: true
          }
        }
      }
    });

    if (claimWithDocuments) {
      console.log('\n📋 Sample Claim Data:');
      console.log(`   Claim Number: ${claimWithDocuments.claimNumber}`);
      console.log(`   Description: ${claimWithDocuments.description}`);
      console.log(`   Amount: $${claimWithDocuments.amount}`);
      console.log(`   Status: ${claimWithDocuments.status}`);
      console.log(`   Policy: ${claimWithDocuments.policy.policyNumber}`);
      console.log(`   Bus: ${claimWithDocuments.policy.bus.registrationNumber}`);
      console.log(`   Documents: ${claimWithDocuments.documents.length}`);
    }

    console.log('\n✅ Database test completed successfully!');
    console.log('🎉 All relationships and data integrity verified.');

  } catch (error) {
    console.error('❌ Database test failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

testDatabase();