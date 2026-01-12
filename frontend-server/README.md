# NEXORA Frontend Server

A simple Express.js static file server for the NEXORA frontend application.

## What's Included

- **Express Server**: Lightweight Node.js server to serve static HTML, CSS, and JavaScript files
- **Port 3000**: Frontend server runs on http://localhost:3000
- **SPA Routing**: Automatically falls back to `index.html` for unknown routes (useful for single-page applications)
- **Nodemon**: Development mode with auto-restart on file changes

## Installation

```bash
npm install
```

## Scripts

### Start Production Server
```bash
npm start
```
Starts the server on port 3000.

### Start Development Server
```bash
npm run dev
```
Starts the server with nodemon for automatic restarts when files change.

## File Structure

```
frontend-server/
├── package.json      # Dependencies and scripts
├── server.js         # Express server configuration
└── node_modules/     # Dependencies (created by npm install)
```

## How It Works

1. The server uses Express to serve static files from the `../client/` directory
2. All requests for files (`.html`, `.css`, `.js`, images, etc.) are served from the client folder
3. Unknown routes fall back to `index.html` to support single-page application routing

## Accessing the Application

- **Home Page**: http://localhost:3000
- **Catalog Page**: http://localhost:3000/catalog.html
- **Product Page**: http://localhost:3000/product.html
- **Cart Page**: http://localhost:3000/cart.html
- **Checkout Page**: http://localhost:3000/checkout.html
- **And more...** all pages from the `client/` folder are accessible

## Backend API

The backend API server (port 4000) should be running separately. See the `server/` folder for backend setup.

## Quick Start (Both Servers)

From the root directory, use one of the startup scripts:

**Windows (Batch):**
```cmd
start-dev.bat
```

**Windows (PowerShell):**
```powershell
.\start-dev.ps1
```

Both scripts will:
1. Clear any existing Node processes
2. Seed the database
3. Start the backend server (port 4000)
4. Start the frontend server (port 3000)

## Troubleshooting

### Port Already in Use
If port 3000 is already in use, modify `server.js` to use a different port:
```javascript
const PORT = 3001; // Change to any available port
```

### Files Not Found
Make sure the `../client/` directory exists and contains your HTML, CSS, and JS files.

### CORS Issues
If the frontend needs to communicate with the backend API, ensure the backend server allows CORS. The backend should already be configured for this.
