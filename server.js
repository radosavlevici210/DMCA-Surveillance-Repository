
const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Serve static files
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API endpoint to get repository info
app.get('/api/info', (req, res) => {
  try {
    const readmeContent = fs.readFileSync('README.md', 'utf8');
    const licenseContent = fs.readFileSync('LICENSE.md', 'utf8');
    const noticeContent = fs.readFileSync('NOTICE.md', 'utf8');
    const hashProof = fs.readFileSync('HASH_PROOF.md', 'utf8');
    
    res.json({
      readme: readmeContent,
      license: licenseContent,
      notice: noticeContent,
      hashProof: hashProof,
      timestamp: new Date().toISOString(),
      status: 'active'
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to read repository files' });
  }
});

// API endpoint for monitoring logs
app.get('/api/monitor', (req, res) => {
  const monitorData = {
    timestamp: new Date().toISOString(),
    repository: 'DMCA Surveillance Repository',
    author: 'Ervin Remus Radosavlevici',
    hash: '7c3de7b1a4da6efb54c86653320bdee90ea3449f',
    status: 'monitoring_active',
    placeholders: [
      'microsoft_windows11_keygen_sim/bypass_simulator.py',
      'apple_ios_emulator/ios_system_emulation.cpp',
      'epicgames_sdk_recovery/fortnite_asset_hack.js',
      'spotify_mp3_downloader_ai/ytmusic_reverse_eng_tool.py',
      'nintendo_rom_rebuilder/switch_sdk_placeholder.cpp'
    ]
  };
  
  res.json(monitorData);
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`DMCA Surveillance Repository running on port ${PORT}`);
  console.log(`Access at: http://0.0.0.0:${PORT}`);
  console.log('Production-ready deployment active');
});
