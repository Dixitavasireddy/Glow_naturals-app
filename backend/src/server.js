const createApp = require('./app');
const { getDatabase } = require('./database');
const path = require('path');
const fs = require('fs');

const PORT = process.env.PORT || 3001;

// Ensure data directory exists
const dataDir = path.join(__dirname, '..', 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Initialize database
getDatabase();

const app = createApp();

app.listen(PORT, () => {
  console.log(`GlowNaturals API server running on http://localhost:${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});
