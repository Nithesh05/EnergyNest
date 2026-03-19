require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Security Middlewares
app.use(helmet({
    contentSecurityPolicy: false // Allows CDNs and inline scripts for frontend ease during prototyping
}));
app.use(cors());

// Rate Limiting (Disabled for local prototype to allow continuous dashboard refresh)
// const limiter = rateLimit({
//     windowMs: 15 * 60 * 1000, // 15 minutes
//     max: 300 // increased for prototype
// });
// app.use(limiter);

// Body parser
app.use(express.json());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, '../public')));

// Import Routes
const apiRoutes = require('./routes/api');
app.use('/api', apiRoutes);

// Base route 
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Start Server
if (!process.env.VERCEL) {
    app.listen(PORT, () => {
        console.log(`⚡ EnergyNest server running on http://localhost:${PORT}`);
    });
}

// Export the Express API for Vercel
module.exports = app;
