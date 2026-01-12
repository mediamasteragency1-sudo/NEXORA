// Test controller functions directly
import { initializeDb } from './src/db.js';
import { authController } from './src/controllers/auth.controller.js';

console.log('Testing authController functions...\n');

try {
  // Initialize database first
  await initializeDb();
  console.log('Database initialized\n');

  // Create mock request and response
  const mockReq = {
    body: { email: 'user@nexora.com', password: 'User123!' },
    headers: { authorization: 'Bearer token' },
    user: { id: 1, email: 'user@nexora.com', role: 'USER' },
    params: {}
  };

  let mockRes = {
    statusCode: 200,
    status(code) { this.statusCode = code; return this; },
    json(data) { 
      console.log(`Response status: ${this.statusCode}`);
      console.log('Response body:', data);
      return this;
    }
  };

  // Test login
  console.log('[1] Testing POST /auth/login\n');
  await authController.login(mockReq, mockRes);

  console.log('\n✅ Controller test passed!');
  process.exit(0);

} catch (error) {
  console.error('❌ Error:', error.message);
  console.error(error.stack);
  process.exit(1);
}
