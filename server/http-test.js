// Simple HTTP client test
import http from 'http';

function testGET(path) {
  return new Promise((resolve) => {
    const req = http.request({
      hostname: 'localhost',
      port: 4000,
      path: path,
      method: 'GET'
    }, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        try {
          const body = JSON.parse(data);
          resolve({ status: res.statusCode, body });
        } catch (e) {
          resolve({ status: res.statusCode, body: data });
        }
      });
    });
    req.on('error', (e) => {
      console.error('Request error:', e.message);
      resolve({ error: e.message });
    });
    req.end();
  });
}

function testPOST(path, body) {
  return new Promise((resolve) => {
    const data = JSON.stringify(body);
    const req = http.request({
      hostname: 'localhost',
      port: 4000,
      path: path,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
      }
    }, (res) => {
      let resp = '';
      res.on('data', c => resp += c);
      res.on('end', () => {
        try {
          const body = JSON.parse(resp);
          resolve({ status: res.statusCode, body });
        } catch (e) {
          resolve({ status: res.statusCode, body: resp });
        }
      });
    });
    req.on('error', (e) => {
      console.error('Request error:', e.message);
      resolve({ error: e.message });
    });
    req.write(data);
    req.end();
  });
}

async function runTests() {
  console.log('=== API HTTP Tests ===\n');

  // Test 1
  console.log('[1] GET /');
  let r = await testGET('/');
  console.log(`Status: ${r.status || 'ERROR'}`);
  if (r.body) console.log('Message:', r.body.message);
  console.log('');

  // Test 2
  console.log('[2] GET /api/products');
  r = await testGET('/api/products');
  console.log(`Status: ${r.status || 'ERROR'}`);
  if (r.body && r.body.products) console.log('Products:', r.body.products.length);
  console.log('');

  // Test 3
  console.log('[3] POST /api/auth/login');
  r = await testPOST('/api/auth/login', { email: 'user@nexora.com', password: 'User123!' });
  console.log(`Status: ${r.status || 'ERROR'}`);
  if (r.body && r.body.user) {
    console.log('User:', r.body.user.email);
    console.log('Token obtained:', !!r.body.token);
  }
  if (r.error) console.log('Error:', r.error);
  console.log('');

  console.log('Tests completed');
  process.exit(0);
}

runTests();
