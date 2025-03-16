const express = require('express');
const multer = require('multer');
const cors = require('cors');
const fs = require('fs');
const { parse } = require('csv-parse');
const path = require('path');

const app = express();
const upload = multer({ dest: 'uploads/' });

// Configure CORS for production
const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',') 
  : ['http://localhost:5173'];

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      return callback(new Error('The CORS policy for this site does not allow access from the specified Origin.'), false);
    }
    return callback(null, true);
  }
}));

app.use(express.json());

// Simple admin key authentication middleware
const adminAuth = (req, res, next) => {
  const adminKey = req.headers['x-admin-key'];
  if (!adminKey || adminKey !== process.env.ADMIN_KEY) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
};

// Store whitelisted addresses in memory
let whitelistedAddresses = new Set();

// Load initial whitelist if exists
const WHITELIST_FILE = 'whitelist.json';
try {
  if (fs.existsSync(WHITELIST_FILE)) {
    const data = JSON.parse(fs.readFileSync(WHITELIST_FILE));
    whitelistedAddresses = new Set(data);
    console.log('Loaded whitelist from file');
  }
} catch (error) {
  console.error('Error loading whitelist:', error);
}

// Save whitelist to file
const saveWhitelist = () => {
  try {
    fs.writeFileSync(WHITELIST_FILE, JSON.stringify([...whitelistedAddresses]));
    console.log('Whitelist saved to file');
  } catch (error) {
    console.error('Error saving whitelist:', error);
  }
};

// Endpoint to upload CSV file (protected, should be called by admin only)
app.post('/upload-whitelist', adminAuth, upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    const results = [];
    fs.createReadStream(req.file.path)
        .pipe(parse({ columns: true, trim: true }))
        .on('data', (data) => {
            // Assuming the CSV has a column named 'wallet' or 'address'
            const address = data.wallet || data.address;
            if (address) {
                whitelistedAddresses.add(address.toLowerCase());
            }
        })
        .on('end', () => {
            // Clean up the uploaded file
            fs.unlinkSync(req.file.path);
            // Save updated whitelist to file
            saveWhitelist();
            res.json({ message: 'Whitelist updated successfully' });
        })
        .on('error', (error) => {
            console.error('Error processing CSV:', error);
            res.status(500).json({ error: 'Failed to process CSV file' });
        });
});

// Endpoint to check if a wallet is whitelisted
app.post('/check-wallet', (req, res) => {
    const { walletAddress } = req.body;

    if (!walletAddress) {
        return res.status(400).json({ error: 'Wallet address is required' });
    }

    const isWhitelisted = whitelistedAddresses.has(walletAddress.toLowerCase());
    res.json({ isWhitelisted });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', whitelistSize: whitelistedAddresses.size });
});

// Create uploads directory if it doesn't exist
if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads');
}

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}); 