import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const FRONTEND_PORT = 3000;

// Serve static files from client directory
const clientPath = path.join(__dirname, '..', 'client');
app.use(express.static(clientPath));

// Fallback to index.html for SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(clientPath, 'index.html'));
});

app.listen(FRONTEND_PORT, () => {
  console.log(`[OK] Frontend server listening on http://localhost:${FRONTEND_PORT}`);
  console.log(`[INFO] API server on http://localhost:4000`);
  console.log(`[INFO] Backend API configured for CORS`);
});
