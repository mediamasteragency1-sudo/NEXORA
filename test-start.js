#!/usr/bin/env node
console.log("Starting backend test...");
console.log("Node version:", process.version);

try {
  console.log("Importing app...");
  import('./server/src/app.js').then(() => {
    console.log("App imported successfully");
  }).catch(err => {
    console.error("Error importing app:", err.message);
    process.exit(1);
  });
} catch (error) {
  console.error("Sync error:", error.message);
  process.exit(1);
}

// Timeout après 10 secondes
setTimeout(() => {
  console.error("App still running after 10 seconds - seems stuck");
  process.exit(1);
}, 10000);
