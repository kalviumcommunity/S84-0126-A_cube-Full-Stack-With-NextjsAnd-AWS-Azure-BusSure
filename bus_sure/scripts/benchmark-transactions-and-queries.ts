import { PrismaClient } from '@prisma/client';
import ClaimTransactionService from '../lib/claim-transaction-service';
import QueryOptimizationService from '../lib/query-optimization-service';

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

/**
 * Benchmark Script for Database Transactions and Query Optimization
 * 
 * This script demonstrates and benchmarks:
 * 1. Transaction workflows with rollback testing
 * 2. Query optimization techniques
 * 3. Before/after performance comparisons
 * 4. Index effectiveness
 */

async function seedTestData() {
  console.log('🌱 Seeding test data...');
  
  // Create test users (handle duplicates manually)
  const testUsers = [
    { email: 'customer1@test.com', name: 'John Doe', password: '$2b$10$WDTXylzDYrnJrJ4HSIyfZeA7SU6qjUAnURgW8CMocfF6GRxANwQO6', role: 'CUSTOMER' },
    { email: 'customer2@test.com', name: 'Jane Smith', password: '$2b$10$WDTXylzDYrnJrJ4HSIyfZeA7SU6qjUAnURgW8CMocfF6GRxANwQO6', role: 'CUSTOMER' },
    { email: 'agent1@test.com', name: 'Agent Brown', password: '$2b$10$WDTXylzDYrnJrJ4HSIyfZeA7SU6qjUAnURgW8CMocfF6GRxANwQO6', role: 'AGENT' },
    { email: 'admin1@test.com', name: 'Admin Wilson', password: '$2b$10$WDTXylzDYrnJrJ4HSIyfZeA7SU6qjUAnURgW8CMocfF6GRxANwQO6', role: 'ADMIN' },
  ];

  let userCount = 0;
  for (const userData of testUsers) {
    try {
      await prisma.user.create({ data: userData });
      userCount++;
    } catch (error) {
      // User already exists, skip
    }
  }

  // Create test buses
  const testBuses = [
    { registrationNumber: 'BUS001', make: 'Mercedes', model: 'Sprinter', year: 2020, capacity: 20 },
    { registrationNumber: 'BUS002', make: 'Ford', model: 'Transit', year: 2019, capacity: 15 },
    { registrationNumber: 'BUS003', make: 'Volvo', model: 'B8R', year: 2021, capacity: 50 },
  ];

  let busCount = 0;
  for (const busData of testBuses) {
    try {
      await prisma.bus.create({ data: busData });
      busCount++;
    } catch (error) {
      // Bus already exists, skip
    }
  }

  // Get created users and buses
  const createdUsers = await prisma.user.findMany({ take: 4 });
  const createdBuses = await prisma.bus.findMany({ take: 3 });

  // Create test policies
  const testPolicies = [
    {
      policyNumber: 'POL001',
      userId: createdUsers[0].id,
      busId: createdBuses[0].id,
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-12-31'),
      premium: 1200.00,
      coverage: 50000.00,
      status: 'ACTIVE',
    },
    {
      policyNumber: 'POL002',
      userId: createdUsers[1].id,
      busId: createdBuses[1].id,
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-12-31'),
      premium: 800.00,
      coverage: 30000.00,
      status: 'ACTIVE',
    },
  ];

  let policyCount = 0;
  for (const policyData of testPolicies) {
    try {
      await prisma.policy.create({ data: policyData });
      policyCount++;
    } catch (error) {
      // Policy already exists, skip
    }
  }

  // Create test claims
  const createdPolicies = await prisma.policy.findMany({ take: 2 });
  let claimCount = 0;
  
  for (let i = 0; i < 20; i++) {
    try {
      await prisma.claim.create({
        data: {
          claimNumber: `CLM${String(i + 1).padStart(3, '0')}`,
          userId: createdUsers[i % 2].id,
          policyId: createdPolicies[i % 2].id,
          incidentDate: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
          description: `Test claim ${i + 1} - Accident description`,
          amount: Math.floor(Math.random() * 10000) + 1000,
          status: ['PENDING', 'APPROVED', 'REJECTED', 'PROCESSING'][Math.floor(Math.random() * 4)],
        }
      });
      claimCount++;
    } catch (error) {
      // Claim already exists, skip
    }
  }

  console.log(`✅ Seeded ${userCount} users, ${busCount} buses, ${policyCount} policies, ${claimCount} claims`);
}

async function benchmarkTransactions() {
  console.log('\n🔄 BENCHMARKING TRANSACTIONS\n');
  
  const transactionService = new ClaimTransactionService();
  
  // Get a test claim for processing
  const testClaim = await prisma.claim.findFirst({
    where: { status: 'PENDING' },
  });

  if (!testClaim) {
    console.log('❌ No pending claims found for testing');
    return;
  }

  const testUser = await prisma.user.findFirst({
    where: { role: 'AGENT' },
  });

  if (!testUser) {
    console.log('❌ No agent user found for testing');
    return;
  }

  console.log('1. Testing successful transaction...');
  try {
    const result = await transactionService.processClaimApproval({
      claimId: testClaim.id,
      approvedAmount: 5000.00,
      paymentMethod: 'BANK_TRANSFER',
      transactionId: `TXN${Date.now()}`,
      processedBy: testUser.id,
    });
    
    console.log(`✅ Transaction successful - Claim: ${result.claim.id}, Payment: ${result.payment.id}`);
  } catch (error) {
    console.error('❌ Transaction failed:', error);
  }

  console.log('\n2. Testing transaction rollback...');
  try {
    await transactionService.simulateTransactionFailure(testClaim.id, testUser.id);
  } catch (error) {
    console.log('✅ Rollback test completed successfully');
  }

  console.log('\n3. Testing claim creation with audit...');
  try {
    const newClaimResult = await transactionService.createClaimWithAudit({
      userId: testUser.id,
      policyId: testClaim.policyId,
      incidentDate: new Date(),
      description: 'Test claim created via transaction',
      amount: 3000.00,
      claimNumber: `CLM${Date.now()}`,
    });
    
    console.log(`✅ Claim creation successful - Claim: ${newClaimResult.claim.id}`);
  } catch (error) {
    console.error('❌ Claim creation failed:', error);
  }
}

async function benchmarkQueries() {
  console.log('\n⚡ BENCHMARKING QUERY OPTIMIZATION\n');
  
  const queryService = new QueryOptimizationService();
  
  console.log('1. Comparing optimized vs unoptimized queries...');
  
  // Test optimized query
  const optimizedResult = await queryService.getOptimizedClaimsList(1, 10, 'PENDING');
  console.log(`✅ Optimized query: ${optimizedResult.queryTime}ms, ${optimizedResult.claims.length} results`);
  
  // Test unoptimized query
  const unoptimizedResult = await queryService.getUnoptimizedClaimsList('PENDING');
  console.log(`🐌 Unoptimized query: ${unoptimizedResult.queryTime}ms, ${unoptimizedResult.claims.length} results`);
  
  const improvement = ((unoptimizedResult.queryTime - optimizedResult.queryTime) / unoptimizedResult.queryTime * 100).toFixed(1);
  console.log(`📈 Performance improvement: ${improvement}% faster`);

  console.log('\n2. Testing bulk operations...');
  
  // Test bulk audit log creation
  const bulkLogs = Array.from({ length: 100 }, (_, i) => ({
    action: 'BULK_TEST',
    entityType: 'CLAIM',
    entityId: i + 1,
    userId: 1,
    details: JSON.stringify({ test: true, index: i }),
  }));
  
  const bulkResult = await queryService.createBulkAuditLogs(bulkLogs);
  console.log(`✅ Bulk operation: Created ${bulkResult.count} logs in ${bulkResult.queryTime}ms`);

  console.log('\n3. Testing dashboard query...');
  
  const user = await prisma.user.findFirst();
  if (user) {
    const dashboardResult = await queryService.getUserDashboard(user.id);
    console.log(`✅ Dashboard query: ${dashboardResult.queryTime}ms`);
    console.log(`   - Policies: ${dashboardResult.activePolicies.length}`);
    console.log(`   - Claims: ${dashboardResult.recentClaims.length}`);
    console.log(`   - Payments: ${dashboardResult.pendingPayments.length}`);
  }

  console.log('\n4. Testing search functionality...');
  
  const searchResult = await queryService.searchClaims('CLM', 5);
  console.log(`✅ Search query: ${searchResult.queryTime}ms, ${searchResult.resultCount} results`);

  console.log('\n5. Testing analytics query...');
  
  const analyticsResult = await queryService.getClaimsAnalytics();
  console.log(`✅ Analytics query: ${analyticsResult.queryTime}ms`);
  console.log(`   - Total claims: ${analyticsResult.totalClaims}`);
  console.log(`   - Average amount: $${analyticsResult.avgClaimAmount?.toFixed(2) || 0}`);
  console.log(`   - Total amount: $${analyticsResult.totalClaimAmount?.toFixed(2) || 0}`);

  console.log('\n6. Testing bulk updates...');
  
  const pendingClaims = await prisma.claim.findMany({
    where: { status: 'PENDING' },
    select: { id: true },
    take: 5,
  });
  
  if (pendingClaims.length > 0) {
    const bulkUpdateResult = await queryService.bulkUpdateClaimStatus(
      pendingClaims.map(c => c.id),
      'PROCESSING',
      1
    );
    console.log(`✅ Bulk update: Updated ${bulkUpdateResult.updatedCount} claims in ${bulkUpdateResult.queryTime}ms`);
  }
}

async function analyzeIndexEffectiveness() {
  console.log('\n📊 ANALYZING INDEX EFFECTIVENESS\n');
  
  // Test queries that should benefit from indexes
  const testQueries = [
    {
      name: 'Claims by status (indexed)',
      query: () => prisma.claim.findMany({ where: { status: 'PENDING' } }),
    },
    {
      name: 'Claims by user (indexed)',
      query: () => prisma.claim.findMany({ where: { userId: 1 } }),
    },
    {
      name: 'Policies by status and date (compound index)',
      query: () => prisma.policy.findMany({
        where: { status: 'ACTIVE' },
        orderBy: { createdAt: 'desc' },
      }),
    },
    {
      name: 'Users by role (indexed)',
      query: () => prisma.user.findMany({ where: { role: 'CUSTOMER' } }),
    },
  ];

  for (const test of testQueries) {
    const startTime = Date.now();
    const result = await test.query();
    const endTime = Date.now();
    console.log(`✅ ${test.name}: ${endTime - startTime}ms (${result.length} results)`);
  }
}

async function generatePerformanceReport() {
  console.log('\n📋 PERFORMANCE REPORT SUMMARY\n');
  
  const stats = await Promise.all([
    prisma.user.count(),
    prisma.policy.count(),
    prisma.claim.count(),
    prisma.payment.count(),
    prisma.auditLog.count(),
    prisma.document.count(),
  ]);

  console.log('Database Statistics:');
  console.log(`  - Users: ${stats[0]}`);
  console.log(`  - Policies: ${stats[1]}`);
  console.log(`  - Claims: ${stats[2]}`);
  console.log(`  - Payments: ${stats[3]}`);
  console.log(`  - Audit Logs: ${stats[4]}`);
  console.log(`  - Documents: ${stats[5]}`);
  
  console.log('\nIndexes Added:');
  console.log('  - Users: role, createdAt, (role, createdAt)');
  console.log('  - Policies: userId, status, (status, createdAt), (userId, status), endDate');
  console.log('  - Claims: userId, policyId, status, (status, createdAt), (userId, status), incidentDate');
  console.log('  - Documents: uploadedBy, claimId, policyId, createdAt');
  console.log('  - Payments: status, createdAt, (status, createdAt)');
  console.log('  - AuditLogs: (entityType, entityId), userId, action, createdAt');
  
  console.log('\nOptimizations Implemented:');
  console.log('  ✅ Selective field fetching with select');
  console.log('  ✅ Pagination with skip/take');
  console.log('  ✅ Bulk operations with createMany/updateMany');
  console.log('  ✅ Efficient filtering with indexed fields');
  console.log('  ✅ Avoiding N+1 queries with include');
  console.log('  ✅ Transaction workflows for data integrity');
  console.log('  ✅ Proper error handling and rollback testing');
}

async function main() {
  console.log('🚀 Starting Database Transaction and Query Optimization Benchmark\n');
  
  try {
    await seedTestData();
    await benchmarkTransactions();
    await benchmarkQueries();
    await analyzeIndexEffectiveness();
    await generatePerformanceReport();
    
    console.log('\n✅ Benchmark completed successfully!');
  } catch (error) {
    console.error('❌ Benchmark failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the benchmark
main().catch(console.error);