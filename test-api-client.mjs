/**
 * Simple test script for API client
 * Run: node test-api-client.mjs
 */

import axios from 'axios';

const API_URL = 'http://localhost:8888';

console.log('Testing API Client...\n');
console.log('Backend URL:', API_URL);
console.log('---');

// Test 1: Health check
async function testHealth() {
  console.log('\n1. Testing /health endpoint...');
  try {
    const response = await axios.get(`${API_URL}/health`);
    console.log('✅ SUCCESS');
    console.log('Status:', response.data.status);
    console.log('Database:', response.data.services.database.status);
    console.log('Redis:', response.data.services.redis.status);
    return true;
  } catch (error) {
    console.error('❌ FAILED');
    console.error('Error:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    return false;
  }
}

// Test 2: Orders endpoint (GET)
async function testOrders() {
  console.log('\n2. Testing /orders endpoint...');
  try {
    const response = await axios.get(`${API_URL}/orders`);
    console.log('✅ SUCCESS');
    console.log('Orders count:', response.data.length || 0);
    return true;
  } catch (error) {
    console.error('❌ FAILED');
    console.error('Error:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
    }
    return false;
  }
}

// Test 3: CORS check
async function testCORS() {
  console.log('\n3. Testing CORS...');
  try {
    const response = await axios.get(`${API_URL}/health`, {
      headers: {
        'Origin': 'http://localhost:3002'
      }
    });
    console.log('✅ SUCCESS');
    console.log('CORS headers present:', !!response.headers['access-control-allow-origin']);
    return true;
  } catch (error) {
    console.error('❌ FAILED');
    console.error('Error:', error.message);
    return false;
  }
}

// Run all tests
async function runTests() {
  const results = [];

  results.push(await testHealth());
  results.push(await testOrders());
  results.push(await testCORS());

  console.log('\n---');
  console.log('Summary:');
  console.log(`Passed: ${results.filter(r => r).length}/${results.length}`);
  console.log(`Failed: ${results.filter(r => !r).length}/${results.length}`);

  if (results.every(r => r)) {
    console.log('\n✅ All tests passed! API client is working correctly.');
    process.exit(0);
  } else {
    console.log('\n❌ Some tests failed. Check the errors above.');
    process.exit(1);
  }
}

runTests();
