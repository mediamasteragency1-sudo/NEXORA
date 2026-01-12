// Direct synchronous test of database and API logic
import { initializeDb, getDb } from './src/db.js';
import { authController } from './src/controllers/auth.controller.js';

console.log('Starting direct test...\n');

try {
  // Test 1: Initialize database
  console.log('[1] Initializing database...');
  await initializeDb();
  console.log('✅ Database initialized\n');

  // Test 2: Get database instance
  console.log('[2] Getting database instance...');
  const db = getDb();
  console.log('✅ Database instance obtained\n');

  // Test 3: Simple query
  console.log('[3] Running simple query...');
  const stmt = db.prepare('SELECT COUNT(*) as count FROM products');
  stmt.step();
  const result = stmt.getAsObject();
  stmt.free();
  console.log(`✅ Products count: ${result.count}\n`);

  // Test 4: Test queryOne helper
  console.log('[4] Testing query functions...');
  console.log('This will require importing from controllers\n');

  console.log('All direct tests passed!');
  process.exit(0);

} catch (error) {
  console.error('❌ Error:', error.message);
  console.error(error.stack);
  process.exit(1);
}
