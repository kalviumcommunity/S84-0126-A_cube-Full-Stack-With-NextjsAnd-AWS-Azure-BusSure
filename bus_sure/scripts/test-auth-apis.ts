#!/usr/bin/env tsx

/**
 * Test script for Authentication APIs
 * Tests signup, login, and protected route access
 */

const API_BASE_URL = 'http://localhost:3000/api';

interface ApiResponse {
  success: boolean;
  message: string;
  [key: string]: any;
}

async function makeRequest(
  endpoint: string, 
  method: 'GET' | 'POST' = 'GET', 
  body?: any, 
  token?: string
): Promise<ApiResponse> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  return response.json();
}

async function testAuthFlow() {
  console.log('🚀 Testing Authentication APIs\n');

  // Test data with timestamp to ensure uniqueness
  const timestamp = Date.now();
  const testUser = {
    name: 'Test User',
    email: `testuser${timestamp}@example.com`,
    password: 'securepassword123',
    phone: '+1987654321'
  };

  try {
    // 1. Test Signup
    console.log('1️⃣ Testing Signup...');
    const signupResponse = await makeRequest('/auth/signup', 'POST', testUser);
    console.log('Signup Response:', JSON.stringify(signupResponse, null, 2));
    
    if (!signupResponse.success) {
      console.log('❌ Signup failed, but continuing with login test...\n');
    } else {
      console.log('✅ Signup successful!\n');
    }

    // 2. Test Login
    console.log('2️⃣ Testing Login...');
    const loginResponse = await makeRequest('/auth/login', 'POST', {
      email: testUser.email,
      password: testUser.password
    });
    console.log('Login Response:', JSON.stringify(loginResponse, null, 2));

    if (!loginResponse.success) {
      console.log('❌ Login failed!');
      return;
    }

    console.log('✅ Login successful!\n');
    const token = loginResponse.token;

    // 3. Test Protected Route (User Profile)
    console.log('3️⃣ Testing Protected Route (User Profile)...');
    const profileResponse = await makeRequest('/users', 'GET', undefined, token);
    console.log('Profile Response:', JSON.stringify(profileResponse, null, 2));

    if (profileResponse.success) {
      console.log('✅ Protected route access successful!\n');
    } else {
      console.log('❌ Protected route access failed!\n');
    }

    // 4. Test Protected Route without Token
    console.log('4️⃣ Testing Protected Route without Token...');
    const unauthorizedResponse = await makeRequest('/users', 'GET');
    console.log('Unauthorized Response:', JSON.stringify(unauthorizedResponse, null, 2));

    if (!unauthorizedResponse.success && unauthorizedResponse.message.includes('token')) {
      console.log('✅ Unauthorized access properly blocked!\n');
    } else {
      console.log('❌ Unauthorized access not properly blocked!\n');
    }

    // 5. Test Login with Wrong Password
    console.log('5️⃣ Testing Login with Wrong Password...');
    const wrongPasswordResponse = await makeRequest('/auth/login', 'POST', {
      email: testUser.email,
      password: 'wrongpassword'
    });
    console.log('Wrong Password Response:', JSON.stringify(wrongPasswordResponse, null, 2));

    if (!wrongPasswordResponse.success && wrongPasswordResponse.message.includes('credentials')) {
      console.log('✅ Wrong password properly rejected!\n');
    } else {
      console.log('❌ Wrong password not properly rejected!\n');
    }

    // 6. Test Password Reset
    console.log('6️⃣ Testing Password Reset...');
    const resetPasswordResponse = await makeRequest('/auth/reset-password', 'POST', {
      currentPassword: testUser.password,
      newPassword: 'newsecurepassword456'
    }, token);
    console.log('Password Reset Response:', JSON.stringify(resetPasswordResponse, null, 2));

    if (resetPasswordResponse.success) {
      console.log('✅ Password reset successful!\n');
      
      // Test login with new password
      console.log('7️⃣ Testing Login with New Password...');
      const newPasswordLoginResponse = await makeRequest('/auth/login', 'POST', {
        email: testUser.email,
        password: 'newsecurepassword456'
      });
      
      if (newPasswordLoginResponse.success) {
        console.log('✅ Login with new password successful!\n');
      } else {
        console.log('❌ Login with new password failed!\n');
      }
    } else {
      console.log('❌ Password reset failed!\n');
    }

    console.log('🎉 Authentication API testing completed!');

  } catch (error) {
    console.error('❌ Test failed with error:', error);
  }
}

// Run the test
if (require.main === module) {
  testAuthFlow();
}