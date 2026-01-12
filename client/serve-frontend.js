const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

// Serve static files
app.use(express.static(path.join(__dirname)));

// Default to index
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Serve HTML files (must be after static to avoid conflicts)
app.get('/:page', (req, res) => {
  const { page } = req.params;
  // Only handle pages without extension
  if (!page.includes('.')) {
    const filePath = path.join(__dirname, `${page}.html`);
    res.sendFile(filePath, (err) => {
      if (err) {
        res.status(404).send('Page not found');
      }
    });
  } else {
    res.status(404).send('Not found');
  }
});

app.listen(PORT, () => {
  console.log(`[OK] Frontend server listening on http://localhost:${PORT}`);
  console.log(`[INFO] API server on http://localhost:4000`);
  console.log(`[INFO] Backend API configured for CORS`);
});
