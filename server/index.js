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
    : ['http://localhost:5173', 'https://10k-checker-59wwbwjkp-karatekid05s-projects.vercel.app'];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
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
        console.log(`Loaded ${whitelistedAddresses.size} addresses from whitelist`);
    }
} catch (error) {
    console.error('Error loading whitelist:', error);
}

// Save whitelist to file
const saveWhitelist = () => {
    try {
        fs.writeFileSync(WHITELIST_FILE, JSON.stringify([...whitelistedAddresses]));
        console.log(`Saved ${whitelistedAddresses.size} addresses to whitelist`);
    } catch (error) {
        console.error('Error saving whitelist:', error);
    }
};

// Endpoint to upload CSV file (protected, should be called by admin only)
app.post('/upload-whitelist', adminAuth, upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    let addressesAdded = 0;
    fs.createReadStream(req.file.path)
        .pipe(parse({
            skip_empty_lines: true,
            trim: true
        }))
        .on('data', (row) => {
            // Take only the first column and clean it
            const address = row[0]?.trim().toLowerCase();
            if (address && address.startsWith('0x')) {
                whitelistedAddresses.add(address);
                addressesAdded++;
            }
        })
        .on('end', () => {
            // Clean up the uploaded file
            fs.unlinkSync(req.file.path);
            // Save updated whitelist to file
            saveWhitelist();
            res.json({
                message: 'Whitelist updated successfully',
                addressesAdded,
                totalAddresses: whitelistedAddresses.size
            });
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

// Get total number of whitelisted addresses
app.get('/stats', (req, res) => {
    res.json({ totalAddresses: whitelistedAddresses.size });
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'healthy', whitelistSize: whitelistedAddresses.size });
});

// Root endpoint
app.get('/', (req, res) => {
    res.json({ message: '10K Squad Whitelist Checker API' });
});

// Create uploads directory if it doesn't exist
if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads');
}

const PORT = process.env.PORT || 3001;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
}); 