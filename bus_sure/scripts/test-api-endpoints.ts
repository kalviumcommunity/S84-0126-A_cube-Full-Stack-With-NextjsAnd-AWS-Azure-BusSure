/**
 * API Endpoint Testing Script
 * Tests the transaction and optimization API endpoints
 */

const BASE_URL = 'http://localhost:3000';

async function testAPI() {
  console.log('🧪 Testing API Endpoints\n');

  try {
    // Test 1: Get optimized claims list
    console.log('1. Testing optimized claims list...');
    const claimsResponse = await fetch(`${BASE_URL}/api/claims/optimized?page=1&limit=5&status=PENDING`);
    const claimsData = await claimsResponse.json();
    
    if (claimsResponse.ok) {
      console.log(`✅ Claims list: ${claimsData.data.claims.length} results in ${claimsData.data.queryTime}ms`);
      console.log(`   Pagination: Page ${claimsData.data.pagination.page} of ${claimsData.data.pagination.totalPages}`);
    } else {
      console.log(`❌ Claims list failed: ${claimsData.error}`);
    }

    // Test 2: Search claims
    console.log('\n2. Testing claims search...');
    const searchResponse = await fetch(`${BASE_URL}/api/claims/optimized`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'search',
        data: { searchTerm: 'CLM', limit: 5 }
      })
    });
    const searchData = await searchResponse.json();
    
    if (searchResponse.ok) {
      console.log(`✅ Search: ${searchData.data.resultCount} results in ${searchData.data.queryTime}ms`);
    } else {
      console.log(`❌ Search failed: ${searchData.error}`);
    }

    // Test 3: Get analytics
    console.log('\n3. Testing claims analytics...');
    const analyticsResponse = await fetch(`${BASE_URL}/api/claims/optimized`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'analytics',
        data: {}
      })
    });
    const analyticsData = await analyticsResponse.json();
    
    if (analyticsResponse.ok) {
      console.log(`✅ Analytics: ${analyticsData.data.totalClaims} total claims in ${analyticsData.data.queryTime}ms`);
      console.log(`   Average amount: $${analyticsData.data.avgClaimAmount?.toFixed(2) || 0}`);
      console.log(`   Total amount: $${analyticsData.data.totalClaimAmount?.toFixed(2) || 0}`);
    } else {
      console.log(`❌ Analytics failed: ${analyticsData.error}`);
    }

    // Test 4: Get user dashboard (using user ID 1)
    console.log('\n4. Testing user dashboard...');
    const dashboardResponse = await fetch(`${BASE_URL}/api/claims/optimized`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'dashboard',
        data: { userId: 1 }
      })
    });
    const dashboardData = await dashboardResponse.json();
    
    if (dashboardResponse.ok) {
      console.log(`✅ Dashboard: Query completed in ${dashboardData.data.queryTime}ms`);
      console.log(`   User: ${dashboardData.data.user?.name || 'Unknown'}`);
      console.log(`   Active policies: ${dashboardData.data.activePolicies.length}`);
      console.log(`   Recent claims: ${dashboardData.data.recentClaims.length}`);
      console.log(`   Pending payments: ${dashboardData.data.pendingPayments.length}`);
    } else {
      console.log(`❌ Dashboard failed: ${dashboardData.error}`);
    }

    // Test 5: Process claim approval (using first available claim)
    console.log('\n5. Testing claim processing transaction...');
    
    // First, get a claim to process
    if (claimsData.success && claimsData.data.claims.length > 0) {
      const claimToProcess = claimsData.data.claims[0];
      
      const processResponse = await fetch(`${BASE_URL}/api/claims/process`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          claimId: claimToProcess.id,
          approvedAmount: 3000.00,
          paymentMethod: 'BANK_TRANSFER',
          transactionId: `TXN${Date.now()}`,
          processedBy: 3 // Assuming agent user ID 3
        })
      });
      const processData = await processResponse.json();
      
      if (processResponse.ok) {
        console.log(`✅ Claim processing: Transaction completed successfully`);
        console.log(`   Claim ID: ${processData.data.claim.id}`);
        console.log(`   Payment ID: ${processData.data.payment.id}`);
        console.log(`   Audit Log ID: ${processData.data.auditLog.id}`);
      } else {
        console.log(`❌ Claim processing failed: ${processData.error}`);
        console.log(`   Details: ${processData.details}`);
      }
    } else {
      console.log('⚠️  No claims available for processing test');
    }

    console.log('\n✅ API testing completed!');

  } catch (error) {
    console.error('❌ API testing failed:', error);
  }
}

// Run the tests
testAPI();