#!/usr/bin/env node
import http from 'http';

function makeRequest(method, path, body = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 4000,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(data) });
        } catch (e) {
          resolve({ status: res.statusCode, body: data });
        }
      });
    });

    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function runTests() {
  console.log('\n📋 Testing NEXORA API Routes\n');

  try {
    // Test 1: GET /api/products
    console.log('[1] GET /api/products (public)');
    let res = await makeRequest('GET', '/api/products');
    if (res.status === 200) {
      console.log(`✅ Status ${res.status} | Products: ${res.body.products?.length || 0}`);
    } else {
      console.log(`❌ Status ${res.status}`);
    }

    // Test 2: POST /api/auth/login
    console.log('\n[2] POST /api/auth/login (public)');
    res = await makeRequest('POST', '/api/auth/login', {
      email: 'user@nexora.com',
      password: 'User123!'
    });
    if (res.status === 200) {
      console.log(`✅ Status ${res.status} | User: ${res.body.user?.email}`);
      var token = res.body.token;
    } else {
      console.log(`❌ Status ${res.status} | ${res.body.erreur}`);
    }

    // Test 3: GET /api/auth/me without token
    console.log('\n[3] GET /api/auth/me (no token - should fail)');
    res = await makeRequest('GET', '/api/auth/me');
    if (res.status === 401) {
      console.log(`✅ Status ${res.status} | Message: ${res.body.erreur}`);
    } else {
      console.log(`❌ Unexpected status ${res.status}`);
    }

    // Test 4: GET /api/auth/me with token
    if (token) {
      console.log('\n[4] GET /api/auth/me (with token)');
      res = await makeRequest('GET', '/api/auth/me', null, {
        'Authorization': `Bearer ${token}`
      });
      if (res.status === 200) {
        console.log(`✅ Status ${res.status} | User: ${res.body.email}`);
      } else {
        console.log(`❌ Status ${res.status} | ${res.body.erreur}`);
      }

      // Test 5: GET /api/orders
      console.log('\n[5] GET /api/orders (protected with token)');
      res = await makeRequest('GET', '/api/orders', null, {
        'Authorization': `Bearer ${token}`
      });
      if (res.status === 200) {
        console.log(`✅ Status ${res.status} | Orders: ${res.body.length || 0}`);
      } else {
        console.log(`❌ Status ${res.status}`);
      }
    }

    // Test 6: 404 handler
    console.log('\n[6] GET /invalid-route (should get 404)');
    res = await makeRequest('GET', '/invalid-route');
    if (res.status === 404 && res.body.erreur) {
      console.log(`✅ Status ${res.status} | Message: ${res.body.erreur}`);
    } else {
      console.log(`❌ Unexpected response`);
    }

    console.log('\n✅ All tests completed!\n');
  } catch (error) {
    console.error('❌ Error:', error.message);
  }

  process.exit(0);
}

runTests();
